import DatePickerField from "../reusableComponents/Hooks/Datepicker";
import SearchInput from "../reusableComponents/SearchInput";
import { Search } from "lucide-react";
import { useFetchData } from "../serviceToApi/fetchData";
import { useState } from "react";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency, formatDate } from "../reusableComponents/formatter";

function SavingsPayment() {
  const [startDateFilter, setStartdateFilter] = useState("");
  const [endDateFilter, setEnddateFilter] = useState("");
  const [refSearch, setRefSeach] = useState("");
  const [hasSeached, setHasSeached] = useState(false);
  const [finalEndpoint, setFinalEndpoint] = useState("");

  const params = new URLSearchParams();
  if (refSearch) params.append("reference", refSearch);
  if (startDateFilter) params.append("startDate", startDateFilter);
  if (endDateFilter) params.append("endDate", endDateFilter);
  const queryString = params.toString();

  const activeEndpoint = queryString
    ? `${API_ENDPOINTS.SAVINGS_PAYMENT_FILTER}?${queryString}`
    : API_ENDPOINTS.SAVINGS_PAYMENT_FILTER;

  const { data: paymentSaving, refetch: refetchPayment } = useFetchData(
    finalEndpoint || "idle",
    finalEndpoint,
  );

  const transactionList = paymentSaving?.savings || [];

  const displayedTransactions = Array.isArray(transactionList)
    ? transactionList
    : [];

  const handleFilterSaving = (e) => {
    e.preventDefault();
    setHasSeached(true);
    setFinalEndpoint(activeEndpoint);
    setStartdateFilter("");
    setEnddateFilter("");
  };

  return (
    <div className="min-h-screen p-5">
      <div className="flex flex-col gap-5 bg-white p-5 shadow-sm rounded-xl">
        <div className="flex flex-col gap-1">
          <label className="text-slate-500 font-semibold text-sm tracking-wider">
            Search reference
          </label>
          <SearchInput
            value={refSearch}
            onChange={(e) => setRefSeach(e.target.value)}
            placeholder="Search reference number..."
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-slate-500 font-semibold text-sm tracking-wider">
            Date Range
          </label>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <DatePickerField
                className="rounded-xl !py-2"
                name="startDateFilter"
                value={startDateFilter}
                onChange={(e) => setStartdateFilter(e.target.value)}
              />
            </div>
            <span className="text-slate-300 text-sm">to</span>
            <div className="relative">
              <DatePickerField
                className="rounded-xl !py-2"
                name="endDateFilter"
                value={endDateFilter}
                onChange={(e) => setEnddateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => handleFilterSaving(e)}
          className="shadow-blue-200/50 bg-gradient-to-r from-sky-500 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2"
        >
          Search
          <Search size={15} />
        </button>
      </div>
      <div className=" my-3 text-slate-700 font-semibold">
        Transaction History
      </div>
      {hasSeached &&
        displayedTransactions?.slice(0, 20).map((transac, index) => (
          <div
            key={`${transac.reference}-${index}`}
            className="bg-white shadow-sm p-3 px-5 rounded-xl my-2"
          >
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-emerald-500">
                {formatCurrency(transac.amountRemit)}
              </div>
              <div className="text-sm font-semibold">
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
          </div>
        ))}

      {displayedTransactions?.length === 0 && (
        <div className="text-center mt-5 p-10 h-70 italic rounded-2xl text-slate-500 bg-white-50 border border-slate-100 shadow-inner">
          No payment records found.
        </div>
      )}
    </div>
  );
}

export default SavingsPayment;
