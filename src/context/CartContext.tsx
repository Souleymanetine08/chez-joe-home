import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  justAdded: boolean;
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  generateWhatsAppUrl: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const addToCart = useCallback((product: Omit<CartItem, "quantity">) => {
    // Trigger animation
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((id: number) => {
    return items.some((item) => item.id === id);
  }, [items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-SN").format(price);
  };

  const generateWhatsAppUrl = useCallback(() => {
    const phoneNumber = "221773836624";

    let message = "Bonjour Chez Joe ! 🌙\n\n";
    message += "Je souhaite commander :\n\n";

    items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      message += `${index + 1}. ${item.name} x${item.quantity}\n`;
      message += `   Prix : ${formatPrice(lineTotal)} FCFA\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `TOTAL : ${formatPrice(total)} FCFA\n\n`;
    message += `Merci de confirmer la disponibilité et le délai de livraison.\n\n`;
    message += `Nom : [À compléter]\n`;
    message += `Adresse de livraison : [À compléter]\n`;
    message += `Téléphone : [À compléter]`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }, [items, total]);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        justAdded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        generateWhatsAppUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
