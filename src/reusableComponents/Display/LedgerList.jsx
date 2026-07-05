import React from "react";
import { Dot } from "lucide-react";

function LedgerList({
  ledgerData = [],
  statusColors = { bg: {}, badge: {}, text: {} },
  transactionIcons = {},
  formatTimeAgo,
  sentinelRef,
  loadingMembers,
  hasMoreMembers,
}) {
  return (
    <div className="flex flex-col gap-3">
      {ledgerData.map((content, index) => (
        <div
          key={`${content.id}-${index}`}
          className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div
              className={`${statusColors.bg[content.description] || statusColors.bg.Default} p-3 rounded-full`}
            >
              {transactionIcons[content.description] ||
                transactionIcons.Default}
            </div>
            <div className="flex justify-between w-full items-center">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {content.description === "Withdrawal"
                    ? "Withdrawal completed"
                    : content.description === "Completed"
                      ? "Loan Completed"
                      : "Payment"}
                </h4>
                <div className="flex text-slate-400 font-semibold text-[11px]">
                  {content.reference}
                  <Dot size={16} className="text-slate-300" strokeWidth={3} />
                  <span className="font-sans font-bold uppercase text-slate-500">
                    {content.description === "Withdrawal"
                      ? "Cash"
                      : content.modeOfPayment || "Cash"}
                  </span>
                </div>
              </div>
              <span>
                <div
                  className={`${statusColors.badge[content.description] || statusColors.badge.Default} text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider`}
                >
                  {content.description === "Loan" ||
                  content.description === "Completed"
                    ? "Loan"
                    : "Savings"}
                </div>
              </span>
            </div>
          </div>
          <span className="px-5">
            <div
              className={`font-black text-2xl ml-3 leading-none ${statusColors.text[content.description] || statusColors.text.Default}`}
            >
              {content.description === "Withdrawal" ? "-" : "+"}₱
              {content.amount?.toLocaleString()}
            </div>
          </span>
          <div className="flex justify-between border-t border-t-slate-200 pt-2 px-1 mt-2 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-mono tracking-tighter">
              {formatTimeAgo
                ? formatTimeAgo(content.depositDate)
                : content.depositDate}
            </span>
            <span className="text-xs text-slate-400 font-mono tracking-tighter">
              {content.savingsId}
            </span>
          </div>
        </div>
      ))}

      {/* Infinite Scroll / Loading Indicators */}
      <div ref={sentinelRef} className="text-center mt-2">
        {loadingMembers ? (
          <span className="loading loading-dots text-slate-400"></span>
        ) : hasMoreMembers ? (
          <span className="text-[10px] font-black text-slate-400 animate-bounce">
            Scroll to load more details.
          </span>
        ) : (
          <span className="text-xs italic text-slate-400">
            -End of ledger. -
          </span>
        )}
      </div>
    </div>
  );
}

export default LedgerList;
