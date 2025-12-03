import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative hero-gradient overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto relative">
        <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
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
            <p className="text-lg lg:text-xl text-primary-foreground/70 max-w-2xl mb-10 animate-fade-up animation-delay-200">
              From AI-powered automation to cloud infrastructure, we deliver cutting-edge technology solutions that transform businesses and drive innovation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-16 animate-fade-up animation-delay-300">
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
            <div className="flex flex-wrap gap-8 animate-fade-up animation-delay-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-primary-foreground font-semibold">99.9%</p>
                  <p className="text-primary-foreground/60 text-sm">Uptime SLA</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-primary-foreground font-semibold">24/7</p>
                  <p className="text-primary-foreground/60 text-sm">IT Support</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-primary-foreground font-semibold">500+</p>
                  <p className="text-primary-foreground/60 text-sm">Projects Delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
