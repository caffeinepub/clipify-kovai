import { Instagram } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer style={{ background: "oklch(0.93 0.028 15)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-display text-2xl font-bold text-foreground block">
                CLIPIFY
              </span>
              <span
                className="font-sans text-sm font-semibold tracking-[0.25em]"
                style={{ color: "oklch(0.74 0.07 15)" }}
              >
                KOVAI ✦
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your go-to destination for adorable Korean-inspired accessories.
              Express your style with our curated collection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm tracking-[0.15em] uppercase mb-4 text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                "Shop All",
                "Best Sellers",
                "New In",
                "Hair Accessories",
                "Jewelry",
              ].map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid={`footer.${link.toLowerCase().replace(/ /g, "_")}.link`}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="font-bold text-sm tracking-[0.15em] uppercase mb-4 text-foreground">
              Stay Connected
            </h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full text-muted-foreground hover:text-foreground transition-colors hover:bg-white/60"
                aria-label="Instagram"
                data-ocid="footer.instagram.link"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full text-muted-foreground hover:text-foreground transition-colors hover:bg-white/60"
                aria-label="TikTok"
                data-ocid="footer.tiktok.link"
              >
                <SiTiktok size={20} />
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Get exclusive deals & new arrivals:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 text-sm px-3 py-2 rounded-full border border-border bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  data-ocid="footer.newsletter.input"
                />
                <button
                  type="button"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "oklch(0.74 0.07 15)" }}
                  data-ocid="footer.newsletter.submit_button"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground"
          style={{ borderColor: "oklch(0.85 0.03 15)" }}
        >
          <p>© {year} Clipify Kovai. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
