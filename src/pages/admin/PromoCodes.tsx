import { useState } from "react";
import { usePromoCodes, PromoCode } from "@/hooks/usePromoCodes";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Loader2, Ticket, Calendar, Users, Percent, Hash, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-SN").format(price);
}

function generateRandomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getPromoStatus(promo: PromoCode): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  const now = new Date();
  
  if (!promo.is_active) {
    return { label: "Inactif", variant: "secondary" };
  }
  
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    return { label: "Expiré", variant: "destructive" };
  }
  
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    return { label: "Planifié", variant: "outline" };
  }
  
  if (promo.max_uses && promo.current_uses >= promo.max_uses) {
    return { label: "Épuisé", variant: "destructive" };
  }
  
  return { label: "Actif", variant: "default" };
}

interface PromoFormData {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  min_order_amount: string;
  max_uses: string;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
}

const emptyFormData: PromoFormData = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  min_order_amount: "",
  max_uses: "",
  is_active: true,
  valid_from: "",
  valid_until: "",
};

export default function PromoCodes() {
  const { data: promoCodes, isLoading } = usePromoCodes();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<PromoFormData>(emptyFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredPromoCodes = promoCodes?.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (promo?: PromoCode) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        code: promo.code,
        description: promo.description || "",
        discount_type: promo.discount_type as "percentage" | "fixed",
        discount_value: promo.discount_value.toString(),
        min_order_amount: promo.min_order_amount?.toString() || "",
        max_uses: promo.max_uses?.toString() || "",
        is_active: promo.is_active,
        valid_from: promo.valid_from ? promo.valid_from.slice(0, 16) : "",
        valid_until: promo.valid_until ? promo.valid_until.slice(0, 16) : "",
      });
    } else {
      setEditingPromo(null);
      setFormData({ ...emptyFormData, code: generateRandomCode() });
    }
    setIsDialogOpen(true);
  };

  const handleGenerateCode = () => {
    setFormData({ ...formData, code: generateRandomCode() });
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code copié !");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const promoData = {
      code: formData.code.toUpperCase().trim(),
      description: formData.description || null,
      discount_type: formData.discount_type,
      discount_value: parseInt(formData.discount_value),
      min_order_amount: formData.min_order_amount ? parseInt(formData.min_order_amount) : null,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      is_active: formData.is_active,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null,
    };

    try {
      if (editingPromo) {
        const { error } = await supabase
          .from("promo_codes")
          .update(promoData)
          .eq("id", editingPromo.id);
        if (error) throw error;
        toast.success("Code promo mis à jour");
      } else {
        const { error } = await supabase.from("promo_codes").insert(promoData);
        if (error) throw error;
        toast.success("Code promo créé");
      }
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      setIsDialogOpen(false);
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("Ce code existe déjà");
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) return;

    setIsDeleting(id);
    try {
      const { error } = await supabase.from("promo_codes").delete().eq("id", id);
      if (error) throw error;
      toast.success("Code promo supprimé");
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleActive = async (promo: PromoCode) => {
    try {
      const { error } = await supabase
        .from("promo_codes")
        .update({ is_active: !promo.is_active })
        .eq("id", promo.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      toast.success(promo.is_active ? "Code désactivé" : "Code activé");
    } catch (error) {
      toast.error("Erreur");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Codes Promo
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos codes promotionnels
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? "Modifier le code promo" : "Nouveau code promo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code */}
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="Ex: RAMADAN25"
                    className="font-mono uppercase"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateCode}
                  >
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Ex: Réduction spéciale Ramadan"
                  rows={2}
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de réduction *</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: "percentage" | "fixed") =>
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                      <SelectItem value="fixed">Montant fixe (FCFA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    Valeur {formData.discount_type === "percentage" ? "(%)" : "(FCFA)"} *
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({ ...formData, discount_value: e.target.value })
                    }
                    placeholder={formData.discount_type === "percentage" ? "10" : "5000"}
                    required
                  />
                </div>
              </div>

              {/* Min order & Max uses */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_order_amount">Commande minimum (FCFA)</Label>
                  <Input
                    id="min_order_amount"
                    type="number"
                    value={formData.min_order_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, min_order_amount: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_uses">Utilisations max</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) =>
                      setFormData({ ...formData, max_uses: e.target.value })
                    }
                    placeholder="Illimité"
                  />
                </div>
              </div>

              {/* Validity Period */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valid_from">Valide à partir de</Label>
                  <Input
                    id="valid_from"
                    type="datetime-local"
                    value={formData.valid_from}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_from: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valid_until">Valide jusqu'au</Label>
                  <Input
                    id="valid_until"
                    type="datetime-local"
                    value={formData.valid_until}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_until: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Code actif</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : editingPromo ? (
                  "Mettre à jour"
                ) : (
                  "Créer le code"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Ticket className="h-4 w-4" />
            <span className="text-sm">Total codes</span>
          </div>
          <p className="text-2xl font-bold">{promoCodes?.length || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Check className="h-4 w-4" />
            <span className="text-sm">Actifs</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {promoCodes?.filter(p => getPromoStatus(p).label === "Actif").length || 0}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">Utilisations</span>
          </div>
          <p className="text-2xl font-bold">
            {promoCodes?.reduce((sum, p) => sum + p.current_uses, 0) || 0}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Expirés</span>
          </div>
          <p className="text-2xl font-bold text-destructive">
            {promoCodes?.filter(p => getPromoStatus(p).label === "Expiré").length || 0}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Réduction</TableHead>
              <TableHead>Min. commande</TableHead>
              <TableHead>Utilisations</TableHead>
              <TableHead>Validité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                </TableRow>
              ))
            ) : filteredPromoCodes && filteredPromoCodes.length > 0 ? (
              filteredPromoCodes.map((promo) => {
                const status = getPromoStatus(promo);
                return (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-secondary px-2 py-1 rounded font-mono text-sm">
                          {promo.code}
                        </code>
                        <button
                          onClick={() => handleCopyCode(promo.code)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          {copiedCode === promo.code ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      {promo.description && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                          {promo.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {promo.discount_type === "percentage" ? (
                          <>
                            <Percent className="h-3.5 w-3.5 text-primary" />
                            <span className="font-medium">{promo.discount_value}%</span>
                          </>
                        ) : (
                          <span className="font-medium">{formatPrice(promo.discount_value)} F</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {promo.min_order_amount ? `${formatPrice(promo.min_order_amount)} F` : "-"}
                    </TableCell>
                    <TableCell>
                      <span className={promo.max_uses && promo.current_uses >= promo.max_uses ? "text-destructive" : ""}>
                        {promo.current_uses}
                        {promo.max_uses ? ` / ${promo.max_uses}` : ""}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {promo.valid_from || promo.valid_until ? (
                        <div className="space-y-0.5">
                          {promo.valid_from && (
                            <p className="text-xs">
                              Du {format(new Date(promo.valid_from), "dd/MM/yy HH:mm", { locale: fr })}
                            </p>
                          )}
                          {promo.valid_until && (
                            <p className="text-xs">
                              Au {format(new Date(promo.valid_until), "dd/MM/yy HH:mm", { locale: fr })}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Illimité</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status.variant}
                        className="cursor-pointer"
                        onClick={() => toggleActive(promo)}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(promo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(promo.id)}
                          disabled={isDeleting === promo.id}
                        >
                          {isDeleting === promo.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {search ? "Aucun code trouvé" : "Aucun code promo"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
