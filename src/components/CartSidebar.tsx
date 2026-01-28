import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useStoreInfo, usePromoSettings } from "@/hooks/useSiteSettings";
import CheckoutModal from "./CheckoutModal";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const { data: storeInfo } = useStoreInfo();
  const { data: promoSettings } = usePromoSettings();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const freeDeliveryThreshold = storeInfo?.free_delivery_threshold || 50000;
  const isFreeDelivery = total >= freeDeliveryThreshold;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-SN").format(price);
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-foreground/50 z-50"
            />

            {/* Sidebar - Full width sur mobile */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:max-w-sm bg-card z-50 shadow-2xl flex flex-col"
            >
              {/* Header - Plus compact */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <h2 className="font-display text-lg sm:text-xl font-semibold">
                    Ma Sélection ({items.length})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items - Optimisé mobile */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Votre sélection est vide
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Ajoutez des produits pour commander
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-2 sm:gap-3 bg-secondary/50 rounded-lg p-2 sm:p-3"
                    >
                      {/* Image - Plus petite sur mobile */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-xs sm:text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-primary font-bold text-sm sm:text-base mt-0.5">
                          {formatPrice(item.price * item.quantity)} F
                        </p>

                        {/* Quantity Controls - Compact */}
                        <div className="flex items-center gap-1 sm:gap-2 mt-1.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto p-1.5 sm:p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer - Compact sur mobile */}
              {items.length > 0 && (
                <div className="border-t border-border p-3 sm:p-4 space-y-3">
                  {/* Free delivery indicator */}
                  {!isFreeDelivery && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">
                        <Gift className="h-3 w-3 inline mr-1" />
                        Encore <span className="font-bold text-primary">{formatPrice(freeDeliveryThreshold - total)} F</span> pour la livraison gratuite
                      </p>
                    </div>
                  )}

                  {isFreeDelivery && (
                    <div className="bg-accent/50 border border-accent rounded-lg p-2 text-center">
                      <p className="text-xs text-accent-foreground font-medium">
                        🎁 {promoSettings?.free_delivery_message || "Livraison Offerte"}
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(total)} FCFA
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    variant="whatsapp"
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Commander via WhatsApp
                  </Button>

                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                    📍 Livraison à Dakar • 📞 {storeInfo?.phone || "+221 77 383 66 24"}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
