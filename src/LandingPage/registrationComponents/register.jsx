import Inputform from "../../reusableComponents/Inputform";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import TermsModal from "../termModal";
import SelectDropdown from "../../reusableComponents/selectdropdown";
import { ValidateRegister } from "../../validations/CredentialValidation";
import { Eye, EyeClosed } from "lucide-react";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { useNavigate } from "react-router-dom";
import { usePasswordToggle } from "../../reusableComponents/Hooks/ToggleEye";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";

//Api
import api from "../../serviceToApi/ApiInstance";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

function Register() {
  const { formData, formErrors, handleChange, setFormErrors, handleSubmit } =
    useForm(
      {
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        email: "",
        phoneNumber: "",
        password: "",
      },
      ValidateRegister,
    );

  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const passwordField = usePasswordToggle();

  const handleAccept = () => {
    setIsAccepted(true);
  };

  const openTermsModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const onRegisterSuccess = async () => {
    showAlert.loading("Loading...", "Please wait");
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, formData);
      const userId = response.data.userId;
      const messageFromServer = response.data.message;

      if (
        messageFromServer ===
        "User exists but not yet verified. Verification email resent."
      ) {
        showAlert
          .success(
            "Already registered but not Verified",
            "OTP sent!, Please check your inbox or spam to get verified",
          )
          .then((result) => {
            if (result.isConfirmed) {
              navigate("/register/otp", {
                state: { email: formData.email, userId: userId },
              });
            }
          });
      } else {
        showAlert
          .success(
            "Submitted!",
            `We will send a One-Time Password (OTP) to <b>${formData.email}</b>. Please check your inbox or spam`,
          )
          .then((result) => {
            if (result.isConfirmed) {
              navigate("/register/otp", {
                state: { email: formData.email, userId: userId },
              });
            }
          });
      }
    } catch (error) {
      console.log(error);
      showAlert.error("Error", error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="w-full max-w-lg py-5 flex flex-col gap-3 bg-white-300 md:px-5 md:py-0 dark:bg-slate-950">
      <h2 className="text-center font-semibold text-2xl font-sans text-slate-700 dark:text-slate-50 mb-3 md:mb-8">
        Register for Paluwagan
      </h2>

      <form
        onSubmit={(e) =>
          handleSubmit(e, onRegisterSuccess, {
            condition: isAccepted,
            onError: () =>
              showAlert.warning(
                "Terms & Conditions",
                "Kailangan mo munang basahin at tanggapin ang aming Terms and Conditions bago makapag-register.",
              ),
          })
        }
        className="flex flex-col gap-6 p-1"
      >
        <div className="flex flex-col gap-6 md:grid md:grid-cols-6 md:gap-x-4 md:gap-y-6">
          {/* First Name */}
          <div className="relative flex flex-col md:col-span-2">
            <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-950 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              First name
            </span>
            <Inputform
              type="text"
              placeholder="Juan"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={
                formErrors.firstName
                  ? "input-error border-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-sky-500"
              }
            />
            {formErrors.firstName && (
              <span className="text-red-500 text-[10px] mt-1">
                {formErrors.firstName}
              </span>
            )}
          </div>

          {/* Middle Name */}
          <div className="relative flex flex-col md:col-span-2">
            <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-950 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              Middle name
            </span>
            <Inputform
              type="text"
              placeholder="Garcia"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="border-slate-300 dark:border-slate-700 focus:border-sky-500"
            />
          </div>

          {/* Last Name */}
          <div className="relative flex flex-col md:col-span-2">
            <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-950 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              Last name
            </span>
            <Inputform
              type="text"
              placeholder="Dela Cruz"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={
                formErrors.lastName
                  ? "input-error border-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-sky-500"
              }
            />
            {formErrors.lastName && (
              <span className="text-red-500 text-[10px] mt-1">
                {formErrors.lastName}
              </span>
            )}
          </div>

          {/* Suffix */}
          <div className="relative flex flex-col md:col-span-3">
            <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-950 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              Suffix
            </span>
            <SelectDropdown
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              options={["Jr.", "Sr.", "II", "III", "IV"]}
              className="border-slate-300 dark:border-slate-900 focus:border-sky-500  "
            />
          </div>

          {/* Phone Number */}
          <div className="relative flex flex-col md:col-span-3">
            <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-950 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              Phone number
            </span>
            <Inputform
              type="text"
              placeholder="0912 345 6789"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={
                formErrors.phoneNumber
                  ? "input-error border-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-sky-500"
              }
            />
            {formErrors.phoneNumber && (
              <span className="text-red-500 text-[10px] mt-1">
                {formErrors.phoneNumber}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="relative flex flex-col md:col-span-3">
            <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-950 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              Email address
            </span>
            <Inputform
              type="email"
              placeholder="example@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={
                formErrors.email
                  ? "input-error border-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-sky-500"
              }
            />
            {formErrors.email && (
              <span className="text-red-500 text-[10px] mt-1">
                {formErrors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="relative flex flex-col md:col-span-3">
            <span className="absolute -top-2.5 left-2 bg-white dark:bg-slate-950 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              Password
            </span>
            <div
              className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
                formErrors.password
                  ? "border-red-500"
                  : "border-slate-300 dark:border-slate-700 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Inputform
                  type={passwordField.type}
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
                />
                <div
                  onClick={passwordField.toggle}
                  className="cursor-pointer text-slate-400 hover:text-sky-500"
                >
                  {passwordField.show ? (
                    <Eye size={18} />
                  ) : (
                    <EyeClosed size={18} />
                  )}
                </div>
              </div>
            </div>
            {formErrors.password && (
              <span className="text-red-500 text-[10px] mt-1">
                {formErrors.password}
              </span>
            )}
          </div>
        </div>

        {/* Terms and Submit */}
        <div className="flex flex-col gap-4">
          <span className="flex gap-2 justify-center items-center">
            <input
              type="checkbox"
              disabled={!isAccepted}
              readOnly
              className="checkbox checkbox-sm border-slate-400 dark:border-slate-500 checked:bg-sky-500 checked:border-sky-500 dark:checked:bg-sky-600 dark:checked:border-sky-600 transition-all cursor-pointer"
              checked={isAccepted}
            />
            <a
              className="underline text-sm text-sky-600 hover:text-sky-700 cursor-pointer transition duration-150"
              onClick={openTermsModal}
            >
              Please read our Terms and Conditions
            </a>
          </span>

          <button
            type="submit"
            className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-sky-600 transition duration-300"
          >
            Register
          </button>
        </div>
      </form>

      <span className="text-sm text-center">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-sky-600 font-bold hover:underline cursor-pointer"
        >
          Sign in here
        </Link>
      </span>

      <TermsModal ref={modalRef} onAccept={handleAccept} />
    </div>
  );
}

export default Register;
