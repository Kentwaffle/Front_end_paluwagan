import React from "react";
import { formatCurrency } from "../reusableComponents/formatter";
import {
  Calendar,
  Calendars,
  Hourglass,
  Banknote,
  Percent,
  Receipt,
  IdCard,
} from "lucide-react";
import { swalModal } from "../reusableComponents/Alerts/SweetAlerts";
function SummaryLoan({
  isOpen,
  isClose,
  loanAmount,
  repayPeriodDays,
  repayPeriodWeeks,
  startDate,
  endDate,
  weeklyPay,
  interest,
  totalRepayable,
  applicationId,
  onSubmit,
}) {
  if (!isOpen) return null;
  const agreeSummary = async (e) => {
    const agreeSum = await swalModal({
      title: "Are you sure?",
      text: "Do you want to submit your application?",
      confirmButtonText: "Yes",
      icon: "question",
    });
    if (agreeSum) onSubmit(e);
  };

  return (
    <div className="p-5 fixed inset-0 overflow-y-auto z-[99] flex items-center justify-center bg-black/50 backdrop-blur">
      <div className="bg-white p-5 rounded-3xl w-full max-w-md h-fit my-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-center m-3">
          {/* <span className="p-2 bg-sky-100 rounded-xl text-sky-600 border border-slate-200 ">
            <FileText />
          </span> */}
          <h3 className="font-extrabold text-2xl text-center">Loan Summary</h3>
        </div>
        <h4 className="text-stone-500 text-sm font-semibold italic text-center">
          <span className="text-red-600">*</span>
          Please review the repayment details before proceeding.
        </h4>
        <div className="flex flex-col gap-3 my-3 mt-5">
          <div className="flex justify-between items-center text-sm  py-3 px-2 bg-slate-100 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-stone-600">
              <span className="p-2 bg-sky-100 rounded-xl text-sky-600 border border-sky-200 ">
                <IdCard size={18} />
              </span>
              <span className="text-stone-500">ID</span>
            </div>
            <span className="font-semibold">{applicationId}</span>
          </div>
          <div className="flex justify-between items-center text-sm  py-3 px-2 bg-slate-100 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-stone-600">
              <span className="p-2 bg-sky-100 rounded-xl text-sky-600 border border-sky-200 ">
                <Calendar size={18} />
              </span>
              <span className="text-stone-500">Date range</span>
            </div>
            <span className="font-semibold">{`${startDate} - ${endDate}`}</span>
          </div>
          <div className="flex justify-between items-center text-sm  py-3 px-2 bg-slate-100 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-stone-600">
              <span className="p-2 bg-sky-100 rounded-xl text-sky-600 border border-sky-200 ">
                <Hourglass size={18} />
              </span>
              <span className="text-stone-500">Repay period</span>
            </div>
            <span className="font-semibold">{`${repayPeriodWeeks}w(${repayPeriodDays}d)`}</span>
          </div>
          <div className="flex justify-between items-center  text-sm py-3 px-2 bg-slate-100  rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-stone-600">
              <span className="p-2 bg-sky-100 rounded-xl text-sky-600 border border-sky-200 ">
                <Calendars size={18} />
              </span>
              <span className="text-stone-500">Weekly pay</span>
            </div>
            <span className="font-semibold">{weeklyPay}</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="flex flex-col gap-3 py-3 px-2 my-3 bg-slate-100 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between">
            <div className="flex items-center gap-2 text-stone-600">
              <span className="p-1 bg-sky-100 rounded-lg text-sky-600 border border-sky-200 ">
                <Banknote size={15} />
              </span>
              <span className="text-stone-500">Total loan</span>
            </div>
            <span>{formatCurrency(loanAmount)}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2  text-stone-600">
              <span className="p-1 bg-sky-100 rounded-lg text-sky-600 border border-sky-200 ">
                <Percent size={15} />
              </span>
              <span className="text-stone-500">Interest</span>
            </div>
            <span>{interest}</span>
          </div>
          <div className="flex justify-between border-t-2 border-gray-300 pt-3">
            <div className="flex items-center gap-2 text-stone-600">
              <span className="p-1 bg-sky-100 rounded-lg text-sky-600 border border-sky-200 ">
                <Receipt size={15} />
              </span>
              <span className="text-lg font-semibold">Total repayable</span>
            </div>
            <span className="text-lg font-semibold">{totalRepayable}</span>
          </div>
        </div>

        <div className="flex gap-1 mt-5">
          <button
            onClick={isClose}
            className="bg-red-200 text-red-500 w-full py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={agreeSummary}
            className="bg-sky-500 text-white w-full py-2 rounded-lg"
          >
            I agree
          </button>
        </div>
      </div>
    </div>
  );
}

export default SummaryLoan;
