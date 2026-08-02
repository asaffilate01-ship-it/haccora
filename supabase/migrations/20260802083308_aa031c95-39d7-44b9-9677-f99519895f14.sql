BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 160),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  country_code text NOT NULL DEFAULT 'DE' CHECK (char_length(country_code) = 2),
  timezone text NOT NULL DEFAULT 'Europe/Berlin',
  enabled_modules text[] NOT NULL DEFAULT ARRAY[
    'haccp','temperature','cleaning','menu','purchasing','rota','training','audits'
  ],
  created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 160),
  business_state text,
  address jsonb NOT NULL DEFAULT '{}'::jsonb,
  timezone text NOT NULL DEFAULT 'Europe/Berlin',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE IF NOT EXISTS public.organization_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  role public.app_role NOT NULL CHECK (role <> 'inspector'),
  default_location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('invited','active','suspended','revoked')),
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.inspector_access_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  inspector_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  location_ids uuid[] NOT NULL,
  evidence_scopes text[] NOT NULL DEFAULT ARRAY[
    'haccp','temperature','cleaning','pest','allergens','training',
    'traceability','audits','documents','incidents'
  ],
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz NOT NULL,
  granted_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  revoked_at timestamptz,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (valid_until > valid_from),
  CHECK (cardinality(location_ids) BETWEEN 1 AND 20),
  CHECK (evidence_scopes <@ ARRAY[
    'haccp','temperature','cleaning','pest','allergens','training',
    'traceability','audits','documents','incidents'
  ]::text[]),
  UNIQUE (organization_id, inspector_user_id, valid_until)
);

CREATE TABLE IF NOT EXISTS public.organization_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  email text NOT NULL CHECK (email = lower(email)),
  role public.app_role NOT NULL CHECK (role IN ('manager','chef','staff')),
  token_hash text NOT NULL UNIQUE,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE TABLE IF NOT EXISTS public.inspector_access_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  email text NOT NULL CHECK (email = lower(email)),
  location_ids uuid[] NOT NULL DEFAULT '{}',
  evidence_scopes text[] NOT NULL,
  access_valid_until timestamptz NOT NULL,
  token_hash text NOT NULL UNIQUE,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  reason text,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (cardinality(location_ids) BETWEEN 1 AND 20),
  CHECK (cardinality(evidence_scopes) BETWEEN 1 AND 10),
  CHECK (evidence_scopes <@ ARRAY[
    'haccp','temperature','cleaning','pest','allergens','training',
    'traceability','audits','documents','incidents'
  ]::text[]),
  CHECK (access_valid_until > created_at),
  CHECK (expires_at > created_at)
);

CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  business_name text,
  locale text NOT NULL DEFAULT 'de' CHECK (locale IN ('de','en')),
  consent_at timestamptz NOT NULL,
  source_ip_hash text NOT NULL,
  user_agent text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed','spam')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.contact_requests FROM anon, authenticated;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS current_location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deactivated_at timestamptz;

