import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface StoreInfo {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  free_delivery_threshold: number;
}

export interface DeliveryOption {
  enabled: boolean;
  label: string;
  price: number | null;
  description: string;
}

export interface DeliveryOptions {
  pickup: DeliveryOption;
  delivery: DeliveryOption;
}

export interface PromoSettings {
  free_delivery_message: string;
  ramadan_promo: boolean;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Helper to safely convert Json to Record<string, unknown>
function jsonToRecord(json: Json): Record<string, unknown> {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    return json as Record<string, unknown>;
  }
  return {};
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async (): Promise<SiteSetting[]> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;
      
      return (data || []).map((item) => ({
        ...item,
        value: jsonToRecord(item.value),
      }));
    },
  });
}

export function useSiteSetting<T = Record<string, unknown>>(key: string) {
  return useQuery({
    queryKey: ["site-settings", key],
    queryFn: async (): Promise<T | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return jsonToRecord(data.value) as T;
    },
  });
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Record<string, unknown> }) => {
      // First check if the setting exists
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: value as Json })
          .eq("key", key);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert({ key, value: value as Json });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });
}

// Convenience hooks
export function useStoreInfo() {
  return useSiteSetting<StoreInfo>("store_info");
}

export function useDeliveryOptions() {
  return useSiteSetting<DeliveryOptions>("delivery_options");
}

export function usePromoSettings() {
  return useSiteSetting<PromoSettings>("promo_settings");
}
