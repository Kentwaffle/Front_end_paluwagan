import React from "react";
import { Dot } from "lucide-react";
import { formatCurrency, capitalizeFirstLetter } from "../Utils/formatter";
import {
  getStatusColor,
  getTransactionIcon,
  getTypeBadge,
} from "../../reusableComponents/Display/TransactionSyle";
function LedgerList({
  ledgerData = [],
  statusColors = { bg: {}, badge: {}, text: {} },
  transactionIcons = {},
  formatTimeAgo,
  sentinelRef,
  loadingMembers,
  hasMoreMembers,
  formatDate,
  formatFullDate,
  isLoading,
}) {
  return (
    <>
      <div className="flex flex-col gap-3 lg:hidden">
        {ledgerData.map((content, index) => (
          <div
            key={`${content.id}-${index}`}
            className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm "
          >
            <div className="flex items-center gap-4">
              <div
                className={`${getTransactionIcon(content.description) ? "bg-slate-100 dark:bg-slate-800" : "bg-slate-100 dark:bg-slate-800"} p-3 rounded-full`}
              >
                {getTransactionIcon(content.description)}
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
                    className={`${getTypeBadge(content.description)} text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider`}
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
                className={`font-black text-2xl ml-3 leading-none ${getStatusColor("text", content.description)}`}
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

      {/* Desktop View */}
      <div className="hidden lg:block relative overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px]  uppercase tracking-wider text-white bg-slate-800 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
              <th className="py-7 px-7 ">Transaction ID</th>
              <th className="py-7 px-7 ">Date</th>
              <th className="py-7 px-7 ">Method</th>
              <th className="py-7 px-7 ">Transaction Type</th>
              <th className="py-7 px-7  text-right ">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
            {ledgerData.map((tx, index) => {
              return (
                <tr
                  key={tx.id || index}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                >
                  {/* Reference / ID */}
                  <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400 font-semibold">
                    {tx.reference || "N/A"}
                  </td>
                  {/* Date */}
                  <td className="py-4 px-4  text-slate-500 dark:text-slate-400 text-xs">
                    <div className="flex   items-center gap-1">
                      <span className="font-semibold">
                        {formatFullDate(tx.depositDate) || "N/A"}
                      </span>

                      <span className="text-xs text-slate-400 dark:text-slate-500 italic ">
                        ({formatTimeAgo(tx.createdAt)})
                      </span>
                    </div>
                  </td>
                  {/* Payment Method */}
                  <td className="py-4 px-4 text-slate-600 dark:text-white text-xs font-semibold">
                    {capitalizeFirstLetter(tx.modeOfPayment) ||
                      capitalizeFirstLetter(tx.paymentMethod) ||
                      "N/A"}
                  </td>

                  {/* Trasaction Type*/}
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium text-xs">
                    <span
                      className={`${getTypeBadge(tx.description)} inline-block text-xs font-semibold px-3 py-1 rounded-full`}
                    >
                      {tx.description || "Online"}
                    </span>
                  </td>

                  {/* Amount */}
                  <td
                    className={`py-4 px-4 text-right font-bold dark:text-white text-base ${getStatusColor("text", tx.description)}`}
                  >
                    {tx.description === "Withdrawal" ? "-" : "+"}
                    {formatCurrency(tx.amount || "0.00")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 flex items-center justify-center rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-dotpulse [animation-delay:0ms]"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-dotpulse [animation-delay:150ms]"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-dotpulse [animation-delay:300ms]"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LedgerList;
