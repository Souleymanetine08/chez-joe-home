import { motion } from "framer-motion";
import { Moon, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function RamadanHero() {
  const scrollToCatalog = () => {
    document.getElementById("catalogue")?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gold rounded-full blur-3xl" />
      </div>

      {/* Stars decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => <motion.div key={i} className="absolute w-1 h-1 bg-gold/50 rounded-full" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }} animate={{
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.5, 1]
      }} transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2
      }} />)}
      </div>

      <div className="container-custom relative z-10 text-center px-4">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="max-w-2xl mx-auto">
          {/* Moon Icon */}
          <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          delay: 0.3,
          type: "spring",
          stiffness: 200
        }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/20 mb-6">
            <Moon className="h-10 w-10 text-gold" fill="currentColor" />
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-4">
            Collection{" "}
            <span className="text-gradient-gold">Ramadan 2026</span>
          </h1>

          {/* Subtitle */}
          <p className="text-card/80 text-lg md:text-xl mb-8">
            Préparez votre mois béni avec style
          </p>

          {/* CTA Button */}
          <Button size="lg" onClick={scrollToCatalog} className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold px-8 py-6 text-lg shadow-gold">
            Voir le catalogue
            <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </motion.div>

        {/* How to order section */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6,
        duration: 0.8
      }} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[{
          step: "1️⃣",
          text: "Parcourez le catalogue"
        }, {
          step: "2️⃣",
          text: "Ajoutez à votre sélection"
        }, {
          step: "3️⃣",
          text: "Commandez via WhatsApp"
        }].map((item, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.8 + index * 0.1
        }} className="bg-card/10 backdrop-blur-sm rounded-xl p-4 border border-card/20">
              <span className="text-2xl mb-2 block">{item.step}</span>
              <p className="text-card/90 font-medium">{item.text}</p>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
}