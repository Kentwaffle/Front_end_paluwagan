import React from "react";
import { Menu, ChevronLeft, Bell } from "lucide-react";
import { getProfileImage } from "../reusableComponents/Hooks/ImageGet";
import { Link, useLocation } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { LoadingHeader } from "../reusableComponents/loading";
import { useQueryClient } from "@tanstack/react-query";
import api from "../serviceToApi/ApiInstance";
import { useAuth } from "../auth/Auth";
import { useNavigate } from "react-router-dom";

function Header({ openSideBar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "ROLE_ADMIN";
  const userID = user?.userId;
  const { data: headerData, isLoading } = useFetchData(
    "/header",
    API_ENDPOINTS.PROFILE_GET,
  );

  const unreadCount = isAdmin
    ? API_ENDPOINTS.NOTIFICATIONS_ADMIN_UNREAD_COUNT
    : userID
      ? API_ENDPOINTS.NOTIFICATIONS_USER_UNREAD_COUNT(userID)
      : null;

  const { data: notifCount, isLoading: notifCountLoading } = useFetchData(
    "notifcount",
    unreadCount,
  );

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isChildRoute =
    pathSegments.length > 2 ||
    (pathSegments[0] === "savings" && pathSegments.length > 1) ||
    console.log("Current Segments:", pathSegments.length);

  const handleBack = () => {
    const lastSegment = location.pathname.split("/").filter(Boolean);
    if (lastSegment.length > 1) {
      lastSegment.pop();
      navigate("/" + lastSegment.join("/"));
    } else {
      navigate("/admin");
    }
  };

  return (
    <div key={"main_header"} className="sticky top-0 z-5">
      {isLoading ? (
        <LoadingHeader key={"LoadingHeaders"} openSideBar={openSideBar} />
      ) : (
        <div
          key={"header"}
          className="navbar bg-white border-b border-gray-100 flex justify-between text-sky-800   min-h-12 h-12 py-0 px-4 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 0"
        >
          <div className="flex items-center cursor-pointer">
            {isChildRoute ? (
              <button
                type="button"
                onClick={() => handleBack()}
                className="p-1 rounded-full"
              >
                <ChevronLeft size={30} />
              </button>
            ) : (
              <Menu onClick={openSideBar} className="cursor-pointer" />
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                navigate("/notification");
              }}
              className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
              aria-label="Notifications"
            >
              <Bell
                size={22}
                className="text-sky-700 dark:text-slate-300 group-hover:scale-110 transition-transform"
              />

              {notifCount ? (
                <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-in zoom-in">
                  {notifCount}
                </span>
              ) : (
                ""
              )}
            </button>
            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center">
              <span className="font-semibold pr-1">
                {headerData?.firstName}
              </span>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex="-1"
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-9 border border-sky-500 rounded-full">
                    <img
                      alt="Profile picture"
                      src={getProfileImage(headerData?.profileImage)}
                    />
                  </div>
                </div>
                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-25 items-center p-2 shadow dark:bg-slate-800 dark:text-slate-200  "
                >
                  <li>
                    <Link
                      to={"/profile"}
                      className="text-sky-800 font-semibold dark:text-slate-200"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="text-red-400 font-semibold dark:text-red-500"
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
