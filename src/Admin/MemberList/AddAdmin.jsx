import React, { useState } from "react";
import { Camera, Eye, EyeClosed } from "lucide-react";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import Inputform from "../../reusableComponents/Inputform";
import SelectDropdown from "../../reusableComponents/selectdropdown";
import { personalInformation, accountInformation } from "./InformationsFields";
import { usePostData } from "../../serviceToApi/PostData";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateAdmin } from "../../validations/CredentialValidation";
import { set } from "date-fns";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { usePasswordToggle } from "../../reusableComponents/Hooks/ToggleEye";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
function AddAdmin() {
  const [step, setStep] = useState(1);
  const passwordField = usePasswordToggle();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: addAdmin } = usePostData(
    API_ENDPOINTS.ADD_ADMIN, // Unang Param: Ang totoong API URL
    "ADMIN_MEMBERLIST",
  );

  const currentFields = step === 1 ? personalInformation : accountInformation;
  const { formData, handleSubmit, handleChange, formErrors, setFormErrors } =
    useForm(
      {
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        phoneNumber: "",
        email: "",
        password: "",
      },
      (data) => ValidateAdmin(data, step),
    );

  const handleNextSubmit = (e) => {
    if (step === 1) {
      const { isValid, errors } = ValidateAdmin(formData, 1);
      if (!isValid) {
        setFormErrors(errors);
        return;
      }

      if (step === 1) {
        setFormErrors({});
        setStep(2);
      }
    } else {
      handleSubmit(e, () => {
        showAlert.loading("Submitting", "Please wait");
        addAdmin(formData, {
          onSuccess: (data) => {
            if (data) {
              showAlert.success("Success!", "Successfully registered as admin");
              queryClient.invalidateQueries({
                queryKey: ["memberlist"],
              });
              navigate("/admin/memberlist");
            }
          },
          onError: (error) => {
            2;
            const responseData = error.response?.data;
            let finalMessage = "Something went wrong";
            if (responseData) {
              if (
                responseData.payload &&
                typeof responseData.payload === "object"
              ) {
                const errorKeys = Object.keys(responseData.payload);
                if (errorKeys.length > 0) {
                  finalMessage = responseData.payload[errorKeys[0]];
                }
              } else if (responseData.message) {
                finalMessage = responseData.message;
              }
            }

            showAlert.warning("Failed", finalMessage);
          },
        });
      });
    }
  };

  return (
    <div className="p-5 min-h-screen">
      <label className="text-lg font-bold text-slate-800 tracking-tight">
        {step === 1 ? "Personal information" : "Account Information"}
      </label>
      <div className="my-5">
        {currentFields.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col md:col-span-2 my-5"
          >
            <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-950 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              {item.label}
            </span>
            {item.itemType === "dropdown" ? (
              <SelectDropdown
                name={item.name}
                label={"Suffix"}
                options={item.options}
                onChange={handleChange}
                value={formData[item.name]}
              />
            ) : (
              <>
                <Inputform
                  type={
                    item.type === "password"
                      ? passwordField.type
                      : item.type || "text"
                  }
                  placeholder={item.placeholderText}
                  name={item.name}
                  value={formData[item.name]}
                  onChange={handleChange}
                  className={
                    formErrors[item.name]
                      ? "input-error border-red-500"
                      : "border-slate-300 dark:border-slate-700 focus:border-sky-500"
                  }
                />
                {item.type === "password" && (
                  <div
                    type="button"
                    onClick={passwordField.toggle}
                    className="absolute right-3 top-2 z-20 text-slate-400 hover:text-sky-500 transition-colors"
                  >
                    {passwordField.show ? <Eye /> : <EyeClosed />}
                  </div>
                )}

                {formErrors[item.name] && (
                  <span className="text-red-500 text-xs mt-1">
                    {formErrors[item.name]}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-10 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(1)}
            className="flex-1 py-3 text-slate-500 font-bold text-sm border border-slate-200 rounded-xl active:scale-95 transition-all"
          >
            Back
          </button>
        )}

        <button
          onClick={(e) => handleNextSubmit(e)}
          className="flex-1 py-3 bg-sky-500 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-200 active:scale-95 transition-all"
        >
          {step === 1 ? "Next" : "Create Admin"}
        </button>
      </div>
    </div>
  );
}

export default AddAdmin;
