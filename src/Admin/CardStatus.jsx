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
            <div className="shadow border border-slate-200 mt-3 rounded-xl">
              <div className="flex justify-between  px-5 pt-5">
                <div className="flex gap-2 items-center">
                  <div className="w-9">
                    <img
                      alt="Profile picture"
                      src={Default_pic}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="flex flex-col font-semibold">
                      <div className="leading-tight">{userdata.firstName}</div>
                      <div className="leading-tight">{userdata.lastName}</div>
                    </span>
                    <div className="text-xs text-gray-400">
                      ID:{userdata.applicationId}
                    </div>
                  </div>
                </div>
                <div
                  className={`badge badge-sm badge-soft ${statusColor(userdata.status)}`}
                >
                  <span>{statusIcon(userdata.status)}</span>
                  <span>{userdata.status}</span>
                </div>
              </div>
              <div className="flex mt-5 text-sm gap-2 justify-evenly px-5 ">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className=" text-sky-500 rounded">
                      <CalendarClock size={15} />
                    </span>
                    <span className="text-stone-500 text-sm w-full">
                      Loan Term
                    </span>
                  </div>
                  <span className="font-semibold text-center">
                    {userdata.repayPeriodWeeks + " weeks"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className=" text-sky-500 rounded">
                      <HandCoins size={15} />
                    </span>
                    <span className="text-stone-500 text-sm">Requested</span>
                  </div>
                  <span className="font-semibold text-center">
                    {formatCurrency(userdata.requestedAmount)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className=" text-sky-500 rounded">
                      <ReceiptText size={15} />
                    </span>
                    <span className="text-stone-500 text-sm">Weekly</span>
                  </div>
                  <span className="font-semibold text-center">
                    {formatCurrency(userdata.weeklyPay)}
                  </span>
                </div>
              </div>
              {/* collapse-open */}
              <div className="border-t border-gray-100 mt-3 mx-5">
                <div tabIndex={0} className="collapse">
                  <div className="collapse-title flex justify-between pt-4 px-2 text-gray-500 text-sm">
                    <div className="flex gap-1 items-center">
                      <span className="bg-sky-100 text-sky-500 p-1 rounded items-center">
                        <ListCheck size={15} />
                      </span>
                      <span>View all details</span>
                    </div>
                    <span className="flex gap-2">
                      <button
                        onClick={(e) => rejectStatus(e, userdata.applicationId)}
                        className={`${currentStatus === "REJECTED" ? "hidden" : "block"} rounded-full bg-red-100 p-1 text-red-500`}
                      >
                        <X size={20} />
                      </button>
                      <button
                        onClick={(e) =>
                          approveStatus(e, userdata.applicationId)
                        }
                        className={`${currentStatus === "APPROVED" ? "hidden" : "block"} rounded-full bg-green-100 p-1 text-green-500`}
                      >
                        <Check size={20} />
                      </button>
                    </span>
                  </div>
                  <div className="collapse-content text-sm  px-0 py-0">
                    <div className="flex flex-col">
                      <div className="flex flex-col gap-3 p-3 rounded-b-3xl border-t border-gray-200">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded">
                              <CalendarRange size={15} />
                            </span>
                            <span className="text-stone-500 text-sm">
                              Date range
                            </span>
                          </div>
                          <span className="font-semibold text-center">
                            {`${formatMonthDay(userdata.startDate)}-
                                    ${formatMonthDay(userdata.endDate)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded">
                              <Wallet size={15} />
                            </span>
                            <span className="text-stone-500 text-sm">
                              Term (Days)
                            </span>
                          </div>
                          <span className="font-semibold text-center">
                            {userdata.repayPeriodDays + " days"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded">
                              <Percent size={15} />
                            </span>
                            <span className="text-stone-500 text-sm">
                              Interest rate
                            </span>
                          </div>
                          <span className="font-semibold text-center">
                            {userdata.interest}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded">
                              <Percent size={15} />
                            </span>
                            <span className="text-stone-500 text-sm">
                              Interest
                            </span>
                          </div>
                          <span className="font-semibold text-center">
                            {userdata.interestRate + " %"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span className=" text-sky-500 rounded">
                              <Wallet size={15} />
                            </span>
                            <span className="text-stone-500 text-sm">
                              Totap repay
                            </span>
                          </div>
                          <span className="font-semibold text-center">
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
          No records found.
        </div>
      )}
    </div>
  );
}

export default CardStatus;
