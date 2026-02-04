import React from "react";
import { Menu } from "lucide-react";

export const LoadingServer = () => (
  <div className="fixed inset-0 z-99 flex flex-col items-center justify-center bg-white">
    <div className="relative">
      <div className="w-24 h-24 rounded-full border border-slate-100"></div>
      <div className="absolute top-0 w-24 h-24 rounded-full border border-transparent border-t-sky-500 border-l-sky-500 animate-spin"></div>
    </div>

    <div className="mt-10 flex flex-col items-center gap-1">
      <span className="text-[12px] uppercase tracking-[0.4em] font-light text-slate-500">
        Connecting to server
      </span>
      <div className="h-[1px] w-full bg-sky-200 animate-pulse"></div>
    </div>
  </div>
);

export const LoadingFilter = () => (
  <div className="fixed inset-0 z-99 flex flex-col items-center justify-center bg-white">
    <div className="relative">
      <div className="w-24 h-24 rounded-full border border-slate-100"></div>
      <div className="absolute top-0 w-24 h-24 rounded-full border border-transparent border-t-sky-500 border-l-sky-500 animate-spin"></div>
    </div>

    <div className="mt-10 flex flex-col items-center gap-1">
      <span className="text-[12px] uppercase tracking-[0.4em] font-light text-slate-500">
        Searching...
      </span>
      <div className="h-[1px] w-full bg-sky-200 animate-pulse"></div>
    </div>
  </div>
);

export const LoadingApply = () => (
  <>
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

export const LoadingLoan = () => (
  <>
    <div className="min-h-screen p-3 flex flex-col gap-5">
      <div className=" w-full rounded-xl skeleton h-80 flex flex-col items-center justify-center"></div>
      <div className=" w-full rounded-xl skeleton h-70 flex flex-col items-center justify-center"></div>
    </div>
  </>
);
