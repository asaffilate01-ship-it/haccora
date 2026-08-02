CREATE OR REPLACE FUNCTION public.get_my_entitlements()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_object_agg(entitlement, jsonb_build_object(
    'enabled', enabled,
    'limit', limit_value,
    'source', source,
    'effective_until', effective_until
  )), '{}'::jsonb)
  FROM public.subscription_entitlements
  WHERE organization_id = public.current_organization_id()
    AND effective_from <= now()
    AND (effective_until IS NULL OR effective_until > now());
$$;

REVOKE ALL ON FUNCTION public.get_my_entitlements() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_entitlements() TO authenticated;