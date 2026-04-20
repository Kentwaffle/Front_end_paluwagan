import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Download } from "lucide-react";
import { formatCurrency } from "../reusableComponents/Utils/formatter";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { useCountdown } from "../reusableComponents/Hooks/Timer";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";

function QRCODE() {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentDetails = location.state?.paymentDetails || "No QR Code Data";
  const qrImageUrl = paymentDetails?.qrImageURL;
  // console.log(paymentDetails?.testQr);
  // console.log("All Details:", paymentDetails);
  const downLoadQr = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `qr-code-${paymentDetails?.referenceId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const intentId = paymentDetails?.intentId;

  const { data: qrTimerData } = useFetchData(
    "/payment/status",
    API_ENDPOINTS.QRTIMER(intentId),
  );
  const { timeLeft, isExpired } = useCountdown(qrTimerData?.payload?.expiresAt);

  useEffect(() => {
    if (isExpired) {
      showAlert.warning(
        "QR Code Expired",
        "We redirect you to the savings page. Please generate a new one.",
      );
      navigate("/savings");
    }
  }, [isExpired, navigate]);

  return (
    <div className="flex flex-col items-center p-6 ">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
        {paymentDetails?.description}
      </h3>

      <div className="flex gap-5 bg-white  rounded-xl p-4 my-2 items-center justify-center  shadow-sm  dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-black tracking-wider uppercase">
            Amount
          </span>
          <span className="text-2xl text-slate-600 font-bold">
            {formatCurrency(paymentDetails?.amount)}
          </span>
        </div>
        <div className="divider divider-horizontal m-0"></div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-black tracking-wider uppercase">
            Expires In
          </span>
          <span
            className={`text-2xl font-bold ${isExpired ? "text-red-500" : "text-slate-600"}`}
          >
            {isExpired ? "EXPIRED" : timeLeft}
          </span>
        </div>
      </div>

      <div className="p-5 bg-white rounded-2xl m-3 border-2 border-dashed border-slate-200">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="uppercase font-extrabold text-sm tracking-widest">
            {paymentDetails?.methodType}
          </div>
          <img
            src={qrImageUrl}
            alt="QR PH Code"
            className="w-64 h-64 border border-slate-300 p-2 rounded-lg"
          />
        </div>
        <button
          onClick={downLoadQr}
          className="mt-3 flex items-center justify-center w-full
         gap-2 text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          <Download size={16} />
          Download QR Code
        </button>
      </div>
      <p className="mt-4 text-[10px] text-slate-500 font-medium italic text-center">
        Scan this to quickly deposit to <br />
        <span className="font-bold text-slate-600">
          {paymentDetails?.referenceId}
        </span>
      </p>
    </div>
  );
}

export default QRCODE;
