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
    // Kung walang logged-in user at walang ticket, huwag muna kumonekta
    if (!currentUserId && !ticketId) return;

    let eventSource;
    let reconnectTimeout;
    let debounceTimeout;

    const handleChatUpdate = (event) => {
      console.log(`[⚡ SSE EVENT] Tinamaan ang event: ${event.type}`);

      let eventTicketId = null;

      // 🔍 Extraction Logic ng Ticket ID mula sa dynamic payload ng backend
      try {
        if (event.data) {
          let parsedData = event.data;
          if (typeof event.data === "string") {
            parsedData = JSON.parse(event.data);
          }

          console.log("📄 [SSE Deep Debug] Parsed Data Object:", parsedData);

          eventTicketId =
            parsedData?.ticketId ||
            parsedData?.payload?.ticketId ||
            parsedData?.data?.ticketId ||
            parsedData?.payload?.messages?.[0]?.ticketId ||
            parsedData?.messages?.[0]?.ticketId;
        }
      } catch (error) {
        console.log(
          "⚠️ [SSE] Error sa pagkuha ng ticketId mula sa data:",
          error,
        );
      }

      console.log(`🎯 [SSE Extracted Key] Target Ticket ID:`, eventTicketId);

      // Debounce para maiwasan ang sunod-sunod na refetch sa database
      if (debounceTimeout) clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(() => {
        console.log(
          "🔄 [SSE Trigger] Pwersahang nililinis ang Chat cache frames...",
        );

        const targetId = eventTicketId || ticketId;

        if (targetId) {
          console.log(
            `🎯 [Targeted Refetch] Gisingin ang chat para kay Ticket: ${targetId}`,
          );

          // 🚀 I-REFRESH ANG ADMIN QUERIES
          queryClient.invalidateQueries({
            queryKey: ["cs_messages_admin", targetId],
          });
          queryClient.refetchQueries({
            queryKey: ["cs_messages_admin", targetId],
          });

          // 🚀 I-REFRESH ANG USER QUERIES
          queryClient.invalidateQueries({
            queryKey: ["cs_messages", targetId],
          });
          queryClient.refetchQueries({
            queryKey: ["cs_messages", targetId],
          });
        } else {
          console.log(
            "⚠️ [Fallback Refetch] Malawakang paglilinis ng cache...",
          );
          queryClient.invalidateQueries({ queryKey: ["cs_messages_admin"] });
          queryClient.invalidateQueries({ queryKey: ["cs_messages"] });
        }

        // Laging siguraduhing updated ang listahan ng pila (Queue) ng Admin
        queryClient.invalidateQueries({ queryKey: ["queue_list"] });
      }, 300);
    };

    const connect = () => {
      let sseUrl;

      // 🎯 DYNAMIC URL DISKARTE:
      // Kung may ticketId, pumasok sa room subscription ng ticket.
      // Kung wala pero may currentUserId, kumonekta gamit ang User ID channel endpoint natin.
      if (ticketId) {
        sseUrl = API_ENDPOINTS.CHATSSE(ticketId);
      } else {
        return;
      }

      console.log(`🔌 Tinatangkang kumonekta sa SSE Stream: ${sseUrl}`);
      eventSource = new EventSource(sseUrl);

      // --- MGA LISTENERS ---

      // 1. Nakikinig sa general admin alert notifications
      eventSource.addEventListener("chat-notification", handleChatUpdate);

      // 2. Nakikinig sa User ID specific channel (Kapag Spring Boot gamit ang user ID mo)
      if (currentUserId) {
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
      }

      // 3. Nakikinig sa Ticket Room stream identifier (Kapag nag-uusap na si Admin at User)
      if (ticketId) {
        eventSource.addEventListener(
          `chat-message-${ticketId}`,
          handleChatUpdate,
        );
      }

      eventSource.onopen = () => {
        console.log(
          `[SSE Connected] Nakabukas ang stream listener para sa real-time updates!`,
        );
      };

      eventSource.onerror = (err) => {
        console.error("[SSE Error] Reconnecting sa loob ng 3 segundo...", err);
        eventSource.close();
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    // Cleanup phase tuwing mag-a-unmount ang component o magbabago ang dependencies
    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (debounceTimeout) clearTimeout(debounceTimeout);
      if (eventSource) {
        eventSource.close();
        console.log(
          "[SSE Disconnected] Sinara ang EventSource connection safely.",
        );
      }
    };
  }, [ticketId, currentUserId, queryClient]);
};
