import React, { useState } from "react";
import { CircleAlert, PlusCircle, MinusCircle } from "lucide-react";
// import TransactionList from "./CardPayment/TransactionList";
import QRCODE from "./QRCODE";
import PaymentForm from "../reusableComponents/Forms/PaymentForm";
import OffsetForm from "./componentSavings/OffsetForm";
import SavingsSummary from "./componentSavings/SavingsSummary";
import { useSavings } from "./hooksForSavings/useSavings";
import TransactionList from "../reusableComponents/Display/TransactionList";
import { formatTimeAgo } from "../reusableComponents/Utils/TimeDateformat";
import { formatDate } from "../reusableComponents/Utils/formatter";
import {
  statusColorPayments,
  statusIconPayments,
} from "../reusableComponents/Feedbacks/StatusHelper";
function Savings() {
  const {
    handleOnlineDeposit,
    handleDeposit,
    navigate,
    isStatusLoading,
    userStatusPayload,
    responseData,
    show,
    toggle,
    displaySavings,
    activeTab,
    setActiveTab,
    paymentMode,
    setPaymentMode,
    depositForm,
    offsetForm,
    agreeDeposit,
    agreeOffset,
    loadingSummary,
    depositHistory,
    activeContent,
    formatCurrency,
    cashPaymentForm,
  } = useSavings();

  const savingsTabs = [
    { label: "Deposit", value: "deposit", icon: <PlusCircle size={18} /> },
    { label: "Offset", value: "offset", icon: <MinusCircle size={18} /> },
  ];
  return (
    <div key={"savings_main"}>
      {isStatusLoading ? (
        <SavingsLoading />
      ) : (
        <div key={"savings"} className="min-h-screen p-5">
          <SavingsSummary
            displaySavings={displaySavings}
            toggle={toggle}
            show={show}
            formatCurrency={formatCurrency}
            responseData={responseData}
          />

          <div className="my-5">
            <h3 className="text-slate-800 font-bold uppercase dark:text-slate-200">
              Quick Remit
            </h3>
            <div className="mt-3 ">
              <div className="flex w-full gap-3 ">
                {savingsTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-4 py-3 flex-1 flex items-center justify-center gap-2 shadow-sm uppercase text-xs font-bold transition-all ${
                      activeTab === tab.value
                        ? "bg-sky-400 text-white rounded-xl shadow-md scale-[1.02] dark:bg-sky-600"
                        : "text-slate-500 font-medium dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {responseData?.hasWithdraw ? (
                <div className="flex flex-col gap-2 justify-center items-center mt-3 p-5 italic shadow-inner rounded-2xl bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                  <div className="text-sky-500">
                    <CircleAlert />
                  </div>
                  <span className="text-slate-500 text-center">
                    You have an active withdrawal request. Wait for it to be
                    processed before making another transaction.
                  </span>
                </div>
              ) : activeTab === "deposit" ? (
                <div className="flex flex-col mt-3 gap-3 bg-white p-5 rounded-xl border shadow-sm border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                  <PaymentForm
                    //Props
                    label="Deposit Amount"
                    buttonName="Deposit"
                    classNameOnline={"mt-5"}
                    classNameCash={"mt-5"}
                    //Hooks
                    setPaymentMode={setPaymentMode}
                    paymentMode={paymentMode}
                    //Deposit Cash
                    depositData={depositForm.formData}
                    handleDepositChange={depositForm.handleChange}
                    depositErrors={depositForm.formErrors}
                    agreeDeposit={agreeDeposit}
                    //Deposit Online
                    cashPaymentData={cashPaymentForm.formData}
                    handleCashPaymentChange={cashPaymentForm.handleChange}
                    cashPaymentErrors={cashPaymentForm.formErrors}
                    handleOnlineDeposit={handleOnlineDeposit}
                  />
                </div>
              ) : userStatusPayload?.hasActiveSavings ? (
                <OffsetForm
                  activeContent={activeContent}
                  offsetData={offsetForm.formData}
                  handleOffsetChange={offsetForm.handleChange}
                  offsetErrors={offsetForm.formErrors}
                  agreeOffset={agreeOffset}
                  handleOnlineDeposit={handleOnlineDeposit}
                />
              ) : (
                <div className="flex gap-2 justify-center items-center mt-3 p-5 italic shadow-inner rounded-2xl bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                  <span className="bg-amber-50 p-1 text-amber-500 rounded-full dark:bg-amber-900 dark:text-amber-400">
                    <CircleAlert />
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    You need to deposit first.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="my-5">
            <div className="flex justify-between mb-3 mx-2">
              <h3 className="text-slate-800 font-bold uppercase dark:text-slate-200">
                Transaction
              </h3>
              <button
                type="button"
                onClick={() => navigate("savings_payments")}
                className="text-sky-500 dark:text-sky-400 font-semibold flex items-center gap-1"
              >
                See all
              </button>
            </div>
            {/* <TransactionList
              transactions={depositHistory?.slice(0, 5)}
              hasSearched={true}
              isLoading={loadingSummary}
              NoRecord={
                "No transaction history available. Deposit now to see your transactions here."
              }
            /> */}
            <TransactionList
              transactions={depositHistory?.slice(0, 5)}
              statusColor={statusColorPayments}
              statusIcon={statusIconPayments}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              formatTimeAgo={formatTimeAgo}
              emptyMessage="No transactions yet. Start making payments!"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Savings;
