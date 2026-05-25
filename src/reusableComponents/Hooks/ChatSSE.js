import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../auth/Auth";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

export const useChatSSE = (ticketId) => {
  const queryClient = useQueryClient();
  const authContext = useAuth();
  const user = authContext?.user;

  const currentUserId = user?.id || user?.userId || user?._id;

  useEffect(() => {
    // ✅ FIX: currentUserId lang ang kailangan para makapasok
    // kahit walang ticketId pa, para makakonekta ang globalEventSource
    if (!currentUserId) return;

    let eventSource;
    let globalEventSource = null;
    let reconnectTimeout;
    let globalReconnectTimeout;
    let debounceTimeout;

    const handleChatUpdate = (event) => {
      console.log(`SSE EVENT: ${event.type}`);

      let eventTicketId = null;

      try {
        if (event.data) {
          let parsedData = event.data;
          if (typeof event.data === "string") {
            parsedData = JSON.parse(event.data);
          }

          console.log("SSE Deep Debug:", parsedData);

          eventTicketId =
            parsedData?.ticketId ||
            parsedData?.payload?.ticketId ||
            parsedData?.data?.ticketId ||
            parsedData?.payload?.messages?.[0]?.ticketId ||
            parsedData?.messages?.[0]?.ticketId;
        }
      } catch (error) {
        console.log(" [SSE] Error :", error);
      }

      console.log(`SSE Key:`, eventTicketId);

      if (debounceTimeout) clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(() => {
        console.log("SSE Trigger");

        const targetId = eventTicketId || ticketId;

        if (targetId) {
          console.log(`Targeted Refetch: ${targetId}`);

          queryClient.invalidateQueries({
            queryKey: ["cs_messages_admin", targetId],
          });
          queryClient.refetchQueries({
            queryKey: ["cs_messages_admin", targetId],
          });

          queryClient.invalidateQueries({
            queryKey: ["cs_messages", targetId],
          });
          queryClient.refetchQueries({
            queryKey: ["cs_messages", targetId],
          });
        } else {
          console.log("Fallback Refetch");
          queryClient.invalidateQueries({ queryKey: ["cs_messages_admin"] });
          queryClient.invalidateQueries({ queryKey: ["cs_messages"] });
        }

        queryClient.invalidateQueries({ queryKey: ["queue_list"] });
      }, 300);
    };

    // ─────────────────────────────────────────────────────────────
    // TICKET-SPECIFIC SSE — /api/cs/ticket/{ticketId}/subscribe
    // Kokonekta lang kung may ticketId
    // ─────────────────────────────────────────────────────────────
    const connect = () => {
      if (!ticketId) return; // walang ticketId, huwag mag-connect

      const sseUrl = API_ENDPOINTS.CHATSSE(ticketId);
      console.log(`Tinatangkang kumonekta sa SSE Stream: ${sseUrl}`);
      eventSource = new EventSource(sseUrl);

      eventSource.addEventListener("chat-notification", handleChatUpdate);

      eventSource.addEventListener(
        `chat-message-${currentUserId}`,
        handleChatUpdate,
      );
      eventSource.addEventListener(
        `ticket-open-${currentUserId}`,
        handleChatUpdate,
      );
      eventSource.addEventListener(
        `ticket-closed-${currentUserId}`,
        handleChatUpdate,
      );

      eventSource.onopen = () => {
        console.log(`SSE Connected ${ticketId}`);
        // ✅ Mag-refetch agad kapag nag-reconnect
        queryClient.invalidateQueries({ queryKey: ["cs_messages", ticketId] });
        queryClient.refetchQueries({ queryKey: ["cs_messages", ticketId] });
        queryClient.invalidateQueries({
          queryKey: ["cs_messages_admin", ticketId],
        });
        queryClient.refetchQueries({
          queryKey: ["cs_messages_admin", ticketId],
        });
      };

      eventSource.onerror = (err) => {
        console.error("SSE Error", err);
        eventSource.close();
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    // ─────────────────────────────────────────────────────────────
    // GLOBAL SSE — /api/loan/updates
    // Laging kokonekta kahit walang ticketId pa
    // Para sa: new-ticket-queue (admin queue notifications)
    // ─────────────────────────────────────────────────────────────
    const connectGlobal = () => {
      const globalUrl = API_ENDPOINTS.SSE;
      console.log(`Trying to reconnect to Global SSE Stream: ${globalUrl}`);

      globalEventSource = new EventSource(globalUrl);
      globalEventSource.addEventListener("new-ticket-queue", handleChatUpdate);

      globalEventSource.onopen = () => {
        console.log(`Global SSE Connected.`);
      };

      globalEventSource.onerror = (err) => {
        console.error("Global SSE Error", err);
        globalEventSource.close();
        globalReconnectTimeout = setTimeout(connectGlobal, 3000);
      };
    };

    connect();
    connectGlobal();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (globalReconnectTimeout) clearTimeout(globalReconnectTimeout);
      if (debounceTimeout) clearTimeout(debounceTimeout);
      if (eventSource) {
        eventSource.close();
        console.log("SSE Disconnected");
      }
      if (globalEventSource) {
        globalEventSource.close();
        console.log("Global SSE Disconnected");
      }
    };
  }, [ticketId, currentUserId, queryClient]);
};
