import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useAuth } from "../../auth/Auth";
export const useLoanSSE = (shouldConnect, savingsId, isLoan) => {
  const queryClient = useQueryClient();
  const authContext = useAuth();
  const user = authContext?.user;

  useEffect(() => {
    if (!user) return;
    console.log("SSE Hook URL:", API_ENDPOINTS.SSE);
    if (!shouldConnect) return;

    let eventSource;
    let reconnectTimeout;

    const handleUpdate = (event) => {
      console.log("Realtime update received!", event.data);
      const currentSearchKey = isLoan ? "searchLoan" : "searchSavings";
      setTimeout(() => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey;
            const keyString = JSON.stringify(queryKey);

            return (
              keyString.includes(currentSearchKey) ||
              keyString.includes("api/admin/loan") ||
              keyString.includes("admin-loans") ||
              keyString.includes("api/admin/savings/members") ||
              keyString.includes("/api/savings/summary") ||
              keyString.includes("user-status-key") ||
              keyString.includes("admin-loan-counts") ||
              keyString.includes("payments") ||
              (savingsId &&
                keyString.includes(
                  `/api/admin/savings/payment/filter/${savingsId}`,
                )) ||
              keyString.includes("/api/profile/info") ||
              keyString.includes("/edit_profile") ||
              keyString.includes("/header") ||
              keyString.includes("notification_list/markOnce") ||
              keyString.includes("notification_list") ||
              keyString.includes("notifcount") ||
              keyString.includes("memberList-overview")
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
  }, [shouldConnect, savingsId, queryClient, isLoan, user]);
};
