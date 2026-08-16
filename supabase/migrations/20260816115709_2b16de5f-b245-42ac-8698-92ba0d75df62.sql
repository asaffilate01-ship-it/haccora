CREATE OR REPLACE FUNCTION public.is_org_member(p_organization_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p_user_id IS NULL OR EXISTS (
    SELECT 1 FROM public.organization_memberships m
    WHERE m.organization_id = p_organization_id
      AND m.user_id = p_user_id
      AND m.status = 'active'
  );
$$;

REVOKE ALL ON FUNCTION public.is_org_member(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) TO service_role;

DROP POLICY IF EXISTS tenant_insert ON public.shifts;
CREATE POLICY tenant_insert ON public.shifts FOR INSERT TO authenticated
WITH CHECK (
  organization_id = current_organization_id()
  AND can_operate_record(organization_id, created_by, location_id)
  AND public.is_org_member(organization_id, staff_id)
);

DROP POLICY IF EXISTS tenant_update ON public.shifts;
CREATE POLICY tenant_update ON public.shifts FOR UPDATE TO authenticated
USING (can_operate_record(organization_id, created_by, location_id))
WITH CHECK (
  organization_id = current_organization_id()
  AND can_operate_record(organization_id, created_by, location_id)
  AND public.is_org_member(organization_id, staff_id)
);