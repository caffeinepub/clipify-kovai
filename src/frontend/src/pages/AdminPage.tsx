import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  KeyRound,
  Loader2,
  LogOut,
  Package,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product, ProductInput, SeoSettings } from "../backend.d";
import { Category } from "../backend.d";
import { useActor } from "../hooks/useActor";

const SESSION_KEY = "clipify_admin_auth";

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useAllSeoSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SeoSettings[]>({
    queryKey: ["seoSettings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSeoSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

function useUpdateSeoSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SeoSettings) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSeoSettings(settings);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seoSettings"] });
      qc.invalidateQueries({ queryKey: ["seoSettings", "home"] });
      toast.success("SEO settings saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save SEO settings.");
    },
  });
}

function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).addProduct(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added!");
    },
    onError: () => toast.error("Failed to add product."),
  });
}

function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ProductInput }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateProduct(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated!");
    },
    onError: () => toast.error("Failed to update product."),
  });
}

function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted.");
    },
    onError: () => toast.error("Failed to delete product."),
  });
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  shop: "Shop",
  categories: "Categories",
};

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.hairClips]: "Hair Clips",
  [Category.scrunches]: "Scrunches",
  [Category.earrings]: "Earrings",
  [Category.hairBands]: "Hair Bands",
  [Category.hairAccessories]: "Hair Accessories",
  [Category.jewelry]: "Jewelry",
  [Category.apparel]: "Apparel",
};

const EMPTY_FORM: ProductInput = {
  name: "",
  description: "",
  category: Category.hairClips,
  image: "",
  isNew: false,
  isBestSeller: false,
  priceCents: BigInt(0),
};

