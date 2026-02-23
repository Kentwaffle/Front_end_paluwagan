import DatePickerField from "../reusableComponents/Hooks/Datepicker";
import SearchInput from "../reusableComponents/SearchInput";
import { Search } from "lucide-react";
import { useFetchData } from "../serviceToApi/fetchData";
import { useState } from "react";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency, formatDate } from "../reusableComponents/formatter";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TransactionList from "./CardPayment/TransactionList";
function SavingsPayment() {
  const navigate = useNavigate();
  const [startDateFilter, setStartdateFilter] = useState("");
  const [endDateFilter, setEnddateFilter] = useState("");
  const [refSearch, setRefSeach] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [finalEndpoint, setFinalEndpoint] = useState(null);

  const params = new URLSearchParams();
  if (refSearch) params.append("reference", refSearch);
  if (startDateFilter) params.append("startDate", startDateFilter);
  if (endDateFilter) params.append("endDate", endDateFilter);
  const queryString = params.toString();

  const activeEndpoint = queryString
    ? `${API_ENDPOINTS.SAVINGS_PAYMENT_FILTER}?${queryString}`
    : API_ENDPOINTS.SAVINGS_PAYMENT_FILTER;

  const { data: paymentSaving, isLoading: loadingPayment } = useFetchData(
    finalEndpoint || "idle",
    finalEndpoint,
    { enabled: !!finalEndpoint },
  );

  const transactionList = paymentSaving?.savings || [];

  const displayedTransactions = Array.isArray(transactionList)
    ? transactionList
    : [];

  const handleFilterSaving = (e) => {
    e.preventDefault();
    setHasSearched(true);
    setFinalEndpoint(activeEndpoint);
  };

  return (
    <div className="min-h-screen p-5">
      <div className="flex flex-col gap-3 bg-white p-5 shadow-sm rounded-xl">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center mb-1">
            <label className="text-slate-500 font-semibold text-sm tracking-wider">
              Search reference
            </label>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sky-500  font-bold text-xs uppercase"
            >
              <span className="font-extrabold">
                <ChevronLeft size={18} />
              </span>
              <span className="mt-0.5">Return</span>
            </button>
          </div>
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

      <TransactionList
        transactions={displayedTransactions}
        hasSearched={true}
        isLoading={loadingPayment}
      />
    </div>
  );
}

export default SavingsPayment;
