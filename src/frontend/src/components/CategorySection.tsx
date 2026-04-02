import { motion } from "motion/react";

interface CategorySectionProps {
  onCategorySelect: (filter: string) => void;
}

const CATEGORIES = [
  {
    label: "Hair Clips",
    filter: "hair",
    image: "/assets/generated/hair-clips.dim_400x400.jpg",
  },
  {
    label: "Scrunches",
    filter: "scrunches",
    image: "/assets/generated/scrunches.dim_400x400.jpg",
  },
  {
    label: "Earrings",
    filter: "jewelry",
    image: "/assets/generated/earrings.dim_400x400.jpg",
  },
  {
    label: "Hair Bands",
    filter: "hair",
    image: "/assets/generated/hair-bands.dim_400x400.jpg",
  },
  {
    label: "Accessories",
    filter: "accessories",
    image: "/assets/generated/accessories.dim_400x400.jpg",
  },
  { label: "Shop All", filter: "all", image: null },
];

export function CategorySection({ onCategorySelect }: CategorySectionProps) {
  return (
    <section className="py-16 lg:py-20" data-ocid="categories.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold tracking-[0.15em] uppercase text-foreground">
            Shop By Category
          </h2>
          <div
            className="mt-3 mx-auto w-16 h-0.5 rounded-full"
            style={{ background: "oklch(0.74 0.07 15)" }}
          />
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => onCategorySelect(cat.filter)}
              data-ocid={`category.${cat.filter}.button`}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all shadow-card group-hover:shadow-card-hover">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.74 0.07 15), oklch(0.82 0.06 30))",
                    }}
                  >
                    ✦
                  </div>
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-center">
                {cat.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
