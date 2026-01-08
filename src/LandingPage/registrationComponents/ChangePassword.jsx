import React from "react";
import Inputform from "../../reusableComponents/Inputform";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { useState, useEffect } from "react";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { useOtpTimer } from "../../reusableComponents/Hooks/SendOTPhook";
import { ValidateChangePassword } from "../../validations/CredentialValidation";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import { usePasswordToggle } from "../../reusableComponents/Hooks/ToggleEye";

//Api
import api from "../../serviceToApi/ApiInstance";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

function ChangePassword() {
  const [hasSent, setHasSent] = useState(false);
  const { timer, isCounting, sendOtp } = useOtpTimer(30);
  const passwordField = usePasswordToggle();
  const confirmPasswordField = usePasswordToggle();
  const location = useLocation();
  const navigate = useNavigate();
  const passedUserId = location.state?.userId;
  const passedEmail = location.state?.email;
  const { handleChange, formErrors, formData, handleSubmit } = useForm(
    {
      otp: "",
      password: "",
      confirmPassword: "",
    },
    ValidateChangePassword
  );

  useEffect(() => {
    if (!passedUserId) {
      navigate("/forgot-password");
      showAlert.warning("No email", "Please provide valid email");
    }
  }, [passedUserId, navigate]);

  const updatepassword = async () => {
    if (formData.password !== formData.confirmPassword) {
      return showAlert.warning("Mismatch", "Passwords do not match!");
    }

    showAlert.loading("Updating password", "Please wait");

    try {
      const response = await api.post(
        API_ENDPOINTS.VERIFY_OTP_FORGOT_PASSWORD,
        {
          userId: passedUserId,
          otp: formData.otp,
          password: formData.password,
        }
      );

      if (response.status === 200) {
        await showAlert.success(
          "Verified!",
          "Click OK to change your password"
        );
        navigate("/");
      }
    } catch (error) {
      const serverResponse = error.response?.data;
      let errorMessage = "Something went wrong";

      if (typeof serverResponse === "object" && serverResponse?.message) {
        errorMessage = serverResponse.message;
      } else if (typeof serverResponse === "string") {
        errorMessage = serverResponse;
      }

      showAlert.error("Error", errorMessage);
    }
  };

  const handleSendOtpTrigger = async () => {
    showAlert.loading("Sending", "Please wait");

    try {
      await api.post(API_ENDPOINTS.FORGOT_PASSWORD_OTP, {
        email: passedEmail,
      });
      sendOtp(passedEmail);
      setHasSent(true);
      showAlert.success("OTP send", "Please check your inbox or spam");
    } catch (error) {
      console.log(error);
      showAlert.error("Error", error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="p-5  w-full md:min-h-screen md:flex md:items-center md:justify-center">
      <form
        onSubmit={(e) => handleSubmit(e, updatepassword)}
        className="flex flex-col gap-3 w-full md:max-w-xl md:border md:border-stone-300 md:py-10 md:px-5 md:rounded-md md:shadow-md "
      >
        <div>
          <span>Change password</span>

          <div
            className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
              formErrors.password
                ? "border-red-500 ring-1 ring-red-500"
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

        <div>
          <span>Confirm password</span>
          <div
            className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
              formErrors.confirmPassword
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Inputform
                type={confirmPasswordField.type}
                placeholder="i.e Juancruz21"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
              />
              <div
                onClick={confirmPasswordField.toggle}
                className="cursor-pointer"
              >
                {confirmPasswordField.show ? <Eye /> : <EyeClosed />}
              </div>
            </div>
          </div>
          {formErrors.confirmPassword && (
            <span className="text-red-500 text-xs mt-1">
              {formErrors.confirmPassword}
            </span>
          )}
        </div>
        <div>
          <span>One time password (OTP)</span>
          <div
            className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
              formErrors.otp
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
            }`}
          >
            <Inputform
              type="text"
              placeholder="i.e 123456"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent"
            />
            <span className="text-stone-400 px-3">|</span>
            <button
              type="button"
              disabled={isCounting}
              onClick={handleSendOtpTrigger}
              className={`whitespace-nowrap text-sm font-semibold transition-colors duration-200 ${
                isCounting
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-sky-600 hover:text-sky-500 cursor-pointer"
              }`}
            >
              {isCounting ? `Resend ${timer}s` : "Resend OTP"}
            </button>
          </div>
          {formErrors.otp && (
            <span className="text-red-500 text-xs mt-1">{formErrors.otp}</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
