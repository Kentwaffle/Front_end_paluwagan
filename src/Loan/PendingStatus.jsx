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

  const { data: statusData, loading: statusLoading } = useFetchData(
    "/api/loan/status",
    API_ENDPOINTS.APPLY_STATUS,
  );

  const { data: detailsData, loading: detailsLoading } = useFetchData(
    "/api/loan/status/details",
    API_ENDPOINTS.APPLICATION_DETAILS,
  );

  if (statusLoading || !statusData) {
    return (
      <div key="loading-view">
        <LoadingApply />
      </div>
    );
  }

  const handleCopy = (textCopy) => {
    if (!textCopy) return;
    navigator.clipboard.writeText(
      `
Application ID: ${finalId}
Date range: ${formatMonthDay(isStartDate)} - ${formatMonthDay(isEndDate)}
Weekly pay: ${formatCurrency(detailsData?.weeklyPay)}
--------------------------
Loan Amount:	${formatCurrency(detailsData?.requestedAmount)}
Interest:	  ${formatCurrency(detailsData?.interest)}
--------------------------
Total repay: ${formatCurrency(detailsData?.totalRepayable)}
      `,
    );
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
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header openSideBar={() => setIsOpen(!isOpen)} />

      {showToast && (
        <div className="toast toast-top toast-center mt-10 z-99 shadow-2xl">
          <div className="alert bg-sky-200 py-2 px-4 font-semibold text-xs text-sky-600 border-none min-w-fit">
            <span>Copied application details!</span>
          </div>
        </div>
      )}

      <div className="min-h-screen p-3 flex flex-col gap-5">
        <div className="shadow-md border border-slate-200 p-5 rounded-2xl">
          <div className="flex justify-center items-center gap-1 pt-5">
            <span className="bg-sky-200 p-2  rounded-full text-sky-500">
              <CircleAlert size={20} />
            </span>
            <h1 className="text-2xl font-extrabold  text-stone-700">
              Application status
            </h1>
          </div>
          <h3 className="text-stone-600 text-center">Reviewing status</h3>
          <div className="bg-slate-50 border border-slate-100 p-3 shadow rounded-lg mt-5 flex flex-col ">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-stone-500 text-sm">Application ID:</span>
                <span className="font-semibold">{finalId}</span>
              </div>
              <div
                className="tooltip tooltip-info"
                data-tip="Copy to clipboard"
              >
                <button
                  onClick={() => handleCopy(finalId)}
                  className="text-sky-500 bg-sky-200 p-2 rounded-lg "
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div className="mt-1">
              <div tabIndex={0} className="collapse group focus:outline-none">
                <div className="collapse-title font-semibold px-1 pb-0 pt-0 text-sm text-gray-500">
                  View details
                </div>
                <div className="collapse-content text-sm p-0">
                  <div className="border-t border-slate-200 py-2 px-1 grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs">
                        Loan Amount:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(detailsData?.requestedAmount)}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs">Date range:</span>
                      <span className="font-semibold">{`${formatMonthDay(isStartDate)} - ${formatMonthDay(isEndDate)}`}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs">Weekly pay:</span>
                      <span className="font-semibold">
                        {formatCurrency(detailsData?.weeklyPay)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs">Interest:</span>
                      <span className="font-semibold">
                        {formatCurrency(detailsData?.interest)}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs">
                        Total repay:
                      </span>
                      <span className="font-semibold">
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
                <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center ring-4 ring-white shadow-sm">
                  <svg
                    className="w-2.5 h-2.5 text-white"
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
                <div className="w-0.5 h-13 bg-sky-500/30"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">
                  Submitted
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4  bg-sky-500 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm`}
                >
                  <svg
                    className={`w-2.5 h-2.5 text-white `}
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
                <div className={`w-0.5 h-13 bg-slate-200`}></div>
              </div>
              <div className="flex flex-col -mt-1">
                <span
                  className={`text-sm font-bold  tracking-tight text-slate-800 `}
                >
                  Under Review
                </span>
                <span
                  className={`text-[10px] text-slate-400 leading-tight mt-1`}
                >
                  We are verifying your details.
                </span>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm bg-slate-200`}
                >
                  <svg
                    className={`w-2.5 h-2.5 text-white `}
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
                  className={`text-sm font-bold  tracking-tight text-slate-800 `}
                >
                  Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingStatus;
