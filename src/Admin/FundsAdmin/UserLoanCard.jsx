import React from "react";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { formatCurrency } from "../../reusableComponents/formatter";

const UserLoanCard = ({ user, onClick, isSelected = false, isLoan = true }) => {
  if (!user) return null;
  const payloadData = {
    balance: isLoan ? user.remainingBalance : user.accountBalance,
    id: isLoan ? user.applicationId : user.savingsId,
    weekylAndTarget: isLoan ? user.weeklyPay : user.targetAmount,
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 bg-white shadow-sm rounded-xl dark:bg-gray-800 my-3  transition-all cursor-pointer `}
    >
      <div className="flex items-center gap-3 pb-5">
        <div className="w-9 h-9 flex justify-center items-center border border-sky-500 rounded-full overflow-hidden">
          <img
            src={getProfileImage(user.profileImage) || "No image"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm text-slate-700 truncate font-black dark:text-gray-300">
            {`${user.firstName} ${user.lastName}` || "No data"}
          </span>
          <span className="text-xs text-slate-500 truncate dark:text-gray-400">
            {payloadData.id || "No id"}
          </span>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-gray-700 pt-3 grid grid-cols-2 gap-5">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            {isLoan ? "Remaining Balance" : "Account Balance"}
          </span>
          <span className="text-lg text-sky-500 dark:text-sky-400 font-bold">
            {formatCurrency(payloadData.balance) || "00"}
          </span>
        </div>
        <div className="flex flex-col border-l border-slate-100 dark:border-gray-700 pl-5">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            {isLoan ? "Weekly payment" : "Target Amount"}
          </span>
          <span className="text-lg text-sky-500 dark:text-sky-400 font-bold">
            {formatCurrency(payloadData.weekylAndTarget) || "00"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserLoanCard;
