import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Cortylix built our company website from scratch and it looks amazing. Fast, responsive, and exactly what we needed to grow our online presence.",
    author: "James Mwangi",
    role: "Founder, BrightPath Solutions",
    avatar: "JM",
  },
  {
    quote: "Our systems kept crashing until Cortylix stepped in. They diagnosed and fixed everything within hours. Our operations have been smooth ever since.",
    author: "Amina Osei",
    role: "Operations Manager, LogiTech Hub",
    avatar: "AO",
  },
  {
    quote: "They redesigned our outdated website and set up proper security. We've had zero downtime and our customers love the new look.",
    author: "David Kimani",
    role: "CEO, UrbanTrade Ltd.",
    avatar: "DK",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-2 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-muted-foreground">
            See what our clients say about working with Cortylix Technologies.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="glass-card rounded-2xl p-8 hover:shadow-elevated transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
