import { ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../backend.d";

export interface CartItem {
  productId: bigint;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[] | undefined;
  onRemoveItem: (productId: bigint) => void;
  onUpdateQuantity: (productId: bigint, qty: number) => void;
}

function formatPrice(priceCents: bigint): string {
  return `$${(Number(priceCents) / 100).toFixed(2)}`;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  products,
  onRemoveItem,
  onUpdateQuantity,
}: CartDrawerProps) {
  const enriched = cartItems
    .map((item) => ({
      ...item,
      product: products?.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);

  const subtotal = enriched.reduce((sum, item) => {
    return sum + Number(item.product!.priceCents) * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            data-ocid="cart.modal"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-background shadow-2xl z-50 flex flex-col"
            data-ocid="cart.sheet"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag
                  size={20}
                  style={{ color: "oklch(0.74 0.07 15)" }}
                />
                <h2 className="font-bold text-lg">Your Cart</h2>
                <span
                  className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                  style={{ background: "oklch(0.74 0.07 15)" }}
                >
                  {cartItems.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                data-ocid="cart.close_button"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {enriched.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-medium">Your cart is empty</p>
                  <p className="text-sm mt-1">Add some cute accessories!</p>
                </div>
              ) : (
                enriched.map((item, idx) => (
                  <motion.div
                    key={item.productId.toString()}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-3 bg-card rounded-xl p-3 shadow-card"
                    data-ocid={`cart.item.${idx + 1}`}
                  >
                    <img
                      src={
                        item.product!.image ||
                        "/assets/generated/accessories.dim_400x400.jpg"
                      }
                      alt={item.product!.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-2 leading-snug">
                        {item.product!.name}
                      </p>
                      <p
                        className="text-sm font-bold mt-1"
                        style={{ color: "oklch(0.55 0.09 15)" }}
                      >
                        {formatPrice(item.product!.priceCents)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              item.productId,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-sm hover:bg-secondary transition-colors"
                          data-ocid={`cart.decrease_button.${idx + 1}`}
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-sm hover:bg-secondary transition-colors"
                          data-ocid={`cart.increase_button.${idx + 1}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.productId)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      data-ocid={`cart.delete_button.${idx + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {enriched.length > 0 && (
              <div className="border-t border-border p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-bold text-lg">
                    ${(subtotal / 100).toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast.success("Coming soon! We're setting up checkout. 🌸")
                  }
                  data-ocid="cart.confirm_button"
                  className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90"
                  style={{ background: "oklch(0.74 0.07 15)" }}
                >
                  Checkout →
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  Free shipping on orders over $50
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
