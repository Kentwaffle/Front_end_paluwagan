import React from "react";
import { Menu } from "lucide-react";

export const LoadingServer = () => (
  <div
    key={"LoadingServer"}
    className="fixed inset-0 z-99 flex flex-col items-center justify-center bg-white"
  >
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
  <div
    key={"LoadingApply"}
    className="fixed inset-0 z-99 flex flex-col items-center justify-center bg-white"
  >
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
    <div key={"LoadingApply"} className="min-h-screen p-3 flex  flex-col gap-5">
      <div className="skeleton h-70 shadow-md border border-slate-200 p-3 rounded-xl"></div>
    </div>
  </>
);

export const LoadingHeader = ({ openSideBar }) => (
  <div
    key={"LoadingHeader"}
    className="navbar flex justify-between bg-white border-b border-gray-100 min-h-12 h-12 py-0 px-4"
  >
    <Menu onClick={openSideBar} />
    <div className="flex items-center gap-2">
      <span className="skeleton h-2 w-12 shrink-0"></span>
      <span className="skeleton h-9 w-9 shrink-0 rounded-full"></span>
    </div>
  </div>
);

export const LoadingLoan = () => (
  <>
    <div key={"LoadingLoan"} className="min-h-screen p-3 flex flex-col gap-5">
      <div className=" shadow-sm  w-full rounded-xl skeleton h-80 flex flex-col items-center justify-center"></div>
      <div className=" shadow-sm  w-30 rounded-xl skeleton h-6 flex flex-col items-center justify-center"></div>
      <div className="flex gap-4">
        <div className=" shadow-sm  w-full rounded-xl skeleton h-8 flex flex-col items-center justify-center"></div>
        <div className=" shadow-sm  w-15 rounded-xl skeleton h-8 flex flex-col items-center justify-center"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className=" shadow-sm  w-full rounded-xl skeleton h-18 flex flex-col items-center justify-center"></div>
        <div className=" shadow-sm  w-full rounded-xl skeleton h-18 flex flex-col items-center justify-center"></div>
        <div className=" shadow-sm  w-full rounded-xl skeleton h-18 flex flex-col items-center justify-center"></div>
      </div>
    </div>
  </>
);

export const SavingsLoading = () => (
  <>
    <div
      key={"SavingsLoading"}
      className="min-h-screen p-3 flex  flex-col gap-5"
    >
      <div className="skeleton h-70 shadow-sm border border-slate-200 p-3 rounded-xl"></div>
      <div className="skeleton h-2 w-30 shadow-sm border border-slate-200 p-3 rounded-lg"></div>
      <div className="skeleton h-60 shadow-sm border border-slate-200 p-3 rounded-lg"></div>
      <div className="skeleton h-2 w-30 shadow-sm border border-slate-200 p-3 rounded-lg"></div>
      <div className="skeleton h-15 shadow-sm border border-slate-200 p-3 rounded-lg"></div>
      <div className="skeleton h-15 shadow-sm border border-slate-200 p-3 rounded-lg"></div>
    </div>
  </>
);

export const ProfileLoading = () => (
  <>
    <div
      key={"ProfileLoading"}
      className="min-h-screen p-3 flex  flex-col gap-5"
    >
      <div className="flex justify-between">
        <div className="skeleton h-10 w-10 shadow-sm border border-slate-200 p-3 rounded-xl"></div>
        <div className="skeleton h-10 w-10 shadow-sm border border-slate-200 p-3 rounded-lg"></div>
      </div>
      <div className="flex justify-center items-center">
        <div className="skeleton h-30 w-30 shadow-sm border border-slate-200 p-3 rounded-full"></div>
      </div>

      <div className="skeleton h-100 shadow-sm border border-slate-200 p-3 rounded-lg"></div>
      <div className="skeleton h-15 shadow-sm border border-slate-200 p-3 rounded-lg"></div>
    </div>
  </>
);
