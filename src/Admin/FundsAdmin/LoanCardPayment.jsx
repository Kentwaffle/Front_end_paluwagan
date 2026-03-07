import React, { useState } from "react";
import SearchInput from "../../reusableComponents/SearchInput";
import Inputform from "../../reusableComponents/Inputform";
import SelectDropdown from "../../reusableComponents/selectdropdown";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "../../reusableComponents/formatter";
import { useParams } from "react-router-dom";
import { usePostData } from "../../serviceToApi/PostData";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
function LoanCardPayment() {
  const { type } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState("cash");
  const [paymentMode, setPaymentMode] = useState("");
  const handleChangeUser = () => {
    setSelectedUser(null);
  };

  const handleChangeRecipient = (user) => {
    setSelectedUser(user);
  };
  const loanFunds = [
    { label: "Cash", value: "cash" },
    { label: "Online payment", value: "online" },
  ];

  const { data: loanFundsData } = usePostData(
    API_ENDPOINTS.FUNDS_PAYMENT_LOAN,
    "fundsPaymentLoan",
  );

  return (
    <div className="min-h-screen p-5">
      <div className="flex justify-between pb-3 text-sm items-center">
        <span className="text-slate-700 dark:text-gray-300 font-black text-lg">
          {`${type === "loan" ? "Loan" : "Savings"} Add Payment`}
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
      {!selectedUser ? (
        <SearchInput
          placeholder="Search recipient..."
          onChange={(e) => {
            if (e.target.value === "test")
              handleChangeRecipient({ name: "Test User" });
          }}
          className="max-w-sm dark:bg-slate-700/50 dark:border-slate-700"
        />
      ) : (
        <div className="p-5 bg-white shadow-sm rounded-xl dark:bg-gray-800">
          <div className="flex items-center gap-3 pb-5">
            <div className="w-9 h-9 flex justify-center items-center border border-sky-500 rounded-full overflow-hidden">
              <img src={getProfileImage()} alt="Profile" />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm  text-slate-700 truncate font-black dark:text-gray-300">
                Juluis Lorenzo Ramboy
              </span>
              <span className="text-xs text-slate-500 truncate dark:text-gray-400">
                REf0-0909090
              </span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-gray-700 pt-3  grid grid-cols-2 gap-5">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-gray-400">
                Remaining Balance
              </span>
              <span className="text-xl text-sky-500 dark:text-sky-400 font-bold">
                {formatCurrency("120000")}
              </span>
            </div>
            <div className="flex flex-col border-l-2 border-slate-200 dark:border-gray-700 pl-5">
              <span className="text-xs text-slate-500 dark:text-gray-400">
                Weekly payment
              </span>
              <span className="text-xl text-sky-500 dark:text-sky-400 font-bold">
                {formatCurrency("5000")}
              </span>
            </div>
          </div>
        </div>
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
                    <Inputform placeholder="Enter payment amount" />
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-slate-600 font-black dark:text-slate-300">
                      Payment amount
                    </span>
                    <Inputform placeholder="Enter payment amount" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-slate-600 font-black dark:text-slate-300">
                      Mode of payment
                    </span>
                    <SelectDropdown
                      name="modeOfpayment"
                      vvalue={paymentMode}
                      label={"Select Bank"}
                      options={["GCash", "Paymaya", "Bank Transfer"]}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-slate-600 font-black dark:text-slate-300">
                      Reference ID
                    </span>
                    <Inputform placeholder="Enter reference id" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <button className=" w-full bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2 dark:from-sky-600 dark:to-sky-400">
            Submit Payment
          </button>
        </>
      ) : null}
    </div>
  );
}

export default LoanCardPayment;
