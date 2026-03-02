import React from "react";
import { BadgeCent, HandCoins, PiggyBank } from "lucide-react";
import White_PaluwaganLogo from "../assets/images/white_outline_SLP.png";
import { Link, useLocation } from "react-router-dom";

const LINKS = {
  ROLE_ADMIN: [
    {
      label: "Loan Admin",
      path: "/admin/loan_management",
      icon: <BadgeCent size={25} />,
    },
    {
      label: "Savings Admin ",
      path: "/admin/savings_management",
      icon: <PiggyBank size={25} />,
    },
    {
      label: "Funds Admin",
      path: "/admin/funds_management",
      icon: <HandCoins size={25} />,
    },
  ],
  ROLE_USER: [
    { label: "Loan", path: "/loan", icon: <BadgeCent size={25} /> },
    { label: "Savings", path: "/savings", icon: <PiggyBank size={25} /> },
    { label: "Payment", path: "/", icon: <HandCoins size={25} /> },
  ],
};

function Sidebar({ isOpen, setIsOpen, role }) {
  const location = useLocation();
  const sideBarlinks = LINKS[role] || [];
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isChildRoute = pathSegments.length > 2;

  return (
    <>
      <div
        className={`fixed w-45 top-0 left-0 bottom-0 p-3 z-50 shadow-2xl bg-slate-900/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-center items-center w-full  pb-5">
          <img src={White_PaluwaganLogo} alt="Logo" className=" w-24 h-auto" />
        </div>

        <aside className="flex flex-col gap-3 text-xl  text-white pl-2">
          {sideBarlinks.map((link) => {
            const isActive = (() => {
              const currentPath = location.pathname;
              if (currentPath === link.path) return true;
              if (currentPath.startsWith(link.path) && link.path !== "/")
                return true;
              if (link.label === "Loan") {
                return ["/apply_loan", "/pending_status"].includes(currentPath);
              }

              return false;
            })();

            return (
              <Link
                key={link.label}
                to={link.path}
                className={`flex gap-3 items-center p-1 rounded-lg transition-colors ${
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
      {isOpen && !isChildRoute && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
