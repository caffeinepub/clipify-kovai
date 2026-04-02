import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import type { Product } from "../backend.d";
import { Category } from "../backend.d";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onAddToCart: (id: bigint) => void;
  activeFilter: string;
}

function filterProducts(products: Product[], filter: string): Product[] {
  switch (filter) {
    case "all":
      return products;
    case "hair":
      return products.filter((p) =>
        [
          Category.hairClips,
          Category.hairBands,
          Category.hairAccessories,
          Category.scrunches,
        ].includes(p.category),
      );
    case "jewelry":
      return products.filter((p) =>
        [Category.jewelry, Category.earrings].includes(p.category),
      );
    case "accessories":
      return products.filter((p) =>
        [Category.apparel, Category.hairAccessories].includes(p.category),
      );
    case "scrunches":
      return products.filter((p) => p.category === Category.scrunches);
    case "new":
      return products.filter((p) => p.isNew);
    case "bestsellers":
      return products.filter((p) => p.isBestSeller);
    default:
      return products;
  }
}

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

function ProductSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between mt-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  isLoading,
  onAddToCart,
  activeFilter,
}: ProductGridProps) {
  const filtered = products ? filterProducts(products, activeFilter) : [];
  const bestSellers = products ? products.filter((p) => p.isBestSeller) : [];
  const newArrivals = products ? products.filter((p) => p.isNew) : [];
  const showSections = activeFilter === "all" || activeFilter === "";

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10" data-ocid="products.loading_state">
            <Skeleton className="h-7 w-40 mx-auto mb-3" />
            <Skeleton className="h-0.5 w-16 mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {SKELETON_KEYS.map((k) => (
              <ProductSkeleton key={k} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (showSections) {
    return (
      <div>
        {bestSellers.length > 0 && (
          <section
            className="py-16 bg-secondary/30"
            data-ocid="bestsellers.section"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="Best Sellers" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {bestSellers.map((p, i) => (
                  <ProductCard
                    key={p.id.toString()}
                    product={p}
                    index={i}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        {newArrivals.length > 0 && (
          <section className="py-16" data-ocid="newin.section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="New In" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {newArrivals.map((p, i) => (
                  <ProductCard
                    key={p.id.toString()}
                    product={p}
                    index={i}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <section className="py-16 bg-secondary/30" data-ocid="products.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={getFilterTitle(activeFilter)} />
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="products.empty_state"
          >
            <span className="text-4xl mb-4 block">✦</span>
            <p className="font-medium">
              No products found in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id.toString()}
                product={p}
                index={i}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-10"
    >
      <h2 className="text-2xl font-bold tracking-[0.15em] uppercase text-foreground">
        {title}
      </h2>
      <div
        className="mt-3 mx-auto w-16 h-0.5 rounded-full"
        style={{ background: "oklch(0.74 0.07 15)" }}
      />
    </motion.div>
  );
}

function getFilterTitle(filter: string): string {
  const titles: Record<string, string> = {
    hair: "Hair Collection",
    jewelry: "Jewelry & Earrings",
    accessories: "Accessories",
    scrunches: "Scrunches",
    new: "New In",
    bestsellers: "Best Sellers",
  };
  return titles[filter] || "All Products";
}
