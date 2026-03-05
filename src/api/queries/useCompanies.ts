import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../api-config";
import { api } from "../axios-client";

export interface Company {
  IniTial: string;
  CompanyName: string;
 
}

export interface selectCompany {
  name: string;
  registrationNumber?: string;
}


const listCompany = async (): Promise<Company[]> => {
  const { data } = await api.get(API_ENDPOINTS.COMPANY.LIST,);
  return data.data;
};

const selectCompany = async (param:string): Promise<Company> => {
  const { data } = await api.get(API_ENDPOINTS.COMPANY.SELECT_COMPANY(param));
  return data.data;
};


export const useCompanies = () => {
  const queryClient = useQueryClient();

  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: listCompany,

    enabled: false, 
    staleTime: 1000 * 60 * 5, 
  });

 
  const createMutation = useMutation({
    mutationFn: selectCompany,
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });

      queryClient.setQueryData(["companies"], (old: Company[] | undefined) => 
        old ? [...old, newCompany] : [newCompany]
      );
    },
    onError: (error) => {
      console.error("Failed to create company:", error);
    }
  });

  return {
    // Data & State
    companies: companiesQuery.data ?? [],
    isLoading: companiesQuery.isLoading,
    isFetching: companiesQuery.isFetching,
    isError: companiesQuery.isError,

    // Actions
    listCompany: companiesQuery.refetch, 
    selectCompany: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};