CREATE OR REPLACE FUNCTION public.current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.organization_id
    FROM public.organization_memberships m
    LEFT JOIN public.profiles p ON p.id = m.user_id
   WHERE m.user_id = auth.uid() AND m.status = 'active'
   ORDER BY (m.organization_id = p.current_organization_id) DESC NULLS LAST, m.created_at
   LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_location_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN selected_location.id IS NOT NULL
              THEN p.current_location_id ELSE m.default_location_id END
    FROM public.organization_memberships m
    LEFT JOIN public.profiles p ON p.id = m.user_id
    LEFT JOIN public.locations selected_location
      ON selected_location.id = p.current_location_id
     AND selected_location.organization_id = m.organization_id
   WHERE m.user_id = auth.uid()
     AND m.organization_id = public.current_organization_id()
     AND m.status = 'active'
   LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_org_role(
  p_organization_id uuid,
  p_roles public.app_role[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM public.organization_memberships m
     WHERE m.organization_id = p_organization_id
       AND m.user_id = auth.uid()
       AND m.status = 'active'
       AND m.role = ANY(p_roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.has_valid_inspector_grant(
  p_organization_id uuid,
  p_scope text DEFAULT NULL,
  p_location_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM public.inspector_access_grants g
     WHERE g.organization_id = p_organization_id
       AND g.inspector_user_id = auth.uid()
       AND g.revoked_at IS NULL
       AND now() BETWEEN g.valid_from AND g.valid_until
       AND (p_scope IS NULL OR p_scope = ANY(g.evidence_scopes))
       AND (
         p_location_id IS NULL
         OR cardinality(g.location_ids) = 0
         OR p_location_id = ANY(g.location_ids)
       )
  );
$$;

CREATE OR REPLACE FUNCTION public.can_read_organization(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p_organization_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.organization_memberships m
     WHERE m.organization_id = p_organization_id
       AND m.user_id = auth.uid()
       AND m.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.can_contribute_to_organization(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p_organization_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.organization_memberships m
     WHERE m.organization_id = p_organization_id
       AND m.user_id = auth.uid()
       AND m.status = 'active'
       AND m.role IN ('owner','manager','chef','staff')
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_organization(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_role(p_organization_id, ARRAY['owner','manager']::public.app_role[]);
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.organization_memberships m
     WHERE m.user_id = _user_id AND m.status = 'active' AND m.role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.can_operate_record(
  p_organization_id uuid,
  p_actor_id uuid,
  p_location_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_role(
           p_organization_id,
           ARRAY['owner','manager','chef']::public.app_role[]
         )
      OR (
        p_actor_id = auth.uid()
        AND public.has_org_role(p_organization_id, ARRAY['staff']::public.app_role[])
        AND (p_location_id IS NULL OR p_location_id = public.current_location_id())
      );
$$;

CREATE OR REPLACE FUNCTION public.is_valid_profile_context(
  p_organization_id uuid,
  p_location_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    p_organization_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships m
       WHERE m.organization_id = p_organization_id
         AND m.user_id = auth.uid()
         AND m.status = 'active'
    )
  ) AND (
    p_location_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.locations l
       WHERE l.id = p_location_id
         AND l.organization_id = p_organization_id
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.try_uuid(p_value text)
RETURNS uuid
LANGUAGE plpgsql
IMMUTABLE
STRICT
SET search_path = public
AS $$
BEGIN
  RETURN p_value::uuid;
EXCEPTION WHEN invalid_text_representation THEN
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT m.role
       FROM public.organization_memberships m
      WHERE m.user_id = auth.uid()
        AND m.organization_id = public.current_organization_id()
        AND m.status = 'active'
      LIMIT 1),
    'staff'::public.app_role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_manager_or_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id = auth.uid()
     AND public.can_manage_organization(public.current_organization_id());
$$;

CREATE OR REPLACE FUNCTION public.is_inspector(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.inspector_access_grants g
     WHERE g.inspector_user_id = _user_id
       AND g.revoked_at IS NULL
       AND now() BETWEEN g.valid_from AND g.valid_until
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, restaurant_name, language)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name',''), split_part(NEW.email,'@',1)),
    NULLIF(NEW.raw_user_meta_data->>'restaurant_name',''),
    CASE WHEN NEW.raw_user_meta_data->>'language' = 'en' THEN 'en' ELSE 'de' END
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'staff')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.bootstrap_my_organization(
  p_name text,
  p_location_name text DEFAULT 'Main location',
  p_business_state text DEFAULT NULL,
  p_modules text[] DEFAULT ARRAY[
    'haccp','temperature','cleaning','menu','purchasing','rota','training','audits'
  ]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_org public.organizations;
  v_location public.locations;
  v_slug text;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  IF char_length(trim(p_name)) < 2 THEN RAISE EXCEPTION 'organization name is required'; END IF;
  IF EXISTS (
    SELECT 1 FROM public.organization_memberships
     WHERE user_id = v_user_id AND status IN ('active','invited')
  ) THEN
    RAISE EXCEPTION 'workspace already exists';
  END IF;

  v_slug := trim(both '-' from regexp_replace(lower(trim(p_name)), '[^a-z0-9]+', '-', 'g'));
  IF v_slug = '' THEN v_slug := 'workspace'; END IF;
  v_slug := left(v_slug, 48) || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);

  INSERT INTO public.organizations (name, slug, created_by, enabled_modules)
  VALUES (trim(p_name), v_slug, v_user_id, p_modules)
  RETURNING * INTO v_org;

  INSERT INTO public.locations (organization_id, name, business_state)
  VALUES (v_org.id, COALESCE(NULLIF(trim(p_location_name),''), 'Main location'), p_business_state)
  RETURNING * INTO v_location;

  INSERT INTO public.organization_memberships (
    organization_id, user_id, role, default_location_id, status, accepted_at
  ) VALUES (v_org.id, v_user_id, 'owner', v_location.id, 'active', now());

  UPDATE public.profiles
     SET current_organization_id = v_org.id,
         current_location_id = v_location.id,
         restaurant_name = v_org.name,
         location = v_location.name
   WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'organization_id', v_org.id,
    'location_id', v_location.id,
    'role', 'owner'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_my_organization(text,text,text,text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_my_organization(text,text,text,text[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_my_context()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT jsonb_build_object(
      'organization_id', m.organization_id,
      'organization_name', o.name,
      'location_id', COALESCE(l.id, m.default_location_id),
      'location_name', l.name,
      'role', m.role,
      'membership_status', m.status
    )
      FROM public.organization_memberships m
      JOIN public.organizations o ON o.id = m.organization_id
      LEFT JOIN public.profiles p ON p.id = m.user_id
      LEFT JOIN public.locations l
        ON l.id = p.current_location_id
       AND l.organization_id = m.organization_id
     WHERE m.user_id = auth.uid()
       AND m.status = 'active'
       AND (p.current_organization_id IS NULL OR p.current_organization_id = m.organization_id)
     ORDER BY m.created_at
     LIMIT 1
  ), (
    SELECT jsonb_build_object(
      'organization_id', g.organization_id,
      'organization_name', o.name,
      'location_id', CASE WHEN cardinality(g.location_ids) = 1 THEN g.location_ids[1] ELSE NULL END,
      'location_name', CASE WHEN cardinality(g.location_ids) = 1 THEN l.name ELSE 'Granted locations' END,
      'role', 'inspector',
      'evidence_scopes', g.evidence_scopes,
      'membership_status', 'active'
    )
      FROM public.inspector_access_grants g
      JOIN public.organizations o ON o.id = g.organization_id
      LEFT JOIN public.locations l
        ON l.id = CASE WHEN cardinality(g.location_ids) = 1 THEN g.location_ids[1] ELSE NULL END
       AND l.organization_id = g.organization_id
     WHERE g.inspector_user_id = auth.uid()
       AND g.revoked_at IS NULL
       AND now() BETWEEN g.valid_from AND g.valid_until
     ORDER BY g.valid_until
     LIMIT 1
  ), '{}'::jsonb);
$$;
REVOKE ALL ON FUNCTION public.get_my_context() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_context() TO authenticated;

CREATE OR REPLACE FUNCTION public.accept_organization_invitation(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text := lower(COALESCE(auth.jwt()->>'email',''));
  v_invite public.organization_invitations;
  v_location_id uuid;
BEGIN
  IF v_user_id IS NULL OR char_length(p_token) < 32 THEN RAISE EXCEPTION 'invalid invitation'; END IF;
  SELECT * INTO v_invite
    FROM public.organization_invitations
   WHERE token_hash = encode(digest(p_token, 'sha256'), 'hex')
     AND accepted_at IS NULL
     AND revoked_at IS NULL
     AND expires_at > now()
   FOR UPDATE;
  IF v_invite.id IS NULL OR v_email <> v_invite.email THEN RAISE EXCEPTION 'invalid invitation'; END IF;

  SELECT id INTO v_location_id FROM public.locations
   WHERE organization_id = v_invite.organization_id AND is_active
   ORDER BY created_at LIMIT 1;

  INSERT INTO public.organization_memberships (
    organization_id, user_id, role, default_location_id, status, invited_by, accepted_at
  ) VALUES (
    v_invite.organization_id, v_user_id, v_invite.role, v_location_id, 'active', v_invite.invited_by, now()
  )
  ON CONFLICT (organization_id, user_id) DO UPDATE SET
    role = CASE
      WHEN organization_memberships.role = 'owner' THEN 'owner'::public.app_role
      ELSE EXCLUDED.role
    END,
    default_location_id = EXCLUDED.default_location_id,
    status = 'active', accepted_at = now();

  UPDATE public.organization_invitations SET accepted_at = now() WHERE id = v_invite.id;
  UPDATE public.profiles
     SET current_organization_id = v_invite.organization_id,
         current_location_id = v_location_id
   WHERE id = v_user_id;
  RETURN jsonb_build_object('organization_id', v_invite.organization_id, 'location_id', v_location_id, 'role', v_invite.role);
END;
$$;
REVOKE ALL ON FUNCTION public.accept_organization_invitation(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_organization_invitation(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.accept_inspector_invitation(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text := lower(COALESCE(auth.jwt()->>'email',''));
  v_invite public.inspector_access_invitations;
BEGIN
  IF v_user_id IS NULL OR char_length(p_token) < 32 THEN
    RAISE EXCEPTION 'invalid invitation';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.organization_memberships
     WHERE user_id = v_user_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'use a separate inspector account';
  END IF;

  SELECT * INTO v_invite
    FROM public.inspector_access_invitations
   WHERE token_hash = encode(digest(p_token, 'sha256'), 'hex')
     AND accepted_at IS NULL
     AND revoked_at IS NULL
     AND expires_at > now()
     AND access_valid_until > now()
   FOR UPDATE;
  IF v_invite.id IS NULL OR v_email <> v_invite.email THEN
    RAISE EXCEPTION 'invalid invitation';
  END IF;
  IF EXISTS (
    SELECT 1 FROM unnest(v_invite.location_ids) invited_location
     WHERE NOT EXISTS (
       SELECT 1 FROM public.locations l
        WHERE l.id = invited_location
          AND l.organization_id = v_invite.organization_id
          AND l.is_active
     )
  ) THEN
    RAISE EXCEPTION 'invalid location scope';
  END IF;

  INSERT INTO public.inspector_access_grants (
    organization_id, inspector_user_id, location_ids, evidence_scopes,
    valid_from, valid_until, granted_by, reason
  ) VALUES (
    v_invite.organization_id, v_user_id, v_invite.location_ids,
    v_invite.evidence_scopes, now(), v_invite.access_valid_until,
    v_invite.invited_by, v_invite.reason
  );
  UPDATE public.inspector_access_invitations
     SET accepted_at = now()
   WHERE id = v_invite.id;

  RETURN jsonb_build_object(
    'organization_id', v_invite.organization_id,
    'role', 'inspector',
    'valid_until', v_invite.access_valid_until
  );
END;
$$;
REVOKE ALL ON FUNCTION public.accept_inspector_invitation(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_inspector_invitation(text) TO authenticated;

DO $$
DECLARE
  u record;
  v_org_id uuid;
  v_location_id uuid;
  v_slug text;
BEGIN
  FOR u IN
    SELECT au.id,
           COALESCE(NULLIF(p.restaurant_name,''), NULLIF(p.full_name,''), split_part(au.email,'@',1), 'Workspace') AS name,
           COALESCE(NULLIF(p.location,''), 'Main location') AS location_name
      FROM auth.users au
      LEFT JOIN public.profiles p ON p.id = au.id
     WHERE NOT EXISTS (
       SELECT 1 FROM public.organization_memberships m WHERE m.user_id = au.id
     )
  LOOP
    v_slug := left(trim(both '-' from regexp_replace(lower(u.name), '[^a-z0-9]+', '-', 'g')), 48);
    IF v_slug = '' THEN v_slug := 'workspace'; END IF;
    v_slug := v_slug || '-' || substr(replace(u.id::text, '-', ''), 1, 8);

    INSERT INTO public.organizations (name, slug, created_by)
    VALUES (u.name, v_slug, u.id)
    RETURNING id INTO v_org_id;

    INSERT INTO public.locations (organization_id, name)
    VALUES (v_org_id, u.location_name)
    RETURNING id INTO v_location_id;

    INSERT INTO public.organization_memberships (
      organization_id, user_id, role, default_location_id, status, accepted_at
    ) VALUES (v_org_id, u.id, 'owner', v_location_id, 'active', now());

    UPDATE public.profiles
       SET current_organization_id = v_org_id,
           current_location_id = v_location_id
     WHERE id = u.id;
  END LOOP;
END;
$$;

ALTER TABLE public.training_records
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS verification_note text;
DELETE FROM public.training_records a
USING public.training_records b
WHERE a.user_id = b.user_id
  AND a.course_id IS NOT DISTINCT FROM b.course_id
  AND (a.created_at, a.id) < (b.created_at, b.id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_training_record_user_course
  ON public.training_records(user_id, course_id) WHERE course_id IS NOT NULL;

ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS mime_type text,
  ADD COLUMN IF NOT EXISTS file_size bigint CHECK (file_size IS NULL OR file_size BETWEEN 1 AND 10485760),
  ADD COLUMN IF NOT EXISTS sha256 text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'ck_temperature_evidence_range'
       AND conrelid = 'public.temperature_logs'::regclass
  ) THEN
    ALTER TABLE public.temperature_logs
      ADD CONSTRAINT ck_temperature_evidence_range CHECK (
        reading BETWEEN -100 AND 300
        AND (target_min IS NULL OR target_min BETWEEN -100 AND 300)
        AND (target_max IS NULL OR target_max BETWEEN -100 AND 300)
        AND (target_min IS NULL OR target_max IS NULL OR target_min < target_max)
      ) NOT VALID;
  END IF;
END;
$$;

ALTER TABLE public.training_courses
  ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE RESTRICT;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'temperature_logs','checks','incidents','alerts','documents','activity_logs',
    'expiry_items','waste_entries','suppliers','haccp_hazards','audits','recalls',
    'assets','recipes','purchase_orders','stock_items','shifts','time_clock',
    'training_records','label_prints','goods_in_logs','calibration_logs',
    'health_register','pest_sightings','oil_tests','complaints','chemicals',
    'haccp_flow_runs'
  ]
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE RESTRICT DEFAULT public.current_organization_id()',
      t
    );
    EXECUTE format(
      'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL DEFAULT public.current_location_id()',
      t
    );
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS idempotency_key text', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON public.%I (organization_id, created_at DESC)', 'idx_' || t || '_org_created', t);
    EXECUTE format(
      'CREATE UNIQUE INDEX IF NOT EXISTS %I ON public.%I (organization_id, idempotency_key) WHERE idempotency_key IS NOT NULL',
      'uq_' || t || '_org_idempotency', t
    );
  END LOOP;
END;
$$;

DO $$
DECLARE
  pair text[];
BEGIN
  FOREACH pair SLICE 1 IN ARRAY ARRAY[
    ['temperature_logs','user_id'],['checks','user_id'],['incidents','user_id'],
    ['alerts','user_id'],['documents','user_id'],['activity_logs','user_id'],
    ['expiry_items','user_id'],['waste_entries','user_id'],['time_clock','user_id'],
    ['training_records','user_id'],['goods_in_logs','user_id'],['calibration_logs','user_id'],
    ['health_register','user_id'],['pest_sightings','user_id'],['oil_tests','user_id'],
    ['complaints','user_id'],['chemicals','user_id'],['haccp_flow_runs','performed_by'],
    ['suppliers','created_by'],['haccp_hazards','created_by'],['assets','created_by'],
    ['recipes','created_by'],['purchase_orders','created_by'],['stock_items','created_by'],
    ['shifts','created_by'],['audits','performed_by'],['recalls','initiated_by'],
    ['label_prints','printed_by']
  ]
  LOOP
    EXECUTE format(
      'UPDATE public.%I r SET organization_id = m.organization_id, location_id = m.default_location_id FROM public.organization_memberships m WHERE r.organization_id IS NULL AND m.user_id = r.%I AND m.status = ''active''',
      pair[1], pair[2]
    );
  END LOOP;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_locations_id_organization
  ON public.locations(id, organization_id);

DO $$
DECLARE
  t text;
  v_constraint_name text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'fk_membership_location_organization'
       AND conrelid = 'public.organization_memberships'::regclass
  ) THEN
    ALTER TABLE public.organization_memberships
      ADD CONSTRAINT fk_membership_location_organization
      FOREIGN KEY (default_location_id, organization_id)
      REFERENCES public.locations(id, organization_id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'fk_profile_location_organization'
       AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT fk_profile_location_organization
      FOREIGN KEY (current_location_id, current_organization_id)
      REFERENCES public.locations(id, organization_id) ON DELETE RESTRICT;
  END IF;

  FOREACH t IN ARRAY ARRAY[
    'temperature_logs','checks','incidents','alerts','documents','activity_logs',
    'expiry_items','waste_entries','suppliers','haccp_hazards','audits','recalls',
    'assets','recipes','purchase_orders','stock_items','shifts','time_clock',
    'training_records','label_prints','goods_in_logs','calibration_logs',
    'health_register','pest_sightings','oil_tests','complaints','chemicals',
    'haccp_flow_runs'
  ]
  LOOP
    v_constraint_name := 'fk_' || t || '_location_organization';
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
       WHERE conname = v_constraint_name
         AND conrelid = format('public.%I', t)::regclass
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (location_id, organization_id) REFERENCES public.locations(id, organization_id) ON DELETE RESTRICT',
        t, v_constraint_name
      );
    END IF;
  END LOOP;
END;
$$;

COMMIT;