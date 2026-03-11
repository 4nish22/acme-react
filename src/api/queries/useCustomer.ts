import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { API_ENDPOINTS } from "../api-config";
import { api } from "../axios-client";
import type { Customer, CustomerListResponse } from "../../types/customer";

export interface CustomerFilters {
  "Context.GlCategory"?: string;
  Skip?: number;
  Take?: number;
  SearchKey?: string | null;
  SelectAll?: boolean;
}

const listCustomer = async (
  filters: CustomerFilters = {},
): Promise<CustomerListResponse> => {
  const { data } = await api.get(API_ENDPOINTS.CUSTOMER.LIST, {
    params: filters,
  });
  return {
    customers: Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [],
    totalRecords: data.totalrecords || 0,
  };
};

const getCustomer = async (id: string | number): Promise<Customer> => {
  const { data } = await api.get(`${API_ENDPOINTS.CUSTOMER.LIST}/${id}`);
  return data.data || data;
};

export const useCustomer = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

export const useCustomers = (filters: CustomerFilters = {}) => {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: () => listCustomer(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const usePrefetchCustomer = () => {
  const queryClient = useQueryClient();

  const prefetch = (id: string | number) => {
    queryClient.prefetchQuery({
      queryKey: ["customer", id],
      queryFn: () => getCustomer(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  return { prefetch };
};
