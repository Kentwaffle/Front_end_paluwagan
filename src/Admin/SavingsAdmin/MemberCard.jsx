import React from "react";
import { ChevronRight } from "lucide-react";

const MemberCard = ({ member, onAction, formatCurrency, getProfileImage }) => {
  return (
    <div
      key={member.savingId || member.firstName}
      className="bg-white my-3 w-full p-5 rounded-2xl shadow-sm cursor-pointer dark:bg-slate-800 transition-all hover:shadow-md"
      onClick={() => onAction(member.savingsId)}
    >
      <div className="w-full">
        <div className="flex items-start flex-1 gap-3 justify-between">
          <div className="flex items-center gap-2">
            {/* Profile Image Section */}
            <div className="w-9 h-9 flex justify-center items-center border border-sky-500 rounded-full overflow-hidden dark:border-sky-400">
              <img
                alt="Profile picture"
                src={getProfileImage(member.profileImage)}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Member Info Section */}
            <div className="flex flex-col flex-1 items-start min-w-0">
              <div className="flex flex-wrap gap-1 truncate w-full font-bold">
                <span className="text-slate-800 dark:text-slate-200">
                  {member.firstName} {member.lastName}
                </span>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                {member.savingsId || "No ID"}
              </div>
            </div>
          </div>
        </div>

        {/* Balance & Action Section */}
        <div className="flex justify-between items-center border-t border-t-slate-200 mt-3 pt-3 pl-2 dark:border-t-slate-700">
          <div className="flex flex-col">
            <span className="text-xs tracking-wider text-slate-400 dark:text-slate-400">
              Account savings
            </span>
            <div className="text-emerald-500 font-semibold text-xl dark:text-emerald-400">
              {formatCurrency(member.savingsAccountBalance) || 0}
            </div>
          </div>

          <div className="relative p-2 rounded-full bg-sky-50 text-sky-600 dark:bg-sky-900 dark:text-sky-400">
            {/* Status Indicators (Pending Withdrawal or Payment) */}
            {member.hasPendingWithdrawal ? (
              <div className="bg-white p-1 rounded-full absolute -top-1 -right-0.5 dark:bg-slate-800">
                <div
                  className="bg-red-500 h-3 w-3 rounded-full dark:bg-red-400 animate-pulse"
                  title="Pending Withdrawal"
                ></div>
              </div>
            ) : member.hasPendingPayment ? (
              <div className="bg-white p-1 rounded-full absolute -top-1 -right-0.5 dark:bg-slate-800">
                <div
                  className="bg-amber-500 h-3 w-3 rounded-full dark:bg-amber-400 animate-pulse"
                  title="Pending Payment"
                ></div>
              </div>
            ) : null}
            <ChevronRight size={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
