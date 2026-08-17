import React, { useState } from "react";
import {
  formatCurrency,
  formatDate,
} from "../../reusableComponents/Utils/formatter";
import SearchInput from "../../reusableComponents/Forms/SearchInput";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useFetchData } from "../../serviceToApi/fetchData";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TransactionList from "../../Savings/CardPayment/TransactionList";
import { UserX, RotateCw, Check, X, Search, CalendarDays, ArrowLeft } from "lucide-react";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { usePostData } from "../../serviceToApi/PostData";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { swalModal } from "../../reusableComponents/Alerts/SweetAlerts";
import { useQueryClient } from "@tanstack/react-query";
import { useLoanSSE } from "../../reusableComponents/Hooks/SSE";
import { PaymentListLoading } from "../../reusableComponents/Feedbacks/loading";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { handleTransactionAction } from "./handleStatusChange";
import { formatTimeAgo } from "../../reusableComponents/Utils/TimeDateformat";
import { formatDistanceToNow } from "date-fns";

function PaymentList() {
  const { savingsId } = useParams();
  useLoanSSE(true, savingsId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [refSearch, setRefSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState("");
  const [limit, setLimit] = useState(10);

  const {
    data: savingsMember,
    isLoading: LoadingsavingsMember,
    error,
  } = useFetchData(
    `api/admin/savings/members/=${savingsId}`,
    `${API_ENDPOINTS.SAVINGS_MEMBER_URL.replace("{savingsId}", savingsId)}`,
  );

  const params = new URLSearchParams();
  if (appliedFilters) params.append("reference", appliedFilters);

  const queryString = params.toString();

  const activeEndpoint = queryString
    ? `${API_ENDPOINTS.SAVINGS_FILTER_APPROVED.replace("{savingsId}", savingsId)}?${queryString}`
    : `${API_ENDPOINTS.SAVINGS_FILTER_APPROVED.replace("{savingsId}", savingsId)}`;

  const { data: filterApproved, loading: isLoadingFilterApproved } =
    useFetchData(activeEndpoint, activeEndpoint);
  const handleSearchClick = () => {
    setAppliedFilters(refSearch);
  };

  const { mutate: ApproveData } = usePostData(
    `/api/admin/savings/payment`,
    API_ENDPOINTS.SAVINGS_ACCEPT_PAYMENT,
  );
  const userCreds = savingsMember?.payload?.user;
  const referencePayment = savingsMember?.payload?.payments?.[0];
  const withdrawRef = savingsMember?.payload?.withdraw;
  const isInvalid =
    !savingsMember?.payload ||
    (Array.isArray(savingsMember.payload) &&
      savingsMember.payload.length === 0) ||
    error;

  const isPending = savingsMember?.payload?.payments?.[0]?.status;
  const withdrawStatus = savingsMember?.payload?.withdraw?.status;
  const widthDraw = savingsMember?.payload?.withdraw;
  const paidArray = filterApproved?.savings || [];
  const isPaid = paidArray.length > 0 && paidArray[0].status === "PAID";

  const context = { ApproveData, queryClient, savingsId, userCreds };

  const getTimeAgo = (dateStr) => {
    try {
      if (!dateStr) return "";
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true }).replace("about ", "");
    } catch (e) {
      return "";
    }
  };

  const handleLoadMore = () => {
    setLimit((prev) => prev + 10);
  };

  const transactionsToDisplay = paidArray.slice(0, limit);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {isLoadingFilterApproved || LoadingsavingsMember ? (
        <PaymentListLoading />
      ) : isInvalid ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-in fade-in duration-500">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-sky-100 rounded-full blur-2xl opacity-50 animate-pulse dark:bg-slate-700"></div>
            <div className="relative bg-white p-6 rounded-full shadow-sm border border-slate-100 dark:bg-slate-800">
              <UserX
                size={48}
                strokeWidth={1.5}
                className="text-slate-300 dark:text-slate-500"
              />
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-800 mb-2 dark:text-slate-200">
            Member not Found
          </h3>
          <p className="text-slate-500 text-sm max-w-[250px] leading-relaxed dark:text-slate-400">
            We couldn't find a record matching this ID. The link might be broken
            or the member has been removed from the database.
          </p>

          <button
            onClick={() => navigate("/admin/savings_management")}
            className="mt-6 px-6 py-2 bg-sky-500 text-white rounded-full text-sm font-bold shadow-md shadow-sky-200 active:scale-95 transition-all dark:bg-sky-400 dark:shadow-sky-700"
          >
            Go to member list
          </button>
        </div>
      ) : (
        <div className="min-h-screen">
          
          {/* MOBILE VIEW */}
          <div className="block md:hidden">
            <div className="bg-gradient-to-br from-sky-500 via-sky-500 to-sky-600 shadow-sm p-5 rounded-2xl dark:bg-gradient-to-br dark:from-slate-700 dark:via-slate-700 dark:to-slate-900">
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 flex justify-center items-center border border-sky-500 rounded-full overflow-hidden">
                    <img
                      alt="Profile picture"
                      src={getProfileImage(userCreds.profileImage)}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col flex-1 items-start min-w-0">
                    <div className="flex flex-wrap gap-1 truncate w-full font-bold text-white dark:text-slate-200">
                      <div>{userCreds.firstName || "No name"}</div>
                      <div>{userCreds.lastName || "No name"}</div>
                    </div>
                    <div className="text-xs text-sky-100 dark:text-slate-400">
                      {userCreds.savingsId || "000000000"}
                    </div>
                  </div>
                </div>
                <div className="my-5">
                  <div className="flex flex-col text-sky-100 dark:text-slate-400">
                    <div className="text-xs dark:text-slate-400">
                      Total Savings
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight dark:text-slate-200">
                      {formatCurrency(userCreds.accountBalance)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                  <div className="flex flex-col text-xs text-white">
                    <span className="text-sky-100 font-medium dark:text-slate-400">
                      Target amount
                    </span>
                    <span className=" font-black dark:text-slate-200">
                      {formatCurrency(userCreds.targetAmount)}
                    </span>
                  </div>
                  <div className="flex flex-col text-xs text-white border-l border-white/40 pl-4 dark:border-slate-400/40">
                    <span className=" text-sky-100 font-medium dark:text-slate-400">
                      Maturity Date
                    </span>
                    <span className="font-black dark:text-slate-200">
                      {formatDate(userCreds.maturityDate) || "No deposit yet"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {withdrawStatus === "WITHDRAW" && (
              <>
                <div className="my-3 mx-2 text-slate-800 font-black dark:text-slate-200">
                  User withdrawal
                </div>
                <div className="bg-white border-l-4 border-l-amber-500 shadow-sm p-3 px-5 rounded-xl border border-slate-50 dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-red-500 dark:text-red-400">
                      {formatCurrency(widthDraw.totalBalance)}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {formatDate(widthDraw.withdrawDate)}
                    </div>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {formatTimeAgo(widthDraw.withdrawDate)}
                    </div>
                    <div className="text-xs dark:text-slate-400">
                      {widthDraw.reference}
                    </div>
                  </div>
                  <div className="flex gap-1 justify-end border-t border-t-slate-200 mt-2 py-2 dark:border-t-slate-700">
                    <button
                      type="button"
                      onClick={() => handleTransactionAction("WITHDRAW_APPROVE", withdrawRef, context)}
                      className="flex items-center rounded-full px-2 py-0.5 text-sm bg-emerald-50 text-emerald-500 dark:bg-emerald-900 dark:text-emerald-400"
                    >
                      <Check size={20} />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleTransactionAction("WITHDRAW_REJECT", withdrawRef, context)}
                      className="flex items-center rounded-full px-2 py-0.5 text-sm bg-red-50 text-red-500 dark:bg-red-900 dark:text-red-400"
                    >
                      <X size={20} />
                      <span>Declined</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="my-3 mx-2 text-slate-800 font-black dark:text-slate-200">
              Pending payments
            </div>
            <div>
              {isPending === "PENDING" ? (
                <TransactionList
                  transactions={savingsMember?.payload?.payments || []}
                  hasSearched={true}
                  isLoading={LoadingsavingsMember}
                  showActions={true}
                  isAccepted={() => handleTransactionAction("APPROVE", referencePayment, context)}
                  isDeclined={() => handleTransactionAction("REJECTED", referencePayment, context)}
                />
              ) : (
                <div className="flex flex-col items-center text-center mt-5 p-5 h-auto italic rounded-2xl text-slate-500 bg-white-50 border border-slate-100 shadow-inner dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                  No pending payments
                </div>
              )}
            </div>

            <div className="my-3 mx-2 text-slate-800 font-black dark:text-slate-200">
              Approved payments
            </div>
            <div className="flex gap-2 mb-4 items-center">
              <SearchInput
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                placeholder="Search ID and Date"
                className="!rounded-full h-9 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={handleSearchClick}
                className="px-4 py-1.5 bg-sky-500 text-white rounded-full text-sm font-medium dark:bg-sky-600 dark:hover:bg-sky-700 active:scale-95 transition-all"
              >
                Search
              </button>
            </div>
            <div>
              {isPaid ? (
                <TransactionList
                  transactions={filterApproved?.savings.slice(0, 15)}
                  hasSearched={true}
                  isLoading={LoadingsavingsMember}
                />
              ) : (
                <div className="flex flex-col items-center text-center mt-5 p-5 h-auto italic rounded-2xl text-slate-500 bg-white-50 border border-slate-100 shadow-inner dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                  No approved payments
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:flex flex-col gap-6">
            
            {/* Header Block */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/savings_management")}
                className="p-2.5 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                title="Back to Member Management"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Ledger Details
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-450 font-medium mt-0.5">
                  Manage savings and view transaction history.
                </p>
              </div>
            </div>

            {/* Top Grid Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left: Blue Member Details Card */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white p-8 rounded-3xl shadow-md border border-blue-500/20 flex flex-col justify-between h-full min-h-[240px]">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 flex justify-center items-center border border-white/30 rounded-full overflow-hidden">
                      <img
                        alt="Profile picture"
                        src={getProfileImage(userCreds.profileImage)}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <h3 className="text-xl font-bold tracking-tight">
                        {userCreds.firstName} {userCreds.lastName}
                      </h3>
                      <span className="text-xs text-blue-100/80 mt-0.5 font-medium flex items-center gap-1">
                        {userCreds.savingsId || "000000000"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col mt-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-100/70 mb-0.5">
                      Total Savings
                    </span>
                    <span className="text-4xl font-black tracking-tight text-white">
                      {formatCurrency(userCreds.accountBalance)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-5 mt-6">
                    <div className="flex flex-col text-xs text-white">
                      <span className="text-blue-100/70 font-semibold mb-0.5">
                        Target amount
                      </span>
                      <span className="font-extrabold text-sm">
                        {formatCurrency(userCreds.targetAmount)}
                      </span>
                    </div>
                    <div className="flex flex-col text-xs text-white border-l border-white/20 pl-6">
                      <span className="text-blue-100/70 font-semibold mb-0.5">
                        Maturity Date
                      </span>
                      <span className="font-extrabold text-sm">
                        {formatDate(userCreds.maturityDate) || "No deposit yet"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right: Pending Payments Card */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-full min-h-[240px]">
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="p-1.5 bg-red-50 text-red-500 rounded-lg dark:bg-red-950/50">
                      <CalendarDays size={18} />
                    </span>
                    <span className="text-sm font-bold text-slate-855 dark:text-slate-100">
                      Pending payments
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    {isPending === "PENDING" ? (
                      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="text-lg font-black text-emerald-500 dark:text-emerald-400">
                              {formatCurrency(referencePayment.amountRemit)}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              {getTimeAgo(referencePayment.remitDate)}
                            </span>
                          </div>
                          <div className="flex flex-col items-end text-xs text-slate-500">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {formatDate(referencePayment.remitDate)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-450 mt-0.5">
                              {referencePayment.reference}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end border-t border-slate-200/60 dark:border-slate-700/60 pt-3 mt-1">
                          <button
                            type="button"
                            onClick={() => handleTransactionAction("APPROVE", referencePayment, context)}
                            className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 transition-colors border border-emerald-100 dark:border-emerald-900/50"
                          >
                            <Check size={14} />
                            <span>Accept</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTransactionAction("REJECTED", referencePayment, context)}
                            className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-650 dark:bg-red-950/30 dark:text-red-400 transition-colors border border-red-100 dark:border-red-900/50"
                          >
                            <X size={14} />
                            <span>Declined</span>
                          </button>
                        </div>
                      </div>
                    ) : withdrawStatus === "WITHDRAW" ? (
                      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="text-xs uppercase font-bold tracking-wider text-amber-500 dark:text-amber-400">
                              Withdrawal Request
                            </span>
                            <span className="text-lg font-black text-red-500 dark:text-red-450 mt-1">
                              {formatCurrency(widthDraw.totalBalance)}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              {getTimeAgo(widthDraw.withdrawDate)}
                            </span>
                          </div>
                          <div className="flex flex-col items-end text-xs text-slate-500">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {formatDate(widthDraw.withdrawDate)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-450 mt-0.5">
                              {widthDraw.reference}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end border-t border-slate-200/60 dark:border-slate-700/60 pt-3 mt-1">
                          <button
                            type="button"
                            onClick={() => handleTransactionAction("WITHDRAW_APPROVE", withdrawRef, context)}
                            className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 transition-colors border border-emerald-100 dark:border-emerald-900/50"
                          >
                            <Check size={14} />
                            <span>Accept</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTransactionAction("WITHDRAW_REJECT", withdrawRef, context)}
                            className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-650 dark:bg-red-950/30 dark:text-red-400 transition-colors border border-red-100 dark:border-red-900/50"
                          >
                            <X size={14} />
                            <span>Declined</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400 dark:text-slate-500 italic text-xs border border-dashed border-slate-250 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                        No pending transactions
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>

            {/* Approved Payments Section */}
            <div className="flex flex-col gap-4 mt-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Approved payments
              </h2>

              {/* Search Controls */}
              <div className="flex gap-3 items-center">
                <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 px-4 py-2.5 rounded-xl focus-within:border-sky-500 transition-colors shadow-sm">
                  <Search size={16} className="text-slate-400" />
                  <input
                    type="text"
                    value={refSearch}
                    onChange={(e) => setRefSearch(e.target.value)}
                    placeholder="Search ID and Date"
                    className="bg-transparent border-none outline-none text-xs flex-1 text-slate-705 dark:text-slate-300 focus:ring-0 placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Search
                </button>
              </div>

              {/* Approved Payments Rows */}
              <div className="flex flex-col gap-3">
                {isPaid ? (
                  <>
                    {transactionsToDisplay.map((transac, idx) => (
                      <div
                        key={`${transac.reference}-${idx}`}
                        className="bg-white dark:bg-slate-800 p-4 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center transition-all hover:border-slate-200 dark:hover:border-slate-750"
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-base font-black text-emerald-500 dark:text-emerald-400">
                            {formatCurrency(transac.amountRemit)}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {getTimeAgo(transac.remitDate)}
                          </span>
                        </div>
                        <div className="flex flex-col items-end text-xs text-slate-500">
                          <span className="font-semibold text-slate-700 dark:text-slate-350">
                            {formatDate(transac.remitDate)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-450 mt-0.5">
                            {transac.reference}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Load More Button */}
                    {paidArray.length > limit && (
                      <div className="flex justify-center mt-4">
                        <button
                          type="button"
                          onClick={handleLoadMore}
                          className="text-xs font-bold text-blue-600 hover:text-blue-750 dark:text-sky-400 flex items-center gap-1 transition-all py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl"
                        >
                          <span>Load More Transactions</span>
                          <span>↓</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center mt-5 p-10 italic rounded-2xl text-slate-500 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-inner">
                    <span>No approved payments found.</span>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default PaymentList;
