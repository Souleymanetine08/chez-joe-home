import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Fatou SARR",
    location: "Dakar, Plateau",
    rating: 5,
    text: "Service impeccable! J'ai équipé toute ma cuisine chez Joe. Prix imbattables et conseil personnalisé. Je recommande vivement!",
    date: "Il y a 1 semaine",
    verified: true,
  },
  {
    id: 2,
    name: "Moussa NDIAYE",
    location: "Dakar, Almadies",
    rating: 5,
    text: "Livraison gratuite et rapide. Le mobilier est magnifique et très bien emballé. L'équipe est professionnelle et ponctuelle.",
    date: "Il y a 2 semaines",
    verified: true,
  },
  {
    id: 3,
    name: "Khady BA",
    location: "Dakar, Sacré-Coeur",
    rating: 5,
    text: "Vaisselle élégante, parfaite pour mes réceptions. Qualité exceptionnelle à prix accessible. Je recommande à 100%!",
    date: "Il y a 3 semaines",
    verified: true,
  },
  {
    id: 4,
    name: "Ibrahima FALL",
    location: "Dakar, Mermoz",
    rating: 5,
    text: "Large choix d'électroménager. J'ai trouvé exactement ce que je cherchais. Le SAV est également très réactif.",
    date: "Il y a 1 mois",
    verified: true,
  },
  {
    id: 5,
    name: "Awa DIALLO",
    location: "Dakar, Point E",
    rating: 5,
    text: "Déco sublime! Mon salon est transformé grâce à leurs conseils. L'équipe est vraiment à l'écoute.",
    date: "Il y a 1 mois",
    verified: true,
  },
  {
    id: 6,
    name: "Amadou DIOP",
    location: "Dakar, Ngor",
    rating: 5,
    text: "Absolument ravi de mon canapé! Qualité exceptionnelle, livraison rapide et montage parfait.",
    date: "Il y a 2 mois",
    verified: true,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const visibleTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-medium tracking-wider uppercase text-sm"
          >
            Ils nous font confiance
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4"
          >
            Avis de nos clients
          </motion.h2>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-6 text-muted-foreground"
          >
            <span className="flex items-center gap-1">
              <Star className="h-5 w-5 text-gold fill-gold" />
              <strong className="text-foreground">4.9/5</strong> étoiles
            </span>
            <span>|</span>
            <span><strong className="text-foreground">1,240+</strong> avis vérifiés</span>
            <span>|</span>
            <span><strong className="text-foreground">99%</strong> recommandent</span>
          </motion.div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-card shadow-medium hover:shadow-strong rounded-full transition-all hidden md:block"
            aria-label="Avis précédents"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-card shadow-medium hover:shadow-strong rounded-full transition-all hidden md:block"
            aria-label="Avis suivants"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {visibleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all border border-border"
                >
                  <Quote className="h-8 w-8 text-gold/30 mb-4" />
                  
                  <p className="text-foreground/80 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "text-gold fill-gold" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-display font-bold text-primary">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    {testimonial.verified && (
                      <span className="text-green-600">✓ Vérifié via Google</span>
                    )}
                    <span>•</span>
                    <span>{testimonial.date}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/30"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
