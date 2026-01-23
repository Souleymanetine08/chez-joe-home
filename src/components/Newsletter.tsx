import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast({
        title: "Inscription réussie !",
        description: "Vous recevrez bientôt nos offres exclusives.",
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-6">
            <Mail className="h-8 w-8 text-gold" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-card mb-4">
            Restez Informé de nos Nouveautés
          </h2>

          <p className="text-card/80 text-lg mb-8">
            Inscrivez-vous et recevez:
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8 text-card/90">
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5 text-gold" />
              10% sur votre 1er achat
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5 text-gold" />
              Offres exclusives
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5 text-gold" />
              Conseils déco
            </span>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-card/10 border-card/30 text-card placeholder:text-card/50 focus:border-gold"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="bg-gold hover:bg-gold/90 text-gold-foreground shadow-gold font-semibold whitespace-nowrap"
              >
                S'inscrire →
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-gold text-lg"
            >
              <Check className="h-6 w-6" />
              Merci pour votre inscription !
            </motion.div>
          )}

          <p className="flex items-center justify-center gap-2 text-card/60 text-sm mt-4">
            <Lock className="h-4 w-4" />
            Pas de spam, désinscription en 1 clic
          </p>
        </motion.div>
      </div>
    </section>
  );
}
