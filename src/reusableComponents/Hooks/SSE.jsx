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

            if (
              queryKey.includes("cs_messages") ||
              queryKey.includes("cs_messages_admin") ||
              queryKey.includes("queue_list")
            ) {
              return false; // 👈 Huwag itong galawin ng Loan SSE! Ligtas dapat ang Chat!
            }

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
              keyString.includes("/userProfile") ||
              keyString.includes("notification_list/markOnce") ||
              keyString.includes("notification_list") ||
              keyString.includes("notifcount") ||
              keyString.includes("memberList-overview")
            );
          },
        });
      }, 500);
    };

    const handleNewTicketQueue = (event) => {
      console.log("Realtime new-ticket-queue update received via SSE!", event.data);
      queryClient.invalidateQueries({ queryKey: ["queue_list"] });
    };

    const connect = () => {
      console.log("Attempting SSE connection...");
      if (eventSource?.readyState === 1) return;
      eventSource = new EventSource(API_ENDPOINTS.SSE);

      eventSource.addEventListener("loan-update", handleUpdate);
      eventSource.addEventListener("new-ticket-queue", handleNewTicketQueue);

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
        // Ngayon, kilala na ni cleanup si handleUpdate at handleNewTicketQueue
        eventSource.removeEventListener("loan-update", handleUpdate);
        eventSource.removeEventListener("new-ticket-queue", handleNewTicketQueue);
        eventSource.close();
        console.log("SSE Connection closed");
      }
    };
  }, [shouldConnect, savingsId, queryClient, isLoan, user]);
};
