import { usePostDynamic } from "../../serviceToApi/DynamicPost";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { useNavigate } from "react-router-dom";

export const useOnlinePayment = () => {
  const navigate = useNavigate();
  const { mutate: paymentIntent } = usePostDynamic(
    API_ENDPOINTS.ONLINE_PAYMENT,
  );
  const { mutate: attachMethod } = usePostDynamic("api/attach-method");

  const processOnlinePayment = (formData, successPath = "qrpayment") => {
    showAlert.loading("Processing Payment", "Please wait...");

    const submissionData = {
      ...formData,
      amount: Number(formData.amount),
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
                  const qrImageURL =
                    attachRes?.payload?.qrCodeImage ||
                    attachRes?.payload?.attributes?.next_action?.show_qr_code
                      ?.image_url;
                  const redirectUrl = attachRes?.payload?.redirectUrl;

                  if (qrImageURL) {
                    showAlert.close();
                    navigate(successPath, {
                      state: {
                        paymentDetails: {
                          ...submissionData,
                          qrImageURL,
                          intentId,
                        },
                      },
                    });
                  } else if (redirectUrl) {
                    showAlert.close();
                    window.open(redirectUrl, "_blank");
                  }
                },
                onError: (err) =>
                  showAlert.error("Payment Failed", err.message),
              },
            );
          }
        },
        onError: (err) => showAlert.error("Payment Failed", err.message),
      },
    );
  };

  return { processOnlinePayment };
};
