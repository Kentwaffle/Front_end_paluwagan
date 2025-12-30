import React from "react";
import { Outlet } from "react-router-dom";
import PaluwaganLogo from "../assets/images/mainLogoPaluwagan.jpg";
import { useState } from "react";

function PaluwaganMain() {
  const [currentView, setCurrentView] = useState("signin");
  return (
    <div className="h-screen w-full flex flex-col items-center p-5">
      <img
        src={PaluwaganLogo}
        alt="No image render"
        className="w-auto h-aut mt-10"
      />
      <Outlet />
    </div>
  );
}

export default PaluwaganMain;
