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
  const useSavingsDatas = useSavings();

  const {
    handleDeposit,
    navigate,
    userStatusPayload,
    activeTab,
    setActiveTab,
    paymentMode,
    setPaymentMode,
    depositForm,
    offsetForm,
    agreeDeposit,
    agreeOffset,
    loadingSummary,
    activeContent,
    cashPaymentForm,
    //OffSet Data
    responseData,
    isStatusLoading,
    show,
    toggle,
    displaySavings,
    formatCurrency,
    depositHistory,
    handleOnlineDeposit,
  } = useSavingsDatas;

  const savingsTabs = [
    { label: "Deposit", value: "deposit", icon: <PlusCircle size={18} /> },
    { label: "Offset", value: "offset", icon: <MinusCircle size={18} /> },
  ];

  console.log("responseData", responseData);
  return (
    <div key={"savings_main"}>
      {isStatusLoading ? (
        <SavingsLoading />
      ) : (
        <div
          key={"savings"}
          className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col gap-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 text-slate-900 dark:text-white"
        >
          <div className="hidden md:block border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Savings Overview
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Keep track of your active deposits and overall growth.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 ">
              <SavingsSummary useSavingsDatas={useSavingsDatas} />
            </div>

            <div>
              <div className="px-1">
                <h3 className="font-black text-lg tracking-tight">
                  Quick Remit
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Set up your remittance details below
                </p>
              </div>
              <div className="mt-3 ">
                {/* <div className="flex w-full gap-3 ">
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
                </div> */}

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
          </div>

          <div className="my-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-1 mb-4">
              {/* Title Section */}
              <div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                  Recent Transactions
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Track and review recent account activity.
                </p>
              </div>
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
