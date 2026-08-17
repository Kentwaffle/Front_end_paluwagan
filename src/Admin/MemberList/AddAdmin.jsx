import React, { useState } from "react";
import { Camera, Eye, EyeClosed, User, Lock, Mail, Phone, Shield, Key, ArrowLeft } from "lucide-react";
import Inputform from "../../reusableComponents/Forms/Inputform";
import SelectDropdown from "../../reusableComponents/Forms/selectdropdown";
import { personalInformation, accountInformation } from "./InformationsFields";
import { usePostData } from "../../serviceToApi/PostData";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { ValidateAdmin } from "../../validations/CredentialValidation";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { usePasswordToggle } from "../../reusableComponents/Forms/ToggleEye";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AddAdmin() {
  const [step, setStep] = useState(1);
  const passwordField = usePasswordToggle();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { mutate: addAdmin } = usePostData(
    API_ENDPOINTS.ADD_ADMIN,
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

  const validateAll = (data) => {
    const res1 = ValidateAdmin(data, 1);
    const res2 = ValidateAdmin(data, 2);
    const combinedErrors = { ...res1.errors, ...res2.errors };
    return {
      isValid: Object.keys(combinedErrors).length === 0,
      errors: combinedErrors,
    };
  };

  const handleNextSubmit = (e) => {
    if (step === 1) {
      const { isValid, errors } = ValidateAdmin(formData, 1);
      if (!isValid) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
      setStep(2);
    } else {
      handleSubmit(e, () => {
        confirmCreateSwal();
      });
    }
  };

  const handleSaveAdmin = () => {
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
  };

  const confirmCreateSwal = async () => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
    if (isDesktop) {
      let isConfirmed = false;
      await Swal.fire({
        html: `
          <div class="flex flex-col gap-4 text-slate-800 dark:text-slate-200">
            <!-- Header -->
            <div class="flex items-start gap-4 text-left">
              <div class="w-12 h-12 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-455 rounded-full flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <div class="flex flex-col gap-1">
                <h2 class="text-xl font-black text-slate-900 dark:text-white leading-tight">Create admin?</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  You are about to register a new system administrator account. Please review the details below to ensure accuracy before proceeding.
                </p>
              </div>
            </div>

            <div class="h-[1px] bg-slate-200/80 dark:bg-slate-800 w-full my-1"></div>

            <!-- Content Card -->
            <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl text-left flex flex-col gap-3">
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">Administrator Name</div>
                <div class="flex items-center gap-1.5 mt-1.5">
                  <svg class="w-4 h-4 text-slate-400 dark:text-slate-505" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span class="text-sm font-bold text-slate-800 dark:text-slate-205">${formData.firstName} ${formData.lastName}</span>
                </div>
              </div>

              <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

              <div class="flex justify-between items-center text-xs">
                <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Email Address</span>
                <span class="font-bold text-slate-800 dark:text-slate-205">
                  ${formData.email}
                </span>
              </div>

              <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

              <div class="flex justify-between items-center text-xs">
                <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Account Role</span>
                <span class="font-black text-blue-600 dark:text-sky-400 text-[10px] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ADMIN
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 mt-4">
              <button 
                id="swal-cancel-btn" 
                type="button" 
                class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                id="swal-confirm-btn" 
                type="button" 
                class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer transition-colors"
              >
                Yes, Create Admin
              </button>
            </div>
          </div>
        `,
        showConfirmButton: false,
        background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
        customClass: {
          popup: "rounded-3xl border border-slate-100 dark:border-slate-850 max-w-[480px] p-6 shadow-xl",
        },
        didOpen: () => {
          const cancelBtn = document.getElementById("swal-cancel-btn");
          const confirmBtn = document.getElementById("swal-confirm-btn");
          
          if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
              Swal.close();
            });
          }
          if (confirmBtn) {
            confirmBtn.addEventListener("click", () => {
              isConfirmed = true;
              Swal.close();
            });
          }
        }
      });

      if (isConfirmed) {
        handleSaveAdmin();
      }
    } else {
      handleSaveAdmin();
    }
  };

  const createAdminDesktop = (e) => {
    e.preventDefault();
    const { isValid, errors } = validateAll(formData);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    confirmCreateSwal();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* MOBILE STEPPED VIEW */}
      <div className="block md:hidden text-left p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <label className="text-lg font-bold text-slate-850 dark:text-white tracking-tight">
          {step === 1 ? "Personal information" : "Account Information"}
        </label>
        
        <div className="my-5">
          {currentFields.map((item, index) => (
            <div key={index} className="relative flex flex-col my-5">
              <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-900 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
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
                        : "border-slate-200 dark:border-slate-800 focus:border-sky-500 h-11 text-xs"
                    }
                  />
                  {item.type === "password" && (
                    <div
                      type="button"
                      onClick={passwordField.toggle}
                      className="absolute right-3 top-2.5 z-20 text-slate-400 hover:text-sky-500 transition-colors cursor-pointer"
                    >
                      {passwordField.show ? <Eye size={18} /> : <EyeClosed size={18} />}
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
              className="flex-1 py-3 text-slate-500 font-bold text-sm border border-slate-200 dark:border-slate-800 rounded-xl active:scale-95 transition-all cursor-pointer"
            >
              Back
            </button>
          )}

          <button
            onClick={(e) => handleNextSubmit(e)}
            className="flex-1 py-3 bg-sky-500 text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {step === 1 ? "Next" : "Create Admin"}
          </button>
        </div>
      </div>

      {/* DESKTOP INTEGRATED VIEW */}
      <div className="hidden md:flex flex-col gap-6 text-left">
        
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/memberlist")}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-600 dark:text-slate-350 flex items-center justify-center shrink-0"
              title="Back to Member List"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Add Admin User
            </h1>
          </div>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1.5 pl-9">
            Configure details for a new system administrator.
          </p>
        </div>

        {/* Content Card container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex flex-col gap-8">
          
          {/* Section 1: Personal Information */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Personal Information
              </h3>
            </div>
            
            <div className="h-[1px] bg-slate-100 dark:bg-slate-850 w-full"></div>

            <div className="grid grid-cols-2 gap-6">
              
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  First Name
                </span>
                <Inputform
                  name="firstName"
                  placeholder="e.g. Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`${formErrors.firstName ? "border-red-500" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs"}`}
                />
                {formErrors.firstName && (
                  <span className="text-red-550 text-[10px] font-semibold">{formErrors.firstName}</span>
                )}
              </div>

              {/* Middle Name */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Middle Name
                </span>
                <Inputform
                  name="middleName"
                  placeholder="e.g. Cruz"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="dark:bg-slate-955 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                  Last Name
                </span>
                <Inputform
                  name="lastName"
                  placeholder="e.g. Dela"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`${formErrors.lastName ? "border-red-500" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs"}`}
                />
                {formErrors.lastName && (
                  <span className="text-red-550 text-[10px] font-semibold">{formErrors.lastName}</span>
                )}
              </div>

              {/* Suffix Dropdown */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                  Suffix Name
                </span>
                <SelectDropdown
                  name="suffix"
                  label="Select Suffix"
                  options={["Jr.", "Sr.", "III", "IV"]}
                  onChange={handleChange}
                  value={formData.suffix}
                  className="dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-11 text-xs"
                />
              </div>

            </div>

          </div>

          {/* Section 2: Contact & Security */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Contact & Security
              </h3>
            </div>
            
            <div className="h-[1px] bg-slate-100 dark:bg-slate-850 w-full"></div>

            <div className="grid grid-cols-2 gap-6">
              
              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Phone Number
                </span>
                <Inputform
                  name="phoneNumber"
                  placeholder="e.g. 09000000000"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`${formErrors.phoneNumber ? "border-red-500" : "dark:bg-slate-955 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs"}`}
                />
                {formErrors.phoneNumber && (
                  <span className="text-red-550 text-[10px] font-semibold">{formErrors.phoneNumber}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Email Address
                </span>
                <Inputform
                  name="email"
                  placeholder="admin@finadmin.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${formErrors.email ? "border-red-500" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs"}`}
                />
                {formErrors.email && (
                  <span className="text-red-555 text-[10px] font-semibold">{formErrors.email}</span>
                )}
              </div>

            </div>

            {/* Initial Password (Full Width Row) */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                Initial Password
              </span>
              <div className="relative">
                <Inputform
                  name="password"
                  type={passwordField.type}
                  placeholder="Enter temporary password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${formErrors.password ? "border-red-500" : "dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500 h-11 text-xs pr-10"}`}
                />
                <div
                  type="button"
                  onClick={passwordField.toggle}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  {passwordField.show ? <Eye size={18} /> : <EyeClosed size={18} />}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                User will be required to change this upon first login.
              </span>
              {formErrors.password && (
                <span className="text-red-550 text-[10px] font-semibold block mt-1">{formErrors.password}</span>
              )}
            </div>

          </div>

          {/* Form Actions (Desktop) */}
          <div className="flex justify-end gap-3 mt-4 border-t border-t-slate-100 dark:border-t-slate-850 pt-6">
            <button
              onClick={() => navigate("/admin/memberlist")}
              className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createAdminDesktop}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer transition-colors active:scale-95"
            >
              Create Admin Account
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AddAdmin;
