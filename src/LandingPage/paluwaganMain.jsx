import React from "react";
import { Outlet, Link } from "react-router-dom";
import Black_PaluwaganLogo from "../assets/images/black_outline_SLP.png";
import { useState } from "react";

function PaluwaganMain() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3">
      <div
        className="flex flex-col items-center w-full 
                      md:flex-row md:justify-center md:border-2 md:border-stone-300 md:rounded-xl md:shadow-lg 
                      md:max-w-5xl bg-slate-50 overflow-hidden"
      >
        <div className="md:flex-col md:border-stone-300 h-full flex items-center justify-center p-5 w-full md:w-1/2">
          <div className="flex justify-center items-center bg-transparent w-full">
            <img
              src={Black_PaluwaganLogo}
              alt="Erro! No image found"
              className="w-64 max-h-full object-contain "
            />
          </div>
          <span className="hidden  md:block text-center text-md text-stone-700 md:mt-2">
            Your trusted digital savings. Save together, grow together, and
            reach your goals faster.
          </span>
        </div>
        <div className="w-full md:w-1/2 flex items-center md:my-5 justify-center md:border-l-2 md:border-stone-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default PaluwaganMain;
