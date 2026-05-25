import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  EllipsisVertical,
  UserRoundPen,
  PhoneMissed,
  MessageSquare,
  SendHorizonal,
} from "lucide-react";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../serviceToApi/fetchData";
import axios from "axios";
import { formatTimeAgo } from "../../reusableComponents/Utils/TimeDateformat";
import { useQueryClient } from "@tanstack/react-query";
import ChatMessage from "../ChatMessage";
import { formatDateTime } from "../../reusableComponents/Utils/TimeDateformat";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { usePostData } from "../../serviceToApi/PostData";
import { useChatSSE } from "../../reusableComponents/Hooks/ChatSSE";

function AI_ADMIN_MAIN() {
  const [view, setView] = useState("queue");
  const [claimedTicketId, setClaimedTicketId] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: queueList } = useFetchData(
    "queue_list",
    API_ENDPOINTS.CS.ADMIN.QUEUE_LIST,
  );

  const nextQueue = queueList?.payload?.next?.ticketId;
  const listQueue = queueList?.payload?.list || [];
  const currtentTicket = queueList?.payload?.current || null;
  const activeTicketId = currtentTicket?.ticketId || claimedTicketId;

  useChatSSE(activeTicketId);

  useEffect(() => {
    if (currtentTicket?.ticketId) {
      setView("ticket");
    }
  }, [currtentTicket]);

  const { mutate: adminResponse, isPending } = usePostData(
    API_ENDPOINTS.CS.ADMIN.RESPONSE_REPLY(activeTicketId),
    ["admin_response", activeTicketId],
  );

  const { formData: responseData, handleChange: handleChangeAdminResponse } =
    useForm({
      message: "",
    });

  const { data: messagesAdmin } = useFetchData(
    activeTicketId
      ? ["cs_messages_admin", activeTicketId]
      : ["cs_messages_admin"],
    activeTicketId
      ? API_ENDPOINTS.CS.ADMIN.GET_MESSAGES_ADMIN(activeTicketId)
      : null,
  );

  const handleSendMessageAdmin = async () => {
    if (!responseData.message.trim() || isPending) return;

    adminResponse(responseData, {
      onSuccess: (data) => {
        console.log("Admin Response Success:", data);
        queryClient.refetchQueries({
          queryKey: ["cs_messages_admin", activeTicketId],
        });
        queryClient.invalidateQueries({
          queryKey: ["cs_messages", activeTicketId],
        });
        queryClient.invalidateQueries({ queryKey: ["queue_list"] });
        responseData.message = "";
      },
      onError: (error) => {
        console.error("Admin Response Error:", error);
      },
    });
  };

  const getNextQueue = async () => {
    const getNextQueueURL = API_ENDPOINTS.CS.ADMIN.NEXT_QUEUE_TICKET(nextQueue);
    try {
      const response = await axios.put(getNextQueueURL, {});
      console.log("Success Claim Ticket Data:", response.data);
      queryClient.invalidateQueries({ queryKey: ["queue_list"] });
      setClaimedTicketId(nextQueue);
      setView("ticket");
    } catch (error) {
      console.error("Error fetching next queue via Axios:", error);
    }
  };

  useEffect(() => {
    if (activeTicketId) {
      console.log(
        `📡 [Isolated Sync] Cache Sync Active For: ${activeTicketId}`,
      );
      queryClient.invalidateQueries({
        queryKey: ["cs_messages_admin", activeTicketId],
      });
    }
  }, [queueList, activeTicketId, queryClient, messagesAdmin]);

  const all_messages = Array.isArray(messagesAdmin)
    ? messagesAdmin
    : messagesAdmin?.messages || messagesAdmin?.payload?.messages || [];

  return (
    <div>
      {view === "queue" && currtentTicket && (
        <div
          onClick={() => setView("ticket")}
          className="cursor-pointer bg-gradient-to-r mx-5 mt-5 from-amber-500 via-orange-500 to-amber-500 text-white px-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center justify-between border border-amber-400 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <MessageSquare size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-100">
                Ongoing Active Session
              </p>
              <h4 className="text-sm font-black tracking-tight">
                Ticket #
                {currtentTicket?.ticketId?.substring(0, 8).toUpperCase()} is
                currently open
              </h4>
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-orange-600 px-3 py-1.5 rounded-xl shadow-sm hover:bg-orange-50 transition-colors">
            Return to Chat →
          </span>
        </div>
      )}

      {/* QUEUE LOBBY VIEW */}
      <div className={view === "queue" ? "block p-5" : "hidden"}>
        <div className="text-center flex flex-col gap-4 bg-white p-4 rounded-lg border-2 border-dashed border-sky-200 shadow-sm">
          {nextQueue ? (
            <>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-3 py-1 rounded-full mb-2">
                READY FOR ASSISTANCE
              </span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                #{nextQueue.substring(0, 8).toUpperCase()}
              </h2>
              <p className="text-xs text-slate-500 mt-1 italic">
                {formatTimeAgo(queueList?.payload?.next?.time) || "Just now"}
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-slate-400 font-medium">No pending tickets</p>
              <p className="text-[10px] text-slate-300">
                Queue is currently empty
              </p>
            </div>
          )}

          <button
            onClick={() => getNextQueue()}
            disabled={!!currtentTicket || !nextQueue}
            className={`font-bold py-2 px-4 rounded transition-all ${
              currtentTicket || !nextQueue
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
            }`}
          >
            {currtentTicket
              ? "Finish Open Session First"
              : !nextQueue
                ? "No Tickets to Claim"
                : "Get Next Ticket"}
          </button>
        </div>

        <div className="text-sm text-gray-500 my-5">
          Queues: {listQueue ? listQueue.length : 0} tickets
        </div>

        {listQueue && listQueue.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="group relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-100/50 hover:shadow-md hover:border-sky-200 dark:hover:border-sky-900/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-slate-300 group-hover:bg-sky-500 transition-colors duration-300"></div>
              <div>
                <div className="flex items-center justify-between mb-3 pl-1">
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/50 dark:text-sky-400 px-2.5 py-1 rounded-lg tracking-wider">
                    #{" "}
                    {listQueue[0]?.ticketId?.substring(0, 8).toUpperCase() ||
                      "PENDING"}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    {formatTimeAgo(listQueue[0]?.time) || "0 mins ago"}
                  </span>
                </div>

                <div className="space-y-1.5 pl-1">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition-colors duration-200">
                    {listQueue[0]?.name || "User"}
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                      Issue reported
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                      {listQueue[0]?.problem || "No problem details reported."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-slate-400 font-medium">No tickets in queue</p>
          </div>
        )}
      </div>

      {/* CHAT PANEL VIEW */}
      <div
        className={
          view === "ticket"
            ? "flex flex-col flex-1 overflow-hidden min-h-screen"
            : "hidden"
        }
      >
        <div className="flex justify-between">
          <button
            onClick={() => setView("queue")}
            className="p-2 bg-white dark:bg-slate-900 shadow-sm rounded-xl text-slate-600"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-lg font-semibold">
            #
            {currtentTicket?.ticketId
              ? currtentTicket.ticketId.substring(0, 8).toUpperCase()
              : "---"}
          </h1>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl text-slate-400"
            >
              <EllipsisVertical size={20} className="text-slate-400" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[10] menu p-2 shadow-lg bg-base-100 rounded-2xl w-52 border border-slate-100 mt-2"
            >
              <li>
                <button
                  type="button"
                  onClick={() => setView("info")}
                  className="flex items-center gap-2 py-3"
                >
                  <UserRoundPen size={16} /> <span>Info</span>
                </button>
              </li>
              <div className="divider my-0 opacity-50"></div>
              <li>
                <button
                  type="button"
                  className="flex items-center gap-2 py-3 text-error font-bold"
                >
                  <PhoneMissed size={16} /> <span>End Chat</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 mt-3 overflow-y-auto  py-6 space-y-6 pb-32 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/50 rounded-2xl shadow-inner scrollbar-thin">
          {all_messages.map((msg, index) => {
            const isFromAdminSide = msg?.sentBy?.toUpperCase() !== "USER";

            return (
              <ChatMessage
                key={`${msg?.id || msg?._id || index}-${all_messages.length}`}
                isSender={isFromAdminSide}
                message={msg?.message || msg?.msg || ""}
                profile={
                  msg?.sentBy === "Peep"
                    ? getProfileImage(msg?.profileImage)
                    : getProfileImage()
                }
                timeCurrent={
                  msg?.sentBy?.toUpperCase() === "USER"
                    ? formatDateTime(msg?.createdAt)
                    : msg?.sentBy?.toUpperCase() === "ADMIN"
                      ? `${msg?.senderName || "Admin"}`
                      : "Peep"
                }
              />
            );
          })}

          <div className="fixed bottom-0 w-full p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
              <input
                type="text"
                name="message"
                value={responseData.message}
                onChange={handleChangeAdminResponse}
                placeholder="Type your message..."
                className="outline-none flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 dark:text-white"
              />
              <button
                type="button"
                disabled={isPending}
                onClick={handleSendMessageAdmin}
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
      </div>

      <div className={view === "info" ? "block" : "hidden"}>
        <button
          onClick={() => setView("ticket")}
          className="p-2 bg-white dark:bg-slate-900 shadow-sm rounded-xl text-slate-600"
        >
          <ChevronLeft />
        </button>
      </div>
    </div>
  );
}

export default AI_ADMIN_MAIN;
