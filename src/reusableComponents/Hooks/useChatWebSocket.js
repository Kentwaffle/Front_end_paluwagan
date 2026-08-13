import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

export const useChatWebSocket = (ticketId) => {
  const queryClient = useQueryClient();
  const clientRef = useRef(null);

  useEffect(() => {
    if (!ticketId) return;

    const wsEndpoint =
      API_ENDPOINTS.CHAT_WS || "https://api.savingsandloan.online/ws";

    console.log(
      `📡 [WebSocket] Connecting STOMP over SockJS to ${wsEndpoint} for ticket #${ticketId}`
    );

    const client = new Client({
      webSocketFactory: () => new SockJS(wsEndpoint),
      reconnectDelay: 5000,
      debug: (msg) => {
        if (import.meta.env.DEV) {
          console.log("[STOMP Debug]", msg);
        }
      },
      onConnect: () => {
        console.log(
          `✅ [WebSocket] STOMP Connected successfully! Subscribing to /topic/chat/${ticketId}`
        );

        client.subscribe(`/topic/chat/${ticketId}`, (stompMessage) => {
          try {
            const body = JSON.parse(stompMessage.body);
            console.log("📩 [WebSocket] Real-time message received:", body);

            // 1. Instantly refetch User Chat Messages
            queryClient.invalidateQueries({
              queryKey: ["cs_messages", ticketId],
            });
            queryClient.refetchQueries({
              queryKey: ["cs_messages", ticketId],
            });

            // 2. Instantly refetch Admin Chat Messages
            queryClient.invalidateQueries({
              queryKey: ["cs_messages_admin", ticketId],
            });
            queryClient.refetchQueries({
              queryKey: ["cs_messages_admin", ticketId],
            });

            // 3. Update Queue List if Admin is listening
            queryClient.invalidateQueries({
              queryKey: ["queue_list"],
            });
          } catch (err) {
            console.error("❌ [WebSocket] Error processing message body:", err);
          }
        });
      },
      onDisconnect: () => {
        console.log(`🔌 [WebSocket] STOMP Disconnected for ticket #${ticketId}`);
      },
      onWebSocketError: (error) => {
        console.error("❌ [WebSocket] WebSocket Error:", error);
      },
      onStompError: (frame) => {
        console.error(
          "❌ [WebSocket] STOMP Protocol Error Header:",
          frame.headers["message"],
          frame.body
        );
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        console.log(
          `🔌 [WebSocket] Deactivating STOMP connection for ticket #${ticketId}`
        );
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [ticketId, queryClient]);

  return clientRef.current;
};
