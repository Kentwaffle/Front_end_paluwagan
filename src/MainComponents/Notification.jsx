import React, { useState } from "react";
import {
  ChevronLeft,
  CheckSquare,
  Square,
  X,
  Trash2,
  CheckCheck,
  Bell,
  PiggyBank,
  Landmark,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/Auth";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { formatTimeAgo } from "../reusableComponents/Utils/TimeDateformat";
import { usePatchData } from "../serviceToApi/PatchData";
import { useQueryClient } from "@tanstack/react-query";
import { useInfiniteFetch } from "../serviceToApi/InfiniteScroll";
import { useDeleteData } from "../serviceToApi/DeleteData";
import { useInfiniteAutoScroll } from "../reusableComponents/Hooks/automaticScroll";

function Notification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showSelected, setShowSelected] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const isAdmin = user?.role === "ROLE_ADMIN";
  const userID = user?.userId;
  const queryClient = useQueryClient();

  const endpoints = {
    list: isAdmin
      ? API_ENDPOINTS.NOTIFICATIONS_ADMIN
      : userID
        ? API_ENDPOINTS.NOTIFICATIONS_USER(userID)
        : null,
    readAll: isAdmin
      ? API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_ADMIN
      : API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_USER,
  };

  const { mutate: markOnce } = usePatchData(null, [
    "notification_list",
    userID,
  ]);
  const { mutate: markALL, isLoading: isMarkAll } = usePatchData(
    endpoints.readAll,
    ["notification_list", userID],
  );
  const { mutate: clearAll, isLoading: isDeleting } = useDeleteData(
    API_ENDPOINTS.NOTIFICATIONS_DELETE,
    ["notification_list", userID],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingNotification,
  } = useInfiniteFetch(["notification_list", userID], endpoints.list, {
    enabled: !!userID && !!endpoints.list,
    staleTime: 5000,
    gcTime: 0,
  });

  const allNotifs = data?.pages.flatMap((page) => page.content) || [];

  const sentinelRef = useInfiniteAutoScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    allNotifs.length,
  );

  const handleReadOnce = (notif) => {
    // If in selection mode, clicking toggles selection instead of navigating
    if (showSelected) {
      toggleSelect(notif.id);
      return;
    }

    const targetUrl = isAdmin
      ? API_ENDPOINTS.NOTIFICATIONS_MARK_SINGLE_ADMIN(notif.id)
      : userID
        ? API_ENDPOINTS.NOTIFICATIONS_MARK_SINGLE_USER(notif.id)
        : null;

    markOnce(targetUrl, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifcount"] });
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

  const handleReadAll = () => {
    if (selectedIds.length === 0) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    markALL(selectedIds, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notification_list", userID],
        });
        queryClient.invalidateQueries({ queryKey: ["notifcount"] });
        setSelectedIds([]);
        setShowSelected(false);
      },
    });
  };

  const clear = () => {
    if (selectedIds.length === 0) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    clearAll(selectedIds, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notification_list", userID],
        });
        queryClient.invalidateQueries({ queryKey: ["notifcount"] });
        setSelectedIds([]);
        setShowSelected(false);
      },
    });
  };

  const handleBack = () => {
    const lastSegment = location.pathname.split("/").filter(Boolean);
    if (lastSegment.length > 1) {
      lastSegment.pop();
      navigate("/" + lastSegment.join("/"));
    } else {
      navigate("/");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === allNotifs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allNotifs.map((notif) => notif.id));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "SAVINGS":
        return <PiggyBank className="w-5 h-5 text-emerald-500" />;
      case "LOAN":
        return <Landmark className="w-5 h-5 text-sky-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Please select at least one item.</span>
          </div>
        </div>
      )}

      {/* Main Container - Centered on Desktop with max-w-4xl */}
      <div
        className={`max-w-4xl mx-auto px-4 py-4 sm:py-6 lg:py-8 ${showSelected ? "pb-28" : "pb-12"}`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors p-1 -ml-1 rounded-lg"
          >
            <ChevronLeft size={22} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-lg font-bold">Notifications</h1>
          <div className="w-8" />
        </div>

        {/* Desktop Header Banner */}
        <div className="hidden lg:block mb-6 border-b border-slate-200 dark:border-slate-800 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with your latest loan approvals, savings activities,
            and account alerts.
          </p>
        </div>

        {/* Control Toolbar */}
        {!isLoadingNotification && allNotifs.length > 0 && (
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800 mb-4 transition-all">
            <div className="flex items-center gap-3">
              {showSelected ? (
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  {selectedIds.length === allNotifs.length ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {selectedIds.length === allNotifs.length
                    ? "Deselect All"
                    : `Select All ${selectedIds.length > 0 ? `(${selectedIds.length})` : ""}`}
                </button>
              ) : (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Total Notifications: {allNotifs.length}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setShowSelected(!showSelected);
                setSelectedIds([]);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors px-2 py-1 rounded-md hover:bg-sky-50 dark:hover:bg-slate-800"
            >
              {showSelected ? (
                <>
                  <X className="w-4 h-4" /> Cancel
                </>
              ) : (
                "Select"
              )}
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoadingNotification ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex gap-4 items-center"
              >
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                </div>
              </div>
            ))
          ) : allNotifs?.length > 0 ? (
            allNotifs.map((notif) => {
              const isSelected = selectedIds.includes(notif.id);
              const isRead = notif.isRead;

              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 group transition-all"
                >
                  {showSelected && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(notif.id)}
                      className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 transition cursor-pointer"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => handleReadOnce(notif)}
                    className={`relative w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 shadow-sm active:scale-[0.99] cursor-pointer ${
                      isSelected
                        ? "bg-sky-50/80 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700"
                        : !isRead
                          ? "bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-900/50 shadow-sky-100/20"
                          : "bg-slate-100/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {!isRead && (
                      <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-sky-500 rounded-full ring-4 ring-sky-100 dark:ring-sky-950" />
                    )}

                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        !isRead
                          ? "bg-sky-100/70 dark:bg-sky-900/40"
                          : "bg-slate-200/60 dark:bg-slate-800"
                      }`}
                    >
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex justify-between items-baseline gap-2 mb-1">
                        <h2
                          className={`text-sm truncate ${
                            !isRead
                              ? "font-bold text-slate-900 dark:text-white"
                              : "font-semibold text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {notif.title}
                        </h2>
                        <span className="text-[11px] text-slate-400 font-medium shrink-0">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-semibold text-base">
                No notifications
              </p>
              <p className="text-xs text-slate-400 mt-1">
                New updates will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Scroll Infinite Sentinel */}
        <div
          ref={sentinelRef}
          className="py-6 flex justify-center items-center"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-ping" />
              Loading more...
            </div>
          ) : hasNextPage ? (
            <span className="text-[10px] text-slate-400 uppercase tracking-widest animate-pulse">
              Scroll for more
            </span>
          ) : allNotifs.length > 0 ? (
            <p className="text-xs italic text-slate-400">— End of list —</p>
          ) : null}
        </div>
      </div>

      {/* Floating Bottom Action Toolbar */}
      {showSelected && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-2xl z-40 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button
              onClick={clear}
              disabled={isDeleting || selectedIds.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedIds.length})
            </button>
            <button
              onClick={handleReadAll}
              disabled={isMarkAll || selectedIds.length === 0}
              className="flex-[2] flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-500/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCheck className="w-4 h-4" />
              Mark as Read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
