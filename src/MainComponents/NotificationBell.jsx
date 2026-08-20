import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, PiggyBank, Landmark } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/Auth";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { formatTimeAgo } from "../reusableComponents/Utils/TimeDateformat";
import { usePatchData } from "../serviceToApi/PatchData";
import { useInfiniteFetch } from "../serviceToApi/InfiniteScroll";
import { useFetchData } from "../serviceToApi/fetchData";
import {
  getStatusColor,
  getTransactionIcon,
  getTypeBadge,
  getNotificationBadge,
} from "../reusableComponents/Display/TransactionSyle";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAdmin = user?.role === "ROLE_ADMIN";
  const userID = user?.userId;

  const countUrl = isAdmin
    ? API_ENDPOINTS.NOTIFICATIONS_ADMIN_UNREAD_COUNT
    : userID
      ? API_ENDPOINTS.NOTIFICATIONS_USER_UNREAD_COUNT(userID)
      : null;

  const { data: notifCount } = useFetchData(["notifCount", userID], countUrl);

  const listUrl = isAdmin
    ? API_ENDPOINTS.NOTIFICATIONS_ADMIN
    : userID
      ? API_ENDPOINTS.NOTIFICATIONS_USER(userID)
      : null;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingNotification,
  } = useInfiniteFetch(["notification_list", userID], listUrl, {
    enabled: !!userID && !!listUrl && open,
    staleTime: 5000,
    gcTime: 0,
  });

  const notifs = data?.pages.flatMap((page) => page.content) || [];

  const { mutate: markOnce } = usePatchData(null, [
    "notification_list",
    userID,
  ]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleNotifClick = (notif) => {
    const targetUrl = isAdmin
      ? API_ENDPOINTS.NOTIFICATIONS_MARK_SINGLE_ADMIN(notif.id)
      : userID
        ? API_ENDPOINTS.NOTIFICATIONS_MARK_SINGLE_USER(notif.id)
        : null;

    markOnce(targetUrl, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifCount"] });
        setOpen(false);
        if (isAdmin) {
          navigate(
            notif.type === "SAVINGS"
              ? `/admin/savings_management/${notif.accountNumber}`
              : "/admin/loan_management",
          );
        } else {
          navigate(notif.type === "SAVINGS" ? "/savings" : "/loan");
        }
      },
    });
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2.5 rounded-full  text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/70 dark:hover:bg-slate-800/70 active:scale-95 transition-all cursor-pointer"
      >
        <Bell size={22} />
        {notifCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none ring-2 ring-slate-50 dark:ring-slate-950">
            {notifCount > 9 ? "9+" : notifCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-[360px] max-h-[560px] flex flex-col bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Notifications
            </h2>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/notification");
              }}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-all"
            >
              See all
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-1.5 sm:px-2 pb-1">
            <p className="px-2.5 pt-1 pb-1.5 text-[15px] font-bold text-slate-900 dark:text-white">
              Earlier
            </p>

            {isLoadingNotification ? (
              <div className="space-y-1 px-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex gap-3 items-center px-2.5 py-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifs.length > 0 ? (
              <div className="space-y-0.5">
                {notifs.map((notif) => {
                  const isRead = notif.isRead;
                  const badge = getNotificationBadge(notif.type);
                  return (
                    <button
                      key={notif.id}
                      type="button"
                      onClick={() => handleNotifClick(notif)}
                      className="w-full flex items-start gap-3 text-left rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                          <div
                            className={`w-5 h-5 text-slate-500 dark:text-slate-400`}
                          >
                            {getTransactionIcon(notif.type)}
                          </div>
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full ${badge.bg} flex items-center justify-center ring-2 ring-white dark:ring-slate-900`}
                        >
                          {badge.icon}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[13.5px] leading-snug ${
                            !isRead
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <span className="font-semibold">
                            {notif.type === "SAVINGS"
                              ? "Savings"
                              : notif.type === "LOAN"
                                ? "Loan"
                                : "General"}{" "}
                            {notif.title}
                          </span>{" "}
                          {notif.message}
                        </p>
                        <p className="text-[12px] font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                          {formatTimeAgo(notif.createdAt)}
                        </p>
                      </div>

                      {!isRead && (
                        <span className="w-2.5 h-2.5 bg-sky-500 rounded-full shrink-0 mt-4" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                  <Bell className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-slate-900 dark:text-white font-semibold text-sm">
                  No notifications
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {hasNextPage && (
            <div className="px-2 pb-2 pt-1 shrink-0">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage
                  ? "Loading..."
                  : "See previous notifications"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
