import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones } from "lucide-react";

export function CTASection() {
  return (
    <section className="section-padding bg-navy relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px]" />

      <div className="container mx-auto relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-10 max-w-xl mx-auto">
            Let's discuss how Cortylix can help you achieve your technology goals. Get started with a free consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="heroOutline" size="xl">
                <Headphones className="w-5 h-5" />
                IT Support Ticket
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
