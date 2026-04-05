import { useState, useEffect, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchData } from "../../serviceToApi/fetchData";
import { usePostData } from "../../serviceToApi/PostData";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { useTodayDate } from "../../reusableComponents/Hooks/CurrentDate";
import { usePasswordToggle } from "../../reusableComponents/Hooks/ToggleEye";
import { formatCurrency } from "../../reusableComponents/formatter";

import {
  showAlert,
  swalModal,
} from "../../reusableComponents/Alerts/SweetAlerts";
import { OFFSET_CONTENT } from "../../reusableComponents/text";
import {
  ValidateOffset,
  ValidateSavingsDeposit,
} from "../../validations/CredentialValidation";
import { generateUUID } from "../../reusableComponents/GeneratedIDS";
import { usePostDynamic } from "../../serviceToApi/DynamicPost";

export const useSavings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const today = useTodayDate();
  const { isStatus, isStatusLoading } = useOutletContext();
  const { show, toggle } = usePasswordToggle();
  const [activeTab, setActiveTab] = useState("deposit");
  const [paymentMode, setPaymentMode] = useState("online");

  //API CALLS
  const { data: savingData, isLoading: loadingSummary } = useFetchData(
    "/api/savings/summary",
    API_ENDPOINTS.SAVINGS_DETAILS,
    { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true },
  );

  const { mutate: savingDeposit } = usePostData(
    "/api/savings/remit",
    API_ENDPOINTS.SAVINGS_DEPOSIT,
  );

  const { mutate: savingOffset } = usePostData(
    "/api/savings/withdraw",
    API_ENDPOINTS.SAVINGS_OFFSET,
  );

  //Data maps
  const responseData = savingData?.payload;
  const userStatusPayload = isStatus?.payload;
  const depositHistory = responseData?.depositHistoryList || [];
  const isMature = responseData?.targetReached;
  const activeContent = responseData
    ? OFFSET_CONTENT({ responseData, isMature })
    : null;
  const totalSavings = formatCurrency(responseData?.totalSavingsBalance || 0);
  const displaySavings = show
    ? totalSavings
    : totalSavings.replace(/[^₱\s]/g, "•");

  //Forms
  const depositForm = useForm(
    { amountDeposit: "", depositDate: today },
    ValidateSavingsDeposit,
  );

  const offsetForm = useForm({ agreementText: "" }, ValidateOffset);

  const initialOnlineValues = useMemo(
    () => ({
      // genId: generateUUID(),
      description: "Online deposit for savings",
      amount: 0,
      paymentType: "SAVINGS",
      referenceId: savingData?.payload?.savingsId || "",
      methodType: "",
    }),
    [savingData?.payload?.savingsId],
  );

  //useEffect para sa ID
  const cashPaymentForm = useForm(initialOnlineValues, ValidateSavingsDeposit);

  // 4. Update Reference ID separately
  useEffect(() => {
    const sId = savingData?.payload?.savingsId;
    if (sId && !cashPaymentForm.formData.referenceId) {
      cashPaymentForm.setFormData((prev) => ({
        ...prev,
        referenceId: sId,
      }));
    }
  }, [savingData]);

  //HandleSubmit
  const handleDeposit = (e) => {
    showAlert.loading("Submitting...", "Please wait");
    savingDeposit(depositForm.formData, {
      onSuccess: (response) => {
        if (response.success) {
          showAlert
            .success(
              "Deposit successful",
              `Your deposit has been processed successfully <br />` +
                `<b>Amount:</b> ${formatCurrency(depositForm.formData.amountDeposit)} <br />` +
                `  An admin will confirm your transaction shortly.`,
            )
            .then(() => {
              depositForm.setFormData((prev) => ({
                ...prev,
                amountDeposit: "",
              }));
              queryClient.invalidateQueries({
                queryKey: ["/api/savings/summary"],
              });
              queryClient.invalidateQueries({
                queryKey: ["notification_list"],
              });
            });
        } else {
          showAlert.warning("Failed", response.message);
        }
      },
      onError: (err) => showAlert.error("Failed", err.message),
    });
  };

  const agreeDeposit = (e) => {
    depositForm.handleSubmit(e, async () => {
      const agree = await swalModal({
        title: "Deposit now?",
        html: `You are about to deposit <b>${formatCurrency(depositForm.formData.amountDeposit)}</b>. <br/> Do you want to proceed?`,
        confirmButtonText: "Yes, deposit now",
        icon: "question",
      });
      if (agree) handleDeposit(e);
    });
  };

  const handleOffsetAction = (e) => {
    if (offsetForm.formData.agreementText?.trim().toUpperCase() === "I AGREE") {
      showAlert.loading("Submitting", "Please wait");
      savingOffset(
        {},
        {
          onSuccess: (res) => {
            if (res?.success) {
              showAlert
                .success(
                  "Withdrawal Successful",
                  `Your withdrawal has been processed successfully. <br />` +
                    `${res?.message || ""} <br />` +
                    `<b>Amount:</b> ${totalSavings} <br />`,
                )
                .then(() => {
                  offsetForm.setFormData({ agreementText: "" });
                  queryClient.invalidateQueries({
                    queryKey: ["/api/savings/summary"],
                  });
                });
            } else {
              showAlert.warning("Failed", res?.message);
            }
          },
        },
      );
    } else {
      showAlert.error("Failed", "Please type I AGREE");
    }
  };

  const agreeOffset = (e) => {
    offsetForm.handleSubmit(e, async () => {
      const modalCfg = isMature
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
      const ok = await swalModal(modalCfg);
      if (ok) handleOffsetAction(e);
    });
  };
  const { mutate: paymentIntent } = usePostDynamic(
    API_ENDPOINTS.ONLINE_PAYMENT,
    "api/create-intent",
  );

  const { mutate: attachMethod } = usePostDynamic("api/attach-method");

  const handleOnlineDeposit = (e) => {
    cashPaymentForm.handleSubmit(e, () => {
      showAlert.loading("Processing Payment", "Please wait...");
      const submissionData = {
        ...cashPaymentForm.formData,
        amount: Number(cashPaymentForm.formData.amount),
      };

      paymentIntent(
        {
          endpoint: API_ENDPOINTS.ONLINE_PAYMENT,
          data: submissionData,
          isPayment: true,
        },
        {
          onSuccess: (res) => {
            const intentId = res?.payload?.intentId || res?.payload?.id;

            if (res?.success && intentId) {
              attachMethod(
                {
                  endpoint: API_ENDPOINTS.ATTACHMENT(
                    intentId,
                    submissionData.methodType,
                  ),
                  data: {},
                  isPayment: true,
                },
                {
                  onSuccess: (attachRes) => {
                    const testQr = attachRes?.payload?.testUrl;
                    const redirectUrl = attachRes?.payload?.redirectUrl;
                    const qrImageURL =
                      attachRes?.payload?.qrCodeImage ||
                      attachRes?.payload?.attributes?.next_action?.show_qr_code
                        ?.image_url;

                    if (qrImageURL) {
                      showAlert.close();
                      navigate("qrpayment", {
                        state: {
                          paymentDetails: {
                            ...submissionData,
                            qrImageURL,
                            testQr,
                            intentId,
                          },
                        },
                      });
                    } else if (redirectUrl) {
                      showAlert.close();
                      window.open(redirectUrl, "_blank");
                    }
                  },
                  onError: (err) => {
                    showAlert.error(
                      "Payment Failed",
                      err.message ||
                        "An error occurred while attaching payment method",
                    );
                  },
                },
              );
            }
          },
          onError: (err) => {
            showAlert.error(
              "Payment Failed",
              err.message || "An error occurred",
            );
          },
        },
      );
    });
  };

  return {
    handleOnlineDeposit,
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
  };
};
