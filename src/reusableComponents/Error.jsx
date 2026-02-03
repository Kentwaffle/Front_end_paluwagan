import React from "react";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import { CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Error_img from "../assets/images/Error_img.png";

function Error({ error }) {
  const navigate = useNavigate();
  const handlerelogin = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isExpired = error?.response?.data?.error === "EXPIRED_TOKEN";

  return (
    <div className="min-h-screen flex items-center justify-center p-5 ">
      <div className="max-w-md flex flex-col justify-center items-center">
        <img src={Error_img} alt="Error" className="w-70 h-auto" />
        <div className="flex flex-col justify-center gap-1 items-center">
          <span className="font-bold text-3xl">
            {isExpired ? "Session Expired" : "Ops! Error."}
          </span>
          <div className="flex flex-col gap-2 ">
            <span className="text-xl text-center text-gray-600">
              {isExpired
                ? "Session Expired. Please log in your account."
                : error?.message || "Please log in your account"}
            </span>
            <button
              onClick={handlerelogin}
              className=" bg-red-500 text-white p-2 rounded-md"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
