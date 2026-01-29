import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Minus, Plus, ShoppingCart, Check, ChevronRight, AlertCircle } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useProductVariants, ProductVariant } from "@/hooks/useProductVariants";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  const { data: variants } = useProductVariants(id || "");
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Get all images (main image + additional images)
  const allImages = product
    ? [product.image_url, ...(product.images || [])].filter(Boolean) as string[]
    : [];

  // Calculate price with variant adjustment
  const basePrice = product?.price || 0;
  const variantAdjustment = selectedVariant?.price_adjustment || 0;
  const finalPrice = basePrice + variantAdjustment;

  // Check if variant is in stock
  const isVariantInStock = selectedVariant 
    ? selectedVariant.is_available && selectedVariant.stock > 0
    : product?.in_stock ?? true;

  // Group variants by type
  const variantsByType = variants?.reduce((acc, variant) => {
    if (!acc[variant.variant_type]) {
      acc[variant.variant_type] = [];
    }
    acc[variant.variant_type].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>) || {};

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartId = selectedVariant 
      ? parseInt(product.id.slice(0, 6) + selectedVariant.id.slice(0, 2), 16)
      : parseInt(product.id.slice(0, 8), 16);
    
    const itemName = selectedVariant 
      ? `${product.name} - ${selectedVariant.name}`
      : product.name;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: cartId,
        name: itemName,
        price: finalPrice,
        image: product.image_url || "/placeholder.svg",
      });
    }
  };

  const inCart = product 
    ? isInCart(selectedVariant 
        ? parseInt(product.id.slice(0, 6) + selectedVariant.id.slice(0, 2), 16)
        : parseInt(product.id.slice(0, 8), 16))
    : false;

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

  const variantTypeLabels: Record<string, string> = {
    color: "Couleur",
    size: "Taille",
    material: "Matériau",
    other: "Option",
  };

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
              {!isVariantInStock && (
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
                {formatPrice(finalPrice)} F
              </span>
              {variantAdjustment !== 0 && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(basePrice)} F
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variants Selection */}
            {Object.keys(variantsByType).length > 0 && (
              <div className="space-y-4">
                {Object.entries(variantsByType).map(([type, typeVariants]) => (
                  <div key={type} className="space-y-2">
                    <label className="text-sm font-medium">
                      {variantTypeLabels[type] || type}
                      {selectedVariant?.variant_type === type && (
                        <span className="text-primary ml-2">: {selectedVariant.name}</span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {typeVariants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        const isAvailable = variant.is_available && variant.stock > 0;
                        
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(isSelected ? null : variant)}
                            disabled={!isAvailable}
                            className={`relative px-4 py-2 rounded-lg border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : isAvailable
                                  ? "border-border hover:border-primary/50"
                                  : "border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            }`}
                          >
                            <span className="font-medium">{variant.name}</span>
                            {variant.price_adjustment !== 0 && (
                              <span className="ml-1 text-xs">
                                ({variant.price_adjustment > 0 ? "+" : ""}{formatPrice(variant.price_adjustment)} F)
                              </span>
                            )}
                            {isSelected && (
                              <Check className="absolute -top-1 -right-1 h-4 w-4 text-primary bg-background rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Stock indicator for selected variant */}
                    {selectedVariant?.variant_type === type && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Plus que {selectedVariant.stock} en stock
                      </p>
                    )}
                  </div>
                ))}
              </div>
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
                disabled={!isVariantInStock}
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
