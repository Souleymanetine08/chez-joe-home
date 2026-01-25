import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import SimpleProductCard from "./SimpleProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

type SortOption = "default" | "price-asc" | "price-desc";

export default function RamadanCatalog() {
  const { data: dbProducts, isLoading: productsLoading } = useProducts();
  const { data: dbCategories, isLoading: categoriesLoading } = useCategories();
  
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Transform DB products to the format expected by SimpleProductCard
  const products = useMemo(() => {
    if (!dbProducts) return [];
    return dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category?.name || "Non classé",
      price: p.price,
      image: p.image_url || "/placeholder.svg",
      inStock: p.in_stock,
      description: p.description || undefined,
    }));
  }, [dbProducts]);

  // Transform categories
  const categories = useMemo(() => {
    if (!dbCategories) return ["Tous"];
    return ["Tous", ...dbCategories.map((c) => c.name)];
  }, [dbCategories]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (activeCategory !== "Tous") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    // Sort by price
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const cycleSortOption = () => {
    if (sortBy === "default") setSortBy("price-asc");
    else if (sortBy === "price-asc") setSortBy("price-desc");
    else setSortBy("default");
  };

  const getSortIcon = () => {
    if (sortBy === "price-asc") return <ArrowUp className="h-4 w-4" />;
    if (sortBy === "price-desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  const getSortLabel = () => {
    if (sortBy === "price-asc") return "Prix ↑";
    if (sortBy === "price-desc") return "Prix ↓";
    return "Trier";
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <section id="catalogue" className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4 sm:mb-6"
        >
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1">
            Notre Sélection
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {isLoading ? (
              <Skeleton className="h-4 w-32 mx-auto" />
            ) : (
              <>
                {filteredAndSortedProducts.length} produit{filteredAndSortedProducts.length > 1 ? "s" : ""} 
                {searchQuery && ` pour "${searchQuery}"`}
              </>
            )}
          </p>
        </motion.div>

        {/* Search & Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex gap-2 mb-4"
        >
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Sort Button */}
          <button
            onClick={cycleSortOption}
            className={`flex items-center gap-1.5 px-3 sm:px-4 h-10 rounded-full text-sm font-medium transition-all ${
              sortBy !== "default"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-muted"
            }`}
          >
            {getSortIcon()}
            <span className="hidden sm:inline">{getSortLabel()}</span>
          </button>
        </motion.div>

        {/* Category Tabs - Scroll horizontal sur mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex overflow-x-auto gap-2 mb-4 sm:mb-6 pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
        >
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
            ))
          ) : (
            categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted text-foreground"
                }`}
              >
                {category}
              </button>
            ))
          )}
        </motion.div>

        {/* Products Grid - 2 colonnes sur mobile */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {filteredAndSortedProducts.map((product) => (
              <SimpleProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit trouvé</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("Tous");
              }}
              className="mt-2 text-primary text-sm underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
