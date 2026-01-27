import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";

// Notification sound (short beep)
const NOTIFICATION_SOUND_URL = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..." // Placeholder - we'll use Web Audio API

export default function NewOrderNotification() {
  const queryClient = useQueryClient();
  const audioContextRef = useRef<AudioContext | null>(null);

  const playNotificationSound = () => {
    try {
      // Use Web Audio API for a simple beep
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.log("Could not play notification sound:", error);
    }
  };

  useEffect(() => {
    // Subscribe to new orders via Supabase Realtime
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const newOrder = payload.new as {
            id: string;
            customer_name: string;
            total: number;
            tracking_id: string;
          };

          // Play sound
          playNotificationSound();

          // Show toast notification
          toast.success("🛒 Nouvelle commande !", {
            description: `${newOrder.customer_name || "Client"} - ${new Intl.NumberFormat("fr-SN").format(newOrder.total)} FCFA`,
            duration: 10000,
            icon: <ShoppingBag className="h-5 w-5 text-primary" />,
            action: {
              label: "Voir",
              onClick: () => {
                window.location.href = "/admin/orders";
              },
            },
          });

          // Invalidate orders query to refresh the list
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return null;
}
