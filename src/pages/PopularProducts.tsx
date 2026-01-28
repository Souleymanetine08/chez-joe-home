import { useState } from "react";
import { usePopularProducts } from "@/hooks/usePopularProducts";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleFooter from "@/components/SimpleFooter";
import SimpleProductCard from "@/components/SimpleProductCard";
import CartSidebar from "@/components/CartSidebar";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Crown } from "lucide-react";

export default function PopularProducts() {
  const { data: products, isLoading } = usePopularProducts(24);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-gold/5 to-background py-16 md:py-20">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nos Produits <span className="text-gradient-gold">Populaires</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les articles les plus appréciés par nos clients. Ces produits sont les plus commandés et les mieux notés.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-success" />
            <span>Basé sur les ventes réelles</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, index) => (
                  <div key={product.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -top-2 -left-2 z-10 bg-gold text-gold-foreground text-xs font-bold px-2 py-1 rounded-full shadow-gold">
                        #{index + 1}
                      </div>
                    )}
                    <SimpleProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image_url || "/placeholder.svg",
                        inStock: product.in_stock,
                        category: product.category?.name,
                        description: product.description || undefined,
                        showDetailPage: product.show_detail_page ?? true,
                      }}
                    />
                    {product.orderCount > 0 && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                          <TrendingUp className="h-3 w-3 inline mr-1" />
                          {product.orderCount} vendus
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Crown className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Pas encore de données de ventes
              </h2>
              <p className="text-muted-foreground">
                Les produits populaires apparaîtront ici une fois que des commandes auront été passées.
              </p>
            </div>
          )}
        </div>
      </section>

      <SimpleFooter />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WhatsAppFloatingButton />
    </div>
  );
}
