import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { useFetchData } from "../serviceToApi/fetchData";
import { formatTimeAgo } from "../reusableComponents/TimeDateformat";
import { CheckSquare, X } from "lucide-react";
import { usePatchData } from "../serviceToApi/PatchData";
import { useQueryClient } from "@tanstack/react-query";
import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";
import { useInfiniteFetch } from "../serviceToApi/InfiniteScroll";
import { useDeleteData } from "../serviceToApi/DeleteData";
function Notification() {
  const navigate = useNavigate();
  const { user, isLoadingAuth } = useAuth();
  const [showSelected, setShowSelected] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const isAdmin = user?.role === "ROLE_ADMIN";
  const userID = user?.userId;
  const queryClient = useQueryClient();
  const sentinelRef = useRef();

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
  const { mutate: markOnce, isLoading: isMarkOnceLoading } = usePatchData(
    null,
    ["notification_list", userID],
  );

  const { mutate: markALL, isLoading: isMarkAll } = usePatchData(
    endpoints.readAll,
    ["notification_list", userID],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingNotification,
  } = useInfiniteFetch(["notification_list", userID], endpoints.list, {
    enabled: !!userID,
  });

  const allNotifs = data?.pages.flatMap((page) => page.content) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleReadOnce = (notif) => {
    const targetUrl = isAdmin
      ? API_ENDPOINTS.NOTIFICATIONS_MARK_SINGLE_ADMIN(notif.id)
      : userID
        ? API_ENDPOINTS.NOTIFICATIONS_MARK_SINGLE_USER(notif.id)
        : null;

    console.log("Target URL:", targetUrl);
    console.log(notif.accountNumber);
    markOnce(targetUrl, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notifcount"],
        });
        if (isAdmin) {
          if (notif.type === "SAVINGS") {
            navigate(`/admin/savings_management/${notif.accountNumber}`);
          } else {
            navigate("/admin/loan_management");
          }
        } else if (!isAdmin) {
          if (notif.type === "SAVINGS") {
            navigate("/savings");
          } else {
            navigate("/loan");
          }
        }
      },
      onError: (err) => {
        console.error("Patch error:", err);
      },
    });
  };

  const handleReadAll = () => {
    if (selectedIds.length === 0) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }

    markALL(selectedIds, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notification_list", userID],
        });
        queryClient.invalidateQueries({
          queryKey: ["notifcount"],
        });
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
      prev.includes(id) ? prev.filter((items) => items !== id) : [...prev, id],
    );
  };
  const { mutate: clearAll, isLoading: LoadClear } = useDeleteData(
    API_ENDPOINTS.NOTIFICATIONS_DELETE,
    ["notification_list", userID],
  );

  const clear = () => {
    clearAll(selectedIds, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notification_list", userID],
        });
        queryClient.invalidateQueries({
          queryKey: ["notifcount"],
        });
        setSelectedIds([]);
        setShowSelected(false);
      },
    });
  };

  return (
    <div key={"Notification"} className="min-h-screen ">
      <div className="flex justify-between items-center mb-2">
        {showToast && (
          <div className="toast toast-top toast-center duration-500 ease-in-out animate-in slide-in-from-top-10">
            <div className="alert alert-info font-semibold text-white">
              <span>Please select at least one item</span>
            </div>
          </div>
        )}
        <h1 className="text-2xl font-bold ">Notifications</h1>
        <button
          onClick={() => handleBack()}
          className="flex items-center  text-sky-500"
        >
          <ChevronLeft size={24} />
          Return
        </button>
      </div>
      {!isLoadingNotification && allNotifs.length > 0 && (
        <div className="flex justify-between text-sm items-center">
          {showSelected && (
            <div className="flex w-full gap-2 text-sky-500">
              <button
                onClick={() => {
                  if (selectedIds.length === allNotifs.length) {
                    setSelectedIds([]);
                  } else {
                    setSelectedIds(allNotifs.map((notif) => notif.id));
                  }
                }}
              >
                {selectedIds.length === allNotifs.length
                  ? "Deselect all"
                  : `Select all ${selectedIds.length == 0 ? "" : `(${selectedIds.length})`}`}
              </button>
            </div>
          )}

          <button
            onClick={() => {
              if (showSelected) {
                setShowSelected(false);
                setSelectedIds([]);
              } else {
                setShowSelected(true);
              }
            }}
            className={`${showSelected ? "flex justify-end items-end" : "flex justify-start items-start"} text-sky-500 pr-2 ml-2`}
          >
            {showSelected ? <X size={20} /> : "Select"}
          </button>
        </div>
      )}

      <div>
        {isLoadingNotification ? (
          <div className="skeleton dark:bg-slate-800 h-15 w-full rounded-2xl"></div>
        ) : allNotifs?.length > 0 ? (
          allNotifs.map((notif) => (
            <div key={notif.id} className="flex items-center my-3 gap-2">
              {showSelected && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(notif.id)}
                  onChange={() => toggleSelect(notif.id)}
                  className="checkbox checkbox-info border-gray-300 text-blue-600 focus:ring-blue-500 transition-all animate-in fade-in slide-in-from-left-2"
                />
              )}
              <button
                type="button"
                onClick={() => handleReadOnce(notif)}
                className={`${selectedIds.includes(notif.id) ? "bg-sky-50" : "bg-sky-50"} ${notif.isRead ? "bg-white" : "bg-slate-200"} text-start w-full p-4 rounded-2xl shadow-sm dark:bg-slate-800 dark:text-slate-20 active:scale-95 transition-all`}
              >
                <div className="flex justify-between items-center">
                  <label className="block font-black text-sm text-gray-700 dark:text-slate-300 mb-1">
                    {notif.title}
                  </label>
                  <span className="text-xs text-slate-400 font-semibold dark:text-slate-400">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>
                <span className="block font-medium text-xs  text-gray-700 dark:text-slate-300 ">
                  {notif.message}
                </span>
              </button>
            </div>
          ))
        ) : (
          <div className="text-slate-400 italic text-lg dark:text-slate-500 font-black mt-40 flex justify-center items-center">
            No notifications
          </div>
        )}
      </div>
      <div ref={sentinelRef} className="p-4 flex justify-center">
        {isFetchingNextPage ? (
          <span className="loading loading-dots"></span>
        ) : hasNextPage ? (
          <p className="text-xs italic">Loading more...</p>
        ) : (
          <p className="text-xs italic">End of notifications</p>
        )}
      </div>
      {showSelected && (
        <div
          className="fixed bottom-0 left-0 right-0  border-t  bg-white
       border-slate-200 p-2 px-5 dark:border-slate-700  dark:bg-slate-800"
        >
          <div className="flex gap-3">
            <button
              onClick={() => clear()}
              className="flex-1 w-full py-3 px-4 text-xs font-bold text-red-400 dark:text-red-500"
            >
              Clear
            </button>
            <button
              onClick={() => handleReadAll()}
              className="flex-2 w-full py-2 px-4 text-white bg-sky-500 rounded-xl font-bold text-xs shadow-lg shadow-sky-100 dark:shadow-none transition-all active:scale-95"
            >
              Mark as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
