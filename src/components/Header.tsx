import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, Phone } from "lucide-react";
import logo from "@/assets/logo-chezjoe.jpg";

const categories = [
  {
    name: "Cuisine",
    items: ["Ustensiles", "Accessoires", "Robots cuisine", "Batterie"],
  },
  {
    name: "Vaisselle",
    items: ["Sets de table", "Assiettes", "Verres", "Couverts"],
  },
  {
    name: "Électroménager",
    items: ["Réfrigérateurs", "Cuisinières", "Micro-ondes", "Mixeurs"],
  },
  {
    name: "Décoration",
    items: ["Lampes", "Cadres", "Vases", "Plantes déco"],
  },
  {
    name: "Mobilier",
    items: ["Canapés", "Tables", "Chaises", "Armoires"],
  },
  {
    name: "Cosmétique",
    items: ["Soins visage", "Soins corps", "Parfums", "Accessoires"],
  },
];

const navItems = [
  { name: "Accueil", href: "#" },
  { name: "Catalogue", href: "#", hasDropdown: true },
  { name: "Nouveautés", href: "#nouveautes" },
  { name: "Promotions", href: "#promotions" },
  { name: "À Propos", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2 text-sm">
        <div className="container-custom flex items-center justify-center gap-4 md:gap-8 text-center flex-wrap">
          <span className="flex items-center gap-1">
            🚚 Livraison gratuite à Dakar dès 50 000 FCFA
          </span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1">
            ⭐ -20% sur mobilier jusqu'à dimanche
          </span>
          <span className="hidden lg:inline">|</span>
          <a href="tel:+221773836624" className="hidden lg:flex items-center gap-1 hover:text-gold transition-colors">
            <Phone className="h-3 w-3" />
            +221 77 383 66 24
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md shadow-soft">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              <img src={logo} alt="Chez Joe" className="h-14 w-14 rounded-full object-cover shadow-md" />
              <span className="hidden sm:block font-display text-2xl font-bold text-primary">CHEZ JOE</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setIsCatalogueOpen(true)}
                  onMouseLeave={() => item.hasDropdown && setIsCatalogueOpen(false)}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-1 text-foreground/80 hover:text-primary font-medium transition-colors link-underline py-2"
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                  </a>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-muted rounded-full transition-colors" aria-label="Rechercher">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors relative" aria-label="Favoris">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-gold-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors relative" aria-label="Panier">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="hidden sm:flex p-2 hover:bg-muted rounded-full transition-colors" aria-label="Mon compte">
                <User className="h-5 w-5" />
              </button>
              
              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {isCatalogueOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 bg-card shadow-strong border-t border-border"
              onMouseEnter={() => setIsCatalogueOpen(true)}
              onMouseLeave={() => setIsCatalogueOpen(false)}
            >
              <div className="container-custom py-8">
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-8">
                  {categories.map((category) => (
                    <div key={category.name}>
                      <h3 className="font-display font-semibold text-primary mb-3">{category.name}</h3>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item}>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card border-t border-border overflow-hidden"
            >
              <nav className="container-custom py-4 space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-3 px-4 hover:bg-muted rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
