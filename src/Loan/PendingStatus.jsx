import React from "react";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import { useState } from "react";
import { CircleAlert, Copy } from "lucide-react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";
import { LoadingApply } from "../reusableComponents/loading";
import {
  formatCurrency,
  formatMonthDay,
} from "../reusableComponents/formatter";

function PendingStatus({ applicationId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const {
    data: statusData,
    loading: statusLoading,
    isError: statusError,
  } = useFetchData("/api/loan/status", API_ENDPOINTS.STATUS);

  const { data: detailsData, loading: detailsLoading } = useFetchData(
    "/api/loan/status/details",
    API_ENDPOINTS.APPLICATION_DETAILS,
  );

  const handleCopy = (textCopy) => {
    if (!textCopy) return;
    const content = `
Application ID: ${String(finalId)}
Date range: ${formatMonthDay(isStartDate)} - ${formatMonthDay(isEndDate)}
Weekly pay: ${formatCurrency(detailsData?.weeklyPay)}
--------------------------
Loan Amount: ${formatCurrency(detailsData?.requestedAmount)}
Interest: ${formatCurrency(detailsData?.interest)}
--------------------------
Total repay: ${formatCurrency(detailsData?.totalRepayable)}
  `.trim();
    navigator.clipboard.writeText(content);
    setShowToast(false);
    setTimeout(() => {
      setShowToast(true);
    }, 10);
    setTimeout(() => setShowToast(false), 2000);
  };

  const finalId = applicationId || statusData?.payload?.latestApplicationId;
  const isStartDate = detailsData?.startDate;
  const isEndDate = detailsData?.endDate;

  return (
    <div key="apply-form-container">
      {showToast && (
        <div className="toast toast-top toast-center mt-10 z-99 shadow-2xl">
          <div className="alert bg-sky-200 py-2 px-4 font-semibold text-xs text-sky-600 border-none min-w-fit">
            <span>Copied application details!</span>
          </div>
        </div>
      )}

      {statusLoading || !statusData ? (
        <LoadingApply key="loading-view" />
      ) : (
        <div className="min-h-screen p-5 flex flex-col gap-5">
          <div className="bg-white shadow-sm border border-slate-200 p-5 rounded-2xl dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-center items-center gap-1 pt-5">
              <span className="bg-sky-200 p-2  rounded-full text-sky-500 dark:bg-sky-500/20 dark:text-sky-400">
                <CircleAlert size={20} />
              </span>
              <h1 className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">
                Application status
              </h1>
            </div>
            <h3 className="text-slate-600 text-center dark:text-slate-400">
              Reviewing status
            </h3>
            <div className="bg-slate-50 border border-slate-100 p-3 shadow rounded-lg mt-5 flex flex-col dark:bg-slate-700 dark:border-slate-600">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-sm dark:text-slate-400">
                    Application ID:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {finalId}
                  </span>
                </div>
                <div
                  className="tooltip tooltip-info"
                  data-tip="Copy to clipboard"
                >
                  <button
                    onClick={() => handleCopy(finalId)}
                    className="text-sky-500 bg-sky-200 p-2 rounded-lg dark:bg-sky-500/20 dark:text-sky-400"
                    title="Copy to clipboard"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-1">
                <div tabIndex={0} className="collapse group focus:outline-none">
                  <div className="collapse-title font-semibold px-1 pb-0 pt-0 text-sm text-slate-500 dark:text-slate-400">
                    View details
                  </div>
                  <div className="collapse-content text-sm p-0">
                    <div className="border-t border-slate-200 py-2 px-1 grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-sky-600 text-xs dark:text-sky-400 font-black">
                          Loan Amount
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {formatCurrency(detailsData?.requestedAmount)}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sky-600 text-xs dark:text-sky-400">
                          Date range
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{`${formatMonthDay(isStartDate)} - ${formatMonthDay(isEndDate)}`}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sky-600 text-xs dark:text-sky-400">
                          Weekly pay
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {formatCurrency(detailsData?.weeklyPay)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sky-600 text-xs dark:text-sky-400">
                          Interest
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {formatCurrency(detailsData?.interest)}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sky-600 text-xs dark:text-sky-400">
                          Total repay
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {formatCurrency(detailsData?.totalRepayable)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-0 py-4">
              {/* Step 1: Finished */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center ring-4 ring-white shadow-sm dark:ring-slate-700">
                    <svg
                      className="w-2.5 h-2.5 text-white dark:text-slate-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={4}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="w-0.5 h-13 bg-sky-500/30 dark:bg-slate-600"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Submitted
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4  bg-sky-500 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm dark:ring-slate-700`}
                  >
                    <svg
                      className={`w-2.5 h-2.5 text-white dark:text-slate-800`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={4}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div
                    className={`w-0.5 h-13 bg-slate-200 dark:bg-slate-600`}
                  ></div>
                </div>
                <div className="flex flex-col -mt-1">
                  <span
                    className={`text-sm font-bold  tracking-tight text-slate-800 dark:text-slate-200`}
                  >
                    Under Review
                  </span>
                  <span
                    className={`text-[10px] text-slate-400 leading-tight mt-1 dark:text-slate-500 dark:group-focus-within:text-slate-400`}
                  >
                    We are verifying your details.
                  </span>
                </div>
              </div>

              {/* Step 3: Pending */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm bg-slate-200 dark:bg-slate-600 dark:ring-slate-700`}
                  >
                    <svg
                      className={`w-2.5 h-2.5 text-white dark:text-slate-800`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={4}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col -mt-1">
                  <span
                    className={`text-sm font-bold  tracking-tight text-slate-800 dark:text-slate-200`}
                  >
                    Approved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingStatus;
