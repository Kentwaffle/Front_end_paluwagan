import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "./ApiInstance";

// fetchData.js
export const useFetchData = (key, endpoint, options = {}) => {
  const { enabled, ...otherOptions } = options;

  const finalizedQueryKey = Array.isArray(key) ? key : [key];

  return useQuery({
    queryKey: finalizedQueryKey,
    queryFn: async ({ queryKey }) => {
      const response = await api.get(endpoint);
      console.log("Fetching data for:", queryKey, response.data);
      return response.data;
    },
    enabled: (enabled !== undefined ? enabled : true) && !!endpoint,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: keepPreviousData,
    ...otherOptions,
  });
};
