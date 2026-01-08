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
      ValidateRegister
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
            "OTP sent!, Please check your inbox or spam to get verified"
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
            `We will send a One-Time Password (OTP) to <b>${formData.email}</b>. Please check your inbox or spam`
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
    <div className="w-full max-w-lg  py-5 flex flex-col gap-3 bg-white-300 md:px-5 md:py-0">
      <h2 className="text-center font-semibold text-2xl font-sans text-stone-700">
        Register for Paluwagan
      </h2>

      <form
        onSubmit={(e) =>
          handleSubmit(e, onRegisterSuccess, {
            condition: isAccepted,
            onError: () =>
              showAlert.warning(
                "Terms & Conditions",
                "Kailangan mo munang basahin at tanggapin ang aming Terms and Conditions bago makapag-register."
              ),
          })
        }
        className="flex flex-col gap-3 p-1"
      >
        <div className="md:grid md:grid-cols-6 md:gap-4 md:mb-1">
          <div className="flex flex-col md:col-span-2">
            <span>First name</span>
            <Inputform
              type="text"
              placeholder="i.e Juan"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={
                formErrors.firstName ? "input-error border-red-500" : ""
              }
            />
            {formErrors.firstName && (
              <span className="text-red-500 text-xs mt-1">
                {formErrors.firstName}
              </span>
            )}
          </div>

          <div className="flex flex-col md:col-span-2">
            <span>Middle name</span>
            <Inputform
              type="text"
              placeholder="i.e. Garcia"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <span>Last name</span>
            <Inputform
              type="text"
              placeholder="i.e. Dela Cruz"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={
                formErrors.lastName ? "input-error border-red-500" : ""
              }
            />
            {formErrors.lastName && (
              <span className="text-red-500 text-xs mt-1">
                {formErrors.lastName}
              </span>
            )}
          </div>

          <div className="flex flex-col md:col-span-3">
            <span>Suffix</span>
            <SelectDropdown
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              options={["Jr.", "Sr.", "II", "III", "IV"]}
            />
          </div>

          <div className="flex flex-col md:col-span-3">
            <span>Phone number</span>
            <Inputform
              type="text"
              placeholder="i.e 0912 345 6789"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={
                formErrors.phoneNumber ? "input-error border-red-500" : ""
              }
            />
            {formErrors.phoneNumber && (
              <span className="text-red-500 text-xs mt-1">
                {formErrors.phoneNumber}
              </span>
            )}
          </div>

          <div className="flex flex-col  md:col-span-3">
            <span>Email address</span>
            <Inputform
              type="email"
              placeholder="example@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "input-error border-red-500" : ""}
            />
            {formErrors.email && (
              <span className="text-red-500 text-xs mt-1">
                {formErrors.email}
              </span>
            )}
          </div>

          <div className="flex flex-col md:col-span-3">
            <span>Password</span>
            <div
              className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
                formErrors.password
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Inputform
                  type={passwordField.type}
                  placeholder="i.e Juancruz21"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
                />
                <div onClick={passwordField.toggle} className="cursor-pointer">
                  {passwordField.show ? <Eye /> : <EyeClosed />}
                </div>
              </div>
            </div>
            {formErrors.password && (
              <span className="text-red-500 text-xs mt-1">
                {formErrors.password}
              </span>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex flex-col gap-2 ">
          <span className="flex gap-1 justify-center items-center">
            <input
              type="checkbox"
              disabled={!isAccepted}
              readOnly
              className="checkbox  checkbox-sm"
              checked={isAccepted}
            />
            <a
              className="underline text-center text-sky-600 hover:text-sky-700 transition duration-150"
              onClick={openTermsModal}
            >
              Please read our Terms and Conditions
            </a>
            {formErrors.terms && (
              <span className="text-red-500 text-xs italic font-medium">
                {formErrors.terms}
              </span>
            )}
          </span>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300"
          >
            Register
          </button>
        </div>
      </form>

      <span className="text-sm  pl-2 text-center">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-sky-600 font-semibold hover:underline cursor-pointer underline"
        >
          Sign in here
        </Link>
      </span>

      {/* renderTerm */}
      <TermsModal ref={modalRef} onAccept={handleAccept} />
    </div>
  );
}

export default Register;
