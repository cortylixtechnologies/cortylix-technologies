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
  LogIn,
} from "lucide-react";
import { z } from "zod";

const priorities = [
  { value: "low", label: "Low", description: "General questions or minor issues" },
  { value: "medium", label: "Medium", description: "Affecting productivity" },
  { value: "high", label: "High", description: "Critical system affected" },
  { value: "urgent", label: "Urgent", description: "Complete system down" },
];

const features = [
  { icon: Clock, title: "Fast Response", description: "Average response time under 2 hours" },
  { icon: Headphones, title: "24/7 Support", description: "Round-the-clock technical assistance" },
  { icon: Shield, title: "Secure Handling", description: "Your data is protected and encrypted" },
];

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const ticketSchema = z.object({
  issueTitle: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide more details"),
  priority: z.string().min(1, "Please select a priority"),
});

export default function Support() {
  const { toast } = useToast();
  const { user, loading: authLoading, signUp, signIn } = useAuth();
  const navigate = useNavigate();

  // Auth state
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authErrors, setAuthErrors] = useState<Record<string, string>>({});
  const [authData, setAuthData] = useState({ fullName: "", email: "", password: "" });

  // Ticket state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketErrors, setTicketErrors] = useState<Record<string, string>>({});
  const [ticketData, setTicketData] = useState({ issueTitle: "", description: "", priority: "" });

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrors({});
    setIsAuthLoading(true);

    try {
      if (authMode === "signup") {
        const result = signUpSchema.safeParse(authData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setAuthErrors(fieldErrors);
          return;
        }
        const { error } = await signUp(authData.email, authData.password, authData.fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({ title: "Account exists", description: "This email is already registered. Please sign in instead.", variant: "destructive" });
            setAuthMode("signin");
          } else {
            toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
          }
          return;
        }
        toast({ title: "Account created!", description: "You can now submit your support ticket." });
      } else {
        const result = signInSchema.safeParse(authData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setAuthErrors(fieldErrors);
          return;
        }
        const { error } = await signIn(authData.email, authData.password);
        if (error) {
          toast({ title: "Sign in failed", description: "Invalid email or password.", variant: "destructive" });
          return;
        }
        toast({ title: "Signed in!", description: "You can now submit your support ticket." });
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketErrors({});

    if (!ticketData.priority) {
      setTicketErrors({ priority: "Please select a priority level" });
      return;
    }

    const validation = ticketSchema.safeParse(ticketData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setTicketErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("tickets")
        .insert({
          user_id: user!.id,
          title: ticketData.issueTitle,
          description: ticketData.description,
          priority: ticketData.priority as "low" | "medium" | "high" | "urgent",
          ticket_number: "TEMP",
        })
        .select("ticket_number")
        .single();

      if (error) {
        toast({ title: "Error", description: "Failed to submit ticket. Please try again.", variant: "destructive" });
        return;
      }

      setTicketNumber(data.ticket_number);
      setSubmitted(true);
      toast({ title: "Ticket Submitted!", description: `Your ticket ID is ${data.ticket_number}.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <Layout>
        <section className="section-padding bg-background min-h-[70vh] flex items-center">
          <div className="container mx-auto">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-4">Ticket Submitted!</h1>
              <p className="text-muted-foreground mb-6">
                Thanks for contacting Elivion Technologies. Your ticket has been received and our team will respond shortly.
              </p>
              <div className="glass-card rounded-xl p-6 mb-4">
                <p className="text-sm text-muted-foreground mb-2">Your Ticket ID</p>
                <p className="text-2xl font-display font-bold text-primary">{ticketNumber}</p>
              </div>
              <div className="glass-card rounded-xl p-4 mb-8 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground">
                  Use your email <span className="font-medium text-foreground">{user?.email}</span> and password to track your ticket status.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/my-tickets">
                  <Button>My Tickets</Button>
                </Link>
                <Button variant="outline" onClick={() => {
                  setSubmitted(false);
                  setTicketData({ issueTitle: "", description: "", priority: "" });
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
      {/* Hero */}
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
             Are you Experiencing technical issues? Report a problem and and our expert team will assist you as quickly as possible.
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
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Step 1: Auth - shown when not logged in */}
              {!authLoading && !user && (
                <div className="glass-card rounded-2xl p-8 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">1</div>
                    <h2 className="text-xl font-display font-semibold text-foreground">
                      {authMode === "signup" ? "Create Your Account" : "Sign In to Your Account"}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6">
                    {authMode === "signup"
                      ? "Create an account to submit and track your support tickets. Your credentials will be used to check ticket status."
                      : "Sign in with your existing account to submit a new ticket."}
                  </p>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === "signup" && (
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            placeholder="John Doe"
                            value={authData.fullName}
                            onChange={(e) => { setAuthData({ ...authData, fullName: e.target.value }); setAuthErrors({ ...authErrors, fullName: "" }); }}
                            className="pl-10"
                          />
                        </div>
                        {authErrors.fullName && <p className="text-destructive text-sm">{authErrors.fullName}</p>}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="authEmail">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="authEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={authData.email}
                          onChange={(e) => { setAuthData({ ...authData, email: e.target.value }); setAuthErrors({ ...authErrors, email: "" }); }}
                          className="pl-10"
                        />
                      </div>
                      {authErrors.email && <p className="text-destructive text-sm">{authErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="authPassword">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="authPassword"
                          type="password"
                          placeholder="••••••••"
                          value={authData.password}
                          onChange={(e) => { setAuthData({ ...authData, password: e.target.value }); setAuthErrors({ ...authErrors, password: "" }); }}
                          className="pl-10"
                        />
                      </div>
                      {authErrors.password && <p className="text-destructive text-sm">{authErrors.password}</p>}
                      {authMode === "signup" && (
                        <p className="text-xs text-muted-foreground">Min 6 characters. You'll use this to track your tickets later.</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isAuthLoading}>
                      {isAuthLoading ? "Please wait..." : authMode === "signup" ? "Create Account" : "Sign In"}
                      {!isAuthLoading && (authMode === "signup" ? <User className="w-4 h-4" /> : <LogIn className="w-4 h-4" />)}
                    </Button>
                  </form>

                  <p className="text-muted-foreground text-sm text-center mt-4">
                    {authMode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => { setAuthMode(authMode === "signup" ? "signin" : "signup"); setAuthErrors({}); }}
                      className="text-primary hover:underline font-medium"
                    >
                      {authMode === "signup" ? "Sign in" : "Sign up"}
                    </button>
                  </p>
                </div>
              )}

              {/* Step 2: Ticket Form - shown when logged in */}
              {user && (
                <>
                  <div className="glass-card rounded-xl p-4 bg-primary/5 border-primary/20 mb-6">
                    <p className="text-sm text-muted-foreground">
                      Logged in as <span className="font-medium text-foreground">{user.email}</span>
                    </p>
                  </div>

                  <div className="glass-card rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">
                        {!authLoading ? "✓" : "2"}
                      </div>
                      <h2 className="text-xl font-display font-semibold text-foreground">Describe Your Issue</h2>
                    </div>

                    <form onSubmit={handleTicketSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="issueTitle">Issue Title *</Label>
                        <Input
                          id="issueTitle"
                          placeholder="Brief description of the issue"
                          value={ticketData.issueTitle}
                          onChange={(e) => { setTicketData({ ...ticketData, issueTitle: e.target.value }); setTicketErrors({ ...ticketErrors, issueTitle: "" }); }}
                        />
                        {ticketErrors.issueTitle && <p className="text-destructive text-sm">{ticketErrors.issueTitle}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Detailed Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Please provide as much detail as possible about your issue..."
                          rows={6}
                          value={ticketData.description}
                          onChange={(e) => { setTicketData({ ...ticketData, description: e.target.value }); setTicketErrors({ ...ticketErrors, description: "" }); }}
                        />
                        {ticketErrors.description && <p className="text-destructive text-sm">{ticketErrors.description}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Priority Level *</Label>
                          <Select
                            value={ticketData.priority}
                            onValueChange={(value) => setTicketData({ ...ticketData, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorities.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                  <div className="flex items-center gap-2">
                                    <span>{p.label}</span>
                                    <span className="text-muted-foreground text-xs">- {p.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {ticketErrors.priority && <p className="text-destructive text-sm">{ticketErrors.priority}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Attachment (Optional)</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload</p>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? <span className="animate-pulse">Submitting...</span> : (
                          <>Submit Ticket <Zap className="w-4 h-4" /></>
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              )}

              {/* Not logged in - disabled ticket preview */}
              {!authLoading && !user && (
                <div className="glass-card rounded-2xl p-8 opacity-50 pointer-events-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm flex items-center justify-center font-bold">2</div>
                    <h2 className="text-xl font-display font-semibold text-muted-foreground">Describe Your Issue</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">Create an account or sign in first to submit your ticket.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">What happens next?</h3>
                <ol className="space-y-4">
                  {[
                    { step: "1", title: "Create Account", desc: "Sign up with your email and password" },
                    { step: "2", title: "Submit Ticket", desc: "Describe your issue and set priority" },
                    { step: "3", title: "Track Status", desc: "Use your credentials to check updates" },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">{item.step}</span>
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-3">Already submitted a ticket?</h3>
                <p className="text-muted-foreground text-sm mb-4">Track your existing tickets by signing in.</p>
                <Link to="/track-ticket">
                  <Button variant="outline" className="w-full">Track My Tickets</Button>
                </Link>
              </div>

              <div className="glass-card rounded-2xl p-6 bg-destructive/5 border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Emergency Support</h3>
                    <p className="text-muted-foreground text-sm mb-3">For critical system outages, call our emergency hotline:</p>
                    <p className="font-semibold text-foreground">+1 (800) 555-0199</p>
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
