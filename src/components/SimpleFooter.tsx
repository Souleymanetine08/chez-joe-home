import { MapPin, Phone, Instagram, Clock } from "lucide-react";
import logo from "@/assets/logo-chezjoe.jpg";

export default function SimpleFooter() {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Chez Joe"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-display font-bold text-xl">Chez Joe</h3>
              <p className="text-primary-foreground/70 text-sm">
                Déco & Électroménager
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href="https://maps.google.com/?q=51+Rue+du+Liban+Dakar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>51 Rue du Liban, Dakar</span>
            </a>

            <a
              href="tel:+221773836624"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+221 77 383 66 24</span>
            </a>

            <a
              href="https://instagram.com/chezjoe.sn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Instagram className="h-4 w-4" />
              <span>@chezjoe.sn</span>
            </a>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Lun-Sam 9h-20h</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-primary-foreground/20 text-center text-xs text-primary-foreground/60">
          © 2025 Chez Joe Sénégal. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
