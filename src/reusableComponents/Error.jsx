import React from "react";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import { CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Error_img from "../assets/images/Error_img.png";

function Error({ isOpen, setIsOpen, error }) {
  const navigate = useNavigate();

  //   <CircleX className="text-white" />
  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />

      <div className="min-h-screen flex items-center justify-center  ">
        <div className="max-w-md">
          <img src={Error_img} alt="Error" className="w-70 h-auto" />
          <div className="flex flex-col justify-center gap-1 items-center">
            <span className="font-bold text-3xl">Ops! Error.</span>
            <div className="flex flex-col gap-2 ">
              <span className="text-xl">
                {error?.message || "Hindi makuha ang data mula sa server."}
              </span>
              <button
                onClick={() => window.location.reload()}
                className=" bg-red-500 text-white p-1 rounded-md"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Error;
