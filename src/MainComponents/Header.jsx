import React from "react";
import { Menu, ChevronLeft, Bell, EllipsisVertical } from "lucide-react";
import { getProfileImage } from "../reusableComponents/Hooks/ImageGet";
import { Link, useLocation } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { LoadingHeader } from "../reusableComponents/Feedbacks/loading";
import { useQueryClient } from "@tanstack/react-query";
import api from "../serviceToApi/ApiInstance";
import { useAuth } from "../auth/Auth";
import { useNavigate } from "react-router-dom";

function Header({ openSideBar, isDesktopButton = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, UserDetails, isLoadingAuth } = useAuth();
  const isAdmin = user?.role === "ROLE_ADMIN";
  const userID = user?.userId;
  const headerData = UserDetails;
  const isLoading = isLoadingAuth;

  const unreadCount = isAdmin
    ? API_ENDPOINTS.NOTIFICATIONS_ADMIN_UNREAD_COUNT
    : userID
      ? API_ENDPOINTS.NOTIFICATIONS_USER_UNREAD_COUNT(userID)
      : null;

  const { data: notifCount, isLoading: notifCountLoading } = useFetchData(
    ["notifCount", userID],
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

  // Desktop view button for sidebar toggle or back button based on route depth.
  if (isDesktopButton) {
    return (
      <div className="hidden lg:flex items-center justify-center fixed top-3 left-3 z-50 bg-white dark:bg-slate-800 shadow-md rounded-xl border border-slate-100 dark:border-slate-700">
        {isChildRoute ? (
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sky-800 dark:text-slate-200 transition-all"
          >
            <ChevronLeft />
          </button>
        ) : (
          <button
            type="button"
            onClick={openSideBar}
            className="p-3 cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sky-800 dark:text-slate-200 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div key={"main_header"} className="sticky top-0 z-5 lg:hidden md">
      {isLoading ? (
        <LoadingHeader key={"LoadingHeaders"} openSideBar={openSideBar} />
      ) : (
        <div
          key={"header"}
          className="navbar bg-white border-b border-gray-100 flex justify-between text-sky-800  min-h-12 h-12 md:min-h-15 md:h-15 lg:min-h-20 lg:h-20 sm:h-18 py-0 px-4 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 0"
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
              <Menu
                onClick={openSideBar}
                className="cursor-pointer w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-sky-800 dark:text-slate-200"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                navigate("/notification");
              }}
              className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group cursor-pointer"
              aria-label="Notifications"
            >
              <Bell
                size={22}
                className="text-sky-700 dark:text-slate-300 group-hover:scale-110 transition-transform md:w-6 md:h-6 lg:w-8 lg:h-8"
              />

              {notifCount ? (
                <span className="absolute  md:text-xs lg:text-sm top-1 right-1 flex h-3 w-3 md:h-5 md:w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-in zoom-in">
                  {notifCount}
                </span>
              ) : (
                ""
              )}
            </button>
            <div className="h-4 w-[1px] md:h-6   bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center">
              <span className="font-semibold pr-1 md:pr-2 lg:pr-3 text-sm md:text-base lg:text-lg  dark:text-slate-200">
                {headerData?.firstName}
              </span>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex="-1"
                  role="button"
                  className="btn btn-ghost btn-circle avatar sm:btn-sm md:btn-md lg:btn-lg p-0 border-0 hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-pointer"
                >
                  <div className="w-9 md:w-12 lg:w-14 border border-sky-500 rounded-full">
                    <img
                      alt="Profile picture"
                      src={getProfileImage(headerData?.profileImage)}
                    />
                  </div>
                </div>
                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-25 items-center p-2 shadow dark:bg-slate-800 dark:text-slate-200 md:w-40"
                >
                  <li>
                    <Link
                      to={"/profile"}
                      className="text-sky-800 font-semibold dark:text-slate-200 md:text-sm lg:text-base"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="text-red-400 font-semibold dark:text-red-500 md:text-sm lg:text-base"
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
