import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/services/api";

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await productsApi.getAll(params);
      return res.data;
    },
    enabled: params.search === undefined || params.search.length > 1,
    staleTime: 60 * 1000,
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await productsApi.getOne(slug);
      return res.data;
    },
    enabled: Boolean(slug),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await productsApi.getFeatured();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
