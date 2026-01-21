import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import { formatDate, formatCurrency } from "../reusableComponents/formatter";
import Error from "../reusableComponents/Error";
import { useEffect, useState } from "react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Inputform from "../reusableComponents/Inputform";
import { useRef } from "react";
import { CalendarRange } from "lucide-react";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateLoan } from "../validations/CredentialValidation";
import Modal from "../reusableComponents/Modal";

function ApplyLoan() {
  const [isOpen, setIsOpen] = useState(false);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState("");
  const [endSelectedDate, setEndSelectedDate] = useState("");
  const [loanAmount, setLoanAmount] = useState(0);
  const today = new Date().toISOString().split("T")[0];
  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    setFormErrors,
    formErrors,
  } = useForm(
    {
      borrow: "",
      startdate: today,
      enddate: "",
    },
    ValidateLoan,
  );
  const loanTotal = Number(formData.borrow) || 0;
  const weeklyPay = loanAmount > 0 ? (loanAmount * 1.05) / 4 : 0;
  const interest = 10 + 10;
  const totalRepayable = loanAmount * 1.05;

  // const handleStartChange = (e) => {
  //   const date = e.target.value;
  //   setStartSelectedDate(date);
  // };

  const handleEndChange = (e) => {
    const date = e.target.value;
    setEndSelectedDate(date);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />
      <div className="min-h-screen p-3 flex flex-col gap-5">
        <div className="bg-gray-50 shadow-md p-3 rounded-md">
          <h1 className="text-2xl font-semibold mb-2">Apply for loan</h1>
          <div className="bg-gray-100 p-3 shadow rounded-md">
            <span className="text-md font-semibold text-stone-600">
              Enter the amount you want to borrow
            </span>
            <div className="my-3">
              <div
                className={`flex p-1 px-3 rounded-md items-center border transition-all duration-300 ${
                  formErrors.borrow
                    ? "border-red-500 bg-red-50"
                    : Number(formData.borrow) === 20000
                      ? "border-orange-400 bg-orange-50"
                      : "border-sky-500 bg-sky-50"
                }`}
              >
                <Inputform
                  type="text"
                  name="borrow"
                  value={formData.borrow}
                  onChange={handleChange}
                  placeholder={formatCurrency("0")}
                  className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
                />
                <span className="text-stone-400">|</span>
                <button
                  onClick={() => setFormData({ ...formData, borrow: 20000 })}
                  className="text-xs"
                >
                  Max 20k
                </button>
              </div>
              {formErrors.borrow && (
                <span className="text-red-500 text-xs mt-1">
                  {formErrors.borrow}
                </span>
              )}
            </div>

            <div className="flex justify-between gap-2">
              <button
                onClick={() => startDateRef.current.showPicker()}
                className="cursor-pointer flex flex-col w-full gap-1 justify-center items-center bg-gray-200 p-3 shadow rounded-md"
              >
                <div className="flex items-center justify-center gap-1">
                  <CalendarRange size={20} className="text-sky-500" />
                  <span>Start date</span>
                </div>
                <Inputform
                  type="date"
                  name="startdate"
                  ref={startDateRef}
                  value={formData.startdate}
                  min={today}
                  className="absolute opacity-0 w-0 h-0"
                  onChange={handleChange}
                />
                <span className="text-sm font-semibold text-gray-700">
                  {/* Gagamitin ang formData.startdate imbes na yung local state */}
                  {formData.startdate
                    ? formatDate(formData.startdate)
                    : "Select start date"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => endDateRef.current.showPicker()}
                className="cursor-pointer flex flex-col gap-1  w-full justify-center items-center  bg-gray-200 p-3 shadow rounded-md"
              >
                <div className="flex items-center  justify-center  gap-1 ">
                  <CalendarRange size={20} className="text-red-400" />
                  <span>End date</span>
                </div>
                <Inputform
                  type="date"
                  name="enddate"
                  ref={endDateRef}
                  min={formData.startdate || today}
                  className="absolute opacity-0 w-0 h-0"
                  onChange={handleEndChange}
                />
                <span className="text-sm font-semibold text-gray-700">
                  {endSelectedDate
                    ? formatDate(endSelectedDate)
                    : "Select End date"}
                </span>
              </button>
            </div>
          </div>
          <div className="bg-gray-100  p-5 shadow rounded-md mt-3">
            <div className="flex justify-between border-b border-b-stone-300 py-3">
              <span className="text-stone-600">Weekly pay</span>
              <span>{formatCurrency(29)}</span>
            </div>
            <div className="flex justify-between not-first:py-3">
              <span className="text-stone-600">Interest</span>
              <span>{10 + "%"}</span>
            </div>
            <div className="flex justify-between border-t border-t-stone-300 py-3">
              <span className="font-semibold text-xl text-stone-600">
                Total Repayable
              </span>
              <span className="font-semibold text-xl">
                {formatCurrency(29)}
              </span>
            </div>
          </div>

          <button className="bg-sky-300 w-full p-3 mt-3 rounded-xl text-xl">
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default ApplyLoan;
