import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  variant_type: string;
  price_adjustment: number;
  stock: number;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useProductVariants(productId: string) {
  return useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async (): Promise<ProductVariant[]> => {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!productId,
  });
}

export function useCreateProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variant: Omit<ProductVariant, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("product_variants")
        .insert(variant)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", variables.product_id] });
    },
  });
}

export function useUpdateProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductVariant> & { id: string }) => {
      const { data, error } = await supabase
        .from("product_variants")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", data.product_id] });
    },
  });
}

export function useDeleteProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productId }: { id: string; productId: string }) => {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", productId] });
    },
  });
}
