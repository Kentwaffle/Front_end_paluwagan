import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  PhilippinePeso,
  ArrowRight,
  Eye,
  EyeClosed,
  ShieldAlert,
  CircleAlert,
} from "lucide-react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { formatCurrency, formatDate } from "../reusableComponents/formatter";
import Inputform from "../reusableComponents/Inputform";
import { usePasswordToggle } from "../reusableComponents/Hooks/ToggleEye";
import { OFFSET_CONTENT } from "../reusableComponents/text";
import { useTodayDate } from "../reusableComponents/Hooks/CurrentDate";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import {
  ValidateOffset,
  ValidateSavingsDeposit,
} from "../validations/CredentialValidation";
import { usePostData } from "../serviceToApi/PostData";
import { showAlert, swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

function Savings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("deposit");
  const { show, toggle } = usePasswordToggle();
  const today = useTodayDate();
  const queryClient = useQueryClient();
  const { isStatus } = useOutletContext();

  // Para sa Deposit
  const {
    handleChange: handleDepositChange,
    handleSubmit: handleDepositSubmit,
    formErrors: depositErrors,
    formData: depositData,
    setFormData: setDepositData,
  } = useForm(
    { amountDeposit: "", depositDate: today },
    ValidateSavingsDeposit,
  );

  // Para sa Offset
  const {
    handleChange: handleOffsetChange,
    handleSubmit: handleOffsetSubmit,
    formErrors: offsetErrors,
    formData: offsetData,
    setFormData: setOffsetData,
  } = useForm({ agreementText: "" }, ValidateOffset);

  const { mutate: savingDeposit } = usePostData(
    "/api/savings/remit",
    API_ENDPOINTS.SAVINGS_DEPOSIT,
  );

  const { data: savingData } = useFetchData(
    "/api/savings/summary",
    API_ENDPOINTS.SAVINGS_DETAILS,
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
  );

  const { mutate: savingOffset } = usePostData(
    "/api/savings/withdraw",
    API_ENDPOINTS.SAVINGS_OFFSET,
  );

  const userStatusPayload = isStatus?.payload;
  const responseData = savingData?.payload;
  const depositHistory = responseData?.depositHistoryList || [];
  const isMature = responseData?.targetReached;

  const activeContent = responseData
    ? OFFSET_CONTENT({ responseData, isMature })
    : null;

  const savingsTabs = [
    { label: "Deposit", value: "deposit" },
    { label: "Offset", value: "offset" },
  ];

  const totalSavings = formatCurrency(responseData?.totalSavingsBalance || 0);
  const displaySavings = show
    ? totalSavings
    : totalSavings.replace(/[^₱\s]/g, "•");

  const handleDeposit = (e) => {
    showAlert.loading("Submitting...", "Please wait");
    savingDeposit(depositData, {
      onSuccess: (response) => {
        if (response.success) {
          const { reference } = response.payload;
          showAlert
            .success(
              "Deposit successful",
              `Your deposit has been processed successfully <br />` +
                `<b>Amount:</b> ${formatCurrency(depositData.amountDeposit)} <br />` +
                `<b>Reference:</b> ${reference}`,
            )
            .then(() => {
              setDepositData((prev) => ({ ...prev, amountDeposit: "" }));
              queryClient.invalidateQueries({
                queryKey: ["/api/savings/summary"],
              });
            });
        } else {
          showAlert.warning(
            "Failed",
            response.message || "Something went wrong",
          );
        }
      },
      onError: (error) => {
        showAlert.error(
          "Failed",
          "Something happened, please try again." + error,
        );
      },
    });
  };

  const agreeDeposit = (e) => {
    handleDepositSubmit(e, async () => {
      const agreeDepo = await swalModal({
        title: "Deposit now?",
        html: `You are about to deposit <b>${formatCurrency(depositData.amountDeposit)}</b>. <br/> Do you want to proceed?`,
        confirmButtonText: "Yes, deposit now",
        icon: "question",
      });
      if (agreeDepo) handleDeposit(e);
    });
  };

  const handleOffset = (e) => {
    if (offsetData.agreementText?.trim().toUpperCase() === "I AGREE") {
      showAlert.loading("Submitting", "Please wait");
      savingOffset(
        {},
        {
          onSuccess: (response) => {
            if (response?.success) {
              showAlert
                .success(
                  "Withdrawal Successful",
                  `Your withdrawal has been processed successfully. <br />` +
                    `${response?.message || ""} <br />` +
                    `<b>Amount:</b> ${totalSavings} <br />`,
                )
                .then(() => {
                  setOffsetData({ agreementText: "" });
                  queryClient.invalidateQueries({
                    queryKey: ["/api/savings/summary"],
                  });
                });
            } else {
              showAlert.warning(
                "Failed",
                response?.message || "Something went wrong",
              );
            }
          },
          onError: (error) => {
            showAlert.error(
              "Failed",
              "Something happened, please try again." + error,
            );
          },
        },
      );
    } else {
      showAlert.error("Failed to withdraw", "Please type I AGREE to submit");
    }
  };

  const agreeOffset = (e) => {
    handleOffsetSubmit(e, async () => {
      const modalOffset = isMature
        ? {
            title: "Target Reached!",
            html: `You are about to withdraw your savings including the earned interest. Proceed?`,
            confirmButtonText: "Yes, withdraw now",
            icon: "success",
          }
        : {
            title: "Early Withdrawal?",
            html: `Your savings haven't matured yet. Proceeding will forfeit your interest.Are you sure you want to continue?`,
            confirmButtonText: "Yes, withdraw now",
            icon: "warning",
          };

      const isConfirmed = await swalModal(modalOffset);
      if (isConfirmed) handleOffset(e);
    });
  };

  return (
    <div key={"savings"} className="min-h-screen p-5">
      <div className="card shadow-sm border border-slate-200 rounded-2xl bg-white">
        <div className="card-content p-5">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h1 className="text-md text-slate-500">Total Savings</h1>
              <h2 className="text-4xl font-semibold text-slate-700">
                {displaySavings}
              </h2>
            </div>
            <span>
              <button
                onClick={toggle}
                type="button"
                className="text-slate-400 transition-colors"
              >
                {show ? <Eye size={25} /> : <EyeClosed size={25} />}
              </button>
            </span>
          </div>
          <div className="flex flex-col justify-center items-start mt-5 pt-2 border-t border-slate-100">
            <div className="flex justify-between w-full text-xs items-center">
              <h5 className="text-slate-400 flex gap-1 items-center rounded-lg">
                Account number:
              </h5>
              <h2 className="text-slate-600 font-semibold">
                {responseData?.savingsId || "000000000"}
              </h2>
            </div>
            <div className="flex justify-between w-full text-xs items-center">
              <h5 className="text-emerald-500 rounded-lg">
                Estimated Annual Earnings
              </h5>
              <h2 className="text-emerald-600 font-semibold">
                {formatCurrency(responseData?.annualMoney || 0)}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="my-5">
        <h3 className="text-slate-800 font-bold uppercase">Quick Remit</h3>
        <div className="mt-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-slate-200/50 p-1 rounded-xl shadow-inner flex w-full border border-slate-100">
            {savingsTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 flex-1 text-sm font-semibold transition-all ${
                  activeTab === tab.value
                    ? "bg-sky-400 text-white shadow-md font-bold rounded-lg"
                    : "text-slate-700 font-medium"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "deposit" ? (
            <div className="flex flex-col mt-3 gap-3">
              <div className="bg-white shadow-sm border border-slate-100 rounded-lg">
                <div className="flex items-center p-2 gap-3">
                  <div className="bg-sky-50 text-sky-500 p-2 rounded-lg">
                    <PhilippinePeso />
                  </div>
                  <div className="relative w-full">
                    <h6 className="absolute -top-2 left-2 px-1 bg-white text-xs tracking-wider text-gray-400 font-bold">
                      Amount
                    </h6>
                    <Inputform
                      name="amountDeposit"
                      placeholder="Enter remit amount"
                      value={depositData.amountDeposit}
                      onChange={handleDepositChange}
                      className={`${depositErrors.amountDeposit ? "border-red-500" : ""} h-9 text-slate-700 font-semibold placeholder:text-slate-300 focus:ring-sky-500`}
                    />
                    {depositErrors.amountDeposit && (
                      <span className="text-red-500 text-xs mt-1">
                        {depositErrors.amountDeposit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={agreeDeposit}
                type="button"
                className="bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2"
              >
                <span>Deposit</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : userStatusPayload?.hasActiveSavings ? (
            <div className="flex flex-col mt-3 gap-3">
              <div className="flex flex-col text-sm bg-sky-50 border shadow-sm border-sky-200 p-3 rounded-xl">
                <div className="flex items-center justify-center gap-1">
                  <span className="p-1 bg-amber-50 text-amber-500 rounded-full">
                    <ShieldAlert />
                  </span>
                  <h1 className="font-bold text-lg italic text-center">
                    {activeContent?.title}
                  </h1>
                </div>
                <span className="italic mt-2 text-slate-600">
                  {activeContent?.description}
                </span>
                <span className="italic mt-2 text-slate-600 text-center">
                  {activeContent?.instruction}
                </span>
                <Inputform
                  name="agreementText"
                  value={offsetData.agreementText}
                  onChange={handleOffsetChange}
                  placeholder="Type I AGREE"
                  className={`${offsetErrors.agreementText ? "border border-red-400" : "border border-sky-100"} bg-slate-50 text-center mt-2 font-bold uppercase`}
                />
                {offsetErrors.agreementText && (
                  <span className="text-red-500 text-center text-xs mt-1">
                    {offsetErrors.agreementText}
                  </span>
                )}
              </div>
              <button
                onClick={agreeOffset}
                type="button"
                className="bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2"
              >
                <span>Offset</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 justify-center items-center mt-3 p-5 italic shadow-inner rounded-2xl bg-white border border-slate-100">
              <span className="bg-amber-50 p-1 text-amber-500 rounded-full">
                <CircleAlert />
              </span>
              <span className="text-slate-700">You need to deposit first.</span>
            </div>
          )}
        </div>
      </div>

      <div className="my-5">
        <div className="flex justify-between">
          <h3 className="text-slate-800 font-bold uppercase">Transaction</h3>
          <button
            type="button"
            onClick={(e) => navigate("/savings/savings_payments")}
            className="text-sky-500"
          >
            See all
          </button>
        </div>
        {depositHistory?.length > 0 ? (
          depositHistory.map((transac, index) => (
            <div
              key={`${transac.reference}-${index}`}
              className="bg-white shadow-sm p-3 px-5 rounded-xl my-2"
            >
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-emerald-500">
                  {formatCurrency(transac.amountRemit)}
                </div>
                <div className="text-sm font-semibold">
                  {formatDate(transac.remitDate)}
                </div>
              </div>
              <div className="flex justify-between text-slate-500">
                <div className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(transac.remitDate), {
                    addSuffix: true,
                  }).replace("about ", "")}
                </div>
                <div className="text-xs">{transac.reference}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5 p-10 italic rounded-2xl text-slate-500 bg-white-50 border border-slate-100 shadow-inner">
            No payment records found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Savings;
