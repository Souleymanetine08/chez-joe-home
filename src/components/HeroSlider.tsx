import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroLiving from "@/assets/hero-living-room.jpg";
import heroKitchen from "@/assets/hero-kitchen.jpg";
import heroDecoration from "@/assets/hero-decoration.jpg";

const slides = [
  {
    image: heroLiving,
    badge: "JUSQU'À -30%",
    subtitle: "NOUVELLE COLLECTION",
    title: "Mobilier Moderne",
    titleHighlight: "pour votre intérieur",
    description: "Découvrez nos canapés, tables et chaises qui transforment votre espace de vie",
    cta1: "Découvrir la collection",
    cta2: "Voir les promotions",
    align: "left",
  },
  {
    image: heroKitchen,
    badge: "QUALITÉ PREMIUM",
    subtitle: "",
    title: "Équipez votre cuisine",
    titleHighlight: "avec style",
    description: "Des appareils performants et design pour faciliter votre quotidien",
    cta1: "Explorer",
    cta2: "",
    align: "center",
  },
  {
    image: heroDecoration,
    badge: "NOUVEAUTÉS",
    subtitle: "",
    title: "Les détails qui font",
    titleHighlight: "la différence",
    description: "Sublimez votre intérieur avec nos accessoires de décoration",
    cta1: "Voir la sélection",
    cta2: "",
    align: "right",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide]);

  const slide = slides[currentSlide];
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <section
      className="relative h-[85vh] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="container-custom relative z-10 h-full flex items-center">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`flex flex-col ${alignmentClasses[slide.align as keyof typeof alignmentClasses]} max-w-2xl ${
            slide.align === "right" ? "ml-auto" : slide.align === "center" ? "mx-auto" : ""
          }`}
        >
          {slide.badge && (
            <span className="inline-block bg-gold text-gold-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-4 shadow-gold">
              {slide.badge}
            </span>
          )}
          
          {slide.subtitle && (
            <span className="text-gold-light text-lg font-medium tracking-wider mb-2">
              {slide.subtitle}
            </span>
          )}
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-2">
            {slide.title}
          </h1>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-6">
            {slide.titleHighlight}
          </h2>
          
          <p className="text-card/90 text-lg md:text-xl mb-8 max-w-lg">
            {slide.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-gold-foreground shadow-gold font-semibold px-8">
              {slide.cta1} →
            </Button>
            {slide.cta2 && (
              <Button size="lg" variant="outline" className="border-card text-card hover:bg-card/10 font-semibold px-8">
                {slide.cta2}
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-card/20 backdrop-blur-sm hover:bg-card/40 rounded-full transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
        style={{ opacity: 1 }}
        aria-label="Slide précédent"
      >
        <ChevronLeft className="h-6 w-6 text-card" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-card/20 backdrop-blur-sm hover:bg-card/40 rounded-full transition-all opacity-0 hover:opacity-100"
        style={{ opacity: 1 }}
        aria-label="Slide suivant"
      >
        <ChevronRight className="h-6 w-6 text-card" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-8 bg-gold" : "w-2 bg-card/50 hover:bg-card/80"
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
