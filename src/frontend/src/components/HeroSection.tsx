import { motion } from "motion/react";

interface HeroSectionProps {
  onShopNow: () => void;
}

export function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.963 0.016 85) 0%, oklch(0.95 0.028 15) 100%)",
      }}
      data-ocid="hero.section"
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-40 animate-blob"
        style={{ background: "oklch(0.85 0.055 210)" }}
      />
      <div
        className="absolute top-10 right-0 w-80 h-80 rounded-full opacity-35 animate-blob"
        style={{ background: "oklch(0.92 0.048 15)", animationDelay: "2s" }}
      />
      <div
        className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full opacity-30 animate-blob"
        style={{ background: "oklch(0.90 0.04 55)", animationDelay: "4s" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-25 animate-blob"
        style={{ background: "oklch(0.82 0.06 15)", animationDelay: "1s" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block text-sm font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "oklch(0.74 0.07 15)" }}
            >
              ✦ Korean Style ✦
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight"
            >
              Adorable
              <br />
              <span style={{ color: "oklch(0.68 0.09 15)" }}>K-Fashion</span>
              <br />
              Accessories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-base text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              Discover the cutest Korean-inspired accessories — from butterfly
              clips to pearl earrings, scrunchies, hair bands, and so much more.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onShopNow}
              data-ocid="hero.primary_button"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-shadow hover:shadow-card-hover"
              style={{ background: "oklch(0.74 0.07 15)" }}
            >
              Shop New Arrivals
              <span className="text-lg">→</span>
            </motion.button>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "oklch(0.92 0.048 15 / 0.4)",
                  transform: "rotate(3deg) scale(1.02)",
                }}
              />
              <img
                src="/assets/generated/hero-product.dim_800x600.jpg"
                alt="Korean fashion accessories collection"
                className="relative rounded-3xl w-full object-cover shadow-card-hover"
                style={{ aspectRatio: "4/3" }}
              />
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex flex-col items-center justify-center text-white shadow-lg text-xs font-bold text-center"
                style={{ background: "oklch(0.74 0.07 15)" }}
              >
                <span className="text-lg">✦</span>
                <span>New</span>
                <span>Arrivals</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
