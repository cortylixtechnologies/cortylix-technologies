import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Innovation First",
    description: "We embrace cutting-edge technologies to deliver forward-thinking solutions.",
  },
  {
    icon: Heart,
    title: "Client Success",
    description: "Your success is our success. We're committed to exceeding expectations.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work as partners, not vendors, building lasting relationships.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Quality and attention to detail in everything we deliver.",
  },
];

const stats = [
  { value: "500+", label: "Projects Delivered" },
  { value: "150+", label: "Happy Clients" },
  { value: "10+", label: "Years Experience" },
  { value: "24/7", label: "Support Available" },
];

const team = [
  { name: "Alex Thompson", role: "CEO & Founder", avatar: "AT" },
  { name: "Maria Garcia", role: "CTO", avatar: "MG" },
  { name: "David Kim", role: "Head of AI", avatar: "DK" },
  { name: "Sarah Miller", role: "Operations Director", avatar: "SM" },
];

const whyChooseUs = [
  "Industry-leading response times",
  "Certified experts across all technologies",
  "Transparent pricing with no hidden fees",
  "Scalable solutions that grow with you",
  "Proven track record of success",
  "Dedicated account management",
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              About Us
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-6">
              Pioneering Technology Excellence Since 2014
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Cortylix Technologies was founded with a simple mission: to make enterprise-grade technology accessible to businesses of all sizes. Today, we're trusted by hundreds of companies worldwide to power their digital transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-display font-bold gradient-text">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="glass-card rounded-2xl p-8 lg:p-10">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To empower businesses with innovative technology solutions that drive growth, efficiency, and competitive advantage. We strive to be the bridge between complex technology and real-world business outcomes.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 lg:p-10">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the world's most trusted technology partner, known for transforming businesses through intelligent solutions. We envision a future where every organization has access to the technology they need to thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground">
              The principles that guide everything we do at Cortylix.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-elevated transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-muted-foreground">
              A team of experienced professionals dedicated to your success.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-elevated transition-all"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-display font-bold text-xl">
                    {member.avatar}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-navy">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-6">
                Why Choose Cortylix?
              </h2>
              <p className="text-primary-foreground/70 mb-8">
                We combine deep technical expertise with a client-first approach to deliver solutions that truly make a difference.
              </p>
              <ul className="space-y-4">
                {whyChooseUs.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="glass-card rounded-2xl p-8 bg-primary-foreground/5 backdrop-blur-xl border-primary-foreground/10 max-w-sm">
                <Clock className="w-12 h-12 text-accent mb-6" />
                <h3 className="text-2xl font-display font-bold text-primary-foreground mb-2">
                  Start Today
                </h3>
                <p className="text-primary-foreground/70 mb-6">
                  Ready to experience the Cortylix difference? Let's discuss your project.
                </p>
                <Link to="/contact">
                  <Button variant="hero" className="w-full">
                    Get in Touch
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
