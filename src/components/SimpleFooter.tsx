import { MapPin, Phone, Instagram, Clock } from "lucide-react";
import logo from "@/assets/logo-chezjoe.jpg";
import { useSiteSection } from "@/hooks/useSiteSections";

export default function SimpleFooter() {
  const { data: footerSection } = useSiteSection("footer");

  // Don't render if section is hidden
  if (footerSection && !footerSection.is_visible) {
    return null;
  }

  const content = footerSection?.content as Record<string, string> || {};
  const phone = content.phone || "+221 77 383 66 24";
  const address = content.address || "51 Rue du Liban, Dakar";
  const title = footerSection?.title || "Chez Joe";
  const subtitle = footerSection?.subtitle || "Déco & Électroménager";
  const backgroundType = footerSection?.background_type || "color";
  const backgroundValue = footerSection?.background_value;

  // Background styles
  const getBackgroundStyles = () => {
    if (backgroundType === "image" && backgroundValue) {
      return {
        backgroundImage: `linear-gradient(to right, rgba(26, 54, 93, 0.95), rgba(15, 35, 60, 0.98)), url(${backgroundValue})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {};
  };

  return (
    <footer
      className="relative bg-primary text-primary-foreground py-8 overflow-hidden"
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
          <div className="absolute inset-0 bg-primary/95" />
        </div>
      )}

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt={title}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-display font-bold text-xl">{title}</h3>
              <p className="text-primary-foreground/70 text-sm">{subtitle}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>{address}</span>
            </a>

            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
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
          © 2026 {title} Sénégal. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
