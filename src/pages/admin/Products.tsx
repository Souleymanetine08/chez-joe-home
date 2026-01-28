import { useState, useRef } from "react";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import { uploadProductImage } from "@/lib/uploadImage";
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
import { Plus, Pencil, Trash2, Search, Loader2, Package, Upload, X, Eye, EyeOff, Images } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(price);
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  in_stock: boolean;
  image_url: string;
  images: string[];
  show_detail_page: boolean;
  size_small: string;
  size_large: string;
  dimensions_unit: string;
}

const emptyFormData: ProductFormData = {
  name: "",
  description: "",
  price: "",
  category_id: "",
  in_stock: true,
  image_url: "",
  images: [],
  show_detail_page: true,
  size_small: "",
  size_large: "",
  dimensions_unit: "cm",
};

export default function Products() {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        category_id: product.category_id || "",
        in_stock: product.in_stock,
        image_url: product.image_url || "",
        images: product.images || [],
        show_detail_page: product.show_detail_page ?? true,
        size_small: product.size_small || "",
        size_large: product.size_large || "",
        dimensions_unit: product.dimensions_unit || "cm",
      });
    } else {
      setEditingProduct(null);
      setFormData(emptyFormData);
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isAdditional = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // For main image, only take the first file
    if (!isAdditional) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 Mo");
        return;
      }

      setIsUploading(true);
      try {
        const imageUrl = await uploadProductImage(file);
        if (imageUrl) {
          setFormData({ ...formData, image_url: imageUrl });
          toast.success("Image principale uploadée");
        } else {
          toast.error("Erreur lors de l'upload");
        }
      } catch (error) {
        toast.error("Erreur lors de l'upload");
        console.error(error);
      } finally {
        setIsUploading(false);
      }
      return;
    }

    // For additional images, support multiple files
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 5 Mo`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Limit to remaining slots
    const remainingSlots = 10 - formData.images.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    if (filesToUpload.length < validFiles.length) {
      toast.warning(`Seulement ${filesToUpload.length} images seront uploadées (max 10)`);
    }

    setIsUploadingAdditional(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of filesToUpload) {
        const imageUrl = await uploadProductImage(file);
        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
        toast.success(`${uploadedUrls.length} image(s) uploadée(s)`);
      }
    } catch (error) {
      toast.error("Erreur lors de l'upload");
      console.error(error);
    } finally {
      setIsUploadingAdditional(false);
      // Reset the input
      if (additionalFileInputRef.current) {
        additionalFileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: "" });
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseInt(formData.price),
      category_id: formData.category_id || null,
      in_stock: formData.in_stock,
      image_url: formData.image_url || null,
      images: formData.images,
      show_detail_page: formData.show_detail_page,
      size_small: formData.size_small || null,
      size_large: formData.size_large || null,
      dimensions_unit: formData.dimensions_unit || "cm",
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
        toast.success("Produit mis à jour");
      } else {
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
        toast.success("Produit créé");
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    setIsDeleting(id);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Produit supprimé");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleDetailPage = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ show_detail_page: !product.show_detail_page })
        .eq("id", product.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        product.show_detail_page
          ? "Page détail masquée"
          : "Page détail activée"
      );
    } catch (error) {
      toast.error("Erreur");
      console.error(error);
    }
  };

  const totalImages = formData.image_url ? 1 + formData.images.length : formData.images.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Produits
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Modifier le produit" : "Nouveau produit"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (FCFA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-2">
                <Label>Dimensions (optionnel)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Input
                      placeholder="Petite taille"
                      value={formData.size_small}
                      onChange={(e) =>
                        setFormData({ ...formData, size_small: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Grande taille"
                      value={formData.size_large}
                      onChange={(e) =>
                        setFormData({ ...formData, size_large: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Select
                      value={formData.dimensions_unit}
                      onValueChange={(value) =>
                        setFormData({ ...formData, dimensions_unit: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="mm">mm</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="pouces">pouces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Main Image Upload */}
              <div className="space-y-2">
                <Label>Image principale</Label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => handleImageUpload(e, false)}
                />
                
                {formData.image_url ? (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Aperçu"
                      className="w-full h-40 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload en cours...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Cliquez pour uploader
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Additional Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Images supplémentaires ({formData.images.length}/10)</Label>
                  {formData.images.length < 10 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => additionalFileInputRef.current?.click()}
                      disabled={isUploadingAdditional}
                    >
                      {isUploadingAdditional ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Images className="h-4 w-4 mr-1" />
                          Ajouter plusieurs
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  ref={additionalFileInputRef}
                  onChange={(e) => handleImageUpload(e, true)}
                />
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Image ${index + 2}`}
                          className="w-full h-20 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalImage(index)}
                          className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {totalImages < 3 ? `Ajoutez au moins 3 images pour la page détail (${totalImages}/3)` : "Vous pouvez sélectionner plusieurs images à la fois"}
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="in_stock">En stock</Label>
                  <Switch
                    id="in_stock"
                    checked={formData.in_stock}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, in_stock: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show_detail_page">Page détail</Label>
                    <p className="text-xs text-muted-foreground">
                      Permet d'accéder à une page produit complète
                    </p>
                  </div>
                  <Switch
                    id="show_detail_page"
                    checked={formData.show_detail_page}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, show_detail_page: checked })
                    }
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : editingProduct ? (
                  "Mettre à jour"
                ) : (
                  "Créer le produit"
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
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Page</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                </TableRow>
              ))
            ) : filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        {(product.images?.length || 0) > 0 && (
                          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            +{product.images?.length}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">{product.name}</span>
                        {product.size_small && (
                          <p className="text-xs text-muted-foreground">
                            {product.size_small} - {product.size_large} {product.dimensions_unit}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.category?.name || "-"}
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        product.in_stock
                          ? "bg-accent text-accent-foreground"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {product.in_stock ? "En stock" : "Épuisé"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleDetailPage(product)}
                      className={`p-1.5 rounded-md transition-colors ${
                        product.show_detail_page
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                      title={
                        product.show_detail_page
                          ? "Page détail visible"
                          : "Page détail masquée"
                      }
                    >
                      {product.show_detail_page ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting === product.id}
                      >
                        {isDeleting === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {search ? "Aucun produit trouvé" : "Aucun produit"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
