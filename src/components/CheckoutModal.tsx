import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Store, Truck, Check, Loader2, AlertCircle, Ticket, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useStoreInfo, useDeliveryOptions, usePromoSettings } from "@/hooks/useSiteSettings";
import { useValidatePromoCode, useIncrementPromoUsage, PromoCode } from "@/hooks/usePromoCodes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeliveryMode = "pickup" | "delivery";

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart();
  const { data: storeInfo } = useStoreInfo();
  const { data: deliveryOptions } = useDeliveryOptions();
  const { data: promoSettings } = usePromoSettings();
  const validatePromoCode = useValidatePromoCode();
  const incrementPromoUsage = useIncrementPromoUsage();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    promo: PromoCode;
    discountAmount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLTextAreaElement>(null);

  const freeDeliveryThreshold = storeInfo?.free_delivery_threshold || 50000;
  const isFreeDelivery = total >= freeDeliveryThreshold;
  const whatsappNumber = storeInfo?.whatsapp || "221773836624";

  // Calculate final total with discount
  const discountAmount = appliedPromo?.discountAmount || 0;
  const finalTotal = Math.max(0, total - discountAmount);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus first input when modal opens
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset promo when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPromoCode("");
      setAppliedPromo(null);
      setPromoError(null);
    }
  }, [isOpen]);

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};

    if (touched.name && !customerName.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (touched.name && customerName.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (touched.phone && !customerPhone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (touched.phone && !/^[0-9\s+()-]{8,}$/.test(customerPhone.trim())) {
      newErrors.phone = "Numéro de téléphone invalide";
    }

    if (touched.address && deliveryMode === "delivery" && !customerAddress.trim()) {
      newErrors.address = "L'adresse est requise pour la livraison";
    }

    setErrors(newErrors);
  }, [customerName, customerPhone, customerAddress, deliveryMode, touched]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-SN").format(price);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsValidatingPromo(true);
    setPromoError(null);

    try {
      const result = await validatePromoCode.mutateAsync({
        code: promoCode.trim(),
        orderTotal: total,
      });

      setAppliedPromo({
        promo: result.promo,
        discountAmount: result.discountAmount,
      });
      toast.success(`Code "${result.promo.code}" appliqué !`);
    } catch (error: any) {
      setPromoError(error.message);
      setAppliedPromo(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError(null);
  };

  const generateWhatsAppMessage = (trackingId: string) => {
    let message = `🛒 NOUVELLE COMMANDE - CHEZ JOE\n\n`;
    message += `CLIENT : ${customerName}\n`;
    message += `TEL : ${customerPhone}\n`;

    if (deliveryMode === "delivery") {
      message += `ADRESSE : ${customerAddress}\n`;
    }

    message += `\nARTICLES :\n`;

    items.forEach((item) => {
      const lineTotal = item.price * item.quantity;
      message += `• ${item.quantity}x ${item.name} (${formatPrice(lineTotal)} F)\n`;
    });

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `TOTAL PRODUITS : ${formatPrice(total)} FCFA\n`;

    if (appliedPromo) {
      message += `RÉDUCTION (${appliedPromo.promo.code}) : -${formatPrice(discountAmount)} FCFA\n`;
      message += `TOTAL À PAYER : ${formatPrice(finalTotal)} FCFA\n`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (deliveryMode === "pickup") {
      message += `MODE : Retrait en boutique\n`;
    } else {
      if (isFreeDelivery) {
        message += `LIVRAISON : OFFERTE (Promo Ramadan) 🎁\n`;
      } else {
        message += `LIVRAISON : À régler au livreur\n`;
      }
    }

    message += `\n📦 Suivi : ${window.location.origin}/suivi/${trackingId}`;

    return message;
  };

  const validateForm = (): boolean => {
    const newTouched = { name: true, phone: true, address: true };
    setTouched(newTouched);

    const newErrors: FormErrors = {};

    if (!customerName.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (customerName.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (!customerPhone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!/^[0-9\s+()-]{8,}$/.test(customerPhone.trim())) {
      newErrors.phone = "Numéro de téléphone invalide";
    }

    if (deliveryMode === "delivery" && !customerAddress.trim()) {
      newErrors.address = "L'adresse est requise pour la livraison";
    }

    setErrors(newErrors);

    // Focus first error field
    if (newErrors.name) {
      nameInputRef.current?.focus();
      return false;
    }
    if (newErrors.phone) {
      phoneInputRef.current?.focus();
      return false;
    }
    if (newErrors.address) {
      addressInputRef.current?.focus();
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save order to database
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const { data, error } = await supabase
        .from("orders")
        .insert({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          items: orderItems,
          total: finalTotal,
          discount_amount: discountAmount,
          promo_code_id: appliedPromo?.promo.id || null,
          notes:
            deliveryMode === "delivery"
              ? `Adresse: ${customerAddress}${isFreeDelivery ? " | Livraison offerte" : " | Livraison à régler au livreur"}`
              : "Retrait en boutique",
          status: "pending",
        })
        .select("tracking_id")
        .single();

      if (error) throw error;

      // Increment promo code usage
      if (appliedPromo) {
        await incrementPromoUsage.mutateAsync(appliedPromo.promo.id);
      }

      const trackingId = data?.tracking_id || "";

      // Generate WhatsApp URL and redirect
      const message = generateWhatsAppMessage(trackingId);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Show success toast
      toast.success("Commande envoyée !", {
        description: `Suivez votre commande avec le code : ${trackingId.toUpperCase()}`,
      });

      window.open(whatsappUrl, "_blank");
      clearCart();
      onClose();

      // Reset form
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setTouched({});
      setErrors({});
      setAppliedPromo(null);
      setPromoCode("");
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Erreur lors de l'envoi de la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid =
    customerName.trim().length >= 2 &&
    /^[0-9\s+()-]{8,}$/.test(customerPhone.trim()) &&
    (deliveryMode === "pickup" || customerAddress.trim());

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/50 z-[100]"
          />

          {/* Centering layer with safe-area padding */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-[env(safe-area-inset-bottom,16px)]">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full sm:max-w-md bg-card rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-2rem-env(safe-area-inset-bottom,0px))] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                <h2 className="font-display text-xl font-semibold">
                  Finaliser la commande
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain"
              >
                {/* Customer Info */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">Votre nom *</Label>
                    <Input
                      ref={nameInputRef}
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder="Ex: Fatou Diallo"
                      className={errors.name ? "border-destructive" : ""}
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      ref={phoneInputRef}
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="Ex: 77 123 45 67"
                      className={errors.phone ? "border-destructive" : ""}
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="space-y-3">
                  <Label>Mode de livraison</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Pickup Option */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMode("pickup")}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        deliveryMode === "pickup"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {deliveryMode === "pickup" && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <Store className="h-6 w-6 text-primary mb-2" />
                      <p className="font-medium text-sm">
                        {deliveryOptions?.pickup.label || "Retrait en boutique"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {deliveryOptions?.pickup.description || "Gratuit"}
                      </p>
                    </button>

                    {/* Delivery Option */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMode("delivery")}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        deliveryMode === "delivery"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {deliveryMode === "delivery" && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <Truck className="h-6 w-6 text-primary mb-2" />
                      <p className="font-medium text-sm">
                        {deliveryOptions?.delivery.label || "Livraison à domicile"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isFreeDelivery
                          ? promoSettings?.free_delivery_message || "Livraison Offerte"
                          : deliveryOptions?.delivery.description ||
                            "Frais à régler au livreur"}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Address (only for delivery) */}
                <AnimatePresence>
                  {deliveryMode === "delivery" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <Label htmlFor="address">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Adresse de livraison *
                      </Label>
                      <Textarea
                        ref={addressInputRef}
                        id="address"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        onBlur={() => handleBlur("address")}
                        placeholder="Ex: Quartier Almadies, près du monument..."
                        rows={2}
                        className={errors.address ? "border-destructive" : ""}
                        autoComplete="street-address"
                      />
                      {errors.address && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.address}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Promo Code Section */}
                <div className="space-y-2">
                  <Label htmlFor="promo">
                    <Ticket className="h-4 w-4 inline mr-1" />
                    Code promo
                  </Label>
                  
                  {appliedPromo ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between bg-accent/20 border border-accent rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-accent-foreground" />
                        <span className="font-mono font-medium">{appliedPromo.promo.code}</span>
                        <span className="text-sm text-accent-foreground">
                          (-{formatPrice(discountAmount)} F)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          setPromoError(null);
                        }}
                        placeholder="Entrez votre code"
                        className={`font-mono uppercase ${promoError ? "border-destructive" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={!promoCode.trim() || isValidatingPromo}
                      >
                        {isValidatingPromo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Appliquer"
                        )}
                      </Button>
                    </div>
                  )}
                  
                  {promoError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {promoError}
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {items.length} article{items.length > 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">{formatPrice(total)} F</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Réduction</span>
                      <span className="text-accent-foreground font-medium">
                        -{formatPrice(discountAmount)} F
                      </span>
                    </div>
                  )}

                  {deliveryMode === "delivery" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      {isFreeDelivery ? (
                        <span className="text-accent-foreground font-medium">
                          🎁 {promoSettings?.free_delivery_message || "Offerte"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          À régler au livreur
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-border flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(finalTotal)} FCFA</span>
                  </div>

                  {!isFreeDelivery && deliveryMode === "delivery" && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      💡 Encore {formatPrice(freeDeliveryThreshold - total)} F pour la
                      livraison gratuite
                    </p>
                  )}
                </div>
              </form>

              {/* Footer */}
              <div className="p-4 border-t border-border flex-shrink-0">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  variant="whatsapp"
                  className="w-full h-12 text-base font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Commander via WhatsApp
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
