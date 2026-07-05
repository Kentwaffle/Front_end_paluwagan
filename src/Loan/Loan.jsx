import { useEffect, useState, useMemo } from "react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { Download, Search, SlidersHorizontal, ListCheck } from "lucide-react";
import {
  formatDate,
  formatCurrency,
  formatMonthDay,
} from "../reusableComponents/Utils/formatter";
import { LoadingLoan } from "../reusableComponents/Feedbacks/loading";
import Filter from "./Filter";
import { useDebounce } from "../reusableComponents/Hooks/useBounce";
import {
  statusColorPayments,
  statusIconPayments,
} from "../reusableComponents/Feedbacks/StatusHelper";
import PaymentForm from "../reusableComponents/Forms/PaymentForm";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateSavingsDeposit } from "../validations/CredentialValidation";
import { generateUUID } from "../reusableComponents/Utils/GeneratedIDS";
import { useOnlinePayment } from "../reusableComponents/Hooks/useOnlinePayment";
import TransactionList from "../reusableComponents/Display/TransactionList";
import { formatTimeAgo } from "../reusableComponents/Utils/TimeDateformat";
import { usePostData } from "../serviceToApi/PostData";
import { useAuth } from "../auth/Auth";
function Loan() {
  const [status, setStatus] = useState("");
  const [method, setmethod] = useState("");
  const [searchRef, setSearchRef] = useState("");
  const debouncedSearch = useDebounce(searchRef, 500);
  const [dateRange, setDateRange] = useState("all");
  const [paymentMode, setPaymentMode] = useState("online");
  const { processOnlinePayment } = useOnlinePayment();

  // Username
  const { UserDetails } = useAuth();
  const username = UserDetails?.firstName || "User";

  // Fetch Loan Details
  const { data: loanData, isLoading: isLoanLoading } = useFetchData(
    "/loan",
    API_ENDPOINTS.LOAN.LOAN_GET,
  );

  // 📝 Dynamic Query String at Date Filters Calculation Logic
  const params = useMemo(() => {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (method) queryParams.append("paymentMethod", method);
    if (debouncedSearch) queryParams.append("reference", debouncedSearch);

    if (dateRange !== "all") {
      const now = new Date();
      if (dateRange === "7days") {
        now.setDate(now.getDate() - 7);
      } else if (dateRange === "30days") {
        now.setDate(now.getDate() - 30);
      } else if (dateRange === "3months") {
        now.setMonth(now.getMonth() - 3);
      }

      const formattedStartDate = now.toISOString().split("T")[0];
      const formattedEndDate = new Date().toISOString().split("T")[0];

      queryParams.append("startDate", formattedStartDate);
      queryParams.append("endDate", formattedEndDate);
    }
    return queryParams;
  }, [status, method, debouncedSearch, dateRange]);

  const activeEndpoint = useMemo(() => {
    return params.toString()
      ? `${API_ENDPOINTS.GET_PAYMENT}?${params.toString()}`
      : API_ENDPOINTS.GET_PAYMENT;
  }, [params]);

  // Fetch Payments Data (In-update ang keys para sa bagong caching mechanism)
  const { data: paymentData } = useFetchData(
    ["payments", status, method, debouncedSearch, dateRange],
    activeEndpoint,
  );

  const loan = loanData?.payload?.loans;
  const appID =
    loanData?.payload?.applications?.[0]?.applicationNumber || "N/A";

  const initialOnlineValues = useMemo(
    () => ({
      // genId: generateUUID(),
      description: "Online deposit for loan payment",
      amount: 0,
      paymentType: "LOAN",
      referenceId: appID || "",
      methodType: "",
    }),
    [appID],
  );

  //useEffect para sa ID
  const cashPaymentLoan = useForm(initialOnlineValues, ValidateSavingsDeposit);

  // 4. Update Reference ID separately
  useEffect(() => {
    const sId = appID;
    if (sId && !cashPaymentLoan.formData.referenceId) {
      cashPaymentLoan.setFormData((prev) => ({
        ...prev,
        referenceId: sId,
      }));
    }
  }, [appID]);

  const handlePayment = (e) => {
    cashPaymentLoan.handleSubmit(e, () => {
      processOnlinePayment(cashPaymentLoan.formData);
    });
  };
  const loanDetails = [
    {
      label: "Date Range",
      value: `${formatMonthDay(loan?.startDate) || "N/A"} - ${formatMonthDay(loan?.endDate) || "N/A"}`,
    },
    {
      label: "Weekly Pay",
      value: formatCurrency(loan?.weeklyPay),
    },
    {
      label: "Loan Amount",
      value: formatCurrency(loan?.totalLoan),
    },
    {
      label: "Interest",
      value: formatCurrency(loan?.interest),
    },
  ];

  return (
    <>
      {isLoanLoading ? (
        <LoadingLoan key="loading-spinner" />
      ) : (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col gap-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 text-slate-900 dark:text-white">
          <div className="hidden md:block border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back,{" "}
              <span className="text-sky-600 dark:text-sky-400">
                {username}!
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track your payment progression and manage active settlements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 card w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm overflow-hidden">
              <div className="relative overflow-hidden flex flex-col gap-1 justify-center items-center py-10 bg-gradient-to-br from-slate-950 via-blue-950 to-sky-900 text-white border-b border-sky-900/30">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  {/* //<Wallet size={12} className="text-sky-400" /> */}
                  Remaining Balance
                </h2>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight font-sans mt-1">
                  {formatCurrency(loanData?.payload?.remainingBalance)}
                </h1>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Payment Progress
                    </span>
                    <span className="text-sky-500 dark:text-sky-400 font-extrabold bg-sky-500/10 dark:bg-sky-400/10 px-2 py-0.5 rounded-md">
                      {loanData?.payload?.paymentProgress}%
                    </span>
                  </div>

                  <progress
                    className="progress progress-info w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800"
                    value={loanData?.payload?.paymentProgress}
                    max="100"
                  ></progress>

                  <div className="flex justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Paid Amount
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold text-base">
                        {formatCurrency(loanData?.payload?.totalAmountPaid)}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Total Repayable
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold text-base">
                        {formatCurrency(loan?.totalRepayable || "N/A")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="collapse collapse-arrow !rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 md:hidden">
                  <input type="checkbox" />
                  <div className="collapse-title flex gap-3 items-center py-3 min-h-0">
                    <div className="bg-sky-500/10 p-1.5 rounded-lg">
                      <ListCheck size={18} className="text-sky-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Loan datails
                    </span>
                  </div>
                  <div className="collapse-content px-4 pb-0">
                    <div className="grid grid-cols-1 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      {loanDetails.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">
                            {item.label}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">
                            {item.value}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-3 mt-1 border-t border-dashed border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {appID}
                        </span>
                        <button className="text-xs font-bold text-sky-500 flex items-center gap-1 hover:underline">
                          <Download size={14} /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Desktop View/ Tablet */}

              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 pb-6">
                {loanDetails.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm bg-slate-50/50 dark:bg-slate-800/20"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      {item.label}
                    </span>
                    <span className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:col-span-1">
              <div className="px-1">
                <h3 className="font-black text-lg tracking-tight">Pay here</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Select payment configuration criteria.
                </p>
              </div>
              <PaymentForm
                // Props for PaymentForm
                label="Payment Amount"
                buttonName="Payment"
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                classNameOnline="bg-white p-5 mt-5 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                classNameCash="bg-white p-5 mt-5 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                //Hooks
                //Deposit Cash
                // depositData={depositForm.formData}
                // handleDepositChange={depositForm.handleChange}
                // depositErrors={depositForm.formErrors}
                // agreeDeposit={agreeDeposit}
                //Deposit Online
                cashPaymentData={cashPaymentLoan.formData}
                handleCashPaymentChange={cashPaymentLoan.handleChange}
                cashPaymentErrors={cashPaymentLoan.formErrors}
                handleOnlineDeposit={handlePayment}
                isLoan={true}
              />
            </div>
          </div>
          <div className="space-y-4 mt-2">
            <div className="space-y-4 mt-4">
              {/* HEADER & FILTER CONTROLS BAR */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-1">
                {/* Title Section */}
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                    Transactions History
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Audit and track ledger accounts actions.
                  </p>
                </div>

                {/* Controls Component Group (Search and Date Dropdown) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {/* 🔍 Smart Search Bar */}
                  <div className="relative group min-w-[220px] grow sm:grow-0">
                    <Search
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors"
                      size={16}
                    />
                    <input
                      type="search"
                      value={searchRef}
                      placeholder="Search reference..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none shadow-sm focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:focus:ring-sky-400/10 transition-all placeholder:text-slate-400/80"
                      onChange={(e) => setSearchRef(e.target.value)}
                    />
                  </div>

                  {/* 📅 Pro Date Range Dropdown Select */}
                  <div className="relative min-w-[160px] grow sm:grow-0">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none shadow-sm focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 cursor-pointer appearance-none pr-10"
                    >
                      <option value="all">All Time</option>
                      <option value="7days">Past 7 Days</option>
                      <option value="30days">Past 30 Days</option>
                      <option value="3months">Past 3 Months</option>
                    </select>

                    {/* Custom Chevron Indicator para magmukhang Pro at hindi generic browser dropdown */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 border-l border-slate-100 dark:border-slate-800 my-2">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>

                  {/* 🧹 Clear Button (Lilitaw kung binago ang search o dropdown) */}
                  {(searchRef || dateRange !== "all") && (
                    <button
                      onClick={() => {
                        setSearchRef("");
                        setDateRange("all");
                      }}
                      className="text-xs font-bold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 px-4 py-2.5 rounded-xl transition-colors text-center"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* LIST: Modern "Flat" Card style */}
            <TransactionList
              transactions={paymentData?.payment}
              statusColor={statusColorPayments}
              statusIcon={statusIconPayments}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              formatTimeAgo={formatTimeAgo}
              emptyMessage="No transactions yet. Start making payments!"
            />
          </div>
        </div>
      )}

      {/* <Filter
        isFilterOpen={isFilterOpen}
        setFilterOpen={() => setFilterOpen(false)}
        setStatus={setStatus}
        setmethod={setmethod}
        setStartdateFilter={setStartdateFilter}
        setEnddateFilter={setEnddateFilter}
      /> */}
    </>
  );
}

export default Loan;
