import { useEffect } from "react";
import { useSeoSettings } from "../hooks/useQueries";

interface SeoHeadProps {
  pageName: string;
}

export function SeoHead({ pageName }: SeoHeadProps) {
  const { data: seo } = useSeoSettings(pageName);

  const title = seo?.metaTitle || "Clipify Kovai — Korean Fashion Accessories";
  const description =
    seo?.metaDescription ||
    "Discover the cutest Korean hair clips, scrunchies, earrings, and accessories at Clipify Kovai. K-fashion style delivered to you.";
  const keywords =
    seo?.keywords ||
    "Korean fashion, hair clips, scrunchies, earrings, hair bands, K-fashion accessories, Kovai";
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;

  useEffect(() => {
    document.title = title;
    function setMeta(name: string, content: string, prop = false) {
      const attr = prop ? "property" : "name";
      let el = document.querySelector<HTMLMetaElement>(
        `meta[${attr}="${name}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    }
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("og:title", ogTitle, true);
    setMeta("og:description", ogDescription, true);
    setMeta("og:type", "website", true);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", ogTitle);
    setMeta("twitter:description", ogDescription);

    if (pageName === "home") {
      let script = document.querySelector<HTMLScriptElement>(
        'script[type="application/ld+json"]',
      );
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Clipify Kovai",
        description:
          "Korean fashion accessories store — hair clips, scrunchies, earrings, and more.",
        url: window.location.origin,
      });
    }
  }, [title, description, keywords, ogTitle, ogDescription, pageName]);

  return null;
}
