import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/hooks/useProducts";
import type { Json } from "@/integrations/supabase/types";

interface OrderItem {
  id: number | string;
  quantity: number;
}

interface PopularProduct extends Product {
  orderCount: number;
}

export function usePopularProducts(limit = 12) {
  return useQuery({
    queryKey: ["popular-products", limit],
    queryFn: async (): Promise<PopularProduct[]> => {
      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("items")
        .in("status", ["confirmed", "delivered"]);

      if (ordersError) throw ordersError;

      // Count product occurrences from orders
      const productCounts: Record<string, number> = {};

      orders?.forEach((order) => {
        const items = order.items as unknown as OrderItem[];
        if (Array.isArray(items)) {
          items.forEach((item) => {
            const productId = String(item.id);
            productCounts[productId] = (productCounts[productId] || 0) + (item.quantity || 1);
          });
        }
      });

      // Sort by count and get top product IDs
      const sortedProductIds = Object.entries(productCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([id]) => id);

      if (sortedProductIds.length === 0) {
        // If no orders, return latest products
        const { data: products, error } = await supabase
          .from("products")
          .select(`*, category:categories(*)`)
          .eq("in_stock", true)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        return (products || []).map((p) => ({ ...p, orderCount: 0 }));
      }

      // Fetch products by IDs
      const { data: products, error } = await supabase
        .from("products")
        .select(`*, category:categories(*)`)
        .in("id", sortedProductIds);

      if (error) throw error;

      // Map products with their order counts and sort by popularity
      const productsWithCounts = (products || [])
        .map((product) => ({
          ...product,
          orderCount: productCounts[product.id] || 0,
        }))
        .sort((a, b) => b.orderCount - a.orderCount);

      return productsWithCounts;
    },
  });
}
