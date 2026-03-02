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
            const queryKey = query.queryKey;
            const keyString = JSON.stringify(queryKey);

            return (
              keyString.includes("api/admin/loan") ||
              keyString.includes("admin-loans") ||
              keyString.includes("api/admin/savings/members") ||
              keyString.includes("/api/savings/summary") ||
              keyString.includes("user-status-key") ||
              keyString.includes("admin-loan-counts") ||
              (savingsId &&
                keyString.includes(
                  `/api/admin/savings/payment/filter/${savingsId}`,
                )) ||
              keyString.includes("/api/profile/info") ||
              keyString.includes("/edit_profile") ||
              keyString.includes("/header")
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
