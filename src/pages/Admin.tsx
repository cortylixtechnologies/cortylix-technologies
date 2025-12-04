import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Check,
  X,
} from "lucide-react";

interface TicketType {
  id: string;
  ticket_number: string;
  user_id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileType {
  full_name: string | null;
  email: string | null;
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  approved: { label: "Approved", icon: CheckCircle2, color: "bg-green-500/10 text-green-600 border-green-500/20" },
  rejected: { label: "Rejected", icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  medium: { label: "Medium", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  urgent: { label: "Urgent", color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export default function Admin() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileType>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      }
    }
  }, [user, authLoading, isAdmin, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchTickets();
    }
  }, [user, isAdmin]);

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTickets(data as TicketType[]);
      
      // Fetch profiles for all unique user_ids
      const userIds = [...new Set(data.map((t) => t.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);
      
      if (profilesData) {
        const profileMap: Record<string, ProfileType> = {};
        profilesData.forEach((p) => {
          profileMap[p.user_id] = { full_name: p.full_name, email: p.email };
        });
        setProfiles(profileMap);
      }
    }
    setLoading(false);
  };

  const updateTicketStatus = async (ticketId: string, status: "approved" | "rejected") => {
    setUpdating(true);
    
    const { error } = await supabase
      .from("tickets")
      .update({
        status,
        admin_notes: adminNotes || null,
      })
      .eq("id", ticketId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Ticket Updated",
        description: `Ticket has been ${status}.`,
      });
      setSelectedTicket(null);
      setAdminNotes("");
      fetchTickets();
    }
    setUpdating(false);
  };

  const filteredTickets = tickets.filter(
    (t) => filter === "all" || t.status === filter
  );

  if (authLoading || loading) {
    return (
      <Layout>
        <section className="section-padding bg-background min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </section>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-primary font-medium">Admin Panel</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
            Ticket Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and process support tickets
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== "all" && (
                  <span className="ml-2 text-xs">
                    ({tickets.filter((t) => t.status === f).length})
                  </span>
                )}
              </Button>
            ))}
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No tickets found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const status = statusConfig[ticket.status];
                const priority = priorityConfig[ticket.priority];
                const StatusIcon = status.icon;
                const profile = profiles[ticket.user_id];

                return (
                  <div
                    key={ticket.id}
                    className="glass-card rounded-xl p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-mono text-sm text-primary">
                            {ticket.ticket_number}
                          </span>
                          <Badge variant="outline" className={priority.color}>
                            {priority.label}
                          </Badge>
                          <Badge variant="outline" className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {ticket.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            By: {profile?.full_name || profile?.email || "Unknown"}
                          </span>
                          <span>
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setAdminNotes(ticket.admin_notes || "");
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Review
                        </Button>
                        {ticket.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => updateTicketStatus(ticket.id, "approved")}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => updateTicketStatus(ticket.id, "rejected")}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Review Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Number</p>
                <p className="font-mono text-primary">{selectedTicket.ticket_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-semibold">{selectedTicket.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-foreground">{selectedTicket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant="outline" className={priorityConfig[selectedTicket.priority].color}>
                    {priorityConfig[selectedTicket.priority].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusConfig[selectedTicket.status].color}>
                    {statusConfig[selectedTicket.status].label}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Admin Notes</p>
                <Textarea
                  placeholder="Add notes for the user..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>
              Cancel
            </Button>
            {selectedTicket?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600"
                  onClick={() => updateTicketStatus(selectedTicket.id, "rejected")}
                  disabled={updating}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => updateTicketStatus(selectedTicket.id, "approved")}
                  disabled={updating}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
