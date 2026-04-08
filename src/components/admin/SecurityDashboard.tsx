import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Activity,
  LogIn,
  LogOut,
  UserPlus,
  RefreshCw,
  Monitor,
  Loader2,
} from "lucide-react";

interface AuthLog {
  id: string;
  user_id: string | null;
  email: string | null;
  event_type: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface AuditLog {
  id: string;
  admin_user_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

interface SecurityStats {
  totalLogins: number;
  failedLogins: number;
  signups: number;
  uniqueUsers: number;
  suspiciousActivity: number;
}

const eventIcons: Record<string, typeof LogIn> = {
  login_success: LogIn,
  login_failed: XCircle,
  signup: UserPlus,
  logout: LogOut,
  password_reset: RefreshCw,
};

const eventColors: Record<string, string> = {
  login_success: "bg-green-500/10 text-green-600 border-green-500/20",
  login_failed: "bg-red-500/10 text-red-600 border-red-500/20",
  signup: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  logout: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  password_reset: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

export function SecurityDashboard() {
  const [authLogs, setAuthLogs] = useState<AuthLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalLogins: 0,
    failedLogins: 0,
    signups: 0,
    uniqueUsers: 0,
    suspiciousActivity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"overview" | "auth" | "audit" | "sessions">("overview");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchAuthLogs(), fetchAuditLogs()]);
    setLoading(false);
  };

  const fetchAuthLogs = async () => {
    const { data } = await supabase
      .from("auth_activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (data) {
      const logs = data as AuthLog[];
      setAuthLogs(logs);

      // Calculate stats
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentLogs = logs.filter((l) => new Date(l.created_at) > last24h);

      const failedLogins = recentLogs.filter((l) => l.event_type === "login_failed");
      
      // Detect brute force: 5+ failed logins from same email in 24h
      const failedByEmail: Record<string, number> = {};
      failedLogins.forEach((l) => {
        if (l.email) {
          failedByEmail[l.email] = (failedByEmail[l.email] || 0) + 1;
        }
      });
      const suspiciousCount = Object.values(failedByEmail).filter((c) => c >= 5).length;

      setStats({
        totalLogins: recentLogs.filter((l) => l.event_type === "login_success").length,
        failedLogins: failedLogins.length,
        signups: recentLogs.filter((l) => l.event_type === "signup").length,
        uniqueUsers: new Set(recentLogs.filter((l) => l.user_id).map((l) => l.user_id)).size,
        suspiciousActivity: suspiciousCount,
      });
    }
  };

  const fetchAuditLogs = async () => {
    const { data } = await supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (data) {
      setAuditLogs(data as AuditLog[]);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const parseUserAgent = (ua: string | null) => {
    if (!ua) return "Unknown Device";
    if (ua.includes("Mobile")) return "Mobile Browser";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    return "Browser";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "overview", label: "Overview", icon: Shield },
          { key: "auth", label: "Auth Logs", icon: Activity },
          { key: "audit", label: "Audit Trail", icon: Monitor },
          { key: "sessions", label: "Sessions", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeView === key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView(key as typeof activeView)}
            className="gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={fetchAllData} className="ml-auto gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Overview */}
      {activeView === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              icon={LogIn}
              label="Logins (24h)"
              value={stats.totalLogins}
              color="text-green-600 bg-green-500/10"
            />
            <StatCard
              icon={XCircle}
              label="Failed (24h)"
              value={stats.failedLogins}
              color="text-red-600 bg-red-500/10"
              alert={stats.failedLogins > 10}
            />
            <StatCard
              icon={UserPlus}
              label="Signups (24h)"
              value={stats.signups}
              color="text-blue-600 bg-blue-500/10"
            />
            <StatCard
              icon={Users}
              label="Active Users"
              value={stats.uniqueUsers}
              color="text-purple-600 bg-purple-500/10"
            />
            <StatCard
              icon={AlertTriangle}
              label="Suspicious"
              value={stats.suspiciousActivity}
              color="text-orange-600 bg-orange-500/10"
              alert={stats.suspiciousActivity > 0}
            />
          </div>

          {/* Suspicious Activity Alert */}
          {stats.suspiciousActivity > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Brute Force Detected</h4>
                <p className="text-red-700 text-sm">
                  {stats.suspiciousActivity} account(s) had 5+ failed login attempts in the last 24 hours.
                  Check Auth Logs for details.
                </p>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {authLogs.slice(0, 10).map((log) => {
                const Icon = eventIcons[log.event_type] || Activity;
                const color = eventColors[log.event_type] || "bg-slate-500/10 text-slate-600";
                return (
                  <div key={log.id} className="glass-card rounded-lg p-3 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {log.email || "Unknown"} — {log.event_type.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.ip_address || "N/A"} · {parseUserAgent(log.user_agent)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(log.created_at)}
                    </span>
                  </div>
                );
              })}
              {authLogs.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No activity logs yet. Events will appear here as users interact with your site.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Logs */}
      {activeView === "auth" && (
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-foreground">Authentication Activity</h3>
          {authLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No authentication logs yet.</p>
          ) : (
            authLogs.map((log) => {
              const Icon = eventIcons[log.event_type] || Activity;
              const color = eventColors[log.event_type] || "bg-slate-500/10 text-slate-600 border-slate-500/20";
              return (
                <div key={log.id} className="glass-card rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-foreground">{log.email || "Unknown"}</span>
                        <Badge variant="outline" className={color}>
                          {log.event_type.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>IP: {log.ip_address || "N/A"}</span>
                        <span>{parseUserAgent(log.user_agent)}</span>
                        <span>{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Audit Trail */}
      {activeView === "audit" && (
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-foreground">Admin Audit Trail</h3>
          {auditLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No admin actions logged yet. Actions like approving tickets or managing portfolio will appear here.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="glass-card rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-foreground">
                        {log.action.replace(/_/g, " ")}
                      </span>
                      <Badge variant="outline">{log.target_type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target: {log.target_id || "N/A"} · {new Date(log.created_at).toLocaleString()}
                    </p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <pre className="text-xs text-muted-foreground mt-2 bg-secondary/50 rounded p-2 overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sessions */}
      {activeView === "sessions" && (
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-foreground">Active Sessions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Based on recent successful logins (last 7 days).
          </p>
          {(() => {
            const recentLogins = authLogs
              .filter((l) => l.event_type === "login_success")
              .filter((l) => new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

            // Group by user
            const userSessions: Record<string, AuthLog[]> = {};
            recentLogins.forEach((log) => {
              const key = log.email || log.user_id || "unknown";
              if (!userSessions[key]) userSessions[key] = [];
              userSessions[key].push(log);
            });

            if (Object.keys(userSessions).length === 0) {
              return <p className="text-muted-foreground text-center py-8">No recent sessions found.</p>;
            }

            return Object.entries(userSessions).map(([email, sessions]) => (
              <div key={email} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{email}</p>
                    <p className="text-xs text-muted-foreground">{sessions.length} session(s) this week</p>
                  </div>
                  <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="space-y-1 pl-13">
                  {sessions.slice(0, 3).map((s) => (
                    <p key={s.id} className="text-xs text-muted-foreground">
                      {s.ip_address || "N/A"} · {parseUserAgent(s.user_agent)} · {formatTime(s.created_at)}
                    </p>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  alert,
}: {
  icon: typeof Shield;
  label: string;
  value: number;
  color: string;
  alert?: boolean;
}) {
  return (
    <div className={`glass-card rounded-xl p-4 ${alert ? "ring-2 ring-red-500/30" : ""}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
