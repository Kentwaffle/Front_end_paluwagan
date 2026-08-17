import React, { useState } from "react";
import {
  CalendarClock,
  HandCoins,
  ReceiptText,
  ListCheck,
  X,
  Check,
  CalendarRange,
  Percent,
  Wallet,
} from "lucide-react";
import {
  formatCurrency,
  formatMonthDay,
} from "../reusableComponents/Utils/formatter";
import {
  statusColor,
  statusIcon,
} from "../reusableComponents/Feedbacks/StatusHelper";
import Default_pic from "../assets/images/default_pic.jpg";
import { getProfileImage } from "../reusableComponents/Hooks/ImageGet";

function LoanCard({ userdata, approveStatus, rejectStatus, currentStatus }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const showReject = currentStatus !== "REJECTED";
  const showApprove = currentStatus !== "APPROVED";

  return (
    <div 
      className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 relative ${
        isExpanded 
          ? "border-blue-500 border-l-4 dark:border-blue-500/80" 
          : "border-slate-150 dark:border-slate-800"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 flex justify-center items-center border border-slate-100 dark:border-slate-800 rounded-full overflow-hidden shrink-0">
            <img
              alt="Profile picture"
              src={getProfileImage(userdata.profileImage)}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {userdata.firstName} {userdata.lastName}
            </span>
            <span className="text-xs text-slate-405 dark:text-slate-500 mt-0.5 font-mono">
              ID: {userdata.applicationId}
            </span>
          </div>
        </div>

        {currentStatus === "PENDING" && (
          <span className="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg">
            New
          </span>
        )}
      </div>

      {/* Requested Amount */}
      <div className="flex flex-col mt-5">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Requested Amount
        </span>
        <span className="font-black text-3xl text-slate-900 dark:text-white mt-1 leading-none">
          {formatCurrency(userdata.requestedAmount)}
        </span>
      </div>

      {/* Card Body Details */}
      {isExpanded ? (
        <div className="flex flex-col gap-4 mt-5">
          {/* Expanded Summary Row */}
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-1">
            <div className="flex flex-col">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Loan Term</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{userdata.repayPeriodWeeks} weeks</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Weekly Repayment</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatCurrency(userdata.weeklyPay)}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col gap-3.5">
            {[
              {
                label: "Date Range",
                value: `${formatMonthDay(userdata.startDate)} - ${formatMonthDay(userdata.endDate)}`,
                icon: <CalendarRange size={14} />,
              },
              {
                label: "Term (Days)",
                value: `${userdata.repayPeriodDays} days`,
                icon: <CalendarClock size={14} />,
              },
              {
                label: "Interest Rate",
                value: formatCurrency(userdata.interest),
                icon: <Percent size={14} />,
              },
              {
                label: "Interest (%)",
                value: `${userdata.interestRate}%`,
                icon: <Percent size={14} />,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="bg-white dark:bg-slate-800 p-2 text-slate-400 dark:text-slate-500 rounded-lg shadow-sm border border-slate-100/50 dark:border-slate-700/50 flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    {item.label}
                  </span>
                </div>
                <span className="text-slate-800 dark:text-slate-200 text-xs font-bold">
                  {item.value}
                </span>
              </div>
            ))}

            {/* Total Repay Box */}
            <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 p-3 px-4 rounded-xl flex justify-between items-center font-bold border border-blue-100 dark:border-blue-900/50 mt-1">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-blue-100/60 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-md">
                  <Wallet size={13} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">Total Repay</span>
              </div>
              <span className="text-base font-black">
                {formatCurrency(userdata.totalRepayable)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed Box */
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl grid grid-cols-2 gap-4 mt-5">
          <div className="flex flex-col">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              Loan Term
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 text-sm">
              {userdata.repayPeriodWeeks} weeks
            </span>
          </div>

          <div className="flex flex-col border-l border-slate-200/60 dark:border-slate-800 pl-4">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              Weekly Repayment
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 text-sm">
              {formatCurrency(userdata.weeklyPay)}
            </span>
          </div>
        </div>
      )}

      {/* Buttons */}
      {(showReject || showApprove) && (
        <div className="flex gap-3 mt-6 border-t border-slate-100 dark:border-slate-850 pt-5">
          {showReject && (
            <button
              onClick={(e) => rejectStatus(e, userdata.applicationId)}
              className="flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 text-red-500 hover:border-red-500 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex-1 dark:border-red-900/50 dark:hover:bg-red-950/20 active:scale-95"
            >
              <X size={14} strokeWidth={2.5} />
              <span>Reject</span>
            </button>
          )}

          {showApprove && (
            <button
              onClick={(e) => approveStatus(e, userdata.applicationId)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex-1 active:scale-95"
            >
              <Check size={14} strokeWidth={2.5} />
              <span>Approve</span>
            </button>
          )}
        </div>
      )}

      {/* Footer Toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-sky-400 mt-5 cursor-pointer select-none pt-2 hover:opacity-85 transition-opacity"
      >
        <span>{isExpanded ? "Hide Details" : "View All Details"}</span>
        <span className="text-lg leading-none">{isExpanded ? "−" : "+"}</span>
      </div>
    </div>
  );
}

function CardStatus({
  cardData = [],
  approveStatus,
  rejectStatus,
  currentStatus,
  searchrefPending = "",
}) {
  const filteredCardData = cardData?.filter((userdata) => {
    if (!searchrefPending) return true;
    const query = searchrefPending.toLowerCase();
    const nameMatch = `${userdata.firstName} ${userdata.lastName}`.toLowerCase().includes(query);
    const idMatch = String(userdata.applicationId).toLowerCase().includes(query);
    return nameMatch || idMatch;
  });

  return (
    <div key={"status"}>
      
      {/* MOBILE VIEW */}
      <div className="block md:hidden">
        {filteredCardData?.length > 0 ? (
          filteredCardData.map((userdata) => (
            <div key={userdata.applicationId}>
              <div className="shadow-sm bg-white border border-slate-200 mt-3 p-5 rounded-2xl dark:bg-slate-800 dark:border-slate-700">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="w-9 h-9 flex justify-center items-center border border-sky-500 rounded-full overflow-hidden">
                      <img
                        alt="Profile picture"
                        src={getProfileImage(userdata.profileImage)}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="flex flex-wrap gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        <div className="leading-tight">{userdata.firstName}</div>
                        <div className="leading-tight">{userdata.lastName}</div>
                      </span>
                      <div className="text-xs text-slate-400 dark:text-slate-300">
                        ID:{userdata.applicationId}
                      </div>
                    </div>
                  </div>
                  <span className="flex gap-2">
                    <button
                      onClick={(e) => rejectStatus(e, userdata.applicationId)}
                      className={`${currentStatus === "REJECTED" ? "hidden" : "flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200"}`}
                    >
                      <X size={14} strokeWidth={3} />
                      {currentStatus === "PENDING" ? (
                        ""
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Reject
                        </span>
                      )}
                    </button>

                    <button
                      onClick={(e) => approveStatus(e, userdata.applicationId)}
                      className={`${currentStatus === "APPROVED" ? "hidden" : "flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-500 border border-green-100 rounded-full hover:bg-green-500 hover:text-white transition-all duration-200"}`}
                    >
                      <Check size={14} strokeWidth={3} />
                      {currentStatus === "PENDING" ? (
                        ""
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Approved
                        </span>
                      )}
                    </button>
                  </span>
                </div>
                
                <div className="flex flex-col py-5 ml-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Requested
                  </span>
                  <span className="font-black text-3xl text-slate-800 dark:text-slate-200">
                    {formatCurrency(userdata.requestedAmount)}
                  </span>
                </div>

                <div className="grid grid-cols-2 text-sm gap-2 px-5 py-4 border-t border-t-slate-100">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs dark:text-slate-300 font-bold tracking-widest">
                      Loan Term
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {userdata.repayPeriodWeeks + " weeks"}
                    </span>
                  </div>

                  <div className="flex flex-col border-l border-l-slate-100 pl-5">
                    <span className="text-slate-400 text-xs dark:text-slate-300 font-bold tracking-widest">
                      Weekly
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(userdata.weeklyPay)}
                    </span>
                  </div>
                </div>

                <div className="collapse collapse-plus bg-slate-100 rounded-2xl w-full">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title text-[11px] font-bold text-slate-400 uppercase tracking-widest px-5 flex items-center min-h-0 py-4 peer-checked:text-sky-500 transition-colors">
                    View all details
                  </div>

                  <div className="collapse-content text-sm px-0 py-0">
                    <div className="flex flex-col">
                      <div className="flex flex-col gap-3 p-5 rounded-b-3xl border-t border-gray-200 dark:border-gray-700">
                        {[
                          {
                            label: "Date Range",
                            value: `${formatMonthDay(userdata.startDate)} - ${formatMonthDay(userdata.endDate)}`,
                            icon: <CalendarRange size={14} />,
                          },
                          {
                            label: "Term (Days)",
                            value: `${userdata.repayPeriodDays} days`,
                            icon: <Wallet size={14} />,
                          },
                          {
                            label: "Interest Rate",
                            value: formatCurrency(userdata.interest),
                            icon: <Percent size={14} />,
                          },
                          {
                            label: "Interest (%)",
                            value: `${userdata.interestRate}%`,
                            icon: <Percent size={14} />,
                          },
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center mx-3">
                            <div className="flex items-center gap-3">
                              <span className="bg-sky-100 p-2 text-sky-500 rounded dark:bg-sky-955/50 dark:text-sky-400">
                                {item.icon}
                              </span>
                              <span className="text-slate-400 text-sm dark:text-slate-300">
                                {item.label}
                              </span>
                            </div>
                            <span className="font-semibold text-center text-slate-800 dark:text-slate-200">
                              {item.value}
                            </span>
                          </div>
                        ))}

                        <div className="flex justify-between bg-sky-50 items-center p-3 rounded-xl border border-sky-500">
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-sky-100 text-sky-500 rounded dark:bg-sky-955/50 dark:text-sky-400">
                              <Wallet size={15} />
                            </span>
                            <span className="text-sky-500 text-sm font-extrabold dark:text-slate-300">
                              Total repay
                            </span>
                          </div>
                          <span className="font-extrabold text-lg text-center text-sky-800 dark:text-slate-200">
                            {formatCurrency(userdata.totalRepayable)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div key={"norecord"} className="text-center p-10 opacity-50 italic">
            {`No ${currentStatus.toLowerCase()} applications`}
          </div>
        )}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
        {filteredCardData?.length > 0 ? (
          filteredCardData.map((userdata) => (
            <LoanCard
              key={userdata.applicationId}
              userdata={userdata}
              approveStatus={approveStatus}
              rejectStatus={rejectStatus}
              currentStatus={currentStatus}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-slate-400 dark:text-slate-500 italic bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl">
            {`No ${currentStatus.toLowerCase()} applications found`}
          </div>
        )}
      </div>

    </div>
  );
}

export default CardStatus;
