import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onShopAll: () => void;
}

const NAV_ITEMS = [
  { label: "Shop All", filter: "all" },
  { label: "Hair", filter: "hair" },
  { label: "Jewelry", filter: "jewelry" },
  { label: "Accessories", filter: "accessories" },
  { label: "New In", filter: "new" },
  { label: "Best Sellers", filter: "bestsellers" },
];

export function Header({
  cartCount,
  onCartOpen,
  activeFilter,
  onFilterChange,
  onShopAll,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={onShopAll}
            className="flex flex-col items-center leading-none cursor-pointer hover:opacity-80 transition-opacity"
            data-ocid="header.link"
          >
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              CLIPIFY
            </span>
            <span className="font-sans text-xs font-semibold tracking-[0.25em] text-primary">
              KOVAI ✦
            </span>
          </button>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item.filter}
                onClick={() => {
                  onFilterChange(item.filter);
                  onShopAll();
                }}
                data-ocid={`nav.${item.filter}.link`}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-all ${
                  activeFilter === item.filter
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Search"
              data-ocid="header.search_input"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Wishlist"
              data-ocid="header.wishlist.button"
            >
              <Heart size={20} />
            </button>
            <button
              type="button"
              onClick={onCartOpen}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Cart"
              data-ocid="header.cart.button"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              data-ocid="header.menu.button"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-white"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  type="button"
                  key={item.filter}
                  onClick={() => {
                    onFilterChange(item.filter);
                    onShopAll();
                    setMobileOpen(false);
                  }}
                  data-ocid={`nav.mobile.${item.filter}.link`}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl text-left transition-all ${
                    activeFilter === item.filter
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
