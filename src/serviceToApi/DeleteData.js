import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./ApiInstance";

export const useDeleteData = (endpoint, key) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.delete(endpoint, { data: payload });
      console.log(`API Delete Response: ${endpoint}`, response.data);
      return response.data;
    },
    onSuccess: () => {
      if (key) {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
  });
};
