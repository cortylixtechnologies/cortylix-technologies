import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slideshowImages = [
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop",
    alt: "Technology circuit board",
  },
  {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    alt: "Global network connections",
  },
  {
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop",
    alt: "Cybersecurity concept",
  },
  {
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1920&h=1080&fit=crop",
    alt: "Modern laptop setup",
  },
  {
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop",
    alt: "Data visualization",
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-5rem)]">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={slideshowImages[currentIndex].url}
            alt={slideshowImages[currentIndex].alt}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Dark overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-navy/50" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto relative">
        <div className="min-h-[calc(100vh-5rem)] flex items-center py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground/80">
                Leading IT Solutions Provider
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              Empowering Digital Growth with{" "}
              <span className="gradient-text">Intelligent Solutions</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-primary-foreground/70 max-w-xl mb-10 animate-fade-up animation-delay-200">
              From AI-powered automation to cloud infrastructure, we deliver cutting-edge technology solutions that transform businesses and drive innovation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12 animate-fade-up animation-delay-300">
              <Link to="/contact">
                <Button variant="hero" size="xl">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="heroOutline" size="xl">
                  Explore Services
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 animate-fade-up animation-delay-400">
              <div className="flex items-center gap-3 backdrop-blur-sm bg-white/5 px-4 py-3 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-primary-foreground font-semibold">99.9%</p>
                  <p className="text-primary-foreground/60 text-xs">Uptime SLA</p>
                </div>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-sm bg-white/5 px-4 py-3 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-primary-foreground font-semibold">24/7</p>
                  <p className="text-primary-foreground/60 text-xs">IT Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slideshowImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary-foreground w-8"
                : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
            }`}
          />
        ))}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}