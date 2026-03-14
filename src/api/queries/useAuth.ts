import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  api, } from "../axios-client";
import { API_ENDPOINTS } from "../api-config";
import type { Login } from "../../types/auth";

export const useCheckSession = () => {
  return useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.AUTH.CHECK_SESSION);
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: Login) => {
      const { data } = await api.post(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
      );
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.data[0].Token);
      localStorage.setItem("salesManID", data.data[0].SalesmanId);
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.get(API_ENDPOINTS.AUTH.LOGOUT);
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear(); 
      window.location.href = "/"; 
    },
  });
};
