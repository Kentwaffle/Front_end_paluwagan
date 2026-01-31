import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./ApiInstance";

export const usePatchData = (endpoint, successKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.patch(endpoint, payload);
      console.log(`API Response: ${endpoint}`, response.data);
      return response.data;
    },
    onSuccess: () => {
      if (successKey) {
        queryClient.invalidateQueries({ queryKey: [successKey] });
      }
    },
  });
};
