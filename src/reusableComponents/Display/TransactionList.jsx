import React from "react";

function TransactionList({
  transactions = [],
  isLoading = false,
  statusColor,
  statusIcon,
  formatCurrency,
  formatDate,
  formatTimeAgo,
  emptyMessage = "No transactions yet.",
}) {
  if (isLoading) {
    return <div className="text-center py-10">Loading history...</div>;
  }

  return (
    <div className="space-y-3">
      {transactions?.length > 0 ? (
        transactions.map((item, index) => {
          const currentStatus = item.status || item.paymentStatus;
          const currentRef = item.reference || item.referenceNumber;
          const currentDate =
            item.remitDate || item.paymentDate || item.createdAt;
          const currentAmount =
            item.amountRemit || item.amountPaid || item.amount;
          const currentMethod = item.method || item.paymentMethod || "NA";

          return (
            <>
              <div
                key={`${currentRef}-${index}`}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm md:hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl bg-opacity-10 ${statusColor?.(currentStatus)}`}
                    >
                      {statusIcon?.(currentStatus) || "No Icon"}
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="font-black text-slate-900 text-xs dark:text-white uppercase">
                        {currentRef || "No Reference"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {formatDate(currentDate) || "No Date"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="font-black text-emerald-500 text-sm">
                      {`+ ${formatCurrency(currentAmount) || "0.00"}`}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-300">
                      {currentMethod}
                    </span>
                  </div>
                </div>

                {/* Time Ago Footer */}
                <div className="flex justify-end items-end border-t border-slate-50 dark:border-slate-800 mt-2 pt-1">
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">
                    {formatTimeAgo(currentDate)}
                  </span>
                </div>
              </div>

              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <th className="py-4 px-4">Transaction ID / Ref</th>
                      <th className="py-4 px-4">Date & Time</th>
                      <th className="py-4 px-4">Method</th>
                      <th className="py-4 px-4 text-right">Amount</th>
                      {/* <th className="py-4 px-4 text-center">Status</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                    {transactions.map((tx, index) => {
                      return (
                        <tr
                          key={tx.id || index}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                        >
                          {/* Reference / ID */}
                          <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-400 font-semibold">
                            {tx.referenceNumber || tx.id || "N/A"}
                          </td>

                          {/* Date */}
                          <td className="py-4 px-4  text-slate-500 dark:text-slate-400">
                            <div className="flex   items-center gap-1">
                              <span className="font-medium">
                                {formatDate(tx.paymentDate || tx.createdAt) ||
                                  "N/A"}
                              </span>

                              <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                                ({formatTimeAgo(tx.paymentDate || tx.createdAt)}
                                )
                              </span>
                            </div>
                          </td>

                          {/* Payment Method */}
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                            {tx.currentMethod || tx.methodType || "Online"}
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 text-right font-bold text-slate-900 dark:text-white text-base">
                            {formatCurrency(
                              tx.amountPaid || tx.amountDeposit || "0.00",
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          );
        })
      ) : (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 italic text-sm font-medium">
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
