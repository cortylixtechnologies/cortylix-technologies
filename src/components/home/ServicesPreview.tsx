import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Service images
import itSupportImg from "@/assets/services/it-support.jpg";
import aiMlImg from "@/assets/services/ai-ml.jpg";
import webHostingImg from "@/assets/services/web-hosting.jpg";
import cloudSolutionsImg from "@/assets/services/cloud-solutions.jpg";
import softwareDevImg from "@/assets/services/software-development.jpg";
import cybersecurityImg from "@/assets/services/cybersecurity.jpg";

const services = [
  {
    image: itSupportImg,
    title: "IT Support",
    description: "24/7 remote and onsite technical support with rapid response times.",
    href: "/support",
    highlight: true,
  },
  {
    image: aiMlImg,
    title: "AI & Machine Learning",
    description: "Custom AI solutions to automate processes and unlock insights.",
    href: "/services",
  },
  {
    image: webHostingImg,
    title: "Web Hosting",
    description: "High-performance hosting with 99.9% uptime guarantee.",
    href: "/services",
  },
  {
    image: cloudSolutionsImg,
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and storage solutions.",
    href: "/services",
  },
  {
    image: softwareDevImg,
    title: "Software Development",
    description: "Custom web and mobile applications built for your needs.",
    href: "/services",
  },
  {
    image: cybersecurityImg,
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
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-2 mb-4">
            Complete Technology Solutions
          </h2>
          <p className="text-muted-foreground">
            From IT support to AI innovation, we provide end-to-end services to power your digital transformation.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={service.href}
                className={`group glass-card rounded-2xl overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 block h-full ${
                  service.highlight ? "border-primary/30" : ""
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/services">
            <Button variant="outline" size="lg">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
