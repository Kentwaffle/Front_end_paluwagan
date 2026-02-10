import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

// Hooks/SSE.js
export const useLoanSSE = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let eventSource;
    let reconnectTimeout;

    const connect = () => {
      eventSource = new EventSource(API_ENDPOINTS.SSE);

      const handleUpdate = (event) => {
        console.log("Realtime update received!");
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0].includes("api/admin/loan"),
        });
      };

      eventSource.addEventListener("loan-update", handleUpdate);
      eventSource.onopen = () => {
        console.log("SSE Connected successfully");
      };

      eventSource.onerror = (err) => {
        console.error("SSE Connection failed:", err);
        eventSource.close();

        console.log("Reconnecting in 3 seconds...");
        reconnectTimeout = setTimeout(() => {
          connect();
        }, 3000);
      };
    };
    connect();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [queryClient]);
};
