import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/Auth";
import AI_ADMIN_MAIN from "./AI_ADMIN/AI_ADMIN_MAIN";
import AI_USER_MAIN from "./AI_User/AI_USER_MAIN";
import { ChevronLeft, EllipsisVertical, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AI_mainlayout() {
  const { user, isLoadingAuth } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();
  console.log("Current User Role:", role);

  // 🎯 GUMAWA NG SESSION STORAGE STATE:
  // Babasahin muna nito kung may naka-save nang ticketId sa browser session para hindi mawala sa refresh.
  const [activeTicketId, setActiveTicketId] = useState(() => {
    return sessionStorage.getItem("active_chat_ticket_id") || "";
  });

  // 🎯 EFFECT TRACKER:
  // Awtomatikong i-aupdate o buburahin ang sessionStorage kapag nagbago ang activeTicketId.
  useEffect(() => {
    if (activeTicketId) {
      sessionStorage.setItem("active_chat_ticket_id", activeTicketId);
    } else {
      sessionStorage.removeItem("active_chat_ticket_id");
    }
  }, [activeTicketId]);

  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking permissions...
      </div>
    );
  }

  if (!user) {
    return <div>Access Denied. Please login.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 p-4">
        <button
          className="p-2 bg-white dark:bg-slate-900 shadow-sm rounded-xl text-slate-600"
          onClick={() => navigate("/profile")}
        >
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold text-slate-600 dark:text-slate-200">
          Beep AI
        </h1>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none rounded-xl text-slate-400 hover:text-sky-500 hover:border-sky-100 dark:hover:border-slate-700 transition-all duration-200"
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
                className="flex items-center gap-2 py-3 text-error"
              >
                <Bug size={16} /> <span>Report</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* 🎯 IPASA ANG SESSION STATES BILANG PROPS */}
      {role === "ROLE_ADMIN" ? (
        <AI_ADMIN_MAIN
          sharedTicketId={activeTicketId}
          setSharedTicketId={setActiveTicketId}
        />
      ) : (
        <AI_USER_MAIN
          sharedTicketId={activeTicketId}
          setSharedTicketId={setActiveTicketId}
        />
      )}
    </div>
  );
}

export default AI_mainlayout;
