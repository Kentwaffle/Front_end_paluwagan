import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { paymentApi } from "./ApiInstance";

export const usePostDynamic = (key) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ endpoint, data, isPayment = false }) => {
      const axiosInstance = isPayment ? paymentApi : api;
      const response = await axiosInstance.post(endpoint, data);

      console.log(
        `API Call [${isPayment ? "Payment" : "Main"}]:`,
        endpoint,
        "Payload:",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      if (key) {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
  });
};
