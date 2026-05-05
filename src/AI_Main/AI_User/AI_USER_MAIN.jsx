import React, { useState } from "react";
import ChatMessage from "../ChatMessage";
import { SendHorizonal } from "lucide-react";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { usePostData } from "../../serviceToApi/PostData";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { useFetchData } from "../../serviceToApi/fetchData";
import { useQueryClient } from "@tanstack/react-query";
import Beep from "../../assets/images/Cs/Beep.png";
import { formatDateTime } from "../../reusableComponents/Utils/TimeDateformat";

function AI_USER_MAIN() {
  const [ticketId, setTicketId] = useState(null);
  const [liveChat, setLiveChat] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: requestMutate, isPending } = usePostData(
    API_ENDPOINTS.CS.USER.REQUEST_POST,
    "cs_request",
  );
  const {
    formData: user,
    handleChange: handleChangeUser,
    handleSubmit: handleSubmitUser,
  } = useForm({
    message: "",
  });

  const { data: messages } = useFetchData(
    "cs_messages",
    API_ENDPOINTS.CS.GET_MESSAGES,
  );

  const handleSendMessage = async () => {
    if (!user.message.trim() || isPending) return;

    requestMutate(user, {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["cs_messages"]);
        user.message = "";
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pb-28">
        <ChatMessage
          isSender={false}
          message="Kamusta! Ako si Beep AI. Paano kita matutulungan sa iyong account?"
          profile={getProfileImage(Beep)} // O yung bot icon mo
          timeCurrent="System"
        />
        {messages?.messages.map((msg, index) => (
          <ChatMessage
            key={index}
            isSender={msg.sentBy === "USER" ? true : false}
            message={msg.message}
            profile={
              msg.sentBy === "Peep" ? getProfileImage(Beep) : getProfileImage()
            }
            timeCurrent={formatDateTime(messages?.messages?.[0]?.createdAt)}
          />
        ))}
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
            onClick={() => handleSendMessage()}
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
