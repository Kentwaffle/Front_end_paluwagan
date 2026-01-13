import { useQuery } from "@tanstack/react-query";
import api from "./ApiInstance";

export const useFetchData = (key, endpoint) => {
  return useQuery({
    queryKey: [key],
    queryFn: async ({ queryKey }) => {
      const response = await api.get(endpoint);
      console.log(`API Response: ${queryKey}`, response.data);
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
