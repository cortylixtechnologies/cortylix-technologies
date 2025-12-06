import { useEffect, useRef, useState } from "react";
import { Users, FolderCheck, Calendar, TrendingUp } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { icon: Users, value: 150, suffix: "+", label: "Happy Clients" },
  { icon: FolderCheck, value: 500, suffix: "+", label: "Projects Completed" },
  { icon: Calendar, value: 10, suffix: "+", label: "Years of Experience" },
  { icon: TrendingUp, value: 5, suffix: "M+", label: "Revenue Generated" },
];

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}

function StatCard({ stat, inView }: { stat: StatItem; inView: boolean }) {
  const count = useCountUp(stat.value, 2000, inView);
  const Icon = stat.icon;

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8 text-center group hover:shadow-elevated transition-all duration-300">
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-primary-foreground" />
      </div>
      <div className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-1">
        {count}
        {stat.suffix}
      </div>
      <p className="text-muted-foreground">{stat.label}</p>
    </div>
  );
}

export function StatsSection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Impact
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-2">
            Driving Results That Matter
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
