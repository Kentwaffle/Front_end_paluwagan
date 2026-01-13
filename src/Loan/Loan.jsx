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
import { formatDate, formatCurrency } from "../reusableComponents/formatter";

function Loan() {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError, error } = useFetchData(
    "/loan",
    API_ENDPOINTS.LOAN_GET
  );

  //Option
  const filterOptions = ["Pending", "Paid", "Failed"];

  //Get the json derulo
  const loanAmount = data?.loans?.[0]?.loanAmount || 0;
  const interestRate = data?.loans?.[0]?.interestRate || 0;
  const app_Number = data?.applications?.[0]?.applicationNumber || "N/A";
  const loanTerm = data?.applications?.[0]?.termLength || 0;

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "failed":
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
      <div className="min-h-screen p-3 flex flex-col gap-5">
        <div className="card w-full card-border shadow-md rounded-xl border-slate-200">
          <div className="card-body flex flex-col gap-5">
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <div className="flex flex-col ">
                  <h1 className=" text-2xl font-semibold">Loan Overview</h1>
                  <div className="text-stone-600">
                    <span>Application number: </span>
                    {"#" + app_Number}
                  </div>
                </div>
                <span className="bg-sky-200 p-1 rounded-md ">
                  <Download />
                </span>
              </div>

              <h2 className="text-stone-600 mt-5">Total remaining loan</h2>
              <span className="text-4xl font-extrabold">
                {formatCurrency(data?.remainingBalance)}
              </span>
            </div>
            <div>
              <div className="flex justify-between">
                <span>Payment progress</span>
                <span>{data?.paymentProgress?.toLocaleString() + "%"}</span>
              </div>
              <div>
                <progress
                  className="progress progress-info w-full"
                  value={data?.paymentProgress}
                  max="100"
                ></progress>
              </div>
            </div>
          </div>
          <div className="flex flex-col border-t  border-slate-200 px-5 bg-gray-50">
            <div className="flex justify-between items-center py-5 ">
              <span className="text-slate-500 text-md">Loan Amount</span>
              <span className="font-semibold">
                {formatCurrency(loanAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 py-5">
              <span className="text-slate-500 text-md">Interest Rate</span>
              <span className="font-semibold">{interestRate + "%"}</span>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 py-5">
              <span className="text-slate-500 text-md">Loan Term</span>
              <span className="font-semibold">{loanTerm + " " + "months"}</span>
            </div>

            {/* <div className="flex justify-between items-center border-t border-slate-200 py-5">
              <span className="text-slate-500 text-md">assd</span>
              <span className="font-semibold">1111</span>
            </div> */}
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
                  placeholder="Search"
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

          {data?.payments?.length > 0 ? (
            data.payments.map((payment) => (
              <div
                key={payment.paymentId}
                className="card border my-5 border-slate-200 shadow"
              >
                <div className="px-5 py-3 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[18px]">
                      <span className="font-semibold">
                        {formatDate(payment.paymentDate)}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(payment.amountPaid)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-stone-400 text-[14px]">
                        {payment.paymentMethod}
                      </span>
                      <span
                        className={`badge badge-sm badge-soft rounded-xl ${statusColor(
                          payment.paymentStatus
                        )} `}
                      >
                        {statusIcon(payment.paymentStatus)}
                        {payment.paymentStatus}
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
