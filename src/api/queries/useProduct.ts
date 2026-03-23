import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../api-config";
import { api } from "../axios-client";
import type { ProductListResponse } from "../../types/product";

export interface ProductFilters {
  "Context.ProductId"?: number;
  "Context.ProductGrpIds"?: string;
  Skip?: number;
  Take?: number;
  SearchKey?: string | null;
  SelectAll?: boolean;
}

/* --- API Functions --- */

const listProduct = async (
  filters: ProductFilters = {},
): Promise<ProductListResponse> => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCT.LIST, {
    params: filters,
  });
  return {
    products: Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [],
    totalRecords: data.totalrecords || 0,
  };
};

const fetchProductDetails = async (id: string | number) => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCT.DETAILS(id));
  const result = data.data || data;
  return Array.isArray(result) ? result[0] : result;
};

const fetchGroups = async () => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCT.GROUP);
  return data.data || data;
};

const fetchGroupTags = async () => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCT.GROUP1);
  return data.data || data;
};

const fetchExport = async () => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCT.EXPORT, {
    responseType: "blob",
  });
  return data;
};

export const useProduct = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductDetails(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useProducts = (initialFilters: ProductFilters = {}) => {
  const queryClient = useQueryClient();

  const productQuery = useQuery({
    queryKey: ["products", initialFilters],
    queryFn: () => listProduct(initialFilters),
    staleTime: 1000 * 60 * 5,
  });

  const groupQuery = useQuery({
    queryKey: ["productGroups"],
    queryFn: fetchGroups,
    staleTime: 1000 * 60 * 30,
  });

  const tagQuery = useQuery({
    queryKey: ["productTags"],
    queryFn: fetchGroupTags,
    staleTime: 1000 * 60 * 30,
  });

  const exportMutation = useMutation({
    mutationFn: fetchExport,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products_export.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Download failed:", error);
    },
  });

  const fetchProducts = async (filters: ProductFilters = {}) => {
    return await queryClient.fetchQuery({
      queryKey: ["products", filters],
      queryFn: () => listProduct(filters),
    });
  };

  const getSingleProduct = async (id: string | number) => {
    return await queryClient.fetchQuery({
      queryKey: ["product", id],
      queryFn: () => fetchProductDetails(id),
    });
  };

  return {
    // Data
    data: productQuery.data ?? { products: [], totalRecords: 0 },
    groups: groupQuery.data ?? [],
    tags: tagQuery.data ?? [],
    export: exportMutation.data ?? [],

    // Statuses
    isLoading:
      productQuery.isLoading || groupQuery.isLoading || tagQuery.isLoading,
    isFetching: productQuery.isFetching,
    isError:
      productQuery.isError ||
      groupQuery.isError ||
      tagQuery.isError ||
      exportMutation.isError,

    // Methods
    handleExport: exportMutation.mutateAsync,
    fetchProducts,
    getSingleProduct,
  };
};
