import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Headphones, 
  Brain, 
  Server, 
  Cloud, 
  Code, 
  Shield,
  ArrowRight 
} from "lucide-react";

const services = [
  {
    icon: Headphones,
    title: "IT Support",
    description: "24/7 remote and onsite technical support with rapid response times.",
    href: "/support",
    highlight: true,
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description: "Custom AI solutions to automate processes and unlock insights.",
    href: "/services",
  },
  {
    icon: Server,
    title: "Web Hosting",
    description: "High-performance hosting with 99.9% uptime guarantee.",
    href: "/services",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and storage solutions.",
    href: "/services",
  },
  {
    icon: Code,
    title: "Software Development",
    description: "Custom web and mobile applications built for your needs.",
    href: "/services",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Comprehensive security solutions to protect your business.",
    href: "/services",
  },
];

export function ServicesPreview() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-2 mb-4">
            Complete Technology Solutions
          </h2>
          <p className="text-muted-foreground">
            From IT support to AI innovation, we provide end-to-end services to power your digital transformation.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.href}
              className={`group glass-card rounded-2xl p-8 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 ${
                service.highlight ? "border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                service.highlight 
                  ? "bg-gradient-to-br from-primary to-accent" 
                  : "bg-secondary group-hover:bg-primary/10"
              }`}>
                <service.icon className={`w-7 h-7 ${
                  service.highlight ? "text-primary-foreground" : "text-primary"
                }`} />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {service.description}
              </p>
              <span className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                Learn more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="outline" size="lg">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
