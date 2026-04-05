import React from "react";
import Inputform from "../reusableComponents/Inputform";
import SelectDropdown from "../reusableComponents/selectdropdown";
import { useForm } from "../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateSavings } from "../validations/CredentialValidation";
import { usePostData } from "../serviceToApi/PostData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { showAlert, swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function Apply_savings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { handleChange, handleSubmit, formErrors, formData } = useForm(
    {
      targetAmount: "",
      sourceOfFunds: "",
    },
    ValidateSavings,
  );

  const { mutate: apply_savignsMutate } = usePostData(
    "/api/savings/apply",
    API_ENDPOINTS.APPLY_SAVINGS,
  );
  const agreeSavings = async (e) => {
    const agreeSave = await swalModal({
      title: "Do you want to apply for savings?",
      text: "You are about to apply for a savings account.",
      confirmButtonText: "Yes",
      icon: "question",
    });
    if (agreeSave) hadleApplySaving(e);
  };

  const hadleApplySaving = (e) => {
    handleSubmit(e, () => {
      showAlert.loading("Submitting", "Please wait");
      apply_savignsMutate(formData, {
        onSuccess: (response) => {
          if (response.success) {
            showAlert
              .success(
                "Successfully Applied",
                "You successfully applied for savings",
              )
              .then(() => {
                queryClient.invalidateQueries({
                  queryKey: ["/api/user/status"],
                });
                navigate("/savings");
              });
          } else {
            if (response.message == "Pls complete your details in profile") {
              showAlert
                .error(
                  "Failed",
                  "Please provide the missing details in your profile.",
                  "Go to Profile",
                )
                .then(() => {
                  navigate("/profile");
                });
            }
          }
        },
        onError: (error) => {
          showAlert.error(
            "Failed",
            "Something happened, please try again." + error,
          );
        },
      });
    });
  };

  return (
    <div key={"apply_savings"}>
      {/* {isLoading ? data : errors ? dataErr : ""} */}
      <div className="min-h-screen p-5">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h1 className="text-2xl font-bold text-slate-800">
            Apply for Savings
          </h1>
          <div className="flex flex-col gap-5 mt-3">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600">
                Target Amount/ Inaasahang Ipon
              </span>
              <Inputform
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="e.g. min. ₱5,000"
                className={`h-9 text-slate-700 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:ring-sky-500 ${formErrors.targetAmount ? "border-red-500" : ""}`}
              />
              {formErrors.targetAmount && (
                <span className="text-red-500 text-xs mt-1">
                  {formErrors.targetAmount}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600">
                Source of Funds/ Pinagkunan ng Pondo
              </span>
              <SelectDropdown
                name="sourceOfFunds"
                label="Source of Funds/ Pinagkunan ng Pondo"
                value={formData.sourceOfFunds}
                onChange={handleChange}
                options={[
                  "Salary / Sweldo",
                  "Business / Negosyo",
                  "Remittance",
                  "Allowance / Others",
                ]}
                className={`${formErrors.sourceOfFunds ? "border-red-500" : ""}`}
              />
              {formErrors.sourceOfFunds && (
                <span className="text-red-500 text-xs mt-1">
                  {formErrors.sourceOfFunds}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={agreeSavings}
              className="bg-gradient-to-r from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2"
            >
              Open Savings Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Apply_savings;
