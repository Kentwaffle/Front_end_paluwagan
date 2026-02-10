import React from "react";
import {
  BadgeCent,
  UserRoundPen,
  HandCoins,
  PiggyBank,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import PaluwaganLogo from "../assets/images/mainLogoPaluwagan.jpg";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LINKS = {
  ROLE_ADMIN: [
    { label: "Loan Management", path: "/admin", icon: <BadgeCent size={25} /> },
    {
      label: "Member Savings",
      path: "",
      icon: <PiggyBank size={25} />,
    },
    { label: "Transactions", path: "", icon: <HandCoins size={25} /> },
  ],
  ROLE_USER: [
    { label: "Loan", path: "/loan", icon: <BadgeCent size={25} /> },
    { label: "Savings", path: "/savings", icon: <PiggyBank size={25} /> },
    { label: "Payment", path: "", icon: <HandCoins size={25} /> },
  ],
};

function Sidebar({ isOpen, setIsOpen, role }) {
  const sideBarlinks = LINKS[role] || [];

  return (
    <>
      <div
        key={"sidebar"}
        className={`fixed w-45 top-0 left-0 bottom-0 p-3 z-50 shadow-2xl bg-sky-200 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <img src={PaluwaganLogo} alt="Error! No image" className="pb-5" />

        <aside className="flex flex-col gap-3 text-xl  text-stone-700 pl-2">
          {sideBarlinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="flex gap-3 items-center"
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </aside>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[0.5px]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
