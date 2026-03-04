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
} from "../reusableComponents/formatter";
import { statusColor, statusIcon } from "../reusableComponents/StatusHelper";
import Default_pic from "../assets/images/default_pic.jpg";
import { getProfileImage } from "../reusableComponents/Hooks/ImageGet";
function CardStatus({
  admin_data,
  approveStatus,
  rejectStatus,
  currentStatus,
}) {
  return (
    <div key={"status"}>
      {admin_data?.payload?.length > 0 ? (
        admin_data?.payload?.map((userdata) => (
          <div key={userdata.applicationId}>
            <div className="shadow-sm bg-white border border-slate-200 mt-3 rounded-xl dark:bg-slate-800 dark:border-slate-700">
              <div className="flex justify-between  px-5 pt-5">
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
                <div
                  className={`badge badge-sm badge-soft text-[10px] px-1 gap-1 ${statusColor(userdata.status)}`}
                >
                  <span>{statusIcon(userdata.status)}</span>
                  <span>{userdata.status}</span>
                </div>
              </div>
              <div className="flex mt-5 text-sm gap-2 justify-evenly px-5 ">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className=" text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
                      <CalendarClock size={15} />
                    </span>
                    <span className="text-slate-500 text-sm w-full dark:text-slate-300">
                      Loan Term
                    </span>
                  </div>
                  <span className="font-semibold text-center text-slate-800 dark:text-slate-200">
                    {userdata.repayPeriodWeeks + " weeks"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className=" text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
                      <HandCoins size={15} />
                    </span>
                    <span className="text-slate-500 text-sm w-full dark:text-slate-300">
                      Requested
                    </span>
                  </div>
                  <span className="font-semibold text-center text-slate-800 dark:text-slate-200 ">
                    {formatCurrency(userdata.requestedAmount)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className=" text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
                      <ReceiptText size={15} />
                    </span>
                    <span className="text-slate-500 text-sm w-full dark:text-slate-300 dark:">
                      Weekly
                    </span>
                  </div>
                  <span className="font-semibold text-center text-slate-800 dark:text-slate-200">
                    {formatCurrency(userdata.weeklyPay)}
                  </span>
                </div>
              </div>
              {/* collapse-open */}
              <div className="border-t border-gray-100 mt-3 mx-5">
                <div tabIndex={0} className="collapse">
                  <div className="collapse-title flex justify-between pt-4 px-2 text-gray-500 text-sm">
                    <div className="flex gap-1 items-center">
                      <span className="bg-sky-100 text-sky-500 p-1 rounded items-center dark:bg-sky-950/50 dark:text-sky-400">
                        <ListCheck size={15} />
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        View all details
                      </span>
                    </div>
                    <span className="flex gap-2 ">
                      <button
                        onClick={(e) => rejectStatus(e, userdata.applicationId)}
                        className={`${currentStatus === "REJECTED" ? "hidden" : "text-xs py-0 px-2 items-center flex gap-1 "} rounded-full bg-red-100 p-1 text-red-500 dark:bg-red-950/50 dark:text-red-400`}
                      >
                        <X size={20} />
                        {currentStatus === "APPROVED" ? "Reject" : ""}
                      </button>
                      <button
                        onClick={(e) =>
                          approveStatus(e, userdata.applicationId)
                        }
                        className={`${currentStatus === "APPROVED" ? "hidden" : "text-xs py-0 px-2 items-center flex gap-1 "} rounded-full bg-green-100 p-1 text-green-500 dark:bg-green-950/50 dark:text-green-400`}
                      >
                        <Check size={20} />
                        {currentStatus === "REJECTED" ? "Approve" : ""}
                      </button>
                    </span>
                  </div>
                  <div className="collapse-content text-sm  px-0 py-0">
                    <div className="flex flex-col">
                      <div className="flex flex-col gap-3 p-3 rounded-b-3xl border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
                              <CalendarRange size={15} />
                            </span>
                            <span className="text-slate-500 text-sm dark:text-slate-300">
                              Date range
                            </span>
                          </div>
                          <span className="font-semibold text-center text-slate-800 dark:text-slate-200">
                            {`${formatMonthDay(userdata.startDate)}-
                                    ${formatMonthDay(userdata.endDate)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
                              <Wallet size={15} />
                            </span>
                            <span className="text-slate-500 text-sm dark:text-slate-300">
                              Term (Days)
                            </span>
                          </div>
                          <span className="font-semibold text-center text-slate-800 dark:text-slate-200">
                            {userdata.repayPeriodDays + " days"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
                              <Percent size={15} />
                            </span>
                            <span className="text-slate-500 text-sm dark:text-slate-300">
                              Interest rate
                            </span>
                          </div>
                          <span className="font-semibold text-center text-slate-800 dark:text-slate-200">
                            {userdata.interest}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
                              <Percent size={15} />
                            </span>
                            <span className="text-slate-500 text-sm dark:text-slate-300">
                              Interest
                            </span>
                          </div>
                          <span className="font-semibold text-center text-slate-800 dark:text-slate-200">
                            {userdata.interestRate + " %"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded dark:bg-sky-950/50 dark:text-sky-400">
                              <Wallet size={15} />
                            </span>
                            <span className="text-slate-500 text-sm dark:text-slate-300">
                              Total repay
                            </span>
                          </div>
                          <span className="font-semibold text-center text-slate-800 dark:text-slate-200">
                            {userdata.totalRepayable}
                          </span>
                        </div>
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
