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
import SeeAllPayments from "../reusableComponents/SeeAllPayments";

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
      <SeeAllPayments
        refSearch={refSearch}
        setRefSeach={setRefSeach}
        startDateFilter={startDateFilter}
        setStartdateFilter={setStartdateFilter}
        endDateFilter={endDateFilter}
        setEnddateFilter={setEnddateFilter}
        handleFilterSaving={handleFilterSaving}
      />
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