// ─── Change Password Dialog ───────────────────────────────────────────────────

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const { actor } = useActor();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleChange() {
    if (newPwd.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (!actor) return;
    setIsPending(true);
    try {
      const ok = await (actor as any).setAdminPassword(currentPwd, newPwd);
      if (ok) {
        toast.success("Password changed successfully!");
        setCurrentPwd("");
        setNewPwd("");
        onClose();
      } else {
        toast.error("Current password is incorrect.");
      }
    } catch {
      toast.error("Failed to change password.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-sm"
        data-ocid="admin.change_password_dialog"
      >
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one (min 6 characters).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="current-pwd">Current Password</Label>
            <Input
              id="current-pwd"
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              placeholder="Current password"
              data-ocid="admin.current_password_input"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-pwd">New Password</Label>
            <Input
              id="new-pwd"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="New password (min 6 chars)"
              data-ocid="admin.new_password_input"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.cancel_button"
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={handleChange}
            disabled={isPending}
            className="bg-primary text-primary-foreground"
            data-ocid="admin.save_button"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            {isPending ? "Saving..." : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Form Dialog ──────────────────────────────────────────────────────

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: Product;
}

function ProductFormDialog({ open, onClose, initial }: ProductFormDialogProps) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const [form, setForm] = useState<ProductInput>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          category: initial.category,
          image: initial.image,
          isNew: initial.isNew,
          isBestSeller: initial.isBestSeller,
          priceCents: initial.priceCents,
        }
      : EMPTY_FORM,
  );

  const isEdit = !!initial;
  const isPending = addProduct.isPending || updateProduct.isPending;

  function setField<K extends keyof ProductInput>(
    key: K,
    value: ProductInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (isEdit && initial) {
      await updateProduct.mutateAsync({ id: initial.id, input: form });
    } else {
      await addProduct.mutateAsync(form);
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="product.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the product details below."
              : "Fill in the details to add a new product to your store."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <Label htmlFor="prod-name">Name *</Label>
            <Input
              id="prod-name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. Pink Pearl Hair Clip"
              data-ocid="product.input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prod-description">Description</Label>
            <Textarea
              id="prod-description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Short product description"
              rows={3}
              data-ocid="product.textarea"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="prod-price">Price (₹)</Label>
              <Input
                id="prod-price"
                type="number"
                min={0}
                step={0.01}
                value={Number(form.priceCents) / 100}
                onChange={(e) =>
                  setField(
                    "priceCents",
                    BigInt(
                      Math.round(
                        Number.parseFloat(e.target.value || "0") * 100,
                      ),
                    ),
                  )
                }
                placeholder="0.00"
                data-ocid="product.price_input"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prod-category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setField("category", v as Category)}
              >
                <SelectTrigger id="prod-category" data-ocid="product.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.values(Category) as Category[]).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prod-image">Image URL</Label>
            <Input
              id="prod-image"
              value={form.image}
              onChange={(e) => setField("image", e.target.value)}
              placeholder="https://..."
              data-ocid="product.image_input"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-1 h-24 w-24 rounded-lg object-cover border border-border"
              />
            )}
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="prod-isnew"
                checked={form.isNew}
                onCheckedChange={(c) => setField("isNew", !!c)}
                data-ocid="product.checkbox"
              />
              <Label htmlFor="prod-isnew">Mark as New</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="prod-bestseller"
                checked={form.isBestSeller}
                onCheckedChange={(c) => setField("isBestSeller", !!c)}
                data-ocid="product.bestseller_checkbox"
              />
              <Label htmlFor="prod-bestseller">Best Seller</Label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="product.cancel_button"
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-primary text-primary-foreground"
            data-ocid="product.save_button"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            {isPending
              ? "Saving..."
              : isEdit
                ? "Update Product"
                : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

interface DeleteConfirmDialogProps {
  open: boolean;
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteConfirmDialog({
  open,
  product,
  onConfirm,
  onCancel,
  isPending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-sm" data-ocid="product.delete_dialog">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{product.name}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            data-ocid="product.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            data-ocid="product.confirm_button"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-1" />
            )}
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteProduct = useDeleteProduct();

  return (
    <>
      <Card
        className="border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        data-ocid={`product.item.${index}`}
      >
        <div className="relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover bg-muted"
            />
          ) : (
            <div className="w-full h-40 bg-muted/50 flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            {product.isNew && (
              <Badge className="bg-green-500 text-white text-xs">New</Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-amber-500 text-white text-xs">⭐ Best</Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
              {product.name}
            </p>
            <span className="font-bold text-primary text-sm whitespace-nowrap">
              ₹{(Number(product.priceCents) / 100).toFixed(0)}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs mb-3">
            {CATEGORY_LABELS[product.category]}
          </Badge>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={() => setEditOpen(true)}
              data-ocid={`product.edit_button.${index}`}
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={() => setDeleteOpen(true)}
              data-ocid={`product.delete_button.${index}`}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {editOpen && (
        <ProductFormDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          initial={product}
        />
      )}

      {deleteOpen && (
        <DeleteConfirmDialog
          open={deleteOpen}
          product={product}
          isPending={deleteProduct.isPending}
          onConfirm={async () => {
            await deleteProduct.mutateAsync(product.id);
            setDeleteOpen(false);
          }}
          onCancel={() => setDeleteOpen(false)}
        />
      )}
    </>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const { data: products, isLoading } = useAllProducts();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your store products — add, edit, or remove items.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-primary text-primary-foreground"
          data-ocid="product.primary_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center py-20"
          data-ocid="product.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : products && products.length > 0 ? (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-ocid="product.list"
        >
          {products.map((p, i) => (
            <ProductCard key={String(p.id)} product={p} index={i + 1} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16" data-ocid="product.empty_state">
          <CardContent>
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No products yet.
            </p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Start by adding your first product.
            </p>
            <Button
              onClick={() => setAddOpen(true)}
              className="bg-primary text-primary-foreground"
              data-ocid="product.secondary_button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          </CardContent>
        </Card>
      )}

      {addOpen && (
        <ProductFormDialog open={addOpen} onClose={() => setAddOpen(false)} />
      )}
    </div>
  );
}

// ─── SEO Tab ──────────────────────────────────────────────────────────────────

interface EditDialogProps {
  settings: SeoSettings;
  open: boolean;
  onClose: () => void;
}

function EditDialog({ settings, open, onClose }: EditDialogProps) {
  const [form, setForm] = useState<SeoSettings>(settings);
  const update = useUpdateSeoSettings();

  function handleChange(field: keyof SeoSettings, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    await update.mutateAsync(form);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="seo.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit SEO — {PAGE_LABELS[settings.pageName] ?? settings.pageName}
          </DialogTitle>
          <DialogDescription>
            Update meta tags for this page. Changes take effect immediately
            after saving.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={form.metaTitle}
              onChange={(e) => handleChange("metaTitle", e.target.value)}
              placeholder="Page title shown in search results"
              data-ocid="seo.input"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={form.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
              placeholder="Short description shown in search results (max 160 chars)"
              rows={3}
              data-ocid="seo.textarea"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={form.keywords}
              onChange={(e) => handleChange("keywords", e.target.value)}
              placeholder="Comma-separated keywords"
              data-ocid="seo.keywords_input"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ogTitle">OG Title</Label>
            <Input
              id="ogTitle"
              value={form.ogTitle}
              onChange={(e) => handleChange("ogTitle", e.target.value)}
              placeholder="Title for social media sharing"
              data-ocid="seo.og_title_input"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ogDescription">OG Description</Label>
            <Textarea
              id="ogDescription"
              value={form.ogDescription}
              onChange={(e) => handleChange("ogDescription", e.target.value)}
              placeholder="Description for social media sharing"
              rows={3}
              data-ocid="seo.og_description_textarea"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="seo.cancel_button"
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={update.isPending}
            className="bg-primary text-primary-foreground"
            data-ocid="seo.save_button"
          >
            {update.isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            {update.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SeoSettingCard({
  settings,
  index,
}: { settings: SeoSettings; index: number }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Card
        className="border border-border shadow-sm hover:shadow-md transition-shadow"
        data-ocid={`seo.item.${index}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="capitalize">
              {PAGE_LABELS[settings.pageName] ?? settings.pageName}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditOpen(true)}
              data-ocid={`seo.edit_button.${index}`}
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm">
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Meta Title</dt>
              <dd className="truncate">
                {settings.metaTitle || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </dd>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">
                Meta Description
              </dt>
              <dd className="line-clamp-2">
                {settings.metaDescription || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </dd>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Keywords</dt>
              <dd className="line-clamp-2 text-muted-foreground">
                {settings.keywords || <span className="italic">Not set</span>}
              </dd>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">OG Title</dt>
              <dd className="truncate">
                {settings.ogTitle || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </dd>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">
                OG Description
              </dt>
              <dd className="line-clamp-2">
                {settings.ogDescription || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      {editOpen && (
        <EditDialog
          settings={settings}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}

function SeoTab() {
  const { data: seoSettings, isLoading: seoLoading } = useAllSeoSettings();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">SEO Settings</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage meta titles, descriptions, and keywords for each page.
        </p>
      </div>

      <Card className="mb-6 bg-accent/30 border-accent">
        <CardContent className="pt-5 pb-4">
          <div className="flex gap-3">
            <Search className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">
                SEO Best Practices
              </p>
              <ul className="text-muted-foreground space-y-0.5 list-disc list-inside">
                <li>
                  Meta titles: 50–60 characters for best display in search
                  results
                </li>
                <li>Meta descriptions: under 160 characters</li>
                <li>Keywords: comma-separated, relevant to the page content</li>
                <li>
                  OG tags control how your page appears when shared on social
                  media
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {seoLoading ? (
        <div
          className="flex items-center justify-center py-20"
          data-ocid="seo.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : seoSettings && seoSettings.length > 0 ? (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="seo.list"
        >
          {seoSettings.map((s, i) => (
            <SeoSettingCard key={s.pageName} settings={s} index={i + 1} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16" data-ocid="seo.empty_state">
          <CardContent>
            <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No SEO settings found yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Settings will appear here once the backend is seeded.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

interface LoginScreenProps {
  onLogin: () => void;
}

function LoginScreen({ onLogin }: LoginScreenProps) {
  const { actor, isFetching } = useActor();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || isFetching) return;
    setIsPending(true);
    setError("");
    try {
      const ok = await (actor as any).checkAdminPassword(password);
      if (ok) {
        sessionStorage.setItem(SESSION_KEY, "true");
        onLogin();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card
        className="w-full max-w-sm shadow-lg border-border"
        data-ocid="admin.card"
      >
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your password to manage Clipify Kovai.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter admin password"
                autoFocus
                data-ocid="admin.input"
              />
              {error && (
                <p
                  className="text-sm text-destructive"
                  data-ocid="admin.error_state"
                >
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isPending || isFetching || !password}
              data-ocid="admin.primary_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── AdminPage ────────────────────────────────────────────────────────────────

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );
  const [changePwdOpen, setChangePwdOpen] = useState(false);

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-semibold text-foreground">
                Clipify Kovai
              </span>
              <span className="ml-2 text-muted-foreground text-sm">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChangePwdOpen(true)}
              className="text-muted-foreground hover:text-foreground"
              data-ocid="admin.open_modal_button"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
              data-ocid="admin.secondary_button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="products" data-ocid="admin.tab">
          <TabsList className="mb-8 bg-muted/60">
            <TabsTrigger
              value="products"
              className="gap-2"
              data-ocid="admin.products_tab"
            >
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger
              value="seo"
              className="gap-2"
              data-ocid="admin.seo_tab"
            >
              <Search className="w-4 h-4" />
              SEO Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="seo">
            <SeoTab />
          </TabsContent>
        </Tabs>
      </main>

      <ChangePasswordDialog
        open={changePwdOpen}
        onClose={() => setChangePwdOpen(false)}
      />
    </div>
  );
}
