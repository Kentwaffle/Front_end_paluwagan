import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./ApiInstance";

export const usePatchData = (defaultEndpoint, successKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variable) => {
      const isUrlDynamic = typeof variable === "string";
      const targetUrl = isUrlDynamic ? variable : defaultEndpoint;
      const payload = isUrlDynamic ? null : variable;

      const response = await api.patch(targetUrl, payload);
      return response.data;
    },
    onSuccess: () => {
      if (successKey) {
        queryClient.invalidateQueries({ queryKey: [successKey] });
      }
    },
  });
};
