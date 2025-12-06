import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slideshowImages = [
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    alt: "Technology circuit board",
  },
  {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    alt: "Global network connections",
  },
  {
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
    alt: "Cybersecurity concept",
  },
  {
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
    alt: "Modern laptop setup",
  },
  {
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
    alt: "Data visualization",
  },
];

export function ImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-elevated">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={slideshowImages[currentIndex].url}
          alt={slideshowImages[currentIndex].alt}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slideshowImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary-foreground w-6"
                : "bg-primary-foreground/50 hover:bg-primary-foreground/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
