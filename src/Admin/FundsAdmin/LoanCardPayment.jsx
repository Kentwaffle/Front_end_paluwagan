import React from "react";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
function LoanCardPayment() {
  return (
    <div className="p-5 bg-white shadow-sm rounded-xl dark:bg-gray-800">
      <div className="flex items-center gap-3 pb-5">
        <div className="w-9 h-9 flex justify-center items-center border border-sky-500 rounded-full overflow-hidden">
          <img src={getProfileImage()} alt="Profile" />
        </div>
        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm  text-slate-700 truncate font-black dark:text-gray-300">
            Juluis Lorenzo Ramboy
          </span>
          <span className="text-xs text-slate-500 truncate dark:text-gray-400">
            REf0-0909090
          </span>
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-gray-700 py-5">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-gray-400">
            Remaining Balance
          </span>
          <span className="text-xl text-slate-700 dark:text-gray-300 font-bold">
            ₱12,000.00
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoanCardPayment;
