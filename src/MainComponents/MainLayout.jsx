import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./sidebar";
import Header from "./Header";

function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  let role = "";
  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (error) {
    console.error("Invalid token");
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role={role} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />
      <main>
        <Outlet context={{ role }} />
      </main>
    </div>
  );
}

export default MainLayout;
