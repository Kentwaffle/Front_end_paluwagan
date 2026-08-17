import React from "react";
import { ChevronRight, EllipsisVertical } from "lucide-react";

const MemberCard = ({ member, onAction, formatCurrency, getProfileImage }) => {
  const handleCardClick = () => {
    onAction(member.savingsId);
  };

  return (
    <div
      key={member.savingId || member.firstName}
      className="bg-white w-full rounded-2xl shadow-sm cursor-pointer dark:bg-slate-800 transition-all duration-300 hover:shadow-md hover:scale-[1.01] border border-slate-100 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-700"
      onClick={handleCardClick}
    >
      {/* MOBILE VIEW */}
      <div className="block md:hidden p-5">
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
              {/* Status Indicators */}
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

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col p-6 h-full justify-between gap-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar with Pending Badge */}
            <div className="relative">
              <div className="w-12 h-12 flex justify-center items-center border border-slate-200 dark:border-slate-700 rounded-full overflow-hidden">
                <img
                  alt="Profile picture"
                  src={getProfileImage(member.profileImage)}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {member.hasPendingWithdrawal ? (
                <span className="absolute -top-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-slate-800 bg-red-500 animate-pulse" title="Pending Withdrawal" />
              ) : member.hasPendingPayment ? (
                <span className="absolute -top-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-slate-800 bg-amber-500 animate-pulse" title="Pending Payment" />
              ) : null}
            </div>

            {/* Name and ID */}
            <div className="flex flex-col">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight hover:text-sky-500 transition-colors">
                {member.firstName} {member.lastName}
              </h4>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
                {member.savingsId || "No ID"}
              </span>
            </div>
          </div>

          {/* Menu Dots */}
          <button
            type="button"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EllipsisVertical size={18} />
          </button>
        </div>

        {/* Balance Box */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/30 flex flex-col items-start w-full">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            Account Savings
          </span>
          <span className="text-2xl font-black text-emerald-500 dark:text-emerald-400 tracking-tight">
            {formatCurrency(member.savingsAccountBalance) || "₱0.00"}
          </span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all group"
        >
          View Ledger <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
