import React from "react";
import { Eye, EyeClosed } from "lucide-react";
function SavingsSummary({
  displaySavings,
  toggle,
  show,
  formatCurrency,
  responseData,
}) {
  return (
    <div className="card shadow-sm border border-slate-200 rounded-2xl bg-white dark:bg-slate-800 dark:border-slate-700">
      <div className="card-content p-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h1 className="text-md text-slate-500 dark:text-slate-400">
              Total Savings
            </h1>
            <h2 className="text-4xl font-semibold text-slate-700 dark:text-slate-200  ">
              {displaySavings}
            </h2>
          </div>
          <span>
            <button
              onClick={toggle}
              type="button"
              className="text-slate-400 transition-colors dark:text-slate-200 "
            >
              {show ? <Eye size={25} /> : <EyeClosed size={25} />}
            </button>
          </span>
        </div>

        <div className="flex flex-col justify-center items-start mt-5 pt-2 border-t border-slate-100 dark:border-slate-700 w-full gap-2">
          <div className="flex justify-between w-full text-xs items-center">
            <h5 className="text-emerald-500 rounded-lg dark:text-emerald-400 flex gap-1 items-center">
              Estimated Annual Earnings
            </h5>
            <h2 className="text-emerald-600 font-semibold dark:text-emerald-300">
              {formatCurrency(responseData?.annualMoney || 0)}
            </h2>
          </div>
          <div className="flex justify-between w-full text-xs items-center">
            <h5 className="text-slate-400 rounded-lg dark:text-slate-500">
              Target amount
            </h5>
            <h2 className="text-slate-600 font-semibold dark:text-slate-300">
              {formatCurrency(responseData?.targetAmount || 0)}
            </h2>
          </div>
          <div className="flex justify-between w-full text-xs items-center">
            <h5 className="text-slate-400 flex gap-1 items-center rounded-lg dark:text-slate-500">
              Account number
            </h5>
            <h2 className="text-slate-600 font-semibold dark:text-slate-300">
              {responseData?.savingsId || "000000000"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavingsSummary;
