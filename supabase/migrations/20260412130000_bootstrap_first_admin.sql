-- One-row config: set setup_secret in Supabase SQL Editor after deploy.
-- Example: UPDATE public.admin_bootstrap_config SET setup_secret = 'your-long-random-secret' WHERE id = 1;

CREATE TABLE IF NOT EXISTS public.admin_bootstrap_config (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  setup_secret TEXT NOT NULL DEFAULT ''
);

INSERT INTO public.admin_bootstrap_config (id, setup_secret)
VALUES (1, '')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.admin_bootstrap_config ENABLE ROW LEVEL SECURITY;

-- No policies: authenticated users cannot read this table; SECURITY DEFINER function reads it.

CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(p_secret text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected text;
  admin_cnt int;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
  END IF;

  SELECT setup_secret INTO expected FROM public.admin_bootstrap_config WHERE id = 1;

  IF expected IS NULL OR btrim(expected) = '' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_configured');
  END IF;

  IF p_secret IS DISTINCT FROM expected THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_secret');
  END IF;

  SELECT COUNT(*)::int INTO admin_cnt FROM public.user_roles WHERE role = 'admin';
  IF admin_cnt > 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'admin_already_exists');
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_first_admin(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin(text) TO authenticated;
