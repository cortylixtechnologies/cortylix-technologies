-- Fix the overly permissive INSERT policy
DROP POLICY "Service can insert auth logs" ON public.auth_activity_logs;

-- Only allow inserts via service role (edge functions) - no direct user inserts
CREATE POLICY "Authenticated users can log their own auth events"
ON public.auth_activity_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);