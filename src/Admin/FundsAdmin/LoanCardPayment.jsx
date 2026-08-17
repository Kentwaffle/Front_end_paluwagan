import React, { useEffect, useState } from "react";
import SearchInput from "../../reusableComponents/Forms/SearchInput";
import Inputform from "../../reusableComponents/Forms/Inputform";
import SelectDropdown from "../../reusableComponents/Forms/selectdropdown";
import { formatCurrency } from "../../reusableComponents/Utils/formatter";
import { useParams } from "react-router-dom";
import { usePostData } from "../../serviceToApi/PostData";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useFetchData } from "../../serviceToApi/fetchData";
import UserLoanCard from "./UserLoanCard";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { ValidateFundsAdmin } from "../../validations/CredentialValidation";
import { generateUUID } from "../../reusableComponents/Utils/GeneratedIDS";
import { useQueryClient } from "@tanstack/react-query";
import { swalModal } from "../../reusableComponents/Alerts/SweetAlerts";
import { useLoanSSE } from "../../reusableComponents/Hooks/SSE";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Landmark } from "lucide-react";
import Swal from "sweetalert2";

function LoanCardPayment() {
  const { type } = useParams();
  const isLoan = type === "loanAddPayment";
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState("cash");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Set to 6 for a perfect 3x2 card grid on desktop

  const queryClient = useQueryClient();
  useLoanSSE(true, selectedUser?.savingsId, isLoan);

  const loanFunds = [
    { label: "Cash", value: "cash" },
    { label: "Online payment", value: "online" },
  ];

  const DynamicURL = {
    FundsUrl: isLoan
      ? API_ENDPOINTS.FUNDS_PAYMENT_LOAN_POST
      : API_ENDPOINTS.FUNDS_PAYMENT_SAVINGS_POST,

    SearchFundUrl: isLoan
      ? API_ENDPOINTS.FUNDS_PAYMENT_LOAN_SEARCH
      : API_ENDPOINTS.FUNDS_PAYMENT_SAVINGS_SEARCH,
  };

  const { mutate: FundsData } = usePostData(DynamicURL.FundsUrl, [
    isLoan ? "fundsDataLoan" : "fundsDataavings",
  ]);

  const { data: SearchFunds, isLoading: loadingSearch } = useFetchData(
    [isLoan ? "searchLoan" : "searchSavings", searchInput],
    `${DynamicURL.SearchFundUrl}?name=${searchInput}`,
  );

  const searchFundsMap = isLoan
    ? SearchFunds?.paymentLoans
    : SearchFunds?.paymentSavings;

  const {
    formData,
    setFormData,
    handleChange,
    formErrors,
    handleSubmit,
    setFormErrors,
  } = useForm({ amount: "" }, ValidateFundsAdmin);

  useEffect(() => {
    if (!selectedUser) return;
    setFormErrors({});
    const currentAmount = formData.amount || "";
    const formdataMap = isLoan
      ? selectedUser?.applicationId
      : selectedUser?.savingsId;

    if (selectedPanel === "cash") {
      setFormData({
        applicationId: formdataMap,
        amount: currentAmount,
        paymentMethod: "CASH",
      });
    } else {
      setFormData({
        applicationId: formdataMap,
        amount: currentAmount,
        paymentMethod: "",
        bankReference: "",
      });
    }
  }, [selectedPanel, isLoan, selectedUser]);

  const modalAlertPayment = (e) => {
    handleSubmit(e, async () => {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      if (isDesktop) {
        let isConfirmed = false;
        await Swal.fire({
          html: `
            <div class="flex flex-col gap-4 text-slate-800 dark:text-slate-200">
              <!-- Header -->
              <div class="flex items-start gap-4 text-left">
                <div class="w-12 h-12 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-455 rounded-full flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <div class="flex flex-col gap-1">
                  <h2 class="text-xl font-black text-slate-900 dark:text-white leading-tight">Record payment?</h2>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    You are about to officially record this payment. Please review the details below to ensure accuracy before proceeding.
                  </p>
                </div>
              </div>

              <div class="h-[1px] bg-slate-200/80 dark:bg-slate-800 w-full my-1"></div>

              <!-- Content Card -->
              <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl text-left flex flex-col gap-3">
                <div>
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">Target Member ID</div>
                  <div class="flex items-center gap-1.5 mt-1.5">
                    <svg class="w-4 h-4 text-slate-400 dark:text-slate-505" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span class="text-sm font-bold text-slate-800 dark:text-slate-205">${isLoan ? selectedUser?.applicationId : selectedUser?.savingsId || "N/A"}</span>
                  </div>
                </div>

                <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Transaction Amount</span>
                  <span class="text-lg font-black text-slate-900 dark:text-white">
                    ${formatCurrency(formData.amount)}
                  </span>
                </div>

                <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Payment Method</span>
                  <span class="font-bold text-slate-800 dark:text-slate-205">
                    ${selectedPanel === 'cash' ? 'Cash' : (formData.paymentMethod || 'Online')}
                  </span>
                </div>

                <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Date Initiated</span>
                  <span class="font-bold text-slate-800 dark:text-slate-205">
                    ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-3 mt-4">
                <button 
                  id="swal-cancel-btn" 
                  type="button" 
                  class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  id="swal-confirm-btn" 
                  type="button" 
                  class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer transition-colors"
                >
                  Yes, Record Payment
                </button>
              </div>
            </div>
          `,
          showConfirmButton: false,
          background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
          customClass: {
            popup: "rounded-3xl border border-slate-100 dark:border-slate-850 max-w-[480px] p-6 shadow-xl",
          },
          didOpen: () => {
            const cancelBtn = document.getElementById("swal-cancel-btn");
            const confirmBtn = document.getElementById("swal-confirm-btn");
            
            if (cancelBtn) {
              cancelBtn.addEventListener("click", () => {
                Swal.close();
              });
            }
            if (confirmBtn) {
              confirmBtn.addEventListener("click", () => {
                isConfirmed = true;
                Swal.close();
              });
            }
          }
        });

        if (isConfirmed) {
          paymentHandler(e);
        }
      } else {
        const paymentSubmit = await swalModal({
          title: "Payment?",
          html: `You are about to pay <b>${formatCurrency(formData.amount)} </b> to ${selectedUser.firstName}. <br/> Do you want to proceed?`,
          confirmButtonText: "Yes, pay now",
          icon: "question",
        });
        if (paymentSubmit) paymentHandler(e);
      }
    });
  };

  const paymentHandler = (e) => {
    if (e) e.preventDefault();
    const genId = generateUUID();
    const finalFormdata = {
      ...formData,
      genId: genId,
    };
    console.log("Eto ang ipapasa ko:", finalFormdata);

    FundsData(finalFormdata, {
      onSuccess: (response) => {
        if (response.success) {
          showAlert.success(
            "Successfully paid!",
            `You've successfully paid ₱${formData.amount} to ${selectedUser.firstName}`,
          );
          queryClient.invalidateQueries({
            queryKey: [isLoan ? "searchLoan" : "searchSavings"],
          });

          queryClient.invalidateQueries({
            queryKey: ["payments"],
          });
          setFormData((prev) => ({ ...prev, amount: "" }));
        } else {
          showAlert.warning("Failed ", response.message);
        }
      },
      onError: (err) => {
        showAlert.error("Error", "Something went wrong with the transaction.");
      },
    });
  };

  const handleChangeUser = () => {
    setSelectedUser(null);
    setSearchInput("");
    setCurrentPage(1);
  };

  // Pagination Helper Calculations
  const totalItems = searchFundsMap?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = searchFundsMap?.slice(indexOfFirstItem, indexOfLastItem) || [];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-955 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="block md:hidden">
        <div className="flex justify-between pb-3 text-sm items-center">
          <span className="text-slate-700 dark:text-gray-300 font-black text-lg">
            {`${type === "loanAddPayment" ? "Loan" : "Savings"} Add Payment`}
          </span>
          {selectedUser && (
            <button
              onClick={handleChangeUser}
              className="text-sky-500 dark:text-sky-400 underline"
            >
              Change user
            </button>
          )}
        </div>

        <SearchInput
          placeholder="Search recipient..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={`${selectedUser ? "hidden" : ""} max-w-sm dark:bg-slate-700/50 dark:border-slate-700`}
        />

        {loadingSearch ? (
          <div className="p-10 text-center text-slate-400 text-sm animate-pulse">
            Searching for "{searchInput}"...
          </div>
        ) : (
          !selectedUser && (
            <>
              {searchFundsMap && searchFundsMap.length > 0 ? (
                searchFundsMap.map((user) => (
                  <UserLoanCard
                    key={user.applicationId || user.savingsId}
                    user={user}
                    isLoan={isLoan}
                    onClick={() => {
                      setSelectedUser(user);
                      setSearchInput("");
                    }}
                  />
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 text-sm italic">
                  No results found
                </div>
              )}
            </>
          )
        )}

        {selectedUser && (
          <UserLoanCard
            user={
              searchFundsMap?.find(
                (u) =>
                  (u.applicationId || u.savingsId) ===
                  (selectedUser.applicationId || selectedUser.savingsId),
              ) || selectedUser
            }
            isS
            key={searchFundsMap?.applicationId || searchFundsMap?.savingsId}
            isSelected={true}
            isLoan={isLoan}
          />
        )}

        {selectedUser && (
          <>
            <div className="bg-white my-5 dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <span className="block text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">
                Payment Method
              </span>

              <div className="grid grid-cols-2 gap-4">
                {loanFunds.map((fund) => (
                  <label key={fund.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="radio-9"
                      value={fund.value}
                      checked={selectedPanel === fund.value}
                      className="hidden peer"
                      onChange={(e) => setSelectedPanel(e.target.value)}
                    />
                    <div
                      className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 bg-slate-50 dark:bg-slate-700/50 dark:border-slate-700 transition-all 
                      peer-checked:border-sky-500 peer-checked:bg-sky-50 dark:peer-checked:bg-sky-900/20 peer-checked:text-sky-600"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 mb-2 flex items-center justify-center transition-all ${
                          selectedPanel === fund.value
                            ? "border-sky-500"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedPanel === fund.value && (
                          <div className="w-2 h-2 rounded-full bg-sky-500" />
                        )}
                      </div>
                      <span className="text-xs font-bold">{fund.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div>
                {selectedPanel === "cash" ? (
                  <div className="mt-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-slate-600 font-black dark:text-slate-300">
                        Payment amount
                      </span>
                      <Inputform
                        name="amount"
                        value={formData.amount || ""}
                        onChange={handleChange}
                        placeholder="Enter payment amount"
                        className={`${formErrors.amount ? "border-red-500" : ""}`}
                      />
                      {formErrors?.amount && (
                        <span className="text-red-550 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">
                          {formErrors?.amount}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-slate-600 font-black dark:text-slate-300">
                        Payment amount
                      </span>
                      <Inputform
                        name="amount"
                        placeholder="Enter payment amount"
                        value={formData.amount || ""}
                        onChange={handleChange}
                        className={`${formErrors.amount ? "border-red-500" : ""}`}
                      />
                      {formErrors?.amount && (
                        <span className="text-red-555 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">
                          {formErrors?.amount}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-slate-600 font-black dark:text-slate-300">
                        Mode of payment
                      </span>
                      <SelectDropdown
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        label={"Select Bank"}
                        options={["GCASH", "MAYA"]}
                        onChange={handleChange}
                        className={`${formErrors.paymentMethod ? "border-red-500" : ""}`}
                      />
                      {formErrors.paymentMethod && (
                        <span className="text-red-555 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">
                          {formErrors.paymentMethod}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-slate-600 font-black dark:text-slate-300">
                        Reference ID
                      </span>
                      <Inputform
                        name="bankReference"
                        placeholder="Enter reference id"
                        value={formData.bankReference || ""}
                        onChange={handleChange}
                        className={`${formErrors.bankReference ? "border-red-500" : ""}`}
                      />
                      {formErrors.bankReference && (
                        <span className="text-red-555 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">
                          {formErrors.bankReference}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => modalAlertPayment(e)}
              className="w-full bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2 dark:from-sky-600 dark:to-sky-400"
            >
              Submit Payment
            </button>
          </>
        )}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col gap-6">
        
        {!selectedUser ? (
          /* Members Directory Listing Section */
          <div className="flex flex-col gap-6">
            
            {/* Header Title */}
            <div className="flex flex-col text-left">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Members Directory
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-455 font-medium mt-1">
                Manage member {isLoan ? "loans" : "savings"}, view balances, and record payments.
              </p>
            </div>

            {/* Large Search Input */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl shadow-sm focus-within:border-sky-500 transition-colors w-full">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search recipient by name or ID..."
                className="bg-transparent border-none outline-none text-xs flex-1 text-slate-700 dark:text-slate-350 focus:ring-0 placeholder:text-slate-400 w-full"
              />
            </div>

            {/* Grid Results */}
            {loadingSearch ? (
              <div className="p-16 text-center text-slate-400 text-sm animate-pulse bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-805">
                Searching for "{searchInput}"...
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                
                {/* 3-Column Card Grid matching Mockup */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((user) => {
                      const balance = isLoan ? user.remainingBalance : user.accountBalance;
                      const id = isLoan ? user.applicationId : user.savingsId;
                      const secondary = isLoan ? user.weeklyPay : user.targetAmount;

                      // Progress Calculations
                      const percentage = Math.min(Math.round((balance / (secondary || 1)) * 100), 100) || 0;
                      const remaining = Math.max(secondary - balance, 0);

                      return (
                        <div key={id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                          
                          {/* Card Header Profile */}
                          <div className="flex gap-3 items-center text-left">
                            <div className="w-11 h-11 border border-slate-100 dark:border-slate-800 rounded-full overflow-hidden shrink-0">
                              <img
                                src={getProfileImage(user.profileImage)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-slate-805 dark:text-slate-200 leading-tight">
                                {user.firstName} {user.lastName}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                                {id}
                              </span>
                            </div>
                          </div>

                          {/* Card Body Stats block */}
                          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex flex-col gap-3 mt-4 text-left">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                                  Account Balance
                                </span>
                                <span className="font-black text-base text-blue-600 dark:text-sky-400 mt-0.5">
                                  {formatCurrency(balance)}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider text-right">
                                  {isLoan ? "Weekly Payment" : "Target Amount"}
                                </span>
                                <span className="font-bold text-xs text-slate-850 dark:text-slate-200 mt-0.5 text-right">
                                  {formatCurrency(secondary)}
                                </span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                              <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                            </div>

                            {/* Percentage progress metadata */}
                            <div className="flex justify-between items-center text-[9px] text-slate-500 dark:text-slate-450 font-bold">
                              <span>{percentage}% Reached</span>
                              <span>Remaining: {formatCurrency(remaining)}</span>
                            </div>
                          </div>

                          {/* Record Payment Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(user);
                              setSearchInput("");
                            }}
                            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200/50 dark:border-slate-750 cursor-pointer active:scale-[0.98] mt-4"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            <span>Record Payment</span>
                          </button>

                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-16 text-slate-400 dark:text-slate-550 italic text-sm bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl">
                      No members found matching your search.
                    </div>
                  )}
                </div>

                {/* Pagination Footer */}
                {totalItems > 0 && (
                  <div className="flex justify-between items-center px-1 py-4 bg-transparent mt-4 select-none">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                    </span>

                    <div className="flex items-center gap-1.5 select-none">
                      <button
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 text-slate-650 dark:text-slate-355 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            currentPage === pageNum
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                              : "bg-white dark:bg-slate-800 border-slate-205 dark:border-slate-700 text-slate-655 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 text-slate-655 dark:text-slate-355 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        ) : (
          /* Payment form Split Section matching mockup */
          <div className="flex flex-col gap-6 text-left">
            
            {/* Header Block */}
            <div className="flex flex-col mb-4">
              <button
                type="button"
                onClick={handleChangeUser}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 mb-2 cursor-pointer w-fit"
              >
                <span>←</span>
                <span>Back to Members</span>
              </button>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Record Payment
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: User Summary Card */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center w-full min-h-[360px]">
                  
                  {/* Large Centered Avatar */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center shrink-0">
                    <img
                      src={getProfileImage(selectedUser.profileImage)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name and ID Badge */}
                  <h3 className="text-lg font-bold text-slate-850 dark:text-white mt-4 leading-tight">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <span className="bg-slate-105 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-wider px-3.5 py-1 rounded-full mt-2 inline-block">
                    ID: {isLoan ? selectedUser.applicationId : selectedUser.savingsId}
                  </span>

                  <div className="h-[1px] bg-slate-100 dark:bg-slate-850 w-full my-6"></div>

                  {/* Stats list aligned left */}
                  <div className="w-full flex flex-col gap-4 text-left">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                        {isLoan ? "Remaining Balance" : "Account Balance"}
                      </span>
                      <span className="font-black text-xl text-red-500 mt-1">
                        {formatCurrency(isLoan ? selectedUser.remainingBalance : selectedUser.accountBalance)}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                        {isLoan ? "Weekly Payment" : "Target Amount"}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-lg mt-1">
                        {formatCurrency(isLoan ? selectedUser.weeklyPay : selectedUser.targetAmount)}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Form Container Card */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      Payment Details
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-semibold">
                      Enter the transaction details below.
                    </p>
                  </div>

                  <div className="h-[1px] bg-slate-100 dark:bg-slate-850 w-full"></div>

                  {/* Payment Method Option Boxes */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                      Payment Method
                    </span>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      {loanFunds.map((fund) => {
                        const isSelected = selectedPanel === fund.value;
                        return (
                          <label key={fund.value} className="relative cursor-pointer flex-1">
                            <input
                              type="radio"
                              name="radio-desktop"
                              value={fund.value}
                              checked={isSelected}
                              className="hidden peer"
                              onChange={(e) => setSelectedPanel(e.target.value)}
                            />
                            <div className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                              isSelected
                                ? "border-blue-600 bg-blue-50/10 text-blue-600"
                                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}>
                              <span className="mb-2">
                                {fund.value === "cash" 
                                  ? <Search size={20} className={isSelected ? "text-blue-600" : "text-slate-500"} />
                                  : <Landmark size={20} className={isSelected ? "text-blue-600" : "text-slate-500"} />
                                }
                              </span>
                              <span className="text-xs font-bold">{fund.label}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inputs Fields block */}
                  <div className="flex flex-col gap-5">
                    {/* Amount Field */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                        Amount (PHP)
                      </span>
                      <Inputform
                        name="amount"
                        value={formData.amount || ""}
                        onChange={handleChange}
                        placeholder="₱ 0.00"
                        className={`${formErrors.amount ? "border-red-500 animate-pulse" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-sm"}`}
                      />
                      {formErrors?.amount && (
                        <span className="text-red-550 text-xs font-medium">
                          {formErrors?.amount}
                        </span>
                      )}
                    </div>

                    {selectedPanel === "online" && (
                      <>
                        {/* Mode of Payment Dropdown */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
                            Mode of payment
                          </span>
                          <SelectDropdown
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            label={"Select Bank or Wallet"}
                            options={["GCASH", "MAYA"]}
                            onChange={handleChange}
                            className={`${formErrors.paymentMethod ? "border-red-500" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-11 text-sm"}`}
                          />
                          {formErrors.paymentMethod && (
                            <span className="text-red-550 text-xs font-medium">
                              {formErrors.paymentMethod}
                            </span>
                          )}
                        </div>

                        {/* Reference ID Input */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
                            Reference ID (Optional)
                          </span>
                          <Inputform
                            name="bankReference"
                            placeholder="e.g. TXN-123456789"
                            value={formData.bankReference || ""}
                            onChange={handleChange}
                            className={`${formErrors.bankReference ? "border-red-500 animate-pulse" : "dark:bg-slate-955 border-slate-200 dark:border-slate-805 focus:border-blue-500 h-11 text-sm"}`}
                          />
                          {formErrors.bankReference && (
                            <span className="text-red-555 text-xs font-medium">
                              {formErrors.bankReference}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                </div>

                {/* Submit Row Aligned Right Outside the Form Card */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => modalAlertPayment(e)}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span>Submit Payment</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default LoanCardPayment;
