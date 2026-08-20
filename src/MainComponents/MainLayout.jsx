import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./Header";
import { useAuth } from "../auth/Auth";
import { PAGE_META } from "./pageHeader";
import Notification from "./Notification";
import { Bell } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import NotificationBell from "./NotificationBell";

function MainLayout({ isStatus, isStatusLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, UserDetails } = useAuth();
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const isEditProfilePage = location.pathname === "/profile/edit_profile";
  const isNotification = location.pathname === "/notification";
  const isSettings = location.pathname === "/Settings";
  const isCostumerService = location.pathname === "/customer-service";
  const hideLayout =
    isProfilePage || isEditProfilePage || isSettings || isCostumerService;
  const roles = user?.role;
  const pageMeta = PAGE_META[location.pathname];
  const hideNotificationButton = isNotification;
  const resolvedTitle =
    typeof pageMeta?.title === "function"
      ? pageMeta.title(UserDetails?.firstName || "User")
      : pageMeta?.title;

  const hideFooter = isCostumerService;
  const queryClient = useQueryClient();
  const notifCount =
    queryClient.getQueryData(["notifCount", user?.userId]) || 0;

  console.log("notifCount ", notifCount);

  if (!user || !roles) {
    return <Navigate to="/auth" replace />;
  }
  return (
    <div
      key={"main-app-layout"}
      className="min-h-screen lg:flex lg:flex-row bg-slate-50 dark:bg-slate-950"
    >
      {!hideLayout && (
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role={roles} />
      )}

      {!hideLayout && (
        <div className="hidden lg:block absolute top-4 left-4 z-10">
          <Header
            openSideBar={() => setIsOpen(!isOpen)}
            isDesktopButton={true}
          />
        </div>
      )}

      {!hideLayout && <Header openSideBar={() => setIsOpen(!isOpen)} />}
      <main
        className={`
  ${!hideLayout ? "flex-1 min-w-0 min-h-screen md:px-25 md:bg-white dark:md:bg-slate-900 md:shadow-lg" : "w-full"}
  ${hideLayout && !isCostumerService ? "p-5" : ""} 
  ${isCostumerService ? "p-0" : ""}
`}
      >
        {pageMeta && !hideNotificationButton && (
          <div className="hidden lg:flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pt-8 pb-5 px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {resolvedTitle}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {pageMeta.description}
              </p>
            </div>

            <NotificationBell />
          </div>
        )}

        <Outlet context={{ roles, isStatus, isStatusLoading }} />
      </main>

      {!hideFooter && !roles === "ROLE_ADMIN" && (
        <footer className="mt-auto pb-5 flex flex-col items-center gap-1 opacity-60">
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <button className="hover:text-sky-500 transition-colors">
              Terms
            </button>
            <span className="text-slate-200">•</span>
            <button className="hover:text-sky-500 transition-colors">
              Privacy
            </button>
          </div>
          <span className="text-[10px] text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mt-2">
            Paluwagan v1.0.0 ({new Date().getFullYear()})
          </span>
        </footer>
      )}
    </div>
  );
}

export default MainLayout;
