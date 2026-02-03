import React from "react";
import { BadgeCent, UserRoundPen, HandCoins, PiggyBank } from "lucide-react";
import { useState } from "react";
import PaluwaganLogo from "../assets/images/mainLogoPaluwagan.jpg";
import { Link, Outlet, useNavigate } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      <div
        key={"sidebar"}
        className={`fixed w-45 top-0 left-0 bottom-0 p-3 z-50 shadow-2xl bg-sky-200 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <img src={PaluwaganLogo} alt="Error! No image" className="pb-5" />

        <div className="flex flex-col gap-3 text-xl  text-stone-700 pl-2">
          <Link to={"/loan"} className="flex gap-3  ">
            <BadgeCent size={25} />
            <span>Loan</span>
          </Link>
          <Link to={"/savings"} className="flex gap-3">
            <PiggyBank size={25} />
            <span>Savings</span>
          </Link>
          <Link className="flex gap-3">
            <HandCoins size={25} />
            <span>Payment</span>
          </Link>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[0.5px]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
