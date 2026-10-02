import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authApi.getMe();
      return res.data;
    },
    retry: false,
  });
}

export function useLogin() {
  const setAuth       = useAuthStore((s) => s.setAuth);
  const queryClient   = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: ({ data }) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (err) => {
      toast.error(err || "Login failed");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
    },
    onError: (err) => {
      toast.error(err || "Registration failed");
    },
  });
}

export function useLogout() {
  const logout      = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success("Logged out successfully");
    },
  });
}
