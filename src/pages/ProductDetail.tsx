import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Minus, Plus, ShoppingCart, Check, ChevronRight } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-SN").format(price);
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id || "");
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get all images (main image + additional images)
  const allImages = product
    ? [product.image_url, ...(product.images || [])].filter(Boolean) as string[]
    : [];

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: parseInt(product.id.slice(0, 8), 16), // Convert UUID to number for cart
        name: product.name,
        price: product.price,
        image: product.image_url || "/placeholder.svg",
      });
    }
  };

  const inCart = product ? isInCart(parseInt(product.id.slice(0, 8), 16)) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <div className="container-custom py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">
            Produit non trouvé
          </h1>
          <p className="text-muted-foreground mb-8">
            Ce produit n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate("/")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Redirect if product detail page is disabled
  if (!product.show_detail_page) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />

      <main className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Accueil
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <li>
              <Link to="/#catalogue" className="text-muted-foreground hover:text-primary transition-colors">
                Catalogue
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <li className="text-foreground font-medium truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-secondary"
            >
              {allImages[selectedImageIndex] ? (
                <img
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Pas d'image
                </div>
              )}

              {/* Stock Badge */}
              {!product.in_stock && (
                <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Épuisé
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <span className="text-sm text-primary font-medium">
                {product.category.name}
              </span>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)} F
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Dimensions */}
            {(product.size_small || product.size_large) && (
              <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-sm">Dimensions</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.size_small && (
                    <div>
                      <span className="text-muted-foreground">Petite taille :</span>{" "}
                      <span className="font-medium">
                        {product.size_small} {product.dimensions_unit || "cm"}
                      </span>
                    </div>
                  )}
                  {product.size_large && (
                    <div>
                      <span className="text-muted-foreground">Grande taille :</span>{" "}
                      <span className="font-medium">
                        {product.size_large} {product.dimensions_unit || "cm"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-border">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantité</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`w-full h-14 text-lg font-semibold ${
                  inCart ? "bg-accent hover:bg-accent/90" : ""
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Dans le panier
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Ajouter au panier
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SimpleFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}
