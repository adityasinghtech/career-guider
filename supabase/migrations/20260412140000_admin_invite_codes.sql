-- Invite codes for promoting users to admin (Tab 1 redeems via RPC; Tab 2 is admin-only via RLS).

CREATE TABLE IF NOT EXISTS public.admin_invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  used_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_invite_codes_code ON public.admin_invite_codes (code);

ALTER TABLE public.admin_invite_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read invite codes"
  ON public.admin_invite_codes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert invite codes"
  ON public.admin_invite_codes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND created_by = auth.uid());

CREATE POLICY "Admins can update invite codes"
  ON public.admin_invite_codes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Atomic redeem: validates code and promotes caller (no direct client access to redeem).
CREATE OR REPLACE FUNCTION public.redeem_admin_invite(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite public.admin_invite_codes%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
  END IF;

  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RETURN jsonb_build_object('ok', true, 'already_admin', true);
  END IF;

  SELECT * INTO invite FROM public.admin_invite_codes
  WHERE code = trim(p_code) AND is_active = true AND used_by IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false);
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.admin_invite_codes
  SET used_by = auth.uid(), used_at = now(), is_active = false
  WHERE id = invite.id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_admin_invite(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_admin_invite(text) TO authenticated;
