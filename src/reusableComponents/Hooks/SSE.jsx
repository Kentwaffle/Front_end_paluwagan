import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

// Hooks/SSE.js
export const useLoanSSE = (queryKeyToInvalidate) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(API_ENDPOINTS.SSE);
    if (!queryKeyToInvalidate) return;

    const handleUpdate = (event) => {
      queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] });
    };

    eventSource.addEventListener("loan-update", handleUpdate);

    eventSource.onerror = (err) => {
      console.error("SSE Connection failed:", err);
    };

    return () => {
      eventSource.removeEventListener("loan-update", handleUpdate);
      eventSource.close();
    };
  }, [queryClient, queryKeyToInvalidate]);
};
