import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate, Enums } from "@/integrations/supabase/types";

export type Order = Tables<"orders">;
export type OrderStatus = Enums<"order_status">;

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status } as TablesUpdate<"orders">)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: {
      items: unknown[];
      total: number;
      customer_name?: string;
      customer_phone?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("orders")
        .insert([{
          items: order.items as Tables<"orders">["items"],
          total: order.total,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          notes: order.notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
