import React from "react";
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
function CardStatus({
  cardData = [],
  approveStatus,
  rejectStatus,
  currentStatus,
}) {
  return (
    <div key={"status"}>
      {cardData?.length > 0 ? (
        cardData.map((userdata) => (
          <div key={userdata.applicationId}>
            <div className="shadow-sm bg-white border border-slate-200 mt-3 p-5 rounded-2xl dark:bg-slate-800 dark:border-slate-700">
              <div className="flex justify-between  ">
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
                {/* <div
                  className={`badge badge-sm badge-soft text-[10px] px-1 gap-1 ${statusColor(userdata.status)}`}
                >
                  <span>{statusIcon(userdata.status)}</span>
                  <span>{userdata.status}</span>
                </div> */}
              </div>
              <div className="flex flex-col py-5 ml-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Requested
                </span>

                <span className="font-black text-3xl font text-slate-800 dark:text-slate-200 ">
                  {formatCurrency(userdata.requestedAmount)}
                </span>
              </div>

              <div className="grid grid-cols-2 text-sm gap-2  px-5 py-4 border-t border-t-slate-100">
                <div className="flex flex-col ">
                  <span className="text-slate-400 text-xs dark:text-slate-300 font-bold  tracking-widest">
                    Loan Term
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {userdata.repayPeriodWeeks + " weeks"}
                  </span>
                </div>

                <div className="flex flex-col  border-l border-l-slate-100 pl-5">
                  <span className="text-slate-400 text-xs dark:text-slate-300 font-bold tracking-widest">
                    Weekly
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(userdata.weeklyPay)}
                  </span>
                </div>
              </div>
              {/* collapse-open */}

              <div className="collapse collapse-plus bg-slate-100 rounded-2xl  w-full">
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-[11px] font-bold text-slate-400 uppercase tracking-widest px-5 flex items-center min-h-0 py-4 peer-checked:text-sky-500 transition-colors">
                  View all details
                </div>

                <div className="collapse-content text-sm  px-0 py-0">
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
                        <div
                          key={index}
                          className="flex justify-between  items-center mx-3"
                        >
                          <div className="flex items-center gap-3 ">
                            <span className=" bg-sky-100 p-2 text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
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
                        <div className="flex items-center gap-3 ">
                          <span className=" p-2 bg-sky-100 text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
                            <Wallet size={15} />
                          </span>
                          <span className="text-sky-500 text-sm font-extrabold dark:text-slate-300">
                            Total repay
                          </span>
                        </div>
                        <span className="font-extrabold text-lg text-center text-sky-800  dark:text-slate-200">
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
  );
}

export default CardStatus;
