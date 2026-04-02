import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { toast } from "sonner";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { CartDrawer, type CartItem } from "./components/CartDrawer";
import { CategorySection } from "./components/CategorySection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ProductGrid } from "./components/ProductGrid";
import { SeoHead } from "./components/SeoHead";
import { useAllProducts } from "./hooks/useQueries";
import { AdminPage } from "./pages/AdminPage";

function Storefront() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: products, isLoading } = useAllProducts();

  function handleAddToCart(productId: bigint) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    toast.success("Added to cart! 🛍️");
  }

  function handleRemoveItem(productId: bigint) {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function handleUpdateQuantity(productId: bigint, qty: number) {
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i,
      ),
    );
  }

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <SeoHead pageName="home" />
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onShopAll={() => setActiveFilter("all")}
      />
      <main className="flex-1">
        {(activeFilter === "all" || activeFilter === "") && (
          <>
            <HeroSection onShopNow={() => setActiveFilter("new")} />
            <CategorySection onCategorySelect={setActiveFilter} />
          </>
        )}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
          activeFilter={activeFilter}
        />
      </main>
      <Footer />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        products={products}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}

export default function App() {
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");

  return (
    <>
      {isAdmin ? <AdminPage /> : <Storefront />}
      <Toaster position="bottom-right" />
    </>
  );
}
