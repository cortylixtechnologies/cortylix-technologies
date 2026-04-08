-- Auth activity logs table
CREATE TABLE public.auth_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  event_type text NOT NULL, -- 'login_success', 'login_failed', 'signup', 'logout', 'password_reset'
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.auth_activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view auth logs
CREATE POLICY "Admins can view auth logs"
ON public.auth_activity_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- System can insert (via edge function with service role)
CREATE POLICY "Service can insert auth logs"
ON public.auth_activity_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Admin audit trail table
CREATE TABLE public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL, -- 'ticket_approved', 'ticket_rejected', 'portfolio_created', 'portfolio_deleted', etc
  target_type text NOT NULL, -- 'ticket', 'portfolio', 'user_role'
  target_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert audit logs
CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit_logs FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_auth_activity_created ON public.auth_activity_logs(created_at DESC);
CREATE INDEX idx_auth_activity_event ON public.auth_activity_logs(event_type);
CREATE INDEX idx_auth_activity_email ON public.auth_activity_logs(email);
CREATE INDEX idx_admin_audit_created ON public.admin_audit_logs(created_at DESC);
CREATE INDEX idx_admin_audit_action ON public.admin_audit_logs(action);