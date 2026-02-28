import React, { useState } from "react";
import { formatCurrency, formatDate } from "../../reusableComponents/formatter";
import SearchInput from "../../reusableComponents/SearchInput";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useFetchData } from "../../serviceToApi/fetchData";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TransactionList from "../../Savings/CardPayment/TransactionList";
import { UserX, RotateCw, Check, X } from "lucide-react";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { usePostData } from "../../serviceToApi/PostData";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { swalModal } from "../../reusableComponents/Alerts/SweetAlerts";
import { useQueryClient } from "@tanstack/react-query";
import { useLoanSSE } from "../../reusableComponents/Hooks/SSE";
import { PaymentListLoading } from "../../reusableComponents/loading";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { formatDistanceToNow } from "date-fns";
import { handleTransactionAction } from "./handleStatusChange";

function PaymentList() {
  const { savingsId } = useParams();
  useLoanSSE(true, savingsId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [refSearch, setRefSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState("");

  const {
    data: savingsMember,
    isLoading: LoadingsavingsMember,
    error,
  } = useFetchData(
    `api/admin/savings/members/${savingsId}`,
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
  // return <PaymentListLoading />;

  const context = { ApproveData, queryClient, savingsId, userCreds };
  return (
    <div className="min-h-screen p-5">
      {isLoadingFilterApproved || LoadingsavingsMember ? (
        <PaymentListLoading />
      ) : isInvalid ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-in fade-in duration-500">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-sky-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-sm border border-slate-100">
              <UserX size={48} strokeWidth={1.5} className="text-slate-300" />
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-800 mb-2">
            Member not Found
          </h3>
          <p className="text-slate-500 text-sm max-w-[250px] leading-relaxed">
            We couldn't find a record matching this ID. The link might be broken
            or the member has been removed from the database.
          </p>

          <button
            onClick={() => navigate("/admin/savings_management")}
            className="mt-6 px-6 py-2 bg-sky-500 text-white rounded-full text-sm font-bold shadow-md shadow-sky-200 active:scale-95 transition-all"
          >
            Go to member list
          </button>
        </div>
      ) : (
        <div className="min-h-screen">
          <div className="bg-gradient-to-br from-sky-500 via-sky-500 to-sky-600 shadow-sm p-5 rounded-2xl">
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
                  <div className="flex flex-wrap gap-1 truncate w-full font-bold text-white">
                    <div>{userCreds.firstName || "No name"}</div>
                    <div>{userCreds.lastName || "No name"}</div>
                  </div>
                  <div className="text-xs text-sky-100">
                    {userCreds.savingsId || "000000000"}
                  </div>
                </div>
              </div>
              <div className="my-5">
                <div className="flex flex-col text-sky-100">
                  <div className="text-xs ">Total Savings</div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    {formatCurrency(userCreds.accountBalance)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                <div className="flex flex-col text-xs text-white">
                  <span className="text-sky-100 font-medium">
                    Target amount
                  </span>
                  <span className=" font-black">
                    {formatCurrency(userCreds.targetAmount)}
                  </span>
                </div>
                <div className="flex flex-col text-xs text-white border-l border-white/40 pl-4">
                  <span className=" text-sky-100 font-medium">
                    Maturity Date
                  </span>
                  <span className="font-black ">
                    {formatDate(userCreds.maturityDate) || "No deposit yet"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {withdrawStatus === "WITHDRAW" ? (
            <>
              <div className="my-3 mx-2 text-slate-800 font-black">
                User withdrawal
              </div>
              <div>
                <div className="bg-white border-l-4 border-l-amber-500 shadow-sm p-3 px-5 rounded-xl border border-slate-50">
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-red-500">
                      {formatCurrency(widthDraw.totalBalance)}
                    </div>
                    <div className="text-sm font-semibold text-slate-600">
                      {formatDate(widthDraw.withdrawDate)}
                    </div>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <div className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(widthDraw.withdrawDate), {
                        addSuffix: true,
                      }).replace("about ", "")}
                    </div>
                    <div className="text-xs">{widthDraw.reference}</div>
                  </div>
                  <div className="flex gap-1 justify-end border-t  border-t-slate-200 mt-2 py-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleTransactionAction(
                          "WITHDRAW_APPROVE",
                          withdrawRef,
                          context,
                        )
                      }
                      className="flex items-center rounded-full px-2 py-0.5 text-sm bg-emerald-50 text-emerald-500"
                    >
                      <Check size={20} />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() =>
                        handleTransactionAction(
                          "WITHDRAW_REJECT",
                          withdrawRef,
                          context,
                        )
                      }
                      className="flex items-center rounded-full px-2 py-0.5 text-sm bg-red-50 text-red-500"
                    >
                      <X size={20} />
                      <span>Declined</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          <div className="my-3 mx-2 text-slate-800 font-black">
            Pending payments
          </div>
          <div>
            {isPending === "PENDING" ? (
              <TransactionList
                transactions={savingsMember?.payload?.payments || []}
                hasSearched={true}
                isLoading={LoadingsavingsMember}
                showActions={true}
                isAccepted={() =>
                  handleTransactionAction("APPROVE", referencePayment, context)
                }
                isDeclined={() =>
                  handleTransactionAction("REJECTED", referencePayment, context)
                }
              />
            ) : (
              <div className="flex flex-col items-center text-center mt-5 p-5 h-auto italic rounded-2xl text-slate-500 bg-white-50 border border-slate-100 shadow-inner">
                No pending payments
              </div>
            )}
          </div>
          <div className="my-3 mx-2 text-slate-800 font-black">
            Approved payments
          </div>
          <div className="flex gap-2 mb-4 items-center">
            <SearchInput
              value={refSearch}
              onChange={(e) => setRefSearch(e.target.value)}
              placeholder="Search ID and Date"
              className="!rounded-full h-9"
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="px-4 py-1.5 bg-sky-500 text-white rounded-full text-sm font-medium"
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
              <div className="flex flex-col items-center text-center mt-5 p-5 h-auto italic rounded-2xl text-slate-500 bg-white-50 border border-slate-100 shadow-inner">
                No approved payments
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentList;
