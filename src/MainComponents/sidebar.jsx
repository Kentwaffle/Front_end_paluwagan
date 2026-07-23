import React from "react";
import {
  BadgeCent,
  LibraryBig,
  PiggyBank,
  UsersRound,
  HandCoins,
  Headset,
  UserRound,
  ChevronRight,
  ArrowBigLeft,
  ArrowBigRight,
} from "lucide-react";
import White_PaluwaganLogo from "../assets/images/white_outline_SLP.png";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/Auth";
import { getProfileImage } from "../reusableComponents/Hooks/ImageGet";

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
    {
      label: "Memberlist",
      path: "/admin/memberlist",
      icon: <UsersRound size={25} />,
    },
    {
      label: "CS Admin",
      path: "/admin/cs_admin",
      icon: <Headset size={25} />,
    },
  ],
  ROLE_USER: [
    { label: "Loan", path: "/loan", icon: <BadgeCent size={25} /> },
    { label: "Savings", path: "/savings", icon: <PiggyBank size={25} /> },
    { label: "Ledger", path: "/ledger", icon: <LibraryBig size={25} /> },
  ],
};

function Sidebar({ isOpen, setIsOpen, role }) {
  const location = useLocation();
  const sideBarlinks = LINKS[role] || [];
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isChildRoute = pathSegments.length > 2;
  const { logout, user, UserDetails, isLoadingAuth } = useAuth();

  return (
    <>
      <div
        className={`fixed flex flex-col top-0 left-0 bottom-0 p-3 z-50 shadow-2xl bg-slate-900/95 backdrop-blur-md 
  transition-all duration-300 ease-out
  lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none lg:bg-slate-900 shrink-0
  ${isOpen ? "w-52" : "w-20 -translate-x-full lg:translate-x-0"}
`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:flex absolute -right-5 top-100 w-10 h-10 cursor-pointer bg-slate-900 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-sky-500 hover:border-sky-400 transition-all z-50 shadow-md duration-[10000ms]"
        >
          <ChevronRight
            size={20}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* LOGO AREA */}
        <div className="flex justify-center items-center w-full pb-5 shrink-0">
          <img
            src={White_PaluwaganLogo}
            alt="Logo"
            className={`h-auto transition-all duration-300 ${isOpen ? "w-24" : "w-24 lg:w-10"}`}
          />
        </div>

        {/* ASIDE AREA */}
        <aside className="flex flex-col justify-between flex-1 gap-3 text-xl mt-3 text-white pb-2 overflow-y-auto no-scrollbar">
          {/* LINKS BUNDLE */}
          <div className="flex flex-col gap-3">
            {sideBarlinks.map((link) => {
              const isActive = (() => {
                const currentPath = location.pathname;
                if (currentPath === link.path) return true;
                if (currentPath.startsWith(link.path) && link.path !== "/")
                  return true;
                if (link.label === "Loan") {
                  return ["/apply_loan", "/pending_status"].includes(
                    currentPath,
                  );
                }
                return false;
              })();

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`flex gap-3 items-center p-2 rounded-xl transition-all relative group ${
                    isActive
                      ? "bg-sky-500/10 text-sky-400"
                      : "hover:bg-white/5 text-slate-300"
                  } ${!isOpen && "lg:justify-center"}`}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                >
                  <div
                    className={
                      isActive
                        ? "text-sky-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    }
                  >
                    {link.icon}
                  </div>

                  {/* Itatago ang text label sa desktop view kapag sarado ang sidebar */}
                  <div
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-w-[160px] opacity-100"
                        : "max-w-0 opacity-0 lg:max-w-0 lg:opacity-0"
                    }`}
                  >
                    {link.label}
                  </div>

                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-sky-500 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* PROFILE COMPONENT (Lagi nang nakadikit sa ilalim ngayon dahil tinanggal ang hidden class) */}
          <div className="pt-4 border-t border-white/5 mr-1 shrink-0">
            <Link
              to="/profile"
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all ${
                !isOpen && "lg:justify-center lg:p-1.5"
              }`}
            >
              <div className="flex gap-2 items-center justify-between w-full min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 border border-sky-500 rounded-full overflow-hidden shrink-0">
                    <img
                      alt="Profile picture"
                      src={getProfileImage(UserDetails?.profileImage)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Itatago ang profile details kapag mini-sidebar display mode */}
                  <div
                    className={`flex flex-col min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-w-[140px] opacity-100"
                        : "max-w-0 opacity-0 lg:max-w-0 lg:opacity-0"
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-200 truncate block">
                      {UserDetails?.firstName || "User"}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block uppercase tracking-wider">
                      View Account
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className={`text-slate-400 shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen
                      ? "max-w-4 opacity-100"
                      : "max-w-0 opacity-0 lg:max-w-0 lg:opacity-0"
                  }`}
                />
              </div>
            </Link>
          </div>
        </aside>
      </div>

      {/* BACKDROP - para lang sa mobile layouts */}
      {isOpen && !isChildRoute && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
export default Sidebar;
