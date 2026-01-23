import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

interface SimpleProductCardProps {
  product: Product;
}

export default function SimpleProductCard({ product }: SimpleProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-SN").format(price);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-primary font-bold text-lg mb-2">
          {formatPrice(product.price)} FCFA
        </p>

        {/* Stock Status */}
        <div className="flex items-center gap-1 mb-3">
          <span
            className={`w-2 h-2 rounded-full ${
              product.inStock ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {product.inStock ? "Disponible" : "Sur commande"}
          </span>
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddToCart}
          variant={inCart ? "secondary" : "default"}
          className={`w-full ${
            inCart
              ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
              : "bg-primary hover:bg-primary-dark text-primary-foreground"
          }`}
        >
          {inCart ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Ajouté
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
