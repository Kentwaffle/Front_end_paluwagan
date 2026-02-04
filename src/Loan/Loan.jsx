import React from "react";
import { useEffect, useState } from "react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import {
  Download,
  Search,
  SlidersHorizontal,
  CircleCheck,
  CircleX,
  CircleEllipsis,
  ListCheck,
} from "lucide-react";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import {
  formatDate,
  formatCurrency,
  formatMonthDay,
} from "../reusableComponents/formatter";
import { LoadingLoan } from "../reusableComponents/loading";
import Error from "../reusableComponents/Error";
import Inputform from "../reusableComponents/Inputform";
import Filter from "./Filter";
import { useDebounce } from "../reusableComponents/Hooks/useBounce";
import { LoadingFilter } from "../reusableComponents/loading";

function Loan() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [method, setmethod] = useState("");
  const [searchRef, setSearchRef] = useState("");
  const debouncedSearch = useDebounce(searchRef, 500);
  const [startDateFilter, setStartdateFilter] = useState("");
  const [endDateFilter, setEnddateFilter] = useState("");

  const {
    data: loanData,
    isLoading: isLoanLoading,
    isError: isLoanError,
    refetch: refetchLoan,
  } = useFetchData("/loan", API_ENDPOINTS.LOAN_GET);

  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (method) params.append("paymentMethod", method);
  if (debouncedSearch) params.append("reference", debouncedSearch);
  if (startDateFilter) params.append("startDate", startDateFilter);
  if (endDateFilter) params.append("endDate", endDateFilter);

  const queryString = params.toString();

  const activeEndpoint = queryString
    ? `${API_ENDPOINTS.GET_PAYMENT}?${queryString}`
    : API_ENDPOINTS.GET_PAYMENT;

  const { data: paymentData, refetch: refetchPayment } = useFetchData(
    `/api/loan/payment/filter?status=${status}&paymentMethod=${method}&reference=${debouncedSearch}&startDate=${startDateFilter}&endDate=${endDateFilter}`,
    activeEndpoint,
  );

  useEffect(() => {
    if (refetchLoan) {
      refetchLoan();
    }
    if (refetchPayment) {
      refetchPayment();
    }
  }, []);

  //Get the json derulo
  const loanAmount = loanData?.payload?.loans?.[0]?.totalLoan || 0;
  const interestRate = loanData?.payload?.loans?.[0]?.interest || 0;
  const app_Number =
    loanData?.payload?.applications?.[0]?.applicationNumber || "N/A";
  const startDate = loanData?.payload?.loans?.[0]?.startDate;
  const endDate = loanData?.payload?.loans?.[0]?.endDate;
  const weeklyPay = loanData?.payload?.loans?.[0]?.weeklyPay || 0;
  const totalRepayable = loanData?.payload?.loans?.[0]?.totalRepayable || 0;

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "failed":
        1;
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const statusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <CircleCheck size={15} />;
      case "pending":
        return <CircleEllipsis size={15} />;
      case "failed":
        return <CircleX size={15} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />
      {isLoanLoading ? (
        <LoadingLoan key="loading-spinner" />
      ) : isLoanError ? (
        <Error key="error-display" />
      ) : (
        <div
          key="loan-content"
          className="min-h-screen p-5 flex flex-col gap-5"
        >
          <div className="card w-full card-border shadow  rounded-xl border-slate-200">
            <div className="flex flex-col gap-1 justify-center items-center mt-6 w-full">
              <h2 className="text-stone-500 text-sm font-semibold">
                Total remaining balance
              </h2>
              <h1 className="text-5xl font-semibold">
                {formatCurrency(loanData?.payload?.remainingBalance)}
              </h1>
            </div>
            <div className="card-body flex flex-col gap-5 p-0 px-5 pt-5 pb-3">
              <div>
                <div className="flex justify-between">
                  <span>Payment progress</span>
                  <span>{`${loanData?.payload?.paymentProgress}%`}</span>
                </div>
                <div>
                  <progress
                    className="progress progress-info w-full"
                    value={loanData?.payload?.paymentProgress}
                    max="100"
                  ></progress>
                </div>
                <div className="flex justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="text-gray-400">Paid </span>
                    <span className="text-slate-700 font-bold">
                      {formatCurrency(loanData?.payload?.totalAmountPaid)}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-400">Loan</span>
                    <span className="text-slate-700 font-bold">
                      {formatCurrency(totalRepayable)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 ">
              <div tabIndex={0} className="collapse collapse-arrow ">
                <div className="collapse-title bg-gray-50 flex gap-2 items-center text-slate-500">
                  <span className="bg-sky-100 text-sky-500 p-1 rounded-lg items-center">
                    <ListCheck size={18} />
                  </span>
                  <span className="text-sm font-semibold ">
                    View loan details
                  </span>
                </div>
                <div className="collapse-content p-0">
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-3 px-5 py-3 rounded-b-3xl border-t border-gray-200">
                      <div className="flex justify-between items-start ">
                        <span className="text-slate-400 text-sm text-md">
                          Date range
                        </span>
                        <span className="font-semibold text-sm">{`${formatMonthDay(startDate)} - ${formatMonthDay(endDate)} `}</span>
                      </div>

                      <div className="flex justify-between items-start ">
                        <span className="text-slate-400 text-sm text-md">
                          Weekly pay
                        </span>
                        <span className="font-semibold text-sm">
                          {formatCurrency(weeklyPay)}
                        </span>
                      </div>

                      <div className="flex justify-between items-start ">
                        <span className="text-slate-400 text-sm text-md">
                          Loan amount
                        </span>
                        <span className="font-semibold text-sm">
                          {formatCurrency(loanAmount)}
                        </span>
                      </div>

                      <div className="flex justify-between items-start">
                        <span className="text-slate-400 text-sm text-md">
                          Interest rate
                        </span>
                        <span className="font-semibold text-sm">
                          {formatCurrency(interestRate)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 flex justify-between px-5 py-3  text-xs border-t border-gray-200 w-full">
                      <div className="text-gray-400 flex ">
                        <span>ID:</span>
                        <div>{app_Number}</div>
                      </div>
                      <button className="flex items-center  justify-center text-sky-500">
                        <span className="p-1">
                          <Download size={13} />
                        </span>
                        <span>Download details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex flex-col justify-between gap-3">
              <h1 className="font-semibold text-lg ">Payments history</h1>
              <div className="flex justify-between items-center gap-3">
                <label className="input rounded-3xl w-full">
                  <Search className="opacity-50" />
                  {/* <Inputform /> */}
                  <input
                    type="search"
                    required
                    value={searchRef}
                    placeholder="Search reference"
                    className="grow"
                    onChange={(e) => setSearchRef(e.target.value)}
                  />
                </label>
                <button
                  onClick={() => setFilterOpen(true)}
                  className="rounded-lg  text-sky-500 bg-sky-100  p-2 px-3 shadow-sm"
                >
                  <SlidersHorizontal size={20} />
                </button>

                <Filter
                  isFilterOpen={isFilterOpen}
                  setFilterOpen={() => setFilterOpen(false)}
                  setStatus={setStatus}
                  setmethod={setmethod}
                  setStartdateFilter={setStartdateFilter}
                  setEnddateFilter={setEnddateFilter}
                />
              </div>
            </div>

            {paymentData?.payment?.length > 0 ? (
              paymentData?.payment?.map((payment, index) => (
                <div
                  key={`${payment.paymentId}-${index}`}
                  className="card border my-3 border-slate-200 shadow"
                >
                  <div className="px-5 py-3 flex flex-col gap-1">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center text-[18px]">
                        <span className="font-semibold text-xl">
                          {formatCurrency(payment.amountPaid)}
                        </span>
                        <span
                          className={`badge badge-sm badge-soft rounded-xl ${statusColor(
                            payment.paymentStatus,
                          )} `}
                        >
                          {statusIcon(payment.paymentStatus)}
                          {payment.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="font-semibold text-stone-600 ">
                          {formatDate(payment.paymentDate)}
                        </span>
                        <span className="font-semibold text-[12px] text-stone-600">
                          {payment.paymentMethod}
                        </span>
                      </div>
                    </div>
                    <span className="block w-full text-right text-stone-400 font-mono uppercase text-[14px]">
                      {payment.referenceNumber}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-10 opacity-50 italic">
                No payment records found.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Loan;
