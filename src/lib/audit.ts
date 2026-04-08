import { supabase } from "@/integrations/supabase/client";

export async function logAuthActivity(
  eventType: string,
  email?: string | null
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase.from("auth_activity_logs").insert({
    user_id: user?.id || null,
    email: email || user?.email || null,
    event_type: eventType,
    ip_address: null, // Client-side can't reliably get IP
    user_agent: navigator.userAgent,
    metadata: {},
  });
}

export async function logAdminAction(
  action: string,
  targetType: string,
  targetId?: string,
  details?: Record<string, unknown>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("admin_audit_logs").insert([{
    admin_user_id: user.id,
    action,
    target_type: targetType,
    target_id: targetId || null,
    details: details || {},
  }]);
}
