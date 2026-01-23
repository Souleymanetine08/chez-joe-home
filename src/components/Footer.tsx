import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo-chezjoe.jpg";

const quickLinks = [
  "Catalogue complet",
  "Nouveautés 2025",
  "Promotions",
  "Guide d'achat",
  "Inspiration déco",
  "Blog & Conseils",
];

const categories = [
  "Cuisine & Ustensiles",
  "Vaisselle & Arts de table",
  "Électroménager",
  "Décoration & Accessoires",
  "Mobilier & Ameublement",
  "Cosmétique & Bien-être",
];

const legalLinks = [
  { name: "CGV", href: "#" },
  { name: "Politique de confidentialité", href: "#" },
  { name: "Mentions légales", href: "#" },
  { name: "Livraison & Retours", href: "#" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-card/80">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Chez Joe" className="h-14 w-14 rounded-full object-cover" />
              <span className="font-display text-2xl font-bold text-card">CHEZ JOE</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Depuis 2015, Chez Joe est votre destination privilégiée pour sublimer votre intérieur à Dakar. 
              Qualité, élégance et service personnalisé.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-card/10 hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/chezjoe.sn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-card/10 hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-card/10 hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-display text-lg font-semibold text-card mb-6">Liens Rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display text-lg font-semibold text-card mb-6">Nos Catégories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <a href="#" className="text-sm hover:text-gold transition-colors">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display text-lg font-semibold text-card mb-6">Contactez-nous</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                <span className="text-sm">51 Rue du Liban, Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0" />
                <a href="tel:+221773836624" className="text-sm hover:text-gold transition-colors">
                  +221 77 383 66 24
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold shrink-0" />
                <a href="mailto:contact@chezjoe.sn" className="text-sm hover:text-gold transition-colors">
                  contact@chezjoe.sn
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p>Lun-Sam: 9h-20h</p>
                  <p>Dim: 10h-18h</p>
                </div>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="text-sm text-card mb-2">💳 Paiements acceptés:</p>
              <p className="text-xs">Cash | Orange Money | Wave | Visa/Mastercard</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-card/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center md:text-left">
              © 2025 Chez Joe Sénégal. Tous droits réservés.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
