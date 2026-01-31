import React from "react";
import { useEffect, useState } from "react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import {
  Download,
  Search,
  Funnel,
  CircleCheck,
  CircleX,
  CircleEllipsis,
} from "lucide-react";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import {
  formatDate,
  formatCurrency,
  formatMonthDay,
} from "../reusableComponents/formatter";
import { LoadingSpinnerLoan } from "../reusableComponents/loading";
import Error from "../reusableComponents/Error";

function Loan() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useFetchData(
    "/loan",
    API_ENDPOINTS.LOAN_GET,
  );

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);
  //Option
  const filterOptions = ["Pending", "Paid", "Failed"];

  //Get the json derulo
  const loanAmount = data?.payload?.loans?.[0]?.totalLoan || 0;
  const interestRate = data?.payload?.loans?.[0]?.interest || 0;
  const app_Number =
    data?.payload?.applications?.[0]?.applicationNumber || "N/A";
  const startDate = data?.payload?.loans?.[0]?.startDate;
  const endDate = data?.payload?.loans?.[0]?.endDate;
  const weeklyPay = data?.payload?.loans?.[0]?.weeklyPay;
  const totalRepayable = data?.payload?.loans?.[0]?.totalRepayable;

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

  // return <LoadingSpinnerLoan isOpen={isOpen} setIsOpen={setIsOpen} />;
  // return <Error isOpen={isOpen} setIsOpen={setIsOpen} error={error} />;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <LoadingSpinnerLoan isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen">
        <Error isOpen={isOpen} setIsOpen={setIsOpen} error={error} />
      </div>
    );
  }

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />
      <div className="min-h-screen p-3 flex flex-col gap-5">
        <div className="card w-full card-border shadow-md rounded-xl border-slate-200">
          <div className="card-body flex flex-col gap-5">
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <div className="flex flex-col ">
                  <h1 className=" text-2xl font-semibold">Loan Overview</h1>
                  <div className="text-stone-600">
                    <span>Application number: </span>
                    {app_Number}
                  </div>
                </div>
                <span className="bg-sky-100 p-1 rounded-md text-sky-500">
                  <Download />
                </span>
              </div>

              <h2 className="text-stone-600 mt-5">Total remaining loan</h2>
              <span className="text-4xl font-extrabold">
                {formatCurrency(data?.payload?.remainingBalance)}
              </span>
            </div>
            <div>
              <div className="flex justify-between">
                <span>{formatCurrency(data?.payload?.totalAmountPaid)}</span>
                <span>
                  {formatCurrency(totalRepayable)}
                  {/* {data?.payload?.paymentProgress?.toLocaleString() + "%"} */}
                </span>
              </div>
              <div>
                <progress
                  className="progress progress-info w-full"
                  value={data?.payload?.paymentProgress}
                  max="100"
                ></progress>
              </div>
            </div>
          </div>
          <div className="flex flex-col border-t  border-slate-200 px-5 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-between items-center  py-5">
              <span className="text-slate-500 text-md">Date range</span>
              <span className="font-semibold">{`${formatMonthDay(startDate)} - ${formatMonthDay(endDate)} `}</span>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 py-5">
              <span className="text-slate-500 text-md">Weekly pay</span>
              <span className="font-semibold">{formatCurrency(weeklyPay)}</span>
            </div>

            <div className="flex justify-between items-center py-5 border-t border-slate-200 ">
              <span className="text-slate-500 text-md">Loan amount</span>
              <span className="font-semibold">
                {formatCurrency(loanAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 py-5">
              <span className="text-slate-500 text-md">Interest rate</span>
              <span className="font-semibold">
                {formatCurrency(interestRate)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-xl shadow-md border border-slate-200 ">
          <div className="flex flex-col justify-between gap-3 ">
            <h1 className="font-semibold text-2xl">Payments history</h1>
            <div className="flex justify-between items-center gap-5">
              <label className="input">
                <Search className="opacity-50" />
                <input
                  type="search"
                  required
                  placeholder="Search ref ID"
                  className="grow"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn ">
                  <Funnel size={15} />
                  <div className="text-stone-400">|</div>
                  <p>Filter</p>
                </div>
                <ul
                  tabIndex="-1"
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm"
                >
                  {filterOptions.map((items, index) => (
                    <li key={index}>
                      <a className="active:bg-sky-500 hover:bg-slate-100">
                        {items}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {data?.payload?.payments?.length > 0 ? (
            data.payload?.payments.map((payment) => (
              <div
                key={payment.paymentId}
                className="card border my-5 border-slate-200 shadow"
              >
                <div className="px-5 py-3 flex flex-col gap-3">
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
    </>
  );
}

export default Loan;
