import React, { useState, useMemo } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./sidebar";
import Header from "./Header";
import { useAuth } from "../auth/Auth";

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
    </div>
  );
}

export default MainLayout;
