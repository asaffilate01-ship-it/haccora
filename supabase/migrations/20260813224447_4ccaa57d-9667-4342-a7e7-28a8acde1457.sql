-- 1. Cross-tenant reference guard -------------------------------------------
CREATE OR REPLACE FUNCTION public.reference_in_current_org(_table text, _id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ok boolean;
  org uuid := public.current_organization_id();
BEGIN
  IF _id IS NULL OR org IS NULL THEN
    RETURN false;
  END IF;
  IF _table !~ '^[a-z_][a-z0-9_]*$' THEN
    RETURN false;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = _table AND column_name = 'organization_id'
  ) THEN
    RETURN false;
  END IF;
  EXECUTE format(
    'SELECT EXISTS (SELECT 1 FROM public.%I t WHERE t.id = $1 AND t.organization_id = $2)', _table
  ) INTO ok USING _id, org;
  RETURN COALESCE(ok, false);
END;
$$;
REVOKE ALL ON FUNCTION public.reference_in_current_org(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reference_in_current_org(text, uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS stock_movements_insert ON public.stock_movements;
CREATE POLICY stock_movements_insert ON public.stock_movements FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = public.current_organization_id()
    AND recorded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.stock_items si
       WHERE si.id = stock_movements.stock_item_id
         AND si.organization_id = public.current_organization_id()
    )
    AND (
      location_id IS NULL OR EXISTS (
        SELECT 1 FROM public.locations l
         WHERE l.id = stock_movements.location_id
           AND l.organization_id = public.current_organization_id()
      )
    )
    AND (reference_table IS NULL OR public.reference_in_current_org(reference_table, reference_id))
  );

DROP POLICY IF EXISTS corrective_insert ON public.corrective_actions;
CREATE POLICY corrective_insert ON public.corrective_actions FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = public.current_organization_id()
    AND created_by = auth.uid()
    AND public.reference_in_current_org(source_table, source_id)
    AND (
      location_id IS NULL OR EXISTS (
        SELECT 1 FROM public.locations l
         WHERE l.id = corrective_actions.location_id
           AND l.organization_id = public.current_organization_id()
      )
    )
  );

-- 2. Profiles: coworkers no longer read business/contact columns -------------
DROP POLICY IF EXISTS profiles_read_tenant ON public.profiles;
CREATE POLICY profiles_read_self ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE OR REPLACE FUNCTION public.get_org_directory()
RETURNS TABLE (id uuid, full_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.avatar_url
    FROM public.profiles p
   WHERE EXISTS (
     SELECT 1
       FROM public.organization_memberships mine
       JOIN public.organization_memberships theirs
         ON theirs.organization_id = mine.organization_id
      WHERE mine.user_id = auth.uid() AND mine.status = 'active'
        AND theirs.user_id = p.id AND theirs.status = 'active'
   );
$$;
REVOKE ALL ON FUNCTION public.get_org_directory() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_org_directory() TO authenticated, service_role;

-- 3. Sensor secrets are never readable by app clients ------------------------
REVOKE SELECT ON public.sensor_devices FROM authenticated;
GRANT SELECT (id, organization_id, location_id, name, external_device_id, is_active,
              last_seen_at, target_min, target_max, created_at, created_by)
  ON public.sensor_devices TO authenticated;

-- 4. Defence in depth: anon gets no table or definer-function access ---------
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.relname
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public' AND c.relkind IN ('r','p','v','m')
  LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', r.relname);
  END LOOP;

  FOR r IN
    SELECT p.oid::regprocedure AS sig
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = 'public' AND p.prosecdef
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon, PUBLIC', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', r.sig);
  END LOOP;
END;
$$;