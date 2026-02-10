import React, { useState, useMemo } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./sidebar";
import Header from "./Header";

function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const isEditProfilePage = location.pathname === "/profile/edit_profile";
  const hideLayout = isProfilePage || isEditProfilePage;
  const roles = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch (error) {
      return null;
    }
  }, [token]);

  // Redirect kung walang token o invalid
  if (!token || !roles) {
    if (!token) localStorage.removeItem("token"); // Cleanup kung sakaling corrupted
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen" key="main-app-layout">
      {!hideLayout && (
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role={roles} />
      )}

      {!hideLayout && <Header openSideBar={() => setIsOpen(!isOpen)} />}
      <main className={`${!hideLayout ? "w-full min-h-screen" : "p-4"}`}>
        <Outlet context={{ roles }} />
      </main>
    </div>
  );
}

export default MainLayout;
