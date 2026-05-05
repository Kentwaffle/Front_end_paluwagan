import { useQuery } from "@tanstack/react-query";
import api from "./ApiInstance";

// fetchData.js
export const useFetchData = (key, endpoint, options = {}) => {
  const { enabled, ...otherOptions } = options;

  return useQuery({
    queryKey: [key],
    queryFn: async ({ queryKey }) => {
      const response = await api.get(endpoint);
      console.log("Fetching data for:" + queryKey, response.data);
      return response.data;
    },
    enabled: (enabled !== undefined ? enabled : true) && !!endpoint,
    // DAGDAG ITO:
    staleTime: 1000 * 60 * 5, // 5 Minutes: Mananatiling "fresh" ang data at walang re-fetch.
    gcTime: 1000 * 60 * 10, // 10 Minutes: Itatago sa cache bago burahin.
    refetchOnWindowFocus: false, // Iwasan ang re-fetch tuwing babalik ka sa tab mula sa DevTools.
    retry: 1, // Hindi siya magre-refetch sa loob ng 3 segundo kahit mag-mount ang component
    ...otherOptions,
  });
};
