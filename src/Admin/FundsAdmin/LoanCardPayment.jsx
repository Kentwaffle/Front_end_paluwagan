import React, { useEffect, useState } from "react";
import SearchInput from "../../reusableComponents/SearchInput";
import Inputform from "../../reusableComponents/Inputform";
import SelectDropdown from "../../reusableComponents/selectdropdown";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "../../reusableComponents/formatter";
import { useParams } from "react-router-dom";
import { usePostData } from "../../serviceToApi/PostData";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useFetchData } from "../../serviceToApi/fetchData";
import UserLoanCard from "./UserLoanCard";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { ValidateFundsAdmin } from "../../validations/CredentialValidation";
import { generateUUID } from "../../reusableComponents/GeneratedIDS";

function LoanCardPayment() {
  const { type } = useParams();
  const isLoan = type === "loanAddPayment";
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState("cash");
  const [paymentMode, setPaymentMode] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const genId = generateUUID();

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
        genId: genId,
      });
    } else {
      setFormData({
        applicationId: formdataMap,
        amount: currentAmount,
        paymentMethod: "",
        bankReference: "",
        genId: genId,
      });
    }
  }, [selectedPanel, isLoan, selectedUser]);

  const paymentHandler = (e) => {
    if (e) e.preventDefault();
    handleSubmit(e, () => {
      console.log("Eto ang ipapasa ko:", formData);
      FundsData(formData, {
        onSuccess: (response) => {
          if (response.success) {
            showAlert.success(
              "Successfully paid!",
              `You've successfully paid ₱${formData.amount} to ${selectedUser.firstName}`,
            );

            setFormData((prev) => ({ ...prev, amount: "" }));
          } else {
            showAlert.warning("Failed " + response.message);
          }
        },
        onError: (err) => {
          showAlert.error(
            "Error",
            "Something went wrong with the transaction.",
          );
        },
      });
    });
  };

  const handleChangeUser = () => {
    setSelectedUser(null);
    setSearchInput("");
  };

  return (
    <div className="min-h-screen p-5">
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
          user={selectedUser}
          key={searchFundsMap?.applicationId || searchFundsMap?.savingsId}
          isSelected={true}
          isLoan={isLoan}
        />
      )}

      {selectedUser ? (
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
                      <span className="text-red-500 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">
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
                      <span className="text-red-500 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">
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
                      <span className="text-red-500 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">
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
                      <span className="text-red-500 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">
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
            onClick={(e) => paymentHandler(e)}
            className=" w-full bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2 dark:from-sky-600 dark:to-sky-400"
          >
            Submit Payment
          </button>
        </>
      ) : null}
    </div>
  );
}

export default LoanCardPayment;
