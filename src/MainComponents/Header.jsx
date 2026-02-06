import React from "react";
import { Menu } from "lucide-react";
import Default_pic from "../assets/images/default_pic.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { LoadingHeader } from "../reusableComponents/loading";

function Header({ openSideBar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const { data, isLoading } = useFetchData(
    "/header",
    API_ENDPOINTS.PROFILE_GET,
  );

  return (
    <div key={"main_header"}>
      {isLoading ? (
        <LoadingHeader key={"LoadingHeaders"} openSideBar={openSideBar} />
      ) : (
        <div
          key={"header"}
          className="navbar shadow-sm flex justify-between  bg-sky-300 min-h-12 h-12 py-0 px-4"
        >
          <Menu onClick={openSideBar} />
          <div className="flex items-center">
            <span className="font-semibold pr-1">{data?.firstName}</span>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-9 rounded-full">
                  <img alt="Profile picture" src={Default_pic} />
                </div>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-25 items-center p-2 shadow"
              >
                <li>
                  <Link to={"/profile"} className="text-sky800 font-semibold">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
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
