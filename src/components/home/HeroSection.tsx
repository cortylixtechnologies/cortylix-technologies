import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slideshowImages = [
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=75&fit=crop",
    alt: "Technology circuit board",
  },
  {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=75&fit=crop",
    alt: "Global network connections",
  },
  {
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=75&fit=crop",
    alt: "Cybersecurity concept",
  },
  {
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&q=75&fit=crop",
    alt: "Modern laptop setup",
  },
  {
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=75&fit=crop",
    alt: "Data visualization",
  },
];

// Preload first image
const preloadLink = document.createElement("link");
preloadLink.rel = "preload";
preloadLink.as = "image";
preloadLink.href = slideshowImages[0].url;
document.head.appendChild(preloadLink);

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Preload all slideshow images
    slideshowImages.forEach((img) => {
      const image = new Image();
      image.src = img.url;
    });

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
            loading="eager"
            decoding="async"
          />
        </AnimatePresence>
        {/* Light overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/70" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto relative">
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-20">
          <div className="max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-up backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Leading IT Solutions Provider
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              Securing and Empowering Your{" "}
              <span className="gradient-text">Digital World</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-up animation-delay-200">
              We provide end-to-end technology solutions — from cybersecurity and web development to IT support, software solutions, and cloud services. At CORTYLIX TECHNOLOGIES, we protect your digital assets, streamline your operations, and create the tools your business needs to grow and thrive in today's digital landscape.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-up animation-delay-300">
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
            <div className="flex flex-wrap justify-center gap-6 animate-fade-up animation-delay-400">
              <div className="flex items-center gap-3 backdrop-blur-sm bg-primary/5 border border-primary/20 px-4 py-3 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">99.9%</p>
                  <p className="text-muted-foreground text-xs">Uptime SLA</p>
                </div>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-sm bg-primary/5 border border-primary/20 px-4 py-3 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">24/7</p>
                  <p className="text-muted-foreground text-xs">IT Support</p>
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
                ? "bg-primary w-8"
                : "bg-primary/30 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}