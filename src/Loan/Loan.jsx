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

function Loan() {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [method, setmethod] = useState("");
  const [searchRef, setSearchRef] = useState("");
  const debouncedSearch = useDebounce(searchRef, 500);
  const [startDateFilter, setStartdateFilter] = useState("");
  const [endDateFilter, setEnddateFilter] = useState("");

  const [paymentMode, setPaymentMode] = useState("online");
  const { processOnlinePayment } = useOnlinePayment();

  const { data: loanData, isLoading: isLoanLoading } = useFetchData(
    "/loan",
    API_ENDPOINTS.LOAN_GET,
  );

  // Dynamic Query String Logic
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (method) params.append("paymentMethod", method);
  if (debouncedSearch) params.append("reference", debouncedSearch);
  if (startDateFilter) params.append("startDate", startDateFilter);
  if (endDateFilter) params.append("endDate", endDateFilter);

  const activeEndpoint = params.toString()
    ? `${API_ENDPOINTS.GET_PAYMENT}?${params.toString()}`
    : API_ENDPOINTS.GET_PAYMENT;

  const { data: paymentData } = useFetchData(
    [
      "payments",
      status,
      method,
      debouncedSearch,
      startDateFilter,
      endDateFilter,
    ],
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

  return (
    <>
      {isLoanLoading ? (
        <LoadingLoan key="loading-spinner" />
      ) : (
        <div className="min-h-screen p-5 flex flex-col gap-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
          <div className="card w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex flex-col gap-1 justify-center items-center py-8 bg-gradient-to-b from-sky-50/50 to-transparent dark:from-sky-900/10">
              <h2 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                Remaining Balance
              </h2>
              <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                {formatCurrency(loanData?.payload?.remainingBalance)}
              </h1>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-400 uppercase">
                    Payment Progress
                  </span>
                  <span className="text-sky-500">
                    {loanData?.payload?.paymentProgress}%
                  </span>
                </div>
                <progress
                  className="progress progress-info w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 [--tglbg:theme(colors.sky.500)]"
                  value={loanData?.payload?.paymentProgress}
                  max="100"
                ></progress>
                <div className="flex justify-between mt-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Paid
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {formatCurrency(loanData?.payload?.totalAmountPaid)}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Total Loan
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {formatCurrency(loan?.totalRepayable)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="collapse collapse-arrow !rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
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
                    {[
                      {
                        label: "Date Range",
                        value: `${formatMonthDay(loan?.startDate)} - ${formatMonthDay(loan?.endDate)}`,
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
                    ].map((item, i) => (
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
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-xl mx-1 text-slate-900 dark:text-white tracking-tight">
              Pay here
            </h3>
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
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between mx-1 items-center">
              <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                Transactions
              </h3>

              <button
                type="button"
                // onClick={() => navigate("savings_payments")}
                className="text-sky-500 dark:text-sky-400 font-semibold flex items-center gap-1"
              >
                See all
              </button>
              {/* <div className="flex gap-2">
                <div className="relative grow">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="search"
                    value={searchRef}
                    placeholder="Search reference..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-all text-sm"
                    onChange={(e) => setSearchRef(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setFilterOpen(true)}
                  className="p-3 rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 active:scale-90 transition-all"
                >
                  <SlidersHorizontal size={20} />
                </button>
              </div> */}
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
