import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PhilippinePeso,
  ArrowRight,
  Eye,
  EyeClosed,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import Sidebar from "../MainComponents/sidebar";
import Header from "../MainComponents/Header";
import { useOutletContext } from "react-router-dom";
import { formatCurrency, formatDate } from "../reusableComponents/formatter";
import Inputform from "../reusableComponents/Inputform";
import { usePasswordToggle } from "../reusableComponents/Hooks/ToggleEye";
import { OFFSET_CONTENT } from "../reusableComponents/text";
import { SavingsLoading } from "../reusableComponents/loading";
import { useTodayDate } from "../reusableComponents/Hooks/CurrentDate";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateSavingsDeposit } from "../validations/CredentialValidation";
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
  const { handleChange, handleSubmit, formErrors, formData, setFormData } =
    useForm(
      {
        amountDeposit: "",
        depositDate: today,
      },
      ValidateSavingsDeposit,
    );

  const { mutate: savingDeposit } = usePostData(
    "/api/savings/remit",
    API_ENDPOINTS.SAVINGS_DEPOSIT,
  );

  const { data: savingData } = useFetchData(
    "/api/savings/summary",
    API_ENDPOINTS.SAVINGS_DETAILS,
    {
      // Mag-re-fetch lang siya pagka-mount KUNG ang data ay 5 mins na sa cache
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true, // Maganda ito para pag-open ng phone, fresh agad
    },
  );
  const responseData = savingData?.payload;
  const depositHistory = savingData?.payload?.depositHistoryList || 0;

  const savingsTabs = [
    { label: "Deposit", value: "deposit" },
    { label: "Offset", value: "offset" },
  ];

  const totalSavings = formatCurrency(responseData?.totalSavingsBalance);
  const displaySavings = show
    ? totalSavings
    : totalSavings.replace(/[^₱\s]/g, "•");

  const agreeDeposit = (e) => {
    handleSubmit(e, async () => {
      const agreeDepo = await swalModal({
        title: "Deposit now?",
        html: `Youre about to deposit <b>${formatCurrency(formData.amountDeposit)}</b>. <br/> Do you want to proceed?`,
        confirmButtonText: "Yes, deposit now",
        icon: "question",
      });
      if (agreeDepo) handleDeposit(e);
    });
  };

  const handleDeposit = (e) => {
    savingDeposit(formData, {
      onSuccess: (response) => {
        if (response.success) {
          const { reference } = response.payload;
          showAlert
            .success(
              "Deposit successful",
              `Your deposit has been processed successfully <br />` +
                `<b>Amount:</b> ${formData.amountDeposit} <br />` +
                `<b>Reference:</b> ${reference}`,
            )
            .then(() => {
              setFormData((prev) => ({
                ...prev,
                amountDeposit: "",
              }));
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
              <h5 className=" text-slate-400 flex gap-1  items-center rounded-lg">
                Account number:
              </h5>
              <h2 className=" text-slate-600 font-semibold">
                {responseData?.savingsId || "000000000"}
              </h2>
            </div>
            <div className="flex justify-between w-full text-xs items-center">
              <h5 className=" text-emerald-500 rounded-lg">
                Estimated Annual Earnings
              </h5>
              <h2 className=" text-emerald-600 font-semibold">
                {formatCurrency(responseData?.annualMoney)}
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
                className={`px-4 py-2 flex-1  text-sm font-semibold transition-all  ${
                  activeTab === tab.value
                    ? "bg-sky-400 text-white shadow-md font-bold rounded-lg"
                    : " text-slate-700 font-medium"
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
                  <div className="bg-sky-50 text-sky-500 p-2 rounded-lg ">
                    <PhilippinePeso />
                  </div>

                  <div className="relative w-full">
                    <h6 className="absolute -top-2 left-2 px-1 bg-white text-xs tracking-wider text-gray-400 font-bold">
                      Amount
                    </h6>
                    <Inputform
                      name="amountDeposit"
                      placeholder="Enter remit amount"
                      value={formData.amountDeposit}
                      onChange={handleChange}
                      className={`${formErrors.amountDeposit ? " border-red-500" : ""} h-9  text-slate-700 font-semibold placeholder:text-slate-300 placeholder:font-normal focus:ring-sky-500`}
                    />
                    {formErrors.amountDeposit && (
                      <span className="text-red-500 text-xs mt-1">
                        {formErrors.amountDeposit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={agreeDeposit}
                className="bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2"
              >
                <span>Deposit</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col mt-3 gap-3">
              <div className="flex flex-col">
                <div className="flex flex-col text-sm bg-sky-50 border shadow-sm border-sky-200 p-3 rounded-xl">
                  <div className="flex items-center justify-center gap-1">
                    <span className="p-1 bg-amber-50 text-amber-500 rounded-full ">
                      <ShieldAlert />
                    </span>
                    <h1 className="font-bold text-lg italic text-center">
                      Nais kong mag-offset
                    </h1>
                  </div>
                  <span className="italic mt-2 text-slate-600">
                    Sa pagpapatuloy ng aksyong ito, kinikilala mo na dahil ang
                    iyong kontribusyon ay hindi pa umabot sa isang taong
                    maturity period, ang orihinal na halaga (principal amount)
                    lamang ng iyong naipon ang maaari mong makuha. Ang anumang
                    inaasahang interest para sa bahaging ito ay
                    mapapawalang-bisa at hindi na maibabalik sa iyong account.
                    Ang prosesong ito ay pinal at hindi na maaaring bawiin.
                    Upang kumpirmahin na nauunawaan at tinatanggap mo ang mga
                    tuntuning ito, mangyaring i-type ang <b>"I AGREE"</b> sa
                    ibaba.
                  </span>

                  <Inputform
                    placeholder="Type I AGREE"
                    className="bg-slate-50 text-center mt-2 font-bold border border-sky-100"
                  />
                </div>
              </div>
              <button className="bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2">
                <span>Offset</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="my-5">
        <h3 className="text-slate-800 font-bold uppercase">Transaction</h3>
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
                    includeSeconds: true,
                  }).replace("about ", "")}
                </div>

                <div className="text-xs">{transac.reference}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 opacity-50 italic">
            No payment records found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Savings;
