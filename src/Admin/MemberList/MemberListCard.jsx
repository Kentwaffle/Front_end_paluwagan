import React from "react";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { formatDate } from "../../reusableComponents/Utils/formatter";

function MemberListCard({ content, memberHandle }) {
  return (
    <button
      onClick={memberHandle}
      className="p-5 md:p-6 bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-sm w-full active:scale-95 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow text-left"
    >
      <div className="flex justify-between items-center w-full">
        
        {/* Left Side: Profile Photo & Details */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {/* Avatar circle */}
            <div className="w-10 h-10 md:w-12 md:h-12 flex justify-center items-center border border-slate-100 dark:border-slate-800 rounded-full overflow-hidden">
              <img
                alt="Profile picture"
                src={getProfileImage(content.profile_image)}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Status indicators */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-slate-900 rounded-full ${
                content.isOnline ? "bg-emerald-500" : "bg-red-500"
              }`}
            ></div>
          </div>

          <div className="flex flex-col text-left">
            <span className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-200 leading-tight">
              {`${content.first_name} ${content.last_name}` || "No data found"}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {formatDate(content.verified_date) || "No data found"}
            </span>
          </div>
        </div>

        {/* Right Side: Role Badge */}
        <div className="shrink-0">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          >
            {content.role_name === "ROLE_ADMIN" ? "ADMIN" : "USER"}
          </span>
        </div>

      </div>

      {/* Grid columns section for user loans and savings */}
      {content.role_name === "ROLE_USER" && (
        <div className="grid grid-cols-2 gap-4 mt-5">
          
          {/* Active Loan Container Block */}
          <div className="flex flex-col items-start p-3 md:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-850">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1 w-full text-left">
              Active Loan
            </span>
            <span
              className={`text-xs font-bold ${content.has_loan === true ? "text-slate-700 dark:text-slate-200" : "text-slate-500"} flex items-center gap-1.5`}
            >
              <div
                className={`w-2 h-2 rounded-full ${content.has_loan === true ? "bg-emerald-500" : "bg-slate-400"}`}
              ></div>
              {content.has_loan === true ? "Yes" : "None"}
            </span>
          </div>

          {/* Active Savings Container Block */}
          <div className="flex flex-col items-start p-3 md:p-4 bg-slate-50 dark:bg-slate-955 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-855">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1 w-full text-left">
              Active Savings
            </span>
            <span
              className={`text-xs font-bold flex items-center gap-1.5 ${content.has_savings_account === true ? "text-slate-700 dark:text-slate-200" : "text-slate-500"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${content.has_savings_account === true ? "bg-emerald-500" : "bg-slate-400"}`}
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
