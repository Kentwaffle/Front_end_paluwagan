import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

export const useLoanSSE = (shouldConnect) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!shouldConnect) return;

    let eventSource;
    let reconnectTimeout;

    // 1. I-define ang handleUpdate sa labas ng connect()
    // para ma-access siya ng cleanup function sa ibaba.
    const handleUpdate = (event) => {
      console.log("Realtime update received!", event.data);
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0].includes("api/admin/loan") ||
          query.queryKey[0].includes("/api/savings/summary") ||
          query.queryKey[0].includes("/api/user/status"),
      });
    };

    const connect = () => {
      console.log("Attempting SSE connection...");
      eventSource = new EventSource(API_ENDPOINTS.SSE);

      eventSource.addEventListener("loan-update", handleUpdate);

      eventSource.onopen = () => {
        console.log("SSE Connected successfully");
      };

      eventSource.onerror = (err) => {
        console.error("SSE Connection failed:", err);
        eventSource.close();
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    // 2. Cleanup Function
    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) {
        // Ngayon, kilala na ni cleanup si handleUpdate
        eventSource.removeEventListener("loan-update", handleUpdate);
        eventSource.close();
        console.log("SSE Connection closed");
      }
    };
  }, [queryClient, shouldConnect]);
};
