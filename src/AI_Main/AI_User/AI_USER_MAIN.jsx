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
import { usePostData } from "../../serviceToApi/PostData";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { useFetchData } from "../../serviceToApi/fetchData";
import { useQueryClient } from "@tanstack/react-query";
import Beep from "../../assets/images/Cs/Beep.png";
import { formatDateTime } from "../../reusableComponents/Utils/TimeDateformat";
import { useChatSSE } from "../../reusableComponents/Hooks/ChatSSE";
import { useAutoScroll } from "../../reusableComponents/Hooks/useAutoScroll";
function AI_USER_MAIN() {
  const [ticketId, setTicketId] = useState(() => {
    return sessionStorage.getItem("user_active_ticket_id") || "";
  });

  const queryClient = useQueryClient();
  useChatSSE(ticketId);
  useEffect(() => {
    if (ticketId) {
      sessionStorage.setItem("user_active_ticket_id", ticketId);
    } else {
      sessionStorage.removeItem("user_active_ticket_id");
    }
  }, [ticketId]);

  const { mutate: requestMutate, isPending } = usePostData(
    API_ENDPOINTS.CS.USER.REQUEST_POST,
    "cs_request",
  );

  const { formData: user, handleChange: handleChangeUser } = useForm({
    message: "",
  });

  const { data: messages } = useFetchData(
    ticketId ? ["cs_messages", ticketId] : ["cs_messages"],
    API_ENDPOINTS.CS.USER.GET_MESSAGES_USER,
  );

  const handleSendMessage = async () => {
    if (!user.message.trim() || isPending) return;

    requestMutate(user, {
      onSuccess: (data) => {
        console.log("User Response Success payload:", data);
        const actualTicketId = data?.ticketId || data?.data?.ticketId;

        if (actualTicketId) {
          setTicketId(actualTicketId);
          queryClient.refetchQueries({
            queryKey: ["cs_messages_admin", actualTicketId],
          });
          queryClient.refetchQueries({
            queryKey: ["cs_messages", actualTicketId],
          });
        } else {
          queryClient.refetchQueries({ queryKey: ["cs_messages"] });
        }

        queryClient.invalidateQueries({ queryKey: ["queue_list"] });
        user.message = "";
      },
      onError: (error) => {
        console.error("User Send Error:", error);
      },
    });
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
          <input
            type="text"
            name="message"
            value={user.message}
            onChange={handleChangeUser}
            placeholder="Type your message..."
            className="outline-none flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 dark:text-white"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={handleSendMessage}
            className="bg-sky-500 text-white p-2 rounded-xl hover:bg-sky-600 transition-all"
          >
            {isPending ? (
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
