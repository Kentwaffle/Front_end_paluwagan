import React, { useState } from "react";
import { Eye, EyeClosed, Copy, Check, BanknoteArrowUp } from "lucide-react";
import OffsetForm from "./OffsetForm";

function SavingsSummary({ useSavingsDatas, onWithdraw }) {
  const {
    formatCurrency,
    activeContent,
    offsetForm,
    agreeOffset,
    responseData,
    show,
    toggle,
    displaySavings,
  } = useSavingsDatas;
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleConfirmWithdraw = (amount) => {
    onWithdraw?.(amount);
    setShowWithdraw(false);
  };

  const savingsDetails = [
    {
      label: "Estimated Annual Earnings",
      value: formatCurrency(responseData?.annualMoney || 0),
      accent: true,
    },
    {
      label: "Target Amount",
      value: formatCurrency(responseData?.targetAmount || 0),
    },
  ];

  return (
    <>
      <div className="card w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="relative overflow-hidden flex flex-col gap-1 justify-center items-center py-10 bg-gradient-to-br from-slate-950 via-blue-950 to-sky-900 text-white border-b border-sky-900/30">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <button
            onClick={toggle}
            type="button"
            className="absolute right-5 top-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {show ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>

          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            Total Savings
          </h2>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight font-sans mt-1">
            {displaySavings}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 pb-0">
          {savingsDetails.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col border rounded-2xl p-4 shadow-sm ${
                item.accent
                  ? "border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10"
                  : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                  item.accent
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`text-lg font-black tracking-tight ${
                  item.accent
                    ? "text-emerald-600 dark:text-emerald-300"
                    : "text-slate-800 dark:text-slate-100"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {responseData?.totalSavingsBalance > 0 && (
          <div className="px-6 pb-6 pt-5">
            <button
              type="button"
              onClick={() => setShowWithdraw(true)}
              className="w-full py-3 rounded-xl border-2 border-sky-500 text-sky-600 dark:text-sky-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-colors cursor-pointer"
            >
              <BanknoteArrowUp size={24} />
              <span>Withdraw Savings</span>
            </button>
          </div>
        )}

        <div className="flex justify-end items-center px-6 pb-4 mt-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            Account No: {responseData?.savingsId || "000000000"}
          </span>
          {/* <button
          type="button"
          onClick={() => copy(responseData?.savingsId || "000000000")}
          className="text-xs font-bold text-sky-500 flex items-center gap-1 hover:underline cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={14} /> Copied
            </>
          ) : (
            <>
              <Copy size={14} /> Copy
            </>
          )}
        </button> */}
        </div>
      </div>

      <OffsetForm
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        activeContent={activeContent}
        offsetData={offsetForm.formData}
        handleOffsetChange={offsetForm.handleChange}
        offsetErrors={offsetForm.formErrors}
        agreeOffset={(e) => agreeOffset(e, () => setShowWithdraw(false))}
      />
    </>
  );
}

export default SavingsSummary;
