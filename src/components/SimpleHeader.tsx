import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Moon, Flame } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartSidebar from "./CartSidebar";
import logo from "@/assets/logo-chezjoe.jpg";

export default function SimpleHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount, justAdded } = useCart();
  return <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Chez Joe" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display font-bold text-lg text-foreground hidden sm:inline">
                Chez Joe
              </span>
            </Link>

            {/* Center Navigation */}
            <div className="flex items-center gap-4">
              {/* Collection Title */}
              <div className="flex items-center gap-2 text-primary">
                <Moon className="h-4 w-4 text-gold" fill="currentColor" />
                <span className="font-display font-semibold text-sm sm:text-base">Ramadan 2026</span>
              </div>

              {/* Popular Products Link */}
              <Link
                to="/populaires"
                className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Flame className="h-4 w-4 text-orange-500" />
                <span>Populaires</span>
              </Link>
            </div>

            {/* Right section: Mobile popular icon + Cart */}
            <div className="flex items-center gap-2">
              {/* Mobile Popular Link */}
              <Link
                to="/populaires"
                className="sm:hidden p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <Flame className="h-5 w-5 text-orange-500" />
              </Link>

              {/* Cart Button */}
              <button 
                onClick={() => setIsCartOpen(true)} 
                className={`relative flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  justAdded ? "animate-cart-bounce scale-110" : ""
                }`}
              >
                <ShoppingBag className={`h-5 w-5 transition-transform duration-300 ${justAdded ? "animate-wiggle" : ""}`} />
                <span className="hidden sm:inline">Ma Sélection</span>
                {itemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-gold text-gold-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 ${
                    justAdded ? "scale-125" : ""
                  }`}>
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>;
}