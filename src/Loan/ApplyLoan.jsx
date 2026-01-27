import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import {
  formatDate,
  formatCurrency,
  formatMonthDay,
} from "../reusableComponents/formatter";
import Error from "../reusableComponents/Error";
import { useEffect, useState } from "react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Inputform from "../reusableComponents/Inputform";
import { useRef } from "react";
import { CalendarRange } from "lucide-react";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateLoan } from "../validations/CredentialValidation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SummaryLoan from "./SummaryLoan";
import { computeLoanDetails } from "./LoanComputation";
function ApplyLoan() {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [isCompOpen, setIsCompOpen] = useState(false);

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    setFormErrors,
    formErrors,
  } = useForm(
    {
      loanAmount: "",
      startdate: today,
      enddate: "",
      interest: "",
      totalRepayable: "",
      weeklypay: "",
      repaymentPeriod: "",
    },
    ValidateLoan,
  );

  const handleSubmitApply = (e) => {
    e.preventDefault();
    const validation = ValidateLoan(formData);
    setFormErrors(validation.errors);

    if (validation.isValid) {
      setIsCompOpen(true);
    }

    console.log(formData);
  };

  useEffect(() => {
    const { loanAmount, startdate, enddate } = formData;
    if (loanAmount && startdate && enddate) {
      const results = computeLoanDetails(loanAmount, startdate, enddate);

      if (formData.repaymentPeriod !== results.periodText) {
        setFormData((prev) => ({
          ...prev,
          repaymentPeriod: results.periodText,
          interest: results.interest,
          totalRepayable: results.total,
          weeklypay: results.weekly,
        }));
      }
    }
  }, [formData.startdate, formData.enddate, formData.loanAmount]);

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />
      <div className="min-h-screen p-3 flex  flex-col gap-5">
        <form
          onSubmit={handleSubmitApply}
          className=" shadow-md border border-slate-200 p-3 rounded-xl"
        >
          <h1 className="text-2xl p-2 font-extrabold mb-2 text-center">
            Apply for loan
          </h1>
          <div className="bg-white p-3 shadow border border-slate-100 rounded-xl">
            <div className="bg-slate-100 p-2 mb-2 rounded-lg border border-slate-100 shadow">
              <h3 className="text-md font-semibold text-stone-600 text-center">
                Enter the amount you want to borrow
              </h3>
              <div
                className={`flex p-1 px-3 rounded-md items-center border transition-all duration-300 ${
                  formErrors.loanAmount
                    ? "border-red-500 bg-red-50"
                    : Number(formData.loanAmount) === 20000
                      ? "border-orange-400 bg-orange-50"
                      : "border-sky-500 bg-sky-50"
                }`}
              >
                <Inputform
                  type="text"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  placeholder={formatCurrency("0")}
                  className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
                />
                <span className="text-stone-400">|</span>
                <button
                  onClick={() =>
                    setFormData({ ...formData, loanAmount: 20000 })
                  }
                  className="text-xs"
                >
                  Max 20k
                </button>
              </div>
              {formErrors.loanAmount && (
                <span className="text-red-500 text-xs mt-1">
                  {formErrors.loanAmount}
                </span>
              )}
            </div>

            <div className="flex justify-between gap-2">
              <div className="cursor-pointer flex flex-col w-full border border-slate-200 gap-1 justify-center items-center  bg-gray-100  p-3 shadow rounded-md">
                <div className="flex items-center justify-center gap-1">
                  <CalendarRange size={20} className="text-sky-500" />
                  <span>Start date</span>
                </div>
                <div className="relative w-full flex flex-col">
                  <DatePicker
                    selected={
                      formData.startdate ? new Date(formData.startdate) : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const formatted = date.toISOString().split("T")[0];
                        handleChange({
                          target: { name: "startdate", value: formatted },
                        });
                      }
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                    dropdownMode="select"
                    dateFormat="MMMM dd yyyy"
                    minDate={new Date()}
                    className="w-full bg-white border border-gray-300 py-2 text-sm  rounded-md font-semibold text-center outline-none focus:border-sky-500"
                    calendarClassName="custom-calendar-style"
                    popperClassName="z-50"
                  />
                </div>
              </div>

              <div className="cursor-pointer flex flex-col gap-1 border border-slate-200  w-full justify-center items-center  bg-gray-100 p-3 shadow rounded-md">
                <div className="flex items-center  justify-center  gap-1 ">
                  <CalendarRange size={20} className="text-red-400" />
                  <span>End date</span>
                </div>
                <div className="relative w-full flex flex-col ">
                  <DatePicker
                    selected={
                      formData.enddate ? new Date(formData.enddate) : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const formatted = date.toISOString().split("T")[0];
                        handleChange({
                          target: { name: "enddate", value: formatted },
                        });
                      }
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                    dropdownMode="select"
                    dateFormat="MMMM dd yyyy"
                    placeholderText="Select End Date"
                    minDate={
                      formData.startdate
                        ? new Date(formData.startdate)
                        : new Date()
                    }
                    className={`w-full border py-2 text-sm rounded-md font-semibold text-center outline-none  ${formErrors.enddate ? "border-red-500 bg-red-50" : "border-sky-500 bg-sky-50"}`}
                    calendarClassName="custom-calendar-style"
                    popperClassName="z-50"
                  />
                </div>
                {formErrors.enddate && (
                  <span className="text-red-500 text-xs mt-1">
                    {formErrors.enddate}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-sky-300 w-full p-3 mt-3 rounded-xl text-xl shadow-sm"
          >
            Submit
          </button>
        </form>
      </div>
      <SummaryLoan
        isOpen={isCompOpen}
        isClose={() => setIsCompOpen(false)}
        loanAmount={formData.loanAmount}
        repaymentPeriod={formData.repaymentPeriod}
        startdate={formatMonthDay(formData.startdate)}
        enddate={formatMonthDay(formData.enddate)}
        interest={formData.interest}
        weeklypay={formData.weeklypay}
        totalRepayable={formData.totalRepayable}
      />
    </>
  );
}

export default ApplyLoan;
