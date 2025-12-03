import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "AI-Powered Analytics Platform",
    category: "AI & Machine Learning",
    description: "Built a predictive analytics dashboard processing 10M+ data points daily.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
  {
    title: "Enterprise Cloud Migration",
    category: "Cloud Solutions",
    description: "Migrated legacy systems to AWS, reducing costs by 40%.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
  },
  {
    title: "E-commerce Platform",
    category: "Web Development",
    description: "Custom marketplace handling 100K+ transactions monthly.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
];

export function PortfolioPreview() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Work
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-2">
              Featured Projects
            </h2>
          </div>
          <Link to="/portfolio">
            <Button variant="outline">
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group glass-card rounded-2xl overflow-hidden hover:shadow-elevated transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                  <button className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <span className="text-primary text-sm font-medium">
                  {project.category}
                </span>
                <h3 className="text-xl font-display font-semibold text-foreground mt-1 mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
