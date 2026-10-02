import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/services/api";
import toast from "react-hot-toast";

export function useMyOrders(params = {}) {
  return useQuery({
    queryKey: ["orders", "my", params],
    queryFn: async () => {
      const res = await ordersApi.getMyOrders(params);
      return res.data;
    },
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await ordersApi.getOne(id);
      return res.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully! 🎉");
    },
    onError: (err) => {
      toast.error(err || "Failed to place order");
    },
  });
}
