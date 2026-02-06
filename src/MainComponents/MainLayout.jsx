import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./sidebar";
import Header from "./Header";

function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  let roles = "";
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    roles = decoded.role;
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role={roles} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />
      <main>
        <Outlet context={{ roles }} />
      </main>
    </div>
  );
}

export default MainLayout;
