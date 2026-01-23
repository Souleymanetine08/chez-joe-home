import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const promotions = [
  {
    id: 1,
    title: "Mobilier d'Exception",
    subtitle: "Canapés & Fauteuils",
    description: "Design scandinave",
    discount: "-30%",
    startingPrice: 180000,
    originalPrice: 260000,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
    large: true,
  },
  {
    id: 2,
    title: "Électroménager Cuisine",
    subtitle: "Équipement complet",
    discount: "-20%",
    startingPrice: 85000,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    large: true,
  },
  {
    id: 3,
    title: "Sets de Vaisselle",
    subtitle: "Collection Premium",
    discount: "-30%",
    startingPrice: 32000,
    image: "https://images.unsplash.com/photo-1603199506016-5d0e4e2f5b62?w=800",
    large: false,
  },
  {
    id: 4,
    title: "Décoration Dorée",
    subtitle: "Accessoires Luxe",
    discount: "-25%",
    startingPrice: 15000,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    large: false,
  },
];

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-card/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-2xl font-bold text-card">{value.toString().padStart(2, "0")}</span>
          </div>
          <span className="text-xs text-card/70 mt-1 block capitalize">{unit === "days" ? "jours" : unit === "hours" ? "heures" : unit === "minutes" ? "min" : "sec"}</span>
        </div>
      ))}
    </div>
  );
}

export default function Promotions() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-SN").format(price) + " FCFA";
  };

  return (
    <section id="promotions" className="section-padding bg-gradient-to-br from-primary via-primary-dark to-primary">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Flame className="h-6 w-6 text-gold animate-pulse" />
            <span className="text-gold font-medium tracking-wider uppercase">Offres Limitées</span>
            <Flame className="h-6 w-6 text-gold animate-pulse" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-card mb-6"
          >
            Promotions Exceptionnelles
          </motion.h2>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 text-card/80">
              <Clock className="h-5 w-5" />
              <span>Offre se termine dans:</span>
            </div>
            <CountdownTimer />
          </motion.div>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden ${
                promo.large ? "md:col-span-2 aspect-[2/1]" : "aspect-square"
              }`}
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
              
              {/* Discount Badge */}
              <span className="absolute top-4 left-4 bg-gold text-gold-foreground px-4 py-2 rounded-full font-bold text-lg shadow-gold">
                {promo.discount}
              </span>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-gold text-sm font-medium">{promo.subtitle}</span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-card mt-1 mb-2">
                  {promo.title}
                </h3>
                {promo.description && (
                  <p className="text-card/70 text-sm mb-3">{promo.description}</p>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-card/60 text-sm line-through">
                    {formatPrice(promo.originalPrice || promo.startingPrice * 1.3)}
                  </span>
                  <span className="text-card font-bold text-lg">
                    À partir de {formatPrice(promo.startingPrice)}
                  </span>
                </div>
                
                <Button className="bg-gold hover:bg-gold/90 text-gold-foreground shadow-gold">
                  J'en profite →
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
