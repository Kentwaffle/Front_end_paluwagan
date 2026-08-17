import React, { useState, useEffect } from "react";
import ChatMessage from "../ChatMessage";
import {
  SendHorizonal,
  ChevronLeft,
  EllipsisVertical,
  Bug,
} from "lucide-react";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import api from "../../serviceToApi/ApiInstance";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { useFetchData } from "../../serviceToApi/fetchData";
import { useQueryClient } from "@tanstack/react-query";
import Beep from "../../assets/images/Cs/Beep.png";
import { formatDateTime } from "../../reusableComponents/Utils/TimeDateformat";
import { useChatWebSocket } from "../../reusableComponents/Hooks/ChatSSE";
import { useAutoScroll } from "../../reusableComponents/Hooks/useAutoScroll";

function AI_USER_MAIN() {
  const [ticketId, setTicketId] = useState(() => {
    return sessionStorage.getItem("user_active_ticket_id") || "";
  });
  const [isSending, setIsSending] = useState(false);

  const queryClient = useQueryClient();
  useChatWebSocket(ticketId);

  useEffect(() => {
    if (ticketId) {
      sessionStorage.setItem("user_active_ticket_id", ticketId);
    } else {
      sessionStorage.removeItem("user_active_ticket_id");
    }
  }, [ticketId]);

  const {
    formData: user,
    setFormData: setUserData,
    handleChange: handleChangeUser,
  } = useForm({
    message: "",
  });

  const { data: messages } = useFetchData(
    ticketId ? ["cs_messages", ticketId] : ["cs_messages"],
    API_ENDPOINTS.CS.USER.GET_MESSAGES_USER,
  );

  useEffect(() => {
    if (messages) {
      const fetchedTicketId = messages.ticketId || messages.payload?.ticketId;
      if (fetchedTicketId) {
        if (fetchedTicketId !== ticketId) {
          setTicketId(fetchedTicketId);
        }
      } else {
        if (ticketId) {
          setTicketId("");
        }
      }
    }
  }, [messages, ticketId]);

  const handleSendMessage = async () => {
    const text = user.message.trim();
    if (!text || isSending) return;

    setIsSending(true);
    const payload = { message: text };
    setUserData({ message: "" });

    try {
      const endpoint = ticketId
        ? API_ENDPOINTS.CS.USER.RESPONSE(ticketId)
        : API_ENDPOINTS.CS.USER.REQUEST_POST;

      const response = await api.post(endpoint, payload);
      const data = response.data;
      console.log("User Send Response:", data);

      const actualTicketId =
        data?.ticketId || data?.data?.ticketId || data?.payload?.ticketId || ticketId;

      if (actualTicketId && actualTicketId !== ticketId) {
        setTicketId(actualTicketId);
      }

      const activeId = actualTicketId || ticketId;
      if (activeId) {
        queryClient.invalidateQueries({ queryKey: ["cs_messages", activeId] });
        queryClient.refetchQueries({ queryKey: ["cs_messages", activeId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["cs_messages"] });
      }
      queryClient.invalidateQueries({ queryKey: ["queue_list"] });
    } catch (error) {
      console.error("User Send Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "";
      const isTicketError =
        errorMsg === "Ticket not found." ||
        errorMsg === "Ticket has already been closed." ||
        error.response?.status === 404 ||
        (error.response?.status === 500 && errorMsg.includes("Ticket not found"));

      if (isTicketError && ticketId) {
        console.warn("Session expired or ticket closed. Re-initiating chat...");
        setTicketId("");
        sessionStorage.removeItem("user_active_ticket_id");

        try {
          const fallbackResponse = await api.post(API_ENDPOINTS.CS.USER.REQUEST_POST, payload);
          const fallbackData = fallbackResponse.data;
          console.log("Fallback Send Response:", fallbackData);

          const newTicketId =
            fallbackData?.ticketId ||
            fallbackData?.data?.ticketId ||
            fallbackData?.payload?.ticketId;

          if (newTicketId) {
            setTicketId(newTicketId);
            queryClient.invalidateQueries({ queryKey: ["cs_messages", newTicketId] });
            queryClient.refetchQueries({ queryKey: ["cs_messages", newTicketId] });
          } else {
            queryClient.invalidateQueries({ queryKey: ["cs_messages"] });
          }
          queryClient.invalidateQueries({ queryKey: ["queue_list"] });
        } catch (fallbackError) {
          console.error("Fallback Send Error:", fallbackError);
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  const currentMessagesList =
    messages?.messages || messages?.payload?.messages || [];
  const messagesEndRef = useAutoScroll([currentMessagesList]);

  return (
    <div className="h-screen flex flex-col justify-between bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pb-28">
        <ChatMessage
          isSender={false}
          message="Kamusta! Ako si Beep AI. Paano kita matutulungan sa iyong account?"
          profile={getProfileImage(Beep)}
          timeCurrent="Peep"
        />
        {currentMessagesList.map((msg, index) => (
          <ChatMessage
            key={msg?.id || msg?._id || index}
            isSender={msg.sentBy === "USER"}
            message={msg.message || msg.msg || ""}
            profile={
              msg.sentBy === "Peep" ? getProfileImage(Beep) : getProfileImage()
            }
            timeCurrent={
              msg.sentBy === "Peep" ? "Peep" : formatDateTime(msg.createdAt)
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 w-full p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
          <textarea
            name="message"
            rows={1}
            value={user.message}
            onChange={handleChangeUser}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="outline-none flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 dark:text-white resize-none max-h-32 scrollbar-none py-1.5"
          />
          <button
            type="button"
            disabled={isSending}
            onClick={handleSendMessage}
            className="bg-sky-500 text-white p-2 rounded-xl hover:bg-sky-600 transition-all disabled:opacity-50"
          >
            {isSending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <SendHorizonal size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AI_USER_MAIN;
