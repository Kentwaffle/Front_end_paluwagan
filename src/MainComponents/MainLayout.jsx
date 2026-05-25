import React, { useState, useMemo } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./sidebar";
import Header from "./Header";
import { useAuth } from "../auth/Auth";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
function MainLayout({ isStatus, isStatusLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const isEditProfilePage = location.pathname === "/profile/edit_profile";
  const isNotification = location.pathname === "/notification";
  const isSettings = location.pathname === "/Settings";
  const isCostumerService = location.pathname === "/customer-service";
  const hideLayout =
    isProfilePage ||
    isEditProfilePage ||
    isNotification ||
    isSettings ||
    isCostumerService;
  const roles = user?.role;

  const hideFooter = isCostumerService;
  // Redirect kung walang token o invalid
  if (!user || !roles) {
    return <Navigate to="/auth" replace />;
  }
  return (
    <div key={"main-app-layout"} className="min-h-screen">
      {!hideLayout && (
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role={roles} />
      )}

      {!hideLayout && <Header openSideBar={() => setIsOpen(!isOpen)} />}
      <main
        className={`
        ${!hideLayout ? "w-full min-h-screen" : ""}
        ${hideLayout && !isCostumerService ? "p-5" : ""} 
        ${isCostumerService ? "p-0" : ""}
      `}
      >
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
