import React, { useState, useMemo } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./sidebar";
import Header from "./Header";
import { useAuth } from "../auth/Auth";
import { MessageSquare } from "lucide-react";
function MainLayout({ isStatus, isStatusLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, token } = useAuth();

  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const isEditProfilePage = location.pathname === "/profile/edit_profile";
  const isNotification = location.pathname === "/notification";
  const hideLayout = isProfilePage || isEditProfilePage || isNotification;
  const roles = user?.role;

  // Redirect kung walang token o invalid
  if (!token || !roles) {
    if (!token) localStorage.removeItem("token"); // Cleanup kung sakaling corrupted
    return <Navigate to="/auth" replace />;
  }

  return (
    <div key={"main-app-layout"} className="min-h-screen">
      {!hideLayout && (
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role={roles} />
      )}

      {!hideLayout && <Header openSideBar={() => setIsOpen(!isOpen)} />}
      <main className={`${!hideLayout ? "w-full min-h-screen" : "p-5"}`}>
        <Outlet context={{ roles, isStatus, isStatusLoading }} />
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
          <MessageSquare size={18} />
        </button>
      </div>
    </div>
  );
}

export default MainLayout;
