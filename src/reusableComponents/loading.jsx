import React from "react";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import { Menu } from "lucide-react";

export const LoadingApply = ({ isOpen, setIsOpen }) => (
  <>
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    <Header openSideBar={() => setIsOpen(!isOpen)} />
    <div className="min-h-screen p-3 flex  flex-col gap-5">
      <div className="skeleton h- shadow-md border border-slate-200 p-3 rounded-xl"></div>
    </div>
  </>
);

export const LoadingHeader = ({ openSideBar }) => (
  <div className="navbar shadow-sm flex justify-between  bg-sky-300 min-h-12 h-12 py-0 px-4">
    <Menu onClick={openSideBar} />
    <div className="flex items-center">
      <span className="skeleton skeleton-text mr-2">Loading...</span>
      <span className="skeleton h-9 w-9 shrink-0 rounded-full"></span>
    </div>
  </div>
);

export const LoadingSpinnerLoan = ({ isOpen, setIsOpen }) => (
  <>
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    <Header openSideBar={() => setIsOpen(!isOpen)} />
    <div className="min-h-screen p-3 flex flex-col gap-5">
      <div className=" w-full rounded-xl skeleton h-80 flex flex-col items-center justify-center"></div>
      <div className=" w-full rounded-xl skeleton h-70 flex flex-col items-center justify-center"></div>
    </div>
  </>
);
