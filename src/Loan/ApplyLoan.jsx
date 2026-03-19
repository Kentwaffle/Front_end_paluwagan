import {
  formatCurrency,
  formatMonthDay,
} from "../reusableComponents/formatter";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Inputform from "../reusableComponents/Inputform";
import { CalendarRange, FileText, PhilippinePeso } from "lucide-react";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateLoan } from "../validations/CredentialValidation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SummaryLoan from "./SummaryLoan";
import { usePostData } from "../serviceToApi/PostData";
import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../serviceToApi/fetchData";
import { LoadingApply } from "../reusableComponents/loading";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import DatePickerField from "../reusableComponents/Hooks/Datepicker";

function ApplyLoan() {
  console.log("ApplyLoan Component Rendered!");
  const today = new Date().toISOString().split("T")[0];
  const [isCompOpen, setIsCompOpen] = useState(false);
  const [loanResult, setLoanResult] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const { mutate: calculateMutate, isLoading: isCalculating } = usePostData(
    "api/loan/calculate-loan",
    API_ENDPOINTS.APPLY_LOAN,
  );

  const { mutate: postApplyMutate } = usePostData(
    "/api/loan/apply-loan",
    API_ENDPOINTS.APPLY_LOAN_POST,
  );
  const isStatusFetching = useIsFetching({ queryKey: ["user-status-key"] });
  const statusData = queryClient.getQueryData(["user-status-key"]);
  const payload = statusData?.payload;
  useEffect(() => {
    if (payload?.hasPendingApplication) {
      navigate("/pending_status", { replace: true });
    }
  }, [payload, navigate]);

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
    setIsCompOpen(false);
    showAlert.loading("Submitting", "Please wait");
    const continueModal = document.getElementById("continue");
    if (continueModal) continueModal.close();

    setTimeout(() => {
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
          onSuccess: async () => {
            showAlert.success(
              "Success!",
              "Application submitted successfully.",
            );
            await queryClient.invalidateQueries({
              queryKey: ["user-status-key"],
            });
            await queryClient.invalidateQueries({
              queryKey: ["admin-loans"],
            });
            await queryClient.invalidateQueries({});

            navigate("/pending_status");
          },
          onError: (error) => {
            setIsCompOpen(true);
            showAlert.error(
              "Failed",
              "Something happened, please try again." + error,
            );
          },
        });
      });
    }, 100);
  };
  const minSelectableDate = new Date();
  minSelectableDate.setDate(minSelectableDate.getDate() + 7);

  return (
    <div key="apply-form-container">
      {!payload && isStatusFetching ? (
        <LoadingApply key="loading-view" />
      ) : (
        <div className="min-h-screen p-5 flex  flex-col gap-5">
          <form onSubmit={handleOpenApplyMoodal} className="space-y-6">
            <div className="pl-2">
              <h1 className="text-3xl font-extrabold  text-slate-800 dark:text-slate-200">
                Apply for loan
              </h1>
              <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                Complete the details below to proceed.
              </p>
            </div>
            <div className="bg-white p-5 mb-4 rounded-2xl border border-slate-100 shadow dark:bg-slate-700 dark:border-slate-600">
              <div className="flex justify-between mb-4 items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Loan Amount
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, loanAmount: 20000 })
                  }
                  className="text-xs font-bold bg-sky-50 text-sky-600 px-2 py-1 rounded-full hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400 transition-colors"
                >
                  MAX 20K
                </button>
              </div>
              <div
                className={`flex p-1 px-3 rounded-md items-center border border-slate-200 transition-all duration-300 dark:bg-slate-800 ${
                  formErrors.loanAmount
                    ? "border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/30"
                    : Number(formData.loanAmount) === 20000
                      ? "border-orange-400 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/30"
                      : "border-gray-300 bg-gray-50 dark:border-slate-600 dark:bg-slate-800"
                }`}
              >
                <span className="text-2xl font-bold text-slate-400 dark:text-slate-500 pr-1">
                  <PhilippinePeso />
                </span>
                <Inputform
                  type="text"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  placeholder={"0.00"}
                  className="h-8 !border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent dark:text-slate-200"
                />
              </div>
              {formErrors.loanAmount && (
                <span className="text-red-500 text-[10px] font-medium mt-2 block ml-1 uppercase">
                  {formErrors.loanAmount}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 bg-white p-5 rounded-2xl shadow-sm dark:bg-slate-700 dark:border-slate-600 border border-slate-200">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block dark:text-slate-400">
                Loan Duration
              </label>
              <div className="space-y-0">
                <div className="relative flex items-center gap-4 pb-2 ">
                  <div className="absolute left-[17px] top-12 bottom-0 w-[1px] bg-slate-300 dark:bg-slate-600"></div>
                  <div className="z-10 bg-sky-50 p-2 rounded-full dark:bg-sky-900/30">
                    <CalendarRange
                      size={20}
                      className="text-sky-500 dark:text-sky-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-black mb-2 text-slate-400 block dark:text-slate-500">
                      Start Date
                    </label>
                    <DatePickerField
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      minDate={new Date()}
                      error={formErrors.startDate}
                    />
                  </div>
                </div>

                <div className="relative flex items-center gap-4 pt-2">
                  <div className="absolute left-[17px] top-0 bottom-12 w-[1px] bg-slate-300 dark:bg-slate-600"></div>
                  <div className="z-10 bg-rose-50 p-2 rounded-full dark:bg-rose-900/30">
                    <CalendarRange
                      size={20}
                      className="text-rose-400 dark:text-rose-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-black mb-2 text-slate-400 block dark:text-slate-500">
                      End Date
                    </label>
                    <DatePickerField
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      minDate={minSelectableDate}
                      error={formErrors.endDate}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-sky-500 text-white font-bold w-full py-4  rounded-2xl text-lg shadow-lg shadow-sky-200 dark:shadow-none hover:bg-sky-600 active:scale-[0.98] transition-all"
            >
              Calculate & Submit
            </button>
          </form>
        </div>
      )}
      {isCompOpen && (
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
      )}
    </div>
  );
}

export default ApplyLoan;
