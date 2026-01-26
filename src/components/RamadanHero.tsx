import { motion } from "framer-motion";
import { Moon, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSection } from "@/hooks/useSiteSections";

export default function RamadanHero() {
  const { data: heroSection } = useSiteSection("hero");

  const scrollToCatalog = () => {
    document.getElementById("catalogue")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Don't render if section is hidden
  if (heroSection && !heroSection.is_visible) {
    return null;
  }

  const content = heroSection?.content as Record<string, string> || {};
  const badge = content.badge || "🌙 Ramadan Kareem";
  const ctaText = content.cta_text || "Voir le catalogue";
  const title = heroSection?.title || "Spécial Ramadan";
  const subtitle = heroSection?.subtitle || "Préparez votre table avec élégance";
  const backgroundType = heroSection?.background_type || "color";
  const backgroundValue = heroSection?.background_value;

  // Background styles based on type
  const getBackgroundStyles = () => {
    if (backgroundType === "video" || backgroundType === "gif") {
      return {};
    }
    if (backgroundType === "image" && backgroundValue) {
      return {
        backgroundImage: `linear-gradient(to bottom right, rgba(26, 54, 93, 0.85), rgba(15, 35, 60, 0.95)), url(${backgroundValue})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {};
  };

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden"
      style={getBackgroundStyles()}
    >
      {/* Video/GIF Background */}
      {(backgroundType === "video" || backgroundType === "gif") && backgroundValue && (
        <div className="absolute inset-0 z-0">
          {backgroundType === "video" ? (
            <video
              src={backgroundValue}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={backgroundValue}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary-dark/90 to-primary/95" />
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gold rounded-full blur-3xl" />
      </div>

      {/* Stars decoration */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <span className="bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-medium">
              {badge}
            </span>
          </motion.div>

          {/* Moon Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/20 mb-6"
          >
            <Moon className="h-10 w-10 text-gold" fill="currentColor" />
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-4">
            Collection{" "}
            <span className="text-gradient-gold">{title}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-card/80 text-lg md:text-xl mb-8">{subtitle}</p>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={scrollToCatalog}
            className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold px-8 py-6 text-lg shadow-gold"
          >
            {ctaText}
            <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </motion.div>

        {/* How to order section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {[
            { step: "1️⃣", text: "Parcourez le catalogue" },
            { step: "2️⃣", text: "Ajoutez à votre sélection" },
            { step: "3️⃣", text: "Commandez via WhatsApp" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-card/10 backdrop-blur-sm rounded-xl p-4 border border-card/20"
            >
              <span className="text-2xl mb-2 block">{item.step}</span>
              <p className="text-card/90 font-medium">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
