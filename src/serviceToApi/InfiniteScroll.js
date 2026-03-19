import { useInfiniteQuery } from "@tanstack/react-query";
import api from "./ApiInstance";

export const useInfiniteFetch = (queryKey, endpoint, options = {}) => {
  return useInfiniteQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async ({ pageParam = 0 }) => {
      // 1. Check kung may '?' na sa endpoint (halimbawa: search?name=kent)
      const separator = endpoint.includes("?") ? "&" : "?";

      // 2. Dito natin idudugtong yung page params nang tama
      const res = await api.get(
        `${endpoint}${separator}page=${pageParam}&size=10`,
      );

      console.log(`Payload for page ${pageParam}:`, res.data);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    ...options,
  });
};
