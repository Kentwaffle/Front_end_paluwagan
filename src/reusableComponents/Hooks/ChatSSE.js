import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getWebSocketUrl } from "../../serviceToApi/ApiEndpoint";

// Ensure global window reference for sockjs-client compatibility if needed in browser
if (typeof window !== "undefined" && !window.global) {
  window.global = window;
}

export const useChatWebSocket = (ticketId) => {
  const queryClient = useQueryClient();
  const clientRef = useRef(null);

  useEffect(() => {
    const wsUrl = getWebSocketUrl();
    console.log(`🔌 STOMP WebSocket Attempting Connection to: ${wsUrl}`);

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => {
        if (import.meta.env.DEV) {
          console.log("[STOMP Debug]", msg);
        }
      },
      onConnect: () => {
        console.log("✅ STOMP WebSocket Connected Successfully!");

        // Refetch queries on connection/reconnection to ensure cache is fresh
        if (ticketId) {
          queryClient.invalidateQueries({
            queryKey: ["cs_messages_admin", ticketId],
          });
          queryClient.refetchQueries({
            queryKey: ["cs_messages_admin", ticketId],
          });
          queryClient.invalidateQueries({
            queryKey: ["cs_messages", ticketId],
          });
          queryClient.refetchQueries({
            queryKey: ["cs_messages", ticketId],
          });
        }
        queryClient.invalidateQueries({ queryKey: ["queue_list"] });

        // Subscribe to ticket-specific topic if ticketId exists
        if (ticketId) {
          const destination = `/topic/chat/${ticketId}`;
          console.log(`📡 STOMP Subscribed to topic: ${destination}`);

          client.subscribe(destination, (frame) => {
            console.log("📩 STOMP Incoming Frame:", frame.body);

            try {
              let parsedMessage = null;
              if (frame.body) {
                parsedMessage = JSON.parse(frame.body);
              }

              // Optimistically update React Query cache if message object exists
              if (parsedMessage && (parsedMessage.message || parsedMessage.msg)) {
                const newMsgObj = {
                  id: parsedMessage.id || Date.now(),
                  ticketId: parsedMessage.ticketId || ticketId,
                  sentBy: parsedMessage.sentBy || "USER",
                  senderName: parsedMessage.senderName || "",
                  profileImage: parsedMessage.senderProfileImage || parsedMessage.profileImage || "",
                  message: parsedMessage.message || parsedMessage.msg,
                  createdAt: parsedMessage.createdAt || new Date().toISOString(),
                };

                // Update User messages cache
                queryClient.setQueryData(["cs_messages", ticketId], (oldData) => {
                  if (!oldData) return { messages: [newMsgObj] };
                  const existingList = Array.isArray(oldData)
                    ? oldData
                    : oldData.messages || oldData.payload?.messages || [];

                  // Avoid duplicates
                  const exists = existingList.some(
                    (m) =>
                      (m.id && m.id === newMsgObj.id) ||
                      (m.createdAt === newMsgObj.createdAt && m.message === newMsgObj.message)
                  );

                  if (exists) return oldData;

                  if (Array.isArray(oldData)) return [...oldData, newMsgObj];
                  return {
                    ...oldData,
                    messages: [...existingList, newMsgObj],
                  };
                });

                // Update Admin messages cache
                queryClient.setQueryData(["cs_messages_admin", ticketId], (oldData) => {
                  if (!oldData) return [newMsgObj];
                  const existingList = Array.isArray(oldData)
                    ? oldData
                    : oldData.messages || oldData.payload?.messages || [];

                  const exists = existingList.some(
                    (m) =>
                      (m.id && m.id === newMsgObj.id) ||
                      (m.createdAt === newMsgObj.createdAt && m.message === newMsgObj.message)
                  );

                  if (exists) return oldData;

                  if (Array.isArray(oldData)) return [...oldData, newMsgObj];
                  return {
                    ...oldData,
                    messages: [...existingList, newMsgObj],
                  };
                });
              }
            } catch (err) {
              console.error("Error processing incoming STOMP frame:", err);
            }

            // Always invalidate/refetch queries to synchronize state
            queryClient.invalidateQueries({
              queryKey: ["cs_messages_admin", ticketId],
            });
            queryClient.refetchQueries({
              queryKey: ["cs_messages_admin", ticketId],
            });
            queryClient.invalidateQueries({
              queryKey: ["cs_messages", ticketId],
            });
            queryClient.refetchQueries({
              queryKey: ["cs_messages", ticketId],
            });
            queryClient.invalidateQueries({ queryKey: ["queue_list"] });
          });
        }
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame.headers["message"], frame.body);
      },
      onWebSocketError: (err) => {
        console.error("❌ STOMP WebSocket Connection Error:", err);
      },
      onDisconnect: () => {
        console.log("🔌 STOMP Disconnected");
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        console.log("🔌 Deactivating STOMP client");
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [ticketId, queryClient]);

  return clientRef.current;
};

// Backwards compatibility export so existing useChatSSE calls work seamlessly
export const useChatSSE = useChatWebSocket;
