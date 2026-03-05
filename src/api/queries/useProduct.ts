import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../api-config";
import { api } from "../axios-client";
import type { ProductListResponse } from "../../types/product";

export interface ProductFilters {
  Context?: number;
  Skip?: number;
  Take?: number;
  SearchKey?: string | null;
  SelectAll?: boolean;
}



const listProduct = async (filters: ProductFilters = {}): Promise<ProductListResponse> => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCT.LIST, { params: filters });
  return {
    products: Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []), 
    totalRecords: data.totalrecords || 0
  };
};

const fetchGroups = async () => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCT.GROUP);
  return data.data || data;
};

const fetchGroupTags = async () => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCT.GROUP1);
  return data.data || data;
};

/* --- Main Hook --- */

export const useProducts = (initialFilters: ProductFilters = {}) => {
  const queryClient = useQueryClient();

  // 1. Fetch Main Products
  const productQuery = useQuery({
    queryKey: ["products", initialFilters],
    queryFn: () => listProduct(initialFilters),
    staleTime: 1000 * 60 * 5,
  });

  // 2. Fetch Product Groups (For Sidebar/Filters)
  const groupQuery = useQuery({
    queryKey: ["productGroups"],
    queryFn: fetchGroups,
    staleTime: 1000 * 60 * 30, // Groups change less often
  });

  // 3. Fetch Group Tags (Group1)
  const tagQuery = useQuery({
    queryKey: ["productTags"],
    queryFn: fetchGroupTags,
    staleTime: 1000 * 60 * 30,
  });

  const fetchProducts = async (filters: ProductFilters = {}) => {
    return await queryClient.fetchQuery({
      queryKey: ["products", filters],
      queryFn: () => listProduct(filters),
    });
  };

  return {
    // Product Data
    data: productQuery.data ?? { products: [], totalRecords: 0 },
    
    // Filter Metadata
    groups: groupQuery.data ?? [],
    tags: tagQuery.data ?? [],
    
    // Statuses
    isLoading: productQuery.isLoading || groupQuery.isLoading || tagQuery.isLoading,
    isFetching: productQuery.isFetching,
    
    // Error states (Optional but helpful)
    isError: productQuery.isError || groupQuery.isError || tagQuery.isError,
    
    fetchProducts, 
  };
};