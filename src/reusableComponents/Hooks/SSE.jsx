import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

export const useLoanSSE = (shouldConnect, savingsId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!shouldConnect) return;

    let eventSource;
    let reconnectTimeout;

    // 1. I-define ang handleUpdate sa labas ng connect()
    // para ma-access siya ng cleanup function sa ibaba.
    const handleUpdate = (event) => {
      console.log("Realtime update received!", event.data);

      // Opsyonal: Magdagdag ng maliit na delay para hindi sumabog ang requests
      setTimeout(() => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            // Kunin ang key, siguraduhing string ito
            const key = Array.isArray(query.queryKey)
              ? query.queryKey[0]
              : query.queryKey;

            if (typeof key !== "string") return false;

            return (
              key.includes("api/admin/loan") ||
              key.includes("admin-loans") ||
              key.includes("/api/savings/summary") ||
              key.includes("/api/user/status") ||
              key.includes("admin-loan-counts") ||
              (savingsId &&
                key.includes(
                  `/api/admin/savings/payment/filter/${savingsId}`,
                )) ||
              key.includes("/api/profile/info") ||
              key.includes("/edit_profile") ||
              key.includes("/header")
            );
          },
        });
      }, 500);
    };

    const connect = () => {
      console.log("Attempting SSE connection...");
      if (eventSource?.readyState === 1) return;
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
  }, [shouldConnect, savingsId]);
};
