import React from "react";
import { Menu, ChevronLeft } from "lucide-react";
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
  const { logout } = useAuth();

  const { data: headerData, isLoading } = useFetchData(
    "/header",
    API_ENDPOINTS.PROFILE_GET,
  );
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isChildRoute = pathSegments.length > 2;

  console.log("Current Segments:", pathSegments.length);
  return (
    <div key={"main_header"} className="sticky top-0 z-5">
      {isLoading ? (
        <LoadingHeader key={"LoadingHeaders"} openSideBar={openSideBar} />
      ) : (
        <div
          key={"header"}
          className="navbar  bg-white border-b border-gray-100 flex justify-between text-sky-800   min-h-12 h-12 py-0 px-4"
        >
          <div className="flex items-center cursor-pointer">
            {isChildRoute ? (
              <button
                type="button"
                onClick={(e) => {
                  if (location.pathname.includes("savings_management")) {
                    navigate("/admin/savings_management", { replace: true });
                  } else {
                    navigate(-1);
                  }
                }}
                className="p-1 rounded-full"
              >
                <ChevronLeft size={30} />
              </button>
            ) : (
              <Menu onClick={openSideBar} className="cursor-pointer" />
            )}
          </div>

          <div className="flex items-center">
            <span className="font-semibold pr-1">{headerData?.firstName}</span>
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
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-25 items-center p-2 shadow"
              >
                <li>
                  <Link to={"/profile"} className="text-sky-800 font-semibold">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="text-red-400 font-semibold"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
