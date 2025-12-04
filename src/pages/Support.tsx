import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Headphones,
  Clock,
  CheckCircle2,
  Upload,
  AlertTriangle,
  Shield,
  Zap,
  LogIn,
} from "lucide-react";

const priorities = [
  { value: "low", label: "Low", description: "General questions or minor issues" },
  { value: "medium", label: "Medium", description: "Affecting productivity" },
  { value: "high", label: "High", description: "Critical system affected" },
  { value: "urgent", label: "Urgent", description: "Complete system down" },
];

const features = [
  {
    icon: Clock,
    title: "Fast Response",
    description: "Average response time under 2 hours",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock technical assistance",
  },
  {
    icon: Shield,
    title: "Secure Handling",
    description: "Your data is protected and encrypted",
  },
];

export default function Support() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [formData, setFormData] = useState({
    issueTitle: "",
    description: "",
    priority: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a ticket.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!formData.priority) {
      toast({
        title: "Priority Required",
        description: "Please select a priority level.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("tickets")
      .insert({
        user_id: user.id,
        title: formData.issueTitle,
        description: formData.description,
        priority: formData.priority as "low" | "medium" | "high" | "urgent",
        ticket_number: "TEMP", // Will be overwritten by database trigger
      })
      .select("ticket_number")
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit ticket. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setTicketNumber(data.ticket_number);
    setSubmitted(true);
    setIsSubmitting(false);

    toast({
      title: "Ticket Submitted Successfully!",
      description: `Your ticket ID is ${data.ticket_number}. We'll get back to you shortly.`,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <Layout>
        <section className="section-padding bg-background min-h-[70vh] flex items-center">
          <div className="container mx-auto">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                Ticket Submitted!
              </h1>
              <p className="text-muted-foreground mb-6">
                Thank you for contacting Cortylix IT Support. Your ticket has been
                received and our team will respond shortly.
              </p>
              <div className="glass-card rounded-xl p-6 mb-8">
                <p className="text-sm text-muted-foreground mb-2">
                  Your Ticket ID
                </p>
                <p className="text-2xl font-display font-bold text-primary">
                  {ticketNumber}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/my-tickets">
                  <Button>View My Tickets</Button>
                </Link>
                <Button variant="outline" onClick={() => {
                  setSubmitted(false);
                  setFormData({ issueTitle: "", description: "", priority: "" });
                }}>
                  Submit Another Ticket
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Headphones className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-primary font-medium">IT Support</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Submit a Support Ticket
            </h1>
            <p className="text-muted-foreground text-lg">
              Experiencing technical issues? Submit a ticket and our expert team
              will assist you as quickly as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          {!authLoading && !user ? (
            <div className="max-w-lg mx-auto text-center">
              <div className="glass-card rounded-2xl p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Sign in to Submit Tickets
                </h2>
                <p className="text-muted-foreground mb-6">
                  Create an account or sign in to submit and track your support tickets.
                </p>
                <Link to="/auth">
                  <Button size="lg">Sign In / Sign Up</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="issueTitle">Issue Title *</Label>
                    <Input
                      id="issueTitle"
                      name="issueTitle"
                      placeholder="Brief description of the issue"
                      value={formData.issueTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Please provide as much detail as possible about your issue, including any error messages, steps to reproduce, and when the issue started..."
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Priority Level *</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <div className="flex items-center gap-2">
                                <span>{priority.label}</span>
                                <span className="text-muted-foreground text-xs">
                                  - {priority.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Attachment (Optional)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload logs or screenshots
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">Submitting...</span>
                      </>
                    ) : (
                      <>
                        Submit Ticket
                        <Zap className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">
                    What happens next?
                  </h3>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">
                        1
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          Ticket Created
                        </p>
                        <p className="text-muted-foreground text-sm">
                          You'll receive a confirmation email
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">
                        2
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          Team Review
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Our experts assess your issue
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">
                        3
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          Resolution
                        </p>
                        <p className="text-muted-foreground text-sm">
                          We work to resolve your issue
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="glass-card rounded-2xl p-6 bg-destructive/5 border-destructive/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Emergency Support
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        For critical system outages, call our emergency hotline:
                      </p>
                      <p className="font-semibold text-foreground">
                        +1 (800) 555-0199
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
