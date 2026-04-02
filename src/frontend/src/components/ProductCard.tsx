import { ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";
import { Category } from "../backend.d";

function getCategoryImage(category: Category): string {
  switch (category) {
    case Category.hairClips:
      return "/assets/generated/hair-clips.dim_400x400.jpg";
    case Category.scrunches:
      return "/assets/generated/scrunches.dim_400x400.jpg";
    case Category.earrings:
      return "/assets/generated/earrings.dim_400x400.jpg";
    case Category.hairBands:
      return "/assets/generated/hair-bands.dim_400x400.jpg";
    default:
      return "/assets/generated/accessories.dim_400x400.jpg";
  }
}

function formatPrice(priceCents: bigint): string {
  const dollars = Number(priceCents) / 100;
  return `$${dollars.toFixed(2)}`;
}

function StarRating({ rating, count }: { rating: number; count: bigint }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-border fill-border"
            }
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        ({count.toString()})
      </span>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (id: bigint) => void;
}

export function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  const image = product.image || getCategoryImage(product.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      data-ocid={`product.item.${index + 1}`}
      className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow group"
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isNew && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full"
            style={{ background: "oklch(0.74 0.07 15)" }}
          >
            New
          </span>
        )}
        {product.isBestSeller && (
          <span
            className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full"
            style={{ background: "oklch(0.62 0.08 45)" }}
          >
            ✦ Best
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="flex items-center justify-between mt-3">
          <span
            className="font-bold text-base"
            style={{ color: "oklch(0.55 0.09 15)" }}
          >
            {formatPrice(product.priceCents)}
          </span>
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            data-ocid={`product.add_button.${index + 1}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "oklch(0.74 0.07 15)" }}
          >
            <ShoppingBag size={12} />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
