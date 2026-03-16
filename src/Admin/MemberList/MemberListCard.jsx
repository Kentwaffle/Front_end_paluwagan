import React from "react";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";

function MemberListCard() {
  return (
    <button className="p-5 bg-white dark:bg-slate-900 my-3 rounded-2xl shadow-sm w-full active:scale-95 border border-transparent dark:border-slate-800">
      <div className="flex justify-center ">
        <div className="flex items-start flex-1 gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 flex justify-center items-center border border-sky-500 rounded-full overflow-hidden dark:border-sky-400">
              <img
                alt="Profile picture"
                src={getProfileImage()}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex flex-col flex-1 items-start min-w-0">
              <div className="flex flex-wrap gap-1 truncate w-full font-bold">
                <span className="text-slate-800 dark:text-slate-200">
                  Full name
                </span>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                Date have joined
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
            USER
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="flex flex-col items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1 text-left w-full">
            Active Loan
          </label>
          <span className="text-sm font-semibold text-success flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            Yes
          </span>
        </div>

        <div className="flex flex-col items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1 text-left w-full">
            Active Loan
          </label>
          <span className="text-sm font-semibold text-base-content/40 dark:text-slate-400 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-base-300 dark:bg-slate-600"></div>
            No
          </span>
        </div>
      </div>
    </button>
  );
}

export default MemberListCard;
