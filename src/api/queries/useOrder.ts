import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { API_ENDPOINTS } from "../api-config";
import type { SalesOrderPayload } from "../../components/sub-components/checkout";

// Define the shape of the API Response
interface OrderResponse {
  Success: boolean;
  Message: string;
  VoucherNo?: string;
}

// The mutation function - typed with SalesOrderPayload instead of any
const placeOrder = async (payload: SalesOrderPayload): Promise<OrderResponse> => {
  const { data } = await axios.post<OrderResponse>(
    API_ENDPOINTS.ORDER.POST, 
    payload
  );
  return data;
};

export const useOrder = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  return useMutation<OrderResponse, AxiosError<{ Message?: string }>, SalesOrderPayload>({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      // Logic for handling the specific API response structure
      if (data.Success) {
        alert(`Order ${data.VoucherNo || ""} placed successfully!`);
        clearCart();
        navigate("/");
      } else {
        alert(`Submission failed: ${data.Message}`);
      }
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.Message || "An unexpected error occurred.";
      console.error("Order Submission Error:", error);
      alert(`Error: ${errorMsg}`);
    },
  });
};