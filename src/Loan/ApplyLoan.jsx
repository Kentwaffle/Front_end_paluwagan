import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import {
  formatCurrency,
  formatMonthDay,
} from "../reusableComponents/formatter";
import Error from "../reusableComponents/Error";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Inputform from "../reusableComponents/Inputform";
import { CalendarRange, FileText } from "lucide-react";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateLoan } from "../validations/CredentialValidation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SummaryLoan from "./SummaryLoan";
import { usePostData } from "../serviceToApi/PostData";
import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";
import { useNavigate } from "react-router-dom";
import PendingStatus from "./PendingStatus";
import { useFetchData } from "../serviceToApi/fetchData";
import { LoadingApply } from "../reusableComponents/loading";

function ApplyLoan() {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [isCompOpen, setIsCompOpen] = useState(false);
  const [loanResult, setLoanResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      startDate: today,
      endDate: "",
    },
    ValidateLoan,
  );

  //APIs

  const {
    data,
    loading: isStatusLoading,
    isError: isStatusError,
    refetch,
  } = useFetchData("/api/loan/status", API_ENDPOINTS.APPLY_STATUS);

  const { mutate: calculateMutate, isLoading: isCalculating } = usePostData(
    "api/loan/calculate-loan",
    API_ENDPOINTS.APPLY_LOAN,
  );

  const { mutate: postApplyMutate, isLoading: isSubmitting } = usePostData(
    "/api/loan/apply-loan",
    API_ENDPOINTS.APPLY_LOAN_POST,
  );

  useEffect(() => {
    // Mag-refetch lang kung hindi pa "fetched" o kung kailangan talaga
    // Pero siguraduhin na hindi ito magti-trigger ng panibagong render cycle
    if (refetch && !isStatusLoading) {
      refetch();
    }
  }, []);

  const handleOpenApplyMoodal = (e) => {
    e.preventDefault();
    const validation = ValidateLoan(formData);
    setFormErrors(validation.errors);
    if (!validation.isValid) return;
    showAlert.loading("Calculating...", "Please wait");
    calculateMutate(formData, {
      onSuccess: (response) => {
        showAlert.close();
        console.log("Success!", response);
        setLoanResult(response);
        setIsCompOpen(true);
      },
      onError: (error) => {
        console.error("Error saving data", error);
        showAlert.warning("Error saving!", error);
      },
    });
  };

  const handleSubmitLoan = (e) => {
    showAlert.loading("Submitting", "Please wait");
    handleSubmit(e, () => {
      const payLoadData = {
        totalLoan: Number(loanResult?.totalLoan),
        startDate: loanResult?.startDate,
        endDate: loanResult?.endDate,
        repayPeriodDays: loanResult?.repayPeriodDays,
        repayPeriodWeeks: loanResult?.repayPeriodWeeks,
        interest: loanResult?.interest,
        weeklyPay: loanResult?.weeklyPay,
        totalRepayable: loanResult?.totalRepayable,
        applicationId: loanResult?.applicationId,
      };

      postApplyMutate(payLoadData, {
        onSuccess: () => {
          showAlert
            .success(
              "Success!",
              "Application submitted successfully. Please wait for administrative approval.",
            )
            .then(
              () => setIsSubmitted(true),
              setIsCompOpen(false),
              console.log("Pumasok ang data", payLoadData),
            );
        },
        onError: () => {
          showAlert.error(
            "Failed",
            "Something happen please try again or contact our support",
          );
        },
      });
    });
  };

  if (
    data?.payload?.hasPendingApplication ||
    data?.payload?.hasApprovedApplication ||
    isSubmitted
  ) {
    return (
      <div key="status-container">
        <PendingStatus
          applicationId={
            loanResult?.applicationId || data?.payload.applicationId
          }
        />
      </div>
    );
  }

  return (
    <div key="apply-form-container">
      {/* <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} /> */}
      {isStatusLoading ? (
        <LoadingApply key="loading-view" />
      ) : isStatusError ? (
        <Error key="error-view" error={isStatusError} />
      ) : (
        <div className="min-h-screen p-3 flex  flex-col gap-5">
          <form
            onSubmit={handleOpenApplyMoodal}
            className=" shadow-md border border-slate-200 p-3 rounded-xl"
          >
            <div className="flex items-center justify-center mb-5">
              <span className="p-2 bg-sky-200 rounded-xl text-sky-500">
                <FileText />
              </span>
              <h1 className="text-2xl p-2 font-extrabold text-center">
                Apply for loan
              </h1>
            </div>
            <div className="bg-white p-2 mb-3 rounded-lg border border-slate-100 shadow">
              <h3 className="text-md font-semibold mb-2 text-stone-600 text-center">
                Enter the amount you want to borrow
              </h3>
              <div
                className={`flex p-1 px-3 rounded-md items-center border transition-all duration-300 ${
                  formErrors.loanAmount
                    ? "border-red-200 bg-red-50"
                    : Number(formData.loanAmount) === 20000
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-300 bg-gray-50"
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
              <div className="cursor-pointer flex flex-col w-full border border-slate-100 gap-1 justify-center items-center  bg-white   p-3 shadow rounded-xl">
                <div className="flex items-center justify-center gap-1">
                  <CalendarRange size={20} className="text-sky-500" />
                  <span>Start date</span>
                </div>
                <div className="relative w-full flex flex-col">
                  <DatePicker
                    selected={
                      formData.startDate ? new Date(formData.startDate) : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const formatted = date.toISOString().split("T")[0];
                        handleChange({
                          target: { name: "startDate", value: formatted },
                        });
                      }
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                    dropdownMode="select"
                    dateFormat="MMMM dd yyyy"
                    minDate={new Date()}
                    className="w-full border  border-gray-300 bg-gray-50 py-2 text-sm  rounded-md font-semibold text-center outline-none focus:border-sky-500"
                    calendarClassName="custom-calendar-style"
                    popperClassName="z-50"
                  />
                </div>
              </div>

              <div className="cursor-pointer flex flex-col gap-1 border border-slate-100  w-full justify-center items-center  bg-white  p-3 shadow rounded-xl">
                <div className="flex items-center  justify-center  gap-1 ">
                  <CalendarRange size={20} className="text-red-400" />
                  <span>End date</span>
                </div>
                <div className="relative w-full flex flex-col ">
                  <DatePicker
                    selected={
                      formData.endDate ? new Date(formData.endDate) : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const formatted = date.toISOString().split("T")[0];
                        handleChange({
                          target: { name: "endDate", value: formatted },
                        });
                      }
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                    dropdownMode="select"
                    dateFormat="MMMM dd yyyy"
                    placeholderText="Select End Date"
                    minDate={
                      formData.startDate
                        ? new Date(formData.startDate)
                        : new Date()
                    }
                    className={`w-full border py-2 text-sm rounded-md font-semibold text-center outline-none  ${formErrors.endDate ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"}`}
                    calendarClassName="custom-calendar-style"
                    popperClassName="z-50"
                  />
                </div>
                {formErrors.endDate && (
                  <span className="text-red-500 text-xs mt-1">
                    {formErrors.endDate}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-sky-200 text-sky-600 font-semibold w-full p-2 mt-5 rounded-xl text-xl shadow-sm"
            >
              Submit
            </button>
          </form>
        </div>
      )}
      <SummaryLoan
        isOpen={isCompOpen}
        isClose={() => setIsCompOpen(false)}
        loanAmount={loanResult?.totalLoan}
        repayPeriodDays={loanResult?.repayPeriodDays}
        repayPeriodWeeks={loanResult?.repayPeriodWeeks}
        startDate={formatMonthDay(loanResult?.startDate)}
        endDate={formatMonthDay(loanResult?.endDate)}
        interest={loanResult?.interest}
        weeklyPay={loanResult?.weeklyPay}
        totalRepayable={loanResult?.totalRepayable}
        applicationId={loanResult?.applicationId}
        onSubmit={handleSubmitLoan}
      />
    </div>
  );
}

export default ApplyLoan;
