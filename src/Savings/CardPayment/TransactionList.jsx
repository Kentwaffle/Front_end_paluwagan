import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";
import { formatCurrency, formatDate } from "../../reusableComponents/formatter";
import { X, Check } from "lucide-react";
const TransactionList = ({
  transactions,
  hasSearched = false,
  isLoading,
  showActions = false,
  NoRecord = false,
  isAccepted,
  isDeclined,
}) => {
  // Kung wala pang search na nagaganap
  if (!hasSearched) {
    return (
      <div className="mt-8 flex flex-col items-center animate-fadeIn">
        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-4">
          <Search className="text-sky-500" size={30} />
        </div>
        <h3 className="text-slate-600 font-bold">Search History</h3>
        <p className="text-slate-400 text-sm text-center px-10">
          Search by reference number or date to track your savings payments.
        </p>
      </div>
    );
  }

  return (
    <div key={"trasaction_payment"}>
      {isLoading ? (
        <div className="text-center p-10 text-slate-400 animate-pulse">
          Fetching transactions...
        </div>
      ) : transactions && transactions.length > 0 ? (
        <div className="flex flex-col gap-2">
          {transactions.slice(0, 20).map((transac, index) => (
            <div
              key={`${transac.reference}-${index}`}
              className="bg-white shadow-sm p-3 px-5 rounded-xl border border-slate-50"
            >
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-emerald-500">
                  {formatCurrency(transac.amountRemit)}
                </div>
                <div className="text-sm font-semibold text-slate-600">
                  {formatDate(transac.remitDate)}
                </div>
              </div>
              <div className="flex justify-between text-slate-500">
                <div className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(transac.remitDate), {
                    addSuffix: true,
                  }).replace("about ", "")}
                </div>
                <div className="text-xs">{transac.reference}</div>
              </div>
              {showActions && (
                <div className="flex gap-1 justify-end border-t  border-t-slate-200 mt-2 py-2">
                  <button
                    type="button"
                    onClick={isAccepted}
                    className="flex items-center rounded-full px-2 py-0.5 text-sm bg-emerald-50 text-emerald-500"
                  >
                    <Check size={20} />
                    <span>Accept</span>
                  </button>
                  <button className="flex items-center rounded-full px-2 py-0.5 text-sm bg-red-50 text-red-500">
                    <X size={20} />
                    <span>Declined</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        NoRecord && (
          <div className="flex flex-col items-center text-center mt-5 p-5 h-auto italic rounded-2xl text-slate-500 bg-white-50 border border-slate-100 shadow-inner">
            <span>"No payment records found."</span>
          </div>
        )
      )}
    </div>
  );
};
export default TransactionList;
