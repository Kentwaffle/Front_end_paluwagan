import React from "react";
import { PhilippinePeso, ArrowRight, CircleAlert } from "lucide-react";
import Inputform from "./Inputform";
import RadioField from "./RadioField";
import { paymentOptions, paymentTabs } from "../../Constants/paymentsOptions";

function PaymentForm({
  paymentMode,
  setPaymentMode,
  depositData = {},
  handleDepositChange,
  depositErrors = {},
  agreeDeposit,
  handleOnlineDeposit,
  cashPaymentData,
  handleCashPaymentChange,
  cashPaymentErrors = {},
  agreeCashPayment,
  label,
  buttonName,
  classNameOnline,
  classNameCash,
  isLoan = false,
}) {
  return (
    <div>
      {!isLoan && (
        <div className="grid grid-cols-2 gap-3">
          {paymentTabs.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setPaymentMode(mode.value)}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                paymentMode === mode.value
                  ? "border-sky-500 bg-sky-50/50 text-sky-600 dark:bg-sky-900/20"
                  : "border-slate-100 bg-white text-slate-400 dark:bg-slate-800 dark:border-slate-700"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-tight">
                {mode.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {paymentMode === "online" ? (
        <div className={classNameOnline}>
          <RadioField
            label="Select Payment Method"
            name="methodType"
            options={paymentOptions}
            value={cashPaymentData?.methodType}
            onChange={handleCashPaymentChange}
            error={cashPaymentErrors?.methodType}
          />

          <div className="relative w-full mt-6 group">
            <label className="absolute -top-2 left-3 px-2 bg-white dark:bg-slate-800 text-[10px] uppercase  text-slate-400 font-black z-10 transition-colors group-focus-within:text-sky-500">
              {label}
            </label>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 font-bold text-lg pointer-events-none">
                ₱
              </span>
              <Inputform
                type="number"
                name="amount"
                placeholder="0.00"
                autoComplete="off"
                value={cashPaymentData?.amount || ""}
                onChange={handleCashPaymentChange}
                className={`
                ${cashPaymentErrors?.amount ? "border-red-500 ring-red-50" : "border-slate-200"}
                w-full h-14 pl-10 pr-4 text-xl font-bold rounded-2xl border-2 transition-all
              `}
              />
            </div>

            {cashPaymentErrors?.amount && (
              <span className="text-red-500 text-xs mt-1 dark:text-red-400">
                {cashPaymentErrors?.amount}
              </span>
            )}

            <button
              onClick={handleOnlineDeposit}
              type="button"
              className="mt-3 w-full bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2 dark:from-sky-600 dark:to-sky-400"
            >
              <span>Online {buttonName}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      ) : (
        !isLoan && (
          <div className={classNameCash}>
            <div className="flex flex-col justify-center gap-3 p-4 rounded-2xl bg-sky-50/50 border border-sky-100 dark:bg-sky-900/10 dark:border-sky-800/50">
              <div className="flex items-center  gap-2">
                <CircleAlert className="w-5 h-5 text-sky-500" />
                <h4 className="text-sm font-bold text-sky-800 dark:text-sky-400 uppercase tracking-tight">
                  Payment Instruction
                </h4>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Please pay in cash to the{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Ramboy Store
                  </span>{" "}
                  before proceeding to ensure a faster transaction. We recommend
                  using the{" "}
                  <span className="italic font-medium">"Pay Online"</span>{" "}
                  option for a smoother experience. Thank you!
                </p>
              </div>
            </div>

            <div className="relative w-full mt-6 group">
              <label className="absolute -top-2 left-3 px-2 bg-white dark:bg-slate-800 text-[10px] uppercase  text-slate-400 font-black z-10 transition-colors group-focus-within:text-sky-500">
                {label}
              </label>

              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 font-bold text-lg pointer-events-none">
                  ₱
                </span>

                <Inputform
                  type="number"
                  name="amountDeposit"
                  placeholder="0.00"
                  autoComplete="off"
                  value={depositData?.amountDeposit || ""}
                  onChange={handleDepositChange}
                  className={`
                ${depositErrors.amountDeposit ? "border-red-400 ring-red-50" : "border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"}
                w-full h-14 pl-10 pr-4 text-xl font-bold rounded-2xl border-2 transition-all duration-200
                bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-white
                placeholder:text-slate-300 dark:placeholder:text-slate-600
                `}
                />
              </div>

              {depositErrors.amountDeposit && (
                <span className="text-red-500 text-xs mt-1 dark:text-red-400">
                  {depositErrors.amountDeposit}
                </span>
              )}

              <button
                onClick={agreeDeposit}
                type="button"
                className="mt-3 w-full bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2 dark:from-sky-600 dark:to-sky-400"
              >
                <span>Cash {buttonName}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default PaymentForm;
