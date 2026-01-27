import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, Clock, XCircle, Home, Phone, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Order } from "@/hooks/useOrders";

const statusConfig = {
  pending: {
    label: "En attente",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    icon: Clock,
    step: 1,
  },
  confirmed: {
    label: "Confirmée",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: Package,
    step: 2,
  },
  delivered: {
    label: "Livrée",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: CheckCircle2,
    step: 3,
  },
  cancelled: {
    label: "Annulée",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: XCircle,
    step: 0,
  },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-SN").format(price);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTracking() {
  const { trackingId } = useParams<{ trackingId: string }>();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order-tracking", trackingId],
    queryFn: async (): Promise<Order | null> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("tracking_id", trackingId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!trackingId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-display font-bold">Commande introuvable</h1>
          <p className="text-muted-foreground max-w-sm">
            Le lien de suivi est invalide ou la commande n'existe pas.
          </p>
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const items = order.items as Array<{ name: string; price: number; quantity: number; image?: string }>;

  const steps = [
    { label: "En attente", status: "pending" },
    { label: "Confirmée", status: "confirmed" },
    { label: "Livrée", status: "delivered" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Retour à la boutique
          </Link>
          <Link to="/" className="font-display text-xl font-bold text-primary">
            Chez Joe
          </Link>
        </div>
      </header>

      <main className="container-custom py-8 max-w-2xl mx-auto">
        {/* Status Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`w-20 h-20 mx-auto ${status.bgColor} rounded-full flex items-center justify-center mb-4`}>
            <StatusIcon className={`h-10 w-10 ${status.color}`} />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">
            Commande {status.label}
          </h1>
          <p className="text-muted-foreground">
            #{order.tracking_id?.toUpperCase()}
          </p>
        </motion.div>

        {/* Progress Steps (not for cancelled orders) */}
        {order.status !== "cancelled" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-border">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${((status.step - 1) / 2) * 100}%` }}
                />
              </div>

              {steps.map((step, index) => {
                const isCompleted = status.step > index + 1;
                const isCurrent = status.step === index + 1;
                return (
                  <div key={step.status} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        isCompleted || isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          {/* Customer Info */}
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold mb-3">Informations client</h2>
            <div className="space-y-2 text-sm">
              {order.customer_name && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Nom :</span>
                  <span className="font-medium">{order.customer_name}</span>
                </div>
              )}
              {order.customer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer_phone}</span>
                </div>
              )}
              {order.notes && (
                <p className="text-muted-foreground mt-2">{order.notes}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold mb-3">Articles commandés</h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      x{item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)} F
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="p-4 bg-secondary/30">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(order.total)} FCFA
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="p-4 text-center text-sm text-muted-foreground border-t border-border">
            Commande passée le {formatDate(order.created_at)}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground mb-3">
            Une question sur votre commande ?
          </p>
          <Button asChild variant="outline">
            <a
              href="https://wa.me/221773836624"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contacter via WhatsApp
            </a>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
