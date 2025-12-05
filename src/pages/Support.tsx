import { useState } from "react";
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
  Mail,
  Lock,
  User,
} from "lucide-react";
import { z } from "zod";

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

const ticketSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  issueTitle: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide more details"),
  priority: z.string().min(1, "Please select a priority"),
});

const loggedInTicketSchema = z.object({
  issueTitle: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide more details"),
  priority: z.string().min(1, "Please select a priority"),
});

export default function Support() {
  const { toast } = useToast();
  const { user, loading: authLoading, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [hasExistingAccount, setHasExistingAccount] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    issueTitle: "",
    description: "",
    priority: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!formData.priority) {
      setErrors({ priority: "Please select a priority level" });
      return;
    }

    setIsSubmitting(true);

    try {
      let currentUser = user;

      // If not logged in, create account or sign in first
      if (!currentUser) {
        const validation = ticketSchema.safeParse(formData);
        if (!validation.success) {
          const fieldErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsSubmitting(false);
          return;
        }

        if (hasExistingAccount) {
          // Sign in existing user
          const { error } = await signIn(formData.email, formData.password);
          if (error) {
            toast({
              title: "Sign in failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
        } else {
          // Create new account
          const { error } = await signUp(formData.email, formData.password, formData.fullName);
          if (error) {
            if (error.message.includes("already registered")) {
              toast({
                title: "Account exists",
                description: "This email is already registered. Please check 'I have an account' and sign in.",
                variant: "destructive",
              });
              setHasExistingAccount(true);
            } else {
              toast({
                title: "Account creation failed",
                description: error.message,
                variant: "destructive",
              });
            }
            setIsSubmitting(false);
            return;
          }
        }

        // Wait for auth state to update
        const { data: { session } } = await supabase.auth.getSession();
        currentUser = session?.user ?? null;

        if (!currentUser) {
          toast({
            title: "Error",
            description: "Authentication failed. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        // User is logged in, validate ticket fields only
        const validation = loggedInTicketSchema.safeParse(formData);
        if (!validation.success) {
          const fieldErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsSubmitting(false);
          return;
        }
      }

      // Submit the ticket
      const { data, error } = await supabase
        .from("tickets")
        .insert({
          user_id: currentUser.id,
          title: formData.issueTitle,
          description: formData.description,
          priority: formData.priority as "low" | "medium" | "high" | "urgent",
          ticket_number: "TEMP",
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

      toast({
        title: "Ticket Submitted Successfully!",
        description: `Your ticket ID is ${data.ticket_number}. Use your email and password to track it.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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
              <div className="glass-card rounded-xl p-6 mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Your Ticket ID
                </p>
                <p className="text-2xl font-display font-bold text-primary">
                  {ticketNumber}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 mb-8 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground">
                  Use your email <span className="font-medium text-foreground">{formData.email || user?.email}</span> and password to track your ticket status.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/my-tickets">
                  <Button>View My Tickets</Button>
                </Link>
                <Button variant="outline" onClick={() => {
                  setSubmitted(false);
                  setFormData({ fullName: "", email: "", password: "", issueTitle: "", description: "", priority: "" });
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
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account fields - only show when not logged in */}
                {!authLoading && !user && (
                  <div className="glass-card rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">Your Account</h3>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={hasExistingAccount}
                          onChange={(e) => setHasExistingAccount(e.target.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-muted-foreground">I already have an account</span>
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {hasExistingAccount 
                        ? "Sign in with your existing credentials to submit a ticket."
                        : "Create an account to submit and track your support tickets."}
                    </p>
                    
                    {!hasExistingAccount && (
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            name="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                        {errors.fullName && (
                          <p className="text-destructive text-sm">{errors.fullName}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-destructive text-sm">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                      {errors.password && (
                        <p className="text-destructive text-sm">{errors.password}</p>
                      )}
                      {!hasExistingAccount && (
                        <p className="text-xs text-muted-foreground">
                          Remember this password - you'll need it to track your ticket.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Logged in user indicator */}
                {user && (
                  <div className="glass-card rounded-xl p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      Submitting as <span className="font-medium text-foreground">{user.email}</span>
                    </p>
                  </div>
                )}

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
                  {errors.issueTitle && (
                    <p className="text-destructive text-sm">{errors.issueTitle}</p>
                  )}
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
                  {errors.description && (
                    <p className="text-destructive text-sm">{errors.description}</p>
                  )}
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
                    {errors.priority && (
                      <p className="text-destructive text-sm">{errors.priority}</p>
                    )}
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
                      {!user ? (hasExistingAccount ? "Sign In & Submit Ticket" : "Create Account & Submit Ticket") : "Submit Ticket"}
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
                        You'll receive a confirmation with your ticket ID
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
                        Track Status
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Use your email & password to check updates
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-3">
                  Already submitted a ticket?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Track your existing tickets by signing in with your email and password.
                </p>
                <Link to="/track-ticket">
                  <Button variant="outline" className="w-full">Track My Tickets</Button>
                </Link>
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
        </div>
      </section>
    </Layout>
  );
}