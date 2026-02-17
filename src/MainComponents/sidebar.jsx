import React from "react";
import { BadgeCent, HandCoins, PiggyBank } from "lucide-react";
import White_PaluwaganLogo from "../assets/images/white_outline_SLP.png";
import { Link, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const sideBarlinks = LINKS[role] || [];
  return (
    <>
      <div
        key={"sidebar"}
        className={`fixed w-45 top-0 left-0 bottom-0 p-3 z-50 shadow-2xl bg-slate-900/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-center items-center w-full  pb-5">
          <img src={White_PaluwaganLogo} alt="Logo" className=" w-24 h-auto" />
        </div>

        <aside className="flex flex-col gap-3 text-xl  text-white pl-2">
          {sideBarlinks.map((link) => {
            const currentPath = location.pathname;

            const isLoanActive =
              link.label === "Loan" &&
              ["/loan", "/pending_status", "/apply_loan"].includes(currentPath);
            const isSavingsActive =
              link.label === "Savings" &&
              ["/savings", "/apply_savings"].includes(currentPath);
            const isOtherActive = currentPath === link.path;

            const isActive = isLoanActive || isOtherActive || isSavingsActive;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`flex gap-3 items-center p-3 rounded-lg transition-colors ${
                  isActive ? "bg-sky-500/10" : "hover:bg-white/5"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className={isActive ? "text-sky-400" : "text-slate-400"}>
                  {link.icon}
                </div>
                <div
                  className={`${isActive ? "text-sky-400" : "text-slate-300"} text-lg font-medium`}
                >
                  {link.label}
                </div>

                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-sky-500 rounded-r-full" />
                )}
              </Link>
            );
          })}
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
