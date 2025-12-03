import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Headphones,
  Brain,
  Server,
  Cloud,
  Code,
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

// Service images
import itSupportImg from "@/assets/services/it-support.jpg";
import aiMlImg from "@/assets/services/ai-ml.jpg";
import webHostingImg from "@/assets/services/web-hosting.jpg";
import cloudSolutionsImg from "@/assets/services/cloud-solutions.jpg";
import softwareDevImg from "@/assets/services/software-development.jpg";
import cybersecurityImg from "@/assets/services/cybersecurity.jpg";

const services = [
  {
    id: "it-support",
    icon: Headphones,
    image: itSupportImg,
    title: "IT Support",
    tagline: "24/7 Expert Technical Support",
    description:
      "Our dedicated IT support team provides round-the-clock assistance for all your technical needs. From troubleshooting to maintenance, we keep your systems running smoothly.",
    features: [
      "Remote & onsite troubleshooting",
      "Help desk ticketing system",
      "Network monitoring & maintenance",
      "Hardware & software support",
      "Emergency response team",
      "Proactive system health checks",
    ],
    cta: { text: "Submit a Ticket", href: "/support", primary: true },
  },
  {
    id: "ai-ml",
    icon: Brain,
    image: aiMlImg,
    title: "AI & Machine Learning",
    tagline: "Intelligent Automation Solutions",
    description:
      "Leverage the power of artificial intelligence to transform your business operations. Our custom AI solutions help you make smarter decisions and automate complex processes.",
    features: [
      "Custom ML model development",
      "Predictive analytics",
      "Natural language processing",
      "Computer vision solutions",
      "AI-powered automation",
      "Data pipeline architecture",
    ],
    cta: { text: "Learn More", href: "/contact" },
  },
  {
    id: "web-hosting",
    icon: Server,
    image: webHostingImg,
    title: "Web Hosting",
    tagline: "High-Performance Hosting",
    description:
      "Reliable, secure, and blazing-fast web hosting solutions designed for businesses of all sizes. Our infrastructure ensures your website is always online and performing at its best.",
    features: [
      "99.9% uptime guarantee",
      "SSD storage & CDN",
      "Free SSL certificates",
      "Daily automated backups",
      "One-click app installations",
      "24/7 server monitoring",
    ],
    cta: { text: "Get Started", href: "/contact" },
  },
  {
    id: "cloud",
    icon: Cloud,
    image: cloudSolutionsImg,
    title: "Cloud Solutions",
    tagline: "Scalable Cloud Infrastructure",
    description:
      "Modernize your infrastructure with our comprehensive cloud services. We help you migrate, optimize, and manage cloud environments for maximum efficiency and cost savings.",
    features: [
      "Cloud migration services",
      "Multi-cloud architecture",
      "Cloud storage solutions",
      "Disaster recovery",
      "Cost optimization",
      "Managed cloud services",
    ],
    cta: { text: "Explore Options", href: "/contact" },
  },
  {
    id: "development",
    icon: Code,
    image: softwareDevImg,
    title: "Software Development",
    tagline: "Custom Digital Solutions",
    description:
      "From web applications to mobile apps, our development team builds custom software solutions tailored to your unique business requirements.",
    features: [
      "Custom web applications",
      "Mobile app development",
      "API development & integration",
      "E-commerce solutions",
      "UI/UX design",
      "Ongoing maintenance & support",
    ],
    cta: { text: "Start Project", href: "/contact" },
  },
  {
    id: "security",
    icon: Shield,
    image: cybersecurityImg,
    title: "Cybersecurity",
    tagline: "Comprehensive Protection",
    description:
      "Protect your business from cyber threats with our comprehensive security solutions. We implement industry-best practices to safeguard your data and systems.",
    features: [
      "Security audits & assessments",
      "Penetration testing",
      "Firewall management",
      "Endpoint protection",
      "Security awareness training",
      "Incident response planning",
    ],
    cta: { text: "Secure Your Business", href: "/contact" },
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-6">
              Technology Solutions for Every Need
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From IT support to AI innovation, we provide comprehensive services
              to help your business thrive in the digital age.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <service.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                        {service.title}
                      </h2>
                      <p className="text-primary font-medium">
                        {service.tagline}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-foreground text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link to={service.cta.href}>
                    <Button
                      variant={service.cta.primary ? "default" : "outline"}
                      size="lg"
                    >
                      {service.cta.text}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div
                  className={`${index % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover aspect-[4/3]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy">
        <div className="container mx-auto text-center">
          <Zap className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Our team can design and implement tailored technology solutions to
            meet your specific business requirements.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">
              Contact Our Team
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
