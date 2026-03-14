import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { API_ENDPOINTS } from "../api-config";
import type { SalesOrderPayload } from "../../pages/product/checkout";
import type { API_RESPONSE } from "../../types/auth";
import { api } from "../axios-client";
import { toast } from "sonner";

interface TermFilter {
  module: string;
  termType: string;
}

const placeOrder = async (payload: SalesOrderPayload): Promise<API_RESPONSE> => {
  const { data } = await api.post<API_RESPONSE>(API_ENDPOINTS.ORDER.POST, payload);
  return data;
};

const fetchTerms = async (filters: TermFilter): Promise<API_RESPONSE> => {
  const { data } = await api.get(API_ENDPOINTS.ORDER.LIST_TERM, {
    params: filters,
  });
  return data;
};

export const useOrder = (moduleName: string = "Sales") => {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  const productTerms = useQuery({
    queryKey: ["order-terms", moduleName, "P"],
    queryFn: () => fetchTerms({ module: moduleName, termType: "P" }),
    enabled: !!moduleName,
  });

  const billTerms = useQuery({
    queryKey: ["order-terms", moduleName, "B"],
    queryFn: () => fetchTerms({ module: moduleName, termType: "B" }),
    enabled: !!moduleName,
  });

  // 3. Mutation for placing order
  const orderMutation = useMutation<
    API_RESPONSE,
    AxiosError<{ Message?: string }>,
    SalesOrderPayload
  >({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      // Use standard status check
      if (data.status === 200) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/");
      } else {
        toast.error(data.Message || "Submission failed");
      }
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.Message || "An unexpected error occurred.";
      toast.error(errorMsg);
    },
  });

  return {
    // Mutation
    placeOrder: orderMutation.mutate,
    isPlacing: orderMutation.isPending,
    
    // Data
    productTerms: productTerms.data,
    billTerms: billTerms.data,
    
    // Combined Loading States
    isTermsLoading: productTerms.isLoading || billTerms.isLoading,
    
    // Errors
    termsError: productTerms.error || billTerms.error,
  };
};