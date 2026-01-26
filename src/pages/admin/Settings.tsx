import { useState, useEffect, useRef } from "react";
import { useSiteSections, useUpdateSiteSection, SiteSection } from "@/hooks/useSiteSections";
import { useSiteSettings, useUpdateSiteSetting, StoreInfo, DeliveryOptions, PromoSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Save,
  Loader2,
  Upload,
  Image,
  Video,
  Settings as SettingsIcon,
  Layout,
  Truck,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
  const { data: sections, isLoading: sectionsLoading } = useSiteSections();
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const updateSection = useUpdateSiteSection();
  const updateSetting = useUpdateSiteSetting();

  const [editingSections, setEditingSections] = useState<Record<string, SiteSection>>({});
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptions | null>(null);
  const [promoSettings, setPromoSettings] = useState<PromoSettings | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Initialize state from fetched data
  useEffect(() => {
    if (sections) {
      const sectionsMap: Record<string, SiteSection> = {};
      sections.forEach((s) => {
        sectionsMap[s.section_key] = s;
      });
      setEditingSections(sectionsMap);
    }
  }, [sections]);

  useEffect(() => {
    if (settings) {
      settings.forEach((s) => {
        if (s.key === "store_info") setStoreInfo(s.value as unknown as StoreInfo);
        if (s.key === "delivery_options") setDeliveryOptions(s.value as unknown as DeliveryOptions);
        if (s.key === "promo_settings") setPromoSettings(s.value as unknown as PromoSettings);
      });
    }
  }, [settings]);

  const handleSectionChange = (key: string, field: keyof SiteSection, value: unknown) => {
    setEditingSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleContentChange = (sectionKey: string, field: string, value: unknown) => {
    setEditingSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        content: { ...prev[sectionKey].content, [field]: value },
      },
    }));
  };

  const handleMediaUpload = async (sectionKey: string, file: File) => {
    setIsUploading(sectionKey);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${sectionKey}-${Date.now()}.${fileExt}`;
      const filePath = `backgrounds/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("site-media")
        .getPublicUrl(filePath);

      // Determine background type
      let bgType = "image";
      if (file.type.startsWith("video/")) bgType = "video";
      else if (file.type === "image/gif") bgType = "gif";

      handleSectionChange(sectionKey, "background_type", bgType);
      handleSectionChange(sectionKey, "background_value", urlData.publicUrl);

      toast.success("Média uploadé avec succès");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(null);
    }
  };

  const handleSaveSection = async (sectionKey: string) => {
    const section = editingSections[sectionKey];
    if (!section) return;

    setIsSaving(true);
    try {
      await updateSection.mutateAsync({
        id: section.id,
        title: section.title,
        subtitle: section.subtitle,
        content: section.content,
        background_type: section.background_type,
        background_value: section.background_value,
        is_visible: section.is_visible,
      });
      toast.success("Section mise à jour");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      if (storeInfo) {
        await updateSetting.mutateAsync({ key: "store_info", value: storeInfo as unknown as Record<string, unknown> });
      }
      if (deliveryOptions) {
        await updateSetting.mutateAsync({ key: "delivery_options", value: deliveryOptions as unknown as Record<string, unknown> });
      }
      if (promoSettings) {
        await updateSetting.mutateAsync({ key: "promo_settings", value: promoSettings as unknown as Record<string, unknown> });
      }
      toast.success("Paramètres sauvegardés");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = async (sectionKey: string) => {
    const section = editingSections[sectionKey];
    if (!section) return;

    const newVisibility = !section.is_visible;
    handleSectionChange(sectionKey, "is_visible", newVisibility);

    try {
      await updateSection.mutateAsync({
        id: section.id,
        is_visible: newVisibility,
      });
      toast.success(newVisibility ? "Section visible" : "Section masquée");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  if (sectionsLoading || settingsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Paramètres du site
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez le contenu et l'apparence de votre boutique
        </p>
      </div>

      <Tabs defaultValue="sections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sections" className="gap-2">
            <Layout className="h-4 w-4" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" />
            Boutique
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2">
            <Truck className="h-4 w-4" />
            Livraison
          </TabsTrigger>
        </TabsList>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-6">
          {Object.values(editingSections).map((section) => (
            <Card key={section.section_key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">
                      Section {section.section_key}
                    </CardTitle>
                    <CardDescription>
                      Personnalisez le contenu et l'arrière-plan
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(section.section_key)}
                    >
                      {section.is_visible ? (
                        <Eye className="h-4 w-4 mr-2" />
                      ) : (
                        <EyeOff className="h-4 w-4 mr-2" />
                      )}
                      {section.is_visible ? "Visible" : "Masqué"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title & Subtitle */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input
                      value={section.title || ""}
                      onChange={(e) =>
                        handleSectionChange(section.section_key, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sous-titre</Label>
                    <Input
                      value={section.subtitle || ""}
                      onChange={(e) =>
                        handleSectionChange(section.section_key, "subtitle", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Section-specific content fields */}
                {section.section_key === "hero" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Badge</Label>
                      <Input
                        value={(section.content as Record<string, string>).badge || ""}
                        onChange={(e) =>
                          handleContentChange(section.section_key, "badge", e.target.value)
                        }
                        placeholder="🌙 Ramadan Kareem"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Texte du bouton</Label>
                      <Input
                        value={(section.content as Record<string, string>).cta_text || ""}
                        onChange={(e) =>
                          handleContentChange(section.section_key, "cta_text", e.target.value)
                        }
                        placeholder="Découvrir"
                      />
                    </div>
                  </div>
                )}

                {section.section_key === "footer" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input
                        value={(section.content as Record<string, string>).phone || ""}
                        onChange={(e) =>
                          handleContentChange(section.section_key, "phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={(section.content as Record<string, string>).email || ""}
                        onChange={(e) =>
                          handleContentChange(section.section_key, "email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Adresse</Label>
                      <Input
                        value={(section.content as Record<string, string>).address || ""}
                        onChange={(e) =>
                          handleContentChange(section.section_key, "address", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Background Upload */}
                {(section.section_key === "hero" || section.section_key === "footer") && (
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Arrière-plan</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm,.gif"
                        className="hidden"
                        ref={(el) => (fileInputRefs.current[section.section_key] = el)}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleMediaUpload(section.section_key, file);
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRefs.current[section.section_key]?.click()}
                        disabled={isUploading === section.section_key}
                      >
                        {isUploading === section.section_key ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Uploader un média
                      </Button>
                      {section.background_value && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {section.background_type === "video" ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <Image className="h-4 w-4" />
                          )}
                          <span className="truncate max-w-xs">
                            {section.background_type} actif
                          </span>
                        </div>
                      )}
                    </div>
                    {section.background_value && (
                      <div className="mt-2">
                        {section.background_type === "video" ? (
                          <video
                            src={section.background_value}
                            className="w-full max-w-md h-32 object-cover rounded-lg"
                            muted
                            loop
                            autoPlay
                          />
                        ) : (
                          <img
                            src={section.background_value}
                            alt="Background preview"
                            className="w-full max-w-md h-32 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => handleSaveSection(section.section_key)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Store Tab */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la boutique</CardTitle>
              <CardDescription>
                Ces informations sont utilisées dans les messages WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {storeInfo && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom de la boutique</Label>
                      <Input
                        value={storeInfo.name}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input
                        value={storeInfo.phone}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Numéro WhatsApp</Label>
                      <Input
                        value={storeInfo.whatsapp}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, whatsapp: e.target.value })
                        }
                        placeholder="221773836624"
                      />
                      <p className="text-xs text-muted-foreground">
                        Format: indicatif + numéro (sans espaces)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Seuil livraison gratuite (FCFA)</Label>
                      <Input
                        type="number"
                        value={storeInfo.free_delivery_threshold}
                        onChange={(e) =>
                          setStoreInfo({
                            ...storeInfo,
                            free_delivery_threshold: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input
                      value={storeInfo.address}
                      onChange={(e) =>
                        setStoreInfo({ ...storeInfo, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Sauvegarder
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Tab */}
        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Options de livraison</CardTitle>
              <CardDescription>
                Configurez les modes de livraison proposés aux clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {deliveryOptions && (
                <>
                  {/* Pickup */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Retrait en boutique</Label>
                      <Switch
                        checked={deliveryOptions.pickup.enabled}
                        onCheckedChange={(checked) =>
                          setDeliveryOptions({
                            ...deliveryOptions,
                            pickup: { ...deliveryOptions.pickup, enabled: checked },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Libellé</Label>
                        <Input
                          value={deliveryOptions.pickup.label}
                          onChange={(e) =>
                            setDeliveryOptions({
                              ...deliveryOptions,
                              pickup: { ...deliveryOptions.pickup, label: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={deliveryOptions.pickup.description}
                          onChange={(e) =>
                            setDeliveryOptions({
                              ...deliveryOptions,
                              pickup: { ...deliveryOptions.pickup, description: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Livraison à domicile</Label>
                      <Switch
                        checked={deliveryOptions.delivery.enabled}
                        onCheckedChange={(checked) =>
                          setDeliveryOptions({
                            ...deliveryOptions,
                            delivery: { ...deliveryOptions.delivery, enabled: checked },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Libellé</Label>
                        <Input
                          value={deliveryOptions.delivery.label}
                          onChange={(e) =>
                            setDeliveryOptions({
                              ...deliveryOptions,
                              delivery: { ...deliveryOptions.delivery, label: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description (si payant)</Label>
                        <Input
                          value={deliveryOptions.delivery.description}
                          onChange={(e) =>
                            setDeliveryOptions({
                              ...deliveryOptions,
                              delivery: { ...deliveryOptions.delivery, description: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Promotions</CardTitle>
              <CardDescription>
                Paramètres des offres promotionnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {promoSettings && (
                <>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Promo Ramadan active</Label>
                      <p className="text-sm text-muted-foreground">
                        Affiche les messages promotionnels Ramadan
                      </p>
                    </div>
                    <Switch
                      checked={promoSettings.ramadan_promo}
                      onCheckedChange={(checked) =>
                        setPromoSettings({ ...promoSettings, ramadan_promo: checked })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message livraison gratuite</Label>
                    <Input
                      value={promoSettings.free_delivery_message}
                      onChange={(e) =>
                        setPromoSettings({
                          ...promoSettings,
                          free_delivery_message: e.target.value,
                        })
                      }
                      placeholder="Livraison Offerte"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Sauvegarder
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
