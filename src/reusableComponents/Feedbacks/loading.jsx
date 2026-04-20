import React from "react";
import { Menu } from "lucide-react";

export const LoadingServer = () => (
  <div
    key={"LoadingServer"}
    className="fixed inset-0 z-99 flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-500"
  >
    <div className="relative">
      <div className="w-24 h-24 rounded-full border border-slate-100 "></div>
      <div className="absolute top-0 w-24 h-24 rounded-full border border-transparent border-t-sky-500 border-l-sky-500 animate-spin"></div>
    </div>

    <div className="mt-10 flex flex-col items-center gap-1">
      <span className="text-[12px] uppercase tracking-[0.4em] font-light text-slate-500 dark:text-slate-400">
        Connecting to server
      </span>
      <div className="h-[1px] w-full bg-sky-200 dark:bg-sky-900 animate-pulse"></div>
    </div>
  </div>
);

export const LoadingFilter = () => (
  <div
    key={"LoadingApply"}
    className="fixed inset-0 z-99 flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-500"
  >
    <div className="relative">
      <div className="w-24 h-24 rounded-full border border-slate-100 "></div>
      <div className="absolute top-0 w-24 h-24 rounded-full border border-transparent border-t-sky-500 border-l-sky-500 animate-spin"></div>
    </div>

    <div className="mt-10 flex flex-col items-center gap-1">
      <span className="text-[12px] uppercase tracking-[0.4em] font-light text-slate-500 dark:text-slate-400">
        Searching...
      </span>
      <div className="h-[1px] w-full bg-sky-200 dark:bg-sky-900 animate-pulse"></div>
    </div>
  </div>
);

export const LoadingApply = () => (
  <>
    <div
      key={"LoadingApply"}
      className="min-h-screen p-5 flex flex-col gap-5 bg-white dark:bg-slate-950"
    >
      <div className="skeleton h-70 shadow-md   p-3 rounded-xl  dark:bg-slate-800"></div>
    </div>
  </>
);

export const LoadingHeader = ({ openSideBar }) => (
  <div
    key={"LoadingHeader"}
    className="navbar flex justify-between bg-white dark:bg-slate-950 border-b border-gray-100  min-h-12 h-12 py-0 px-4"
  >
    <Menu onClick={openSideBar} className="dark:text-slate-400" />
    <div className="flex items-center gap-2">
      <span className="skeleton h-2 w-12 shrink-0  dark:bg-slate-800"></span>
      <span className="skeleton h-9 w-9 shrink-0 rounded-full  dark:bg-slate-800"></span>
    </div>
  </div>
);

export const LoadingLoan = () => (
  <>
    <div
      key={"LoadingLoan"}
      className="min-h-screen p-5 flex flex-col gap-5 bg-white dark:bg-slate-950"
    >
      <div className="shadow-sm w-full rounded-xl skeleton h-80 flex flex-col items-center justify-center  dark:bg-slate-800"></div>
      <div className="shadow-sm w-30 rounded-xl skeleton h-6 flex flex-col items-center justify-center  dark:bg-slate-800"></div>
      <div className="flex gap-4">
        <div className="shadow-sm w-full rounded-xl skeleton h-8 flex flex-col items-center justify-center  dark:bg-slate-800"></div>
        <div className="shadow-sm w-15 rounded-xl skeleton h-8 flex flex-col items-center justify-center  dark:bg-slate-800"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="shadow-sm w-full rounded-xl skeleton h-18 flex flex-col items-center justify-center  dark:bg-slate-800"></div>
        <div className="shadow-sm w-full rounded-xl skeleton h-18 flex flex-col items-center justify-center  dark:bg-slate-800"></div>
        <div className="shadow-sm w-full rounded-xl skeleton h-18 flex flex-col items-center justify-center  dark:bg-slate-800"></div>
      </div>
    </div>
  </>
);

export const SavingsLoading = () => (
  <>
    <div
      key={"SavingsLoading"}
      className="min-h-screen p-5 flex flex-col gap-5 bg-white dark:bg-slate-950"
    >
      <div className="skeleton h-40 shadow-sm   p-3 rounded-xl  dark:bg-slate-800"></div>
      <div className="skeleton h-2 w-30 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
      <div className="skeleton h-50 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
      <div className="flex justify-between">
        <div className="skeleton h-2 w-25 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
        <div className="skeleton h-2 w-15 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
      </div>

      <div className="skeleton h-15 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
      <div className="skeleton h-15 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
    </div>
  </>
);

export const ProfileLoading = () => (
  <>
    <div
      key={"ProfileLoading"}
      className="min-h-screen p-5 flex flex-col gap-5 bg-white dark:bg-slate-950"
    >
      <div className="flex justify-between">
        <div className="skeleton h-10 w-10 shadow-sm   p-3 rounded-xl  dark:bg-slate-800"></div>
        <div className="skeleton h-10 w-10 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
      </div>
      <div className="flex justify-center items-center">
        <div className="skeleton h-30 w-30 shadow-sm   p-3 rounded-full  dark:bg-slate-800"></div>
      </div>

      <div className="skeleton h-100 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
      <div className="skeleton h-15 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
    </div>
  </>
);

export const PaymentListLoading = () => (
  <>
    <div
      key={"paymentListLoading"}
      className="min-h-screen flex flex-col gap-5 bg-white dark:bg-slate-950"
    >
      <div className="skeleton h-50 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
      <div className="skeleton w-30 h-5 shadow-sm   p-3 rounded-xl  dark:bg-slate-800"></div>
      <div className="skeleton h-15 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
      <div className="skeleton w-30 h-5 shadow-sm   p-3 rounded-xl  dark:bg-slate-800"></div>
      <div className="skeleton h-15 shadow-sm   p-3 rounded-lg  dark:bg-slate-800"></div>
    </div>
  </>
);
