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
import api from "../../serviceToApi/ApiInstance";
import { formatTimeAgo } from "../../reusableComponents/Utils/TimeDateformat";
import { useQueryClient } from "@tanstack/react-query";
import ChatMessage from "../ChatMessage";
import { formatDateTime } from "../../reusableComponents/Utils/TimeDateformat";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { usePostData } from "../../serviceToApi/PostData";
import { useChatWebSocket } from "../../reusableComponents/Hooks/ChatSSE";
import { useAutoScroll } from "../../reusableComponents/Hooks/useAutoScroll";
import Swal from "sweetalert2";

function AI_ADMIN_MAIN() {
  const [view, setView] = useState("queue");
  const [claimedTicketId, setClaimedTicketId] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasRestoreView, setHasRestoreView] = useState(false);
  const [justEnded, setJustEnded] = useState(false);
  const [lastClosedTicketId, setLastClosedTicketId] = useState(null);
  const [hasOpenedActiveTicket, setHasOpenedActiveTicket] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: queueList } = useFetchData(
    "queue_list",
    API_ENDPOINTS.CS.ADMIN.QUEUE_LIST,
    { refetchInterval: 3000 }
  );

  const nextQueue = queueList?.payload?.next?.ticketId;
  const listQueue = queueList?.payload?.list || [];
  const currtentTicket = queueList?.payload?.current || null;
  const activeTicketId = currtentTicket?.ticketId || claimedTicketId;

  const displayQueue = [];
  if (currtentTicket) {
    displayQueue.push(currtentTicket);
  }
  listQueue.forEach((ticket) => {
    if (ticket.ticketId !== currtentTicket?.ticketId) {
      displayQueue.push(ticket);
    }
  });

  const displayTicket = currtentTicket || queueList?.payload?.next || null;
  const displayTicketId = displayTicket?.ticketId;
  const displayTicketTime = displayTicket?.time || displayTicket?.createdAt;

  const showChat = !!activeTicketId && hasOpenedActiveTicket;

  useChatWebSocket(activeTicketId);

  useEffect(() => {
    if (currtentTicket?.ticketId && !hasRestoreView) {
      setView("ticket");
      setHasOpenedActiveTicket(true);
      setHasRestoreView(true);
    }
  }, [currtentTicket, hasRestoreView]);

  const { mutate: adminResponse, isPending } = usePostData(
    API_ENDPOINTS.CS.ADMIN.RESPONSE_REPLY(activeTicketId),
    ["admin_response", activeTicketId],
  );

  const {
    formData: responseData,
    setFormData: setResponseData,
    handleChange: handleChangeAdminResponse,
  } = useForm({
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
    const textToSend = responseData.message.trim();
    if (!textToSend || isPending) return;

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
        setResponseData({ message: "" });
      },
      onError: (error) => {
        console.error("Admin Response Error:", error);
      },
    });
  };

  const [isEndingChat, setIsEndingChat] = useState(false);

  const handleEndChat = async () => {
    if (!activeTicketId || isEndingChat) return;

    let isConfirmed = false;
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
    if (isDesktop) {
      await Swal.fire({
        html: `
          <div class="flex flex-col gap-4 text-slate-800 dark:text-slate-200">
            <!-- Header -->
            <div class="flex items-start gap-4 text-left">
              <div class="w-12 h-12 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-full flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                </svg>
              </div>
              <div class="flex flex-col gap-1">
                <h2 class="text-xl font-black text-slate-900 dark:text-white leading-tight">End Support Chat?</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  You are about to close this ticket session. The user will be notified that support has finished, and this session will be archived.
                </p>
              </div>
            </div>

            <div class="h-[1px] bg-slate-200/80 dark:bg-slate-800 w-full my-1"></div>

            <!-- Content Card -->
            <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl text-left flex flex-col gap-3">
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">Active Session</div>
                <div class="flex items-center gap-1.5 mt-1.5">
                  <span class="text-sm font-bold text-slate-800 dark:text-slate-205">#${activeTicketId.substring(0, 8).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 mt-4">
              <button 
                id="swal-cancel-btn" 
                type="button" 
                class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                id="swal-confirm-btn" 
                type="button" 
                class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-sm cursor-pointer transition-colors"
              >
                Yes, End Session
              </button>
            </div>
          </div>
        `,
        showConfirmButton: false,
        background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
        customClass: {
          popup: "rounded-3xl border border-slate-100 dark:border-slate-850 max-w-[480px] p-6 shadow-xl",
        },
        didOpen: () => {
          const cancelBtn = document.getElementById("swal-cancel-btn");
          const confirmBtn = document.getElementById("swal-confirm-btn");
          
          if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
              Swal.close();
            });
          }
          if (confirmBtn) {
            confirmBtn.addEventListener("click", () => {
              isConfirmed = true;
              Swal.close();
            });
          }
        }
      });
    } else {
      const result = await Swal.fire({
        title: "End Support Chat?",
        text: "Are you sure you want to close this ticket session?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, End Chat",
        cancelButtonText: "Cancel",
        background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
        color: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#f3f4f6" : "#1f2937",
      });
      isConfirmed = result.isConfirmed;
    }

    if (!isConfirmed) return;

    setIsEndingChat(true);
    try {
      const closeUrl = API_ENDPOINTS.CS.ADMIN.ENDCHAT(activeTicketId);
      console.log(`Closing ticket: ${activeTicketId} at ${closeUrl}`);
      const response = await api.post(closeUrl, {});
      console.log("Success Close Ticket Data:", response.data);

      queryClient.setQueryData(["queue_list"], (old) => {
        if (!old) return old;
        return {
          ...old,
          payload: {
            ...old.payload,
            current: null
          }
        };
      });

      queryClient.invalidateQueries({ queryKey: ["queue_list"] });
      queryClient.invalidateQueries({
        queryKey: ["cs_messages_admin", activeTicketId],
      });

      setLastClosedTicketId(activeTicketId);
      setClaimedTicketId(null);
      setHasOpenedActiveTicket(false);
      setView("queue");
      setJustEnded(true);
      setTimeout(() => {
        setJustEnded(false);
      }, 1200);
    } catch (error) {
      console.error("Error closing ticket via API:", error);
    } finally {
      setIsEndingChat(false);
    }
  };

  const getNextQueue = async () => {
    if (!nextQueue || isClaiming) return;

    let isConfirmed = false;
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
    if (isDesktop) {
      await Swal.fire({
        html: `
          <div class="flex flex-col gap-4 text-slate-800 dark:text-slate-200">
            <!-- Header -->
            <div class="flex items-start gap-4 text-left">
              <div class="w-12 h-12 bg-sky-50 dark:bg-sky-950/30 text-sky-600 rounded-full flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <div class="flex flex-col gap-1">
                <h2 class="text-xl font-black text-slate-900 dark:text-white leading-tight">Claim Support Ticket?</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  You are about to claim and open a new customer support chat session. This will assign you as the primary support handler.
                </p>
              </div>
            </div>

            <div class="h-[1px] bg-slate-200/80 dark:bg-slate-800 w-full my-1"></div>

            <!-- Content Card -->
            <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl text-left flex flex-col gap-3">
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">Ticket ID</div>
                <div class="flex items-center gap-1.5 mt-1.5">
                  <svg class="w-4 h-4 text-slate-400 dark:text-slate-555" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 20l4-16m2 16l4-16"></path>
                  </svg>
                  <span class="text-sm font-bold text-slate-800 dark:text-slate-205">#${nextQueue.substring(0, 8).toUpperCase()}</span>
                </div>
              </div>

              <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

              <div class="flex justify-between items-center text-xs">
                <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Queue Position</span>
                <span class="font-bold text-slate-800 dark:text-slate-205">
                  Next in Line
                </span>
              </div>

              <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

              <div class="flex justify-between items-center text-xs">
                <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Time Elapsed</span>
                <span class="font-semibold text-slate-800 dark:text-slate-205">
                  ${formatTimeAgo(queueList?.payload?.next?.time) || "Just now"}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 mt-4">
              <button 
                id="swal-cancel-btn" 
                type="button" 
                class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                id="swal-confirm-btn" 
                type="button" 
                class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer transition-colors"
              >
                Yes, Claim Ticket
              </button>
            </div>
          </div>
        `,
        showConfirmButton: false,
        background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
        customClass: {
          popup: "rounded-3xl border border-slate-100 dark:border-slate-850 max-w-[480px] p-6 shadow-xl",
        },
        didOpen: () => {
          const cancelBtn = document.getElementById("swal-cancel-btn");
          const confirmBtn = document.getElementById("swal-confirm-btn");
          
          if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
              Swal.close();
            });
          }
          if (confirmBtn) {
            confirmBtn.addEventListener("click", () => {
              isConfirmed = true;
              Swal.close();
            });
          }
        }
      });
    } else {
      const result = await Swal.fire({
        title: "Claim Support Ticket?",
        text: "Are you sure you want to claim the next ticket in line?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, Claim Ticket",
        cancelButtonText: "Cancel",
        background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
        color: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#f3f4f6" : "#1f2937",
      });
      isConfirmed = result.isConfirmed;
    }

    if (!isConfirmed) return;

    const getNextQueueURL = API_ENDPOINTS.CS.ADMIN.NEXT_QUEUE_TICKET(nextQueue);
    setIsClaiming(true);
    try {
      const response = await api.put(getNextQueueURL, {});
      console.log("Success Claim Ticket Data:", response.data);

      queryClient.setQueryData(["queue_list"], (old) => {
        if (!old) return old;
        const nextTicketObj = old.payload?.list?.find((t) => t.ticketId === nextQueue) || { ticketId: nextQueue };
        return {
          ...old,
          payload: {
            ...old.payload,
            current: nextTicketObj,
            list: old.payload?.list?.filter((t) => t.ticketId !== nextQueue) || [],
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ["queue_list"] });
      setClaimedTicketId(nextQueue);
      setHasOpenedActiveTicket(true);
      setView("ticket");
    } catch (error) {
      console.error("Error fetching next queue via API:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClaimButtonClick = () => {
    if (currtentTicket) {
      setHasOpenedActiveTicket(true);
      setView("ticket");
    } else {
      getNextQueue();
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
  const messagesEndRef = useAutoScroll([all_messages], view, "ticket");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* MOBILE RESPONSIVE VIEWS */}
      <div className="block md:hidden">
        {view === "queue" && currtentTicket && hasOpenedActiveTicket && (
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

        {/* QUEUE LOBBY VIEW (MOBILE) */}
        <div className={view === "queue" ? "block p-5" : "hidden"}>
          <div className="text-center flex flex-col gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-880 shadow-sm">
            {displayTicketId ? (
              <>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/30 px-3 py-1 rounded-full mb-2 mx-auto uppercase">
                  {currtentTicket ? "ASSIGNED TO YOU" : "READY FOR ASSISTANCE"}
                </span>
                <h2 className="text-2xl font-black text-slate-805 dark:text-white tracking-tight">
                  #{displayTicketId.substring(0, 8).toUpperCase()}
                </h2>
                <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 italic">
                  {formatTimeAgo(displayTicketTime) || "Just now"}
                </p>
              </>
            ) : (
              <div className="text-center">
                <p className="text-slate-400 font-medium">No pending tickets</p>
                <p className="text-[10px] text-slate-305 dark:text-slate-500">
                  Queue is currently empty
                </p>
              </div>
            )}

            <button
              onClick={() => handleClaimButtonClick()}
              disabled={!displayTicketId || isClaiming || justEnded}
              className={`font-bold py-3 px-4 rounded-xl transition-all cursor-pointer ${!displayTicketId || isClaiming || justEnded
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800"
                  : "bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                }`}
            >
              {isClaiming
                ? "Claiming Ticket..."
                : !displayTicketId
                  ? "No Tickets to Claim"
                  : "Get Next Ticket"}
            </button>
          </div>

          <div className="text-sm text-gray-500 my-5 font-bold uppercase tracking-wider text-[10px]">
            Queues: {displayQueue ? displayQueue.length : 0} tickets
          </div>

          {displayQueue && displayQueue.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="group relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1 bg-slate-300 group-hover:bg-sky-500 transition-colors duration-300"></div>
                <div>
                  <div className="flex items-center justify-between mb-3 pl-1">
                    <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/50 dark:text-sky-400 px-2.5 py-1 rounded-lg tracking-wider">
                      #{" "}
                      {displayQueue[0]?.ticketId?.substring(0, 8).toUpperCase() ||
                        "PENDING"}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-555 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      {formatTimeAgo(displayQueue[0]?.time) || "0 mins ago"}
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {displayQueue[0]?.name || "User"}
                    </h4>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                      <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                        Issue reported
                      </p>
                      <p className="text-xs text-slate-650 dark:text-slate-400 font-medium">
                        {displayQueue[0]?.problem || "No problem details reported."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 font-medium">No tickets in queue</p>
            </div>
          )}
        </div>

        {/* CHAT PANEL VIEW (MOBILE) */}
        <div
          className={
            view === "ticket"
              ? "flex flex-col h-[calc(100vh-60px)] overflow-hidden bg-white dark:bg-slate-900"
              : "hidden"
          }
        >
          <div className="sticky top-0 z-10 flex justify-between p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 items-center">
            <button
              onClick={() => setView("queue")}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl text-slate-600"
            >
              <ChevronLeft size={18} />
            </button>
            <h1 className="text-sm font-black tracking-tight text-slate-800 dark:text-white">
              #
              {currtentTicket?.ticketId
                ? currtentTicket.ticketId.substring(0, 8).toUpperCase()
                : "---"}
            </h1>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl text-slate-450 cursor-pointer"
              >
                <EllipsisVertical size={18} />
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
                    disabled={isEndingChat}
                    onClick={handleEndChat}
                    className="flex items-center gap-2 py-3 text-error font-bold disabled:opacity-50"
                  >
                    <PhoneMissed size={16} />{" "}
                    <span>{isEndingChat ? "Ending..." : "End Chat"}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 p-5 pb-32 scrollbar-thin">
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
            <div ref={messagesEndRef} />
          </div>

          <div className="fixed bottom-0 w-full p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
              <textarea
                name="message"
                rows={1}
                value={responseData.message}
                onChange={handleChangeAdminResponse}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessageAdmin();
                  }
                }}
                placeholder="Type your message..."
                className="outline-none flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 dark:text-white resize-none max-h-32 scrollbar-none py-1.5"
              />
              <button
                type="button"
                disabled={isPending}
                onClick={handleSendMessageAdmin}
                className="bg-sky-500 text-white p-2 rounded-xl hover:bg-sky-600 transition-all cursor-pointer"
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

        {/* INFO SCREEN (MOBILE) */}
        <div className={view === "info" ? "block p-5 bg-white dark:bg-slate-900 min-h-screen" : "hidden"}>
          <button
            onClick={() => setView("ticket")}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl text-slate-600 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-col items-center mt-8 text-center">
            <img
              src={getProfileImage(currtentTicket?.profileImage)}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-slate-100"
            />
            <h3 className="text-base font-bold text-slate-800 dark:text-white mt-4">{currtentTicket?.name || "User"}</h3>
            <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Support Ticket Details</span>
            <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800 my-6"></div>
            <div className="text-left w-full space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reported Issue</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-305 mt-1 bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-100/50">{currtentTicket?.problem || "No details"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* DESKTOP SPLIT SIDEBAR & MESSENGER VIEW */}
      <div className="hidden md:flex h-[calc(100vh-100px)] w-full gap-5 p-4 md:p-8">
        
        {/* Left Panel: Messenger Area / Queue Claim Button Dashboard */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
          
          {!showChat ? (
            
            /* LOBBY DASHBOARD (GET NEXT TICKET VIEW) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20 dark:bg-slate-900/10">
              <div className="max-w-[480px] w-full bg-white dark:bg-slate-900 border-2 border-dashed border-sky-100 dark:border-sky-900/80 p-10 rounded-3xl shadow-sm flex flex-col gap-6 items-center text-center">
                {displayTicketId ? (
                  <>
                    <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full select-none uppercase">
                      {currtentTicket ? "ASSIGNED TO YOU" : "READY FOR ASSISTANCE"}
                    </span>
                    <h2 className="text-4xl font-black text-slate-850 dark:text-white tracking-tight mt-2 font-mono">
                      #{displayTicketId.substring(0, 8).toUpperCase()}
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 select-none">
                      Registered in queue {formatTimeAgo(displayTicketTime) || "a few minutes ago"}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2.5 py-6 opacity-60">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-805 flex items-center justify-center">
                      <MessageSquare size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No support tickets in queue</p>
                      <p className="text-xs text-slate-400 mt-0.5">Please wait for user ticket reports to arrive.</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleClaimButtonClick()}
                  disabled={!displayTicketId || isClaiming || justEnded}
                  className={`w-full py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    !displayTicketId || isClaiming || justEnded
                      ? "bg-slate-150 text-slate-400 dark:bg-slate-800 cursor-not-allowed shadow-none"
                      : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
                  }`}
                >
                  {isClaiming ? (
                    <span>Claiming Ticket...</span>
                  ) : (
                    <>
                      <span>Get Next Ticket</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
            
          ) : (
            
            /* MESSENGER CHAT INTERFACE */
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center bg-white dark:bg-slate-900 shadow-sm shrink-0 z-[2]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={getProfileImage(currtentTicket?.profileImage)}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                      {currtentTicket?.name || "Support Member"}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5 select-none font-mono">
                      <span>ID:</span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-505">
                        {activeTicketId}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isEndingChat}
                  onClick={handleEndChat}
                  className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <PhoneMissed size={14} />
                  <span>{isEndingChat ? "Ending..." : "End Session"}</span>
                </button>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-32 scrollbar-thin bg-slate-50/20">
                {/* Reported Issue pinned banner */}
                {currtentTicket?.problem && (
                  <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 p-4 rounded-2xl flex flex-col gap-1 text-left mb-4 shadow-sm select-none">
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-600">Reported Issue Details</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                      "{currtentTicket.problem}"
                    </p>
                  </div>
                )}

                {all_messages.map((msg, index) => {
                  const isFromAdminSide = msg?.sentBy?.toUpperCase() !== "USER";
                  return (
                    <ChatMessage
                      key={msg?.id || msg?._id || index}
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
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-[3]">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl">
                  <textarea
                    name="message"
                    rows={1}
                    value={responseData.message}
                    onChange={handleChangeAdminResponse}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessageAdmin();
                      }
                    }}
                    placeholder="Type your message..."
                    className="outline-none flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 dark:text-white resize-none max-h-32 scrollbar-none py-2"
                  />
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleSendMessageAdmin}
                    className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all cursor-pointer shadow-sm active:scale-95"
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
          )}

        </div>

        {/* Right Sidebar: Tickets Queue List */}
        <div className="w-[380px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col overflow-hidden text-left">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-555 border-b border-slate-100 dark:border-slate-800 px-6 py-5 select-none shrink-0 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <span>Queues: {displayQueue.length} Tickets</span>
            {claimedTicketId && (
              <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                Claimed Active
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-thin">
            {displayQueue && displayQueue.length > 0 ? (
              displayQueue.map((ticket, index) => {
                const isActive = ticket.ticketId === activeTicketId;
                return (
                  <div
                    key={ticket.ticketId || index}
                    onClick={() => {
                      if (isActive) {
                        setView("ticket");
                      } else {
                        showAlert.warning(
                          "Queue Control",
                          "You must click 'Get Next Ticket' to claim the next ticket in order."
                        );
                      }
                    }}
                    className={`relative p-5 bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col gap-3 hover:shadow-md ${
                      isActive
                        ? "border-blue-500 dark:border-blue-500 shadow-sm cursor-pointer"
                        : "border-slate-105 dark:border-slate-800/60 cursor-not-allowed opacity-75"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-500"></div>
                    )}
                    
                    <div className="flex items-center justify-between pl-1">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg tracking-wider font-mono">
                        #{ticket.ticketId?.substring(0, 8).toUpperCase() || "PENDING"}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 select-none font-sans">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        {formatTimeAgo(ticket.time) || "Just now"}
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-1">
                      <h4 className={`text-sm font-bold leading-tight ${isActive ? "text-blue-600 dark:text-sky-400" : "text-slate-800 dark:text-slate-200"}`}>
                        {ticket.name || "User"}
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-850/50 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                        <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-555 mb-0.5 select-none">
                          Issue reported
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-350 font-semibold line-clamp-2 leading-relaxed">
                          {ticket.problem || "No problem details reported."}
                        </p>
                      </div>
                    </div>
                  </div>
                 );
               })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40 select-none">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                  <MessageSquare size={24} className="text-slate-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Queue empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AI_ADMIN_MAIN;
