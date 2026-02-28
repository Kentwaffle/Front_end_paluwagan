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
    staleTime: 3000, // Hindi siya magre-refetch sa loob ng 3 segundo kahit mag-mount ang component
    ...otherOptions,
  });
};
