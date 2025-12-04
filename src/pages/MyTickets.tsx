import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Loader2,
} from "lucide-react";

interface TicketType {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
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

export default function MyTickets() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTickets(data as TicketType[]);
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <section className="section-padding bg-background min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-primary font-medium">Support</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
                My Tickets
              </h1>
              <p className="text-muted-foreground mt-2">
                Track the status of your support requests
              </p>
            </div>
            <Link to="/support">
              <Button>
                <Plus className="w-4 h-4" />
                New Ticket
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto">
          {tickets.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No tickets yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Submit your first support ticket to get help from our team.
              </p>
              <Link to="/support">
                <Button>Submit a Ticket</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => {
                const status = statusConfig[ticket.status];
                const priority = priorityConfig[ticket.priority];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={ticket.id}
                    className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-primary">
                            {ticket.ticket_number}
                          </span>
                          <Badge variant="outline" className={priority.color}>
                            {priority.label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {ticket.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {ticket.description}
                        </p>
                        {ticket.admin_notes && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Admin Note:</span>{" "}
                              {ticket.admin_notes}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant="outline" className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
