import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./ApiInstance";

export const usePutData = (endpoint, key) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.put(endpoint, payload);
      console.log(`API Response: ${endpoint}`, response.data);
      return response.data;
    },
    onSuccess: () => {
      if (key) {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
  });
};
