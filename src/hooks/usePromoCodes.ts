import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export function usePromoCodes() {
  return useQuery({
    queryKey: ["promo-codes"],
    queryFn: async (): Promise<PromoCode[]> => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        throw new Error("Code promo invalide");
      }

      const promo = data as PromoCode;
      const now = new Date();

      // Check validity period
      if (promo.valid_from && new Date(promo.valid_from) > now) {
        throw new Error("Ce code promo n'est pas encore valide");
      }
      if (promo.valid_until && new Date(promo.valid_until) < now) {
        throw new Error("Ce code promo a expiré");
      }

      // Check minimum order amount
      if (promo.min_order_amount && orderTotal < promo.min_order_amount) {
        throw new Error(`Commande minimum de ${promo.min_order_amount} FCFA requise`);
      }

      // Check max uses
      if (promo.max_uses && promo.current_uses >= promo.max_uses) {
        throw new Error("Ce code promo a atteint sa limite d'utilisation");
      }

      // Calculate discount
      let discountAmount = 0;
      if (promo.discount_type === "percentage") {
        discountAmount = Math.round((orderTotal * promo.discount_value) / 100);
      } else {
        discountAmount = promo.discount_value;
      }

      return {
        promo,
        discountAmount,
        finalTotal: Math.max(0, orderTotal - discountAmount),
      };
    },
  });
}

export function useIncrementPromoUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promoId: string) => {
      // Increment usage directly
      const { data, error: fetchError } = await supabase
        .from("promo_codes")
        .select("current_uses")
        .eq("id", promoId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("promo_codes")
        .update({ current_uses: (data?.current_uses || 0) + 1 })
        .eq("id", promoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
    },
  });
}
