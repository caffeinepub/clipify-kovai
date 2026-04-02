import { useQuery } from "@tanstack/react-query";
import type { Product, SeoSettings } from "../backend.d";
import { Category } from "../backend.d";
import { useActor } from "./useActor";

export function useAllProducts() {
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

export function useProductsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeoSettings(pageName: string) {
  const { actor, isFetching } = useActor();
  return useQuery<SeoSettings | null>({
    queryKey: ["seoSettings", pageName],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSeoSettings(pageName);
    },
    enabled: !!actor && !isFetching,
  });
}

export { Category };
