import { motion } from "framer-motion";
import { Truck, Wrench, CreditCard, RotateCcw, Gift, Shield, Phone, Store } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Livraison Gratuite",
    description: "Dès 50 000 FCFA dans tout Dakar",
  },
  {
    icon: Wrench,
    title: "Installation Gratuite",
    description: "Montage mobilier & branchement",
  },
  {
    icon: CreditCard,
    title: "Paiement Flexible",
    description: "Cash, mobile, en plusieurs fois",
  },
  {
    icon: RotateCcw,
    title: "Retour 30 jours",
    description: "Satisfait ou remboursé",
  },
  {
    icon: Gift,
    title: "Programme Fidélité",
    description: "Cumulez des points à chaque achat",
  },
  {
    icon: Shield,
    title: "Garantie 2 ans",
    description: "Sur tous nos produits",
  },
  {
    icon: Phone,
    title: "SAV Réactif",
    description: "Support disponible 7j/7",
  },
  {
    icon: Store,
    title: "Showroom",
    description: "Venez découvrir nos produits",
  },
];

export default function Services() {
  return (
    <section className="section-padding bg-card">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-medium tracking-wider uppercase text-sm"
          >
            Pourquoi nous choisir
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2"
          >
            Nos Engagements
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group p-6 rounded-2xl bg-background hover:bg-primary/5 border border-border hover:border-primary/20 transition-all duration-300 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground transition-all duration-300 mb-4">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
