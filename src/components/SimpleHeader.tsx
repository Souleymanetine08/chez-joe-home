import { useState } from "react";
import { ShoppingBag, Moon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartSidebar from "./CartSidebar";
import logo from "@/assets/logo-chezjoe.jpg";

export default function SimpleHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Chez Joe"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-display font-bold text-lg text-foreground hidden sm:inline">
                Chez Joe
              </span>
            </a>

            {/* Collection Title - Center */}
            <div className="flex items-center gap-2 text-primary">
              <Moon className="h-4 w-4 text-gold" fill="currentColor" />
              <span className="font-display font-semibold text-sm sm:text-base">
                Ramadan 2025
              </span>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-4 py-2 rounded-full font-medium transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden sm:inline">Ma Sélection</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-gold-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
