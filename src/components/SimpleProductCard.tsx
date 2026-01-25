import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export interface ProductCardData {
  id: string | number;
  name: string;
  category?: string;
  price: number;
  image: string;
  inStock: boolean;
  description?: string;
}

interface SimpleProductCardProps {
  product: ProductCardData;
}

export default function SimpleProductCard({ product }: SimpleProductCardProps) {
  const { addToCart, isInCart } = useCart();
  // Convert id to number for cart compatibility
  const numericId = typeof product.id === "string" ? parseInt(product.id, 16) % 1000000 : product.id;
  const inCart = isInCart(numericId);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-SN").format(price);
  };

  const handleAddToCart = () => {
    addToCart({
      id: numericId,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    
    toast.success(`${product.name} ajouté à votre sélection`, {
      description: `${formatPrice(product.price)} FCFA`,
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Image - Plus compact sur mobile */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content - Padding réduit sur mobile */}
      <div className="p-2 sm:p-3">
        {/* Name - Taille réduite sur mobile */}
        <h3 className="font-medium text-foreground text-xs sm:text-sm line-clamp-2 mb-1 min-h-[2rem] sm:min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price & Stock - Layout compact */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-primary font-bold text-sm sm:text-base">
            {formatPrice(product.price)} F
          </p>
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              product.inStock ? "bg-green-500" : "bg-red-500"
            }`}
            title={product.inStock ? "Disponible" : "Sur commande"}
          />
        </div>

        {/* Add Button - Plus compact */}
        <Button
          onClick={handleAddToCart}
          variant={inCart ? "secondary" : "default"}
          size="sm"
          className={`w-full h-8 sm:h-9 text-xs sm:text-sm ${
            inCart
              ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
              : "bg-primary hover:bg-primary-dark text-primary-foreground"
          }`}
        >
          {inCart ? (
            <>
              <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Ajouté
            </>
          ) : (
            <>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Ajouter
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
