import React from "react";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { formatDate } from "../../reusableComponents/formatter";
function MemberListCard({ content, memberHandle }) {
  return (
    <button
      onClick={memberHandle}
      className="p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm w-full active:scale-95 border border-transparent dark:border-slate-800"
    >
      <div className="flex justify-center ">
        <div className="flex items-start flex-1 gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-9 h-9 flex justify-center items-center border border-sky-500 rounded-full overflow-hidden dark:border-sky-400">
                <img
                  alt="Profile picture"
                  src={getProfileImage(content.profile_image)}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                  content.isOnline ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
            <div className="flex flex-col flex-1 items-start min-w-0">
              <div className="flex flex-wrap gap-1 truncate w-full font-bold">
                <span className="text-slate-800 dark:text-slate-200">
                  {`${content.first_name} ${content.last_name}` ||
                    "No data found"}
                </span>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                {formatDate(content.verified_date) || "No data found"}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border ${
              content.role_name === "ROLE_ADMIN"
                ? "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 font-bold tracking-wider"
                : "text-gray-500 border-gray-300 dark:text-slate-400 dark:border-slate-600"
            }`}
          >
            {content.role_name === "ROLE_ADMIN" ? "ADMIN" : "USER"}
          </span>
        </div>
      </div>

      {content.role_name === "ROLE_USER" && (
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="flex flex-col items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1 text-left w-full">
              Active Loan
            </label>
            <span
              className={`text-sm font-semibold ${content.has_loan === true ? "text-emerald-400" : "text-slate-400"} flex items-center gap-1`}
            >
              <div
                className={`w-2 h-2 rounded-full  ${content.has_loan === true ? "bg-emerald-400" : "bg-slate-400"}`}
              ></div>
              {content.has_loan === true ? "Yes" : "None"}
            </span>
          </div>

          <div className="flex flex-col items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1 text-left w-full">
              Active Savings
            </label>
            <span
              className={`text-sm font-semibold  flex items-center gap-1 ${content.has_savings_account === true ? "text-emerald-400" : "text-slate-400"}`}
            >
              <div
                className={`w-2 h-2 rounded-full  dark:bg-slate-600 ${content.has_savings_account === true ? "bg-emerald-400" : "bg-slate-400"}`}
              ></div>
              {content.has_savings_account === true ? "Yes" : "None"}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}

export default MemberListCard;
