import { useInfiniteQuery } from "@tanstack/react-query";
import api from "./ApiInstance";

export const useInfiniteFetch = (queryKey, endpoint, options = {}) => {
  const apiKey = Array.isArray(queryKey) ? queryKey : [queryKey];
  return useInfiniteQuery({
    queryKey: apiKey,
    queryFn: async ({ pageParam = 0 }) => {
      const separator = endpoint.includes("?") ? "&" : "?";

      const res = await api.get(
        `${endpoint}${separator}page=${pageParam}&size=10`,
      );

      console.log(`Payload for page ${pageParam}: ${apiKey}`, res.data);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.allPayments || lastPage;

      if (!pagination || pagination.last === true) {
        return undefined;
      }

      const currentPage =
        typeof pagination.currentPage === "number"
          ? pagination.currentPage
          : typeof pagination.number === "number"
            ? pagination.number
            : 0;

      return currentPage + 1;
    },
    ...options,
  });
};
