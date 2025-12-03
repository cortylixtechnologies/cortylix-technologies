import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const categories = ["All", "AI & ML", "Web Development", "Cloud", "Mobile"];

const projects = [
  {
    title: "AI-Powered Analytics Platform",
    category: "AI & ML",
    description:
      "Built a predictive analytics dashboard processing 10M+ data points daily for a Fortune 500 company.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    tags: ["Python", "TensorFlow", "React", "AWS"],
  },
  {
    title: "Enterprise Cloud Migration",
    category: "Cloud",
    description:
      "Migrated legacy on-premise infrastructure to AWS, reducing operational costs by 40%.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    tags: ["AWS", "Terraform", "Docker", "Kubernetes"],
  },
  {
    title: "E-commerce Marketplace",
    category: "Web Development",
    description:
      "Custom marketplace platform handling 100K+ transactions monthly with real-time inventory.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    tags: ["Next.js", "PostgreSQL", "Stripe", "Redis"],
  },
  {
    title: "Healthcare Mobile App",
    category: "Mobile",
    description:
      "Patient management app with HIPAA compliance and telehealth integration.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    tags: ["React Native", "Node.js", "MongoDB", "WebRTC"],
  },
  {
    title: "NLP Chatbot System",
    category: "AI & ML",
    description:
      "Intelligent customer service chatbot reducing support tickets by 60%.",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop",
    tags: ["Python", "OpenAI", "FastAPI", "Vue.js"],
  },
  {
    title: "SaaS Dashboard Platform",
    category: "Web Development",
    description:
      "White-label analytics dashboard serving 50+ enterprise clients.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    tags: ["React", "TypeScript", "GraphQL", "PostgreSQL"],
  },
  {
    title: "Multi-Cloud Infrastructure",
    category: "Cloud",
    description:
      "Designed hybrid cloud architecture across AWS, Azure, and GCP.",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop",
    tags: ["Multi-cloud", "Terraform", "Ansible", "Monitoring"],
  },
  {
    title: "Fitness Tracking App",
    category: "Mobile",
    description:
      "iOS and Android app with wearable device integration and social features.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    tags: ["Flutter", "Firebase", "HealthKit", "ML Kit"],
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Work
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-6">
              Portfolio
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore our latest projects and see how we've helped businesses
              transform through technology.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-16 lg:top-20 z-40">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.title}
                className={cn(
                  "group glass-card rounded-2xl overflow-hidden hover:shadow-elevated transition-all duration-300",
                  "animate-fade-up"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                    <button className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center hover:scale-110 transition-transform">
                      <ExternalLink className="w-5 h-5 text-foreground" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Let's discuss how we can bring your vision to life with our
            expertise and innovative solutions.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
