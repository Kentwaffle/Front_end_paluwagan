import Inputform from "../../reusableComponents/Inputform";
import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { Eye, EyeClosed } from "lucide-react";
import { usePasswordToggle } from "../../reusableComponents/Hooks/ToggleEye";
import { ValidateLogIn } from "../../validations/CredentialValidation";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { useNavigate } from "react-router-dom";
import { useOtpTimer } from "../../reusableComponents/Hooks/SendOTPhook";

//Api
import api from "../../serviceToApi/ApiInstance";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

function SignIn() {
  const { formData, formErrors, handleChange, setFormErrors, handleSubmit } =
    useForm(
      {
        email: "",
        password: "",
        otp: "",
      },
      ValidateLogIn
    );

  const navigate = useNavigate();
  const { timer, isCounting, sendOtp } = useOtpTimer(30);
  const passwordField = usePasswordToggle();
  const [hasSent, setHasSent] = useState(false);
  const { userId } = location.state || {};

  const handleSendOtpTrigger = async () => {
    showAlert.loading("Sending", "Please wait");

    try {
      await api.post(API_ENDPOINTS.SEND_OTP, {
        email: formData.email,
      });
      sendOtp(formData.email, formData.password);
      setHasSent(true);
    } catch (error) {
      console.log(error);
      showAlert.error("Error", error.response?.data?.message || "Failed");
    }
  };

  const onSigninSuccess = async () => {
    showAlert.loading("Loading...", "Please wait");
    if (!formData.otp) {
      showAlert.warning("Wait!", "Please enter the OTP sent to your email.");
      return;
    }

    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, formData);

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        showAlert.success("Success!", "Logged in successfully!").then(() => {
          console.log("Navigating to Dashboard...");
          // navigate("/dashboard");
        });
      }
    } catch (error) {
      console.error("Login failed", error);
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      showAlert.error("Login Failed", errorMessage);
    }
  };

  return (
    <div className="w-full max-w-lg mt-10 sm:p-10  flex flex-col gap-3 bg-white-300 sm:shadow-lg sm:rounded-lg">
      <h2 className="text-center font-semibold text-xl font-sans mb-3">
        Sign in to your account
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e, onSigninSuccess, {
            onError: () => showAlert.warning("Error!", "Wrong credential"),
          });
        }}
        className="flex flex-col gap-3"
      >
        <div>
          <Inputform
            type="email"
            placeholder="Enter your email"
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

        <div>
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
                placeholder="Enter your password"
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
          <div
            className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
              formErrors.otp
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
            }`}
          >
            <Inputform
              type="text"
              placeholder="Enter OTP(One time password)"
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
              {isCounting
                ? `Resend ${timer}s`
                : hasSent
                ? "Resend OTP"
                : "Send OTP"}
            </button>
          </div>
          {formErrors.otp && (
            <span className="text-red-500 text-xs mt-1">{formErrors.otp}</span>
          )}
        </div>

        <span className="text-sm text-center">
          Dont have an account?{" "}
          <Link
            to="/register"
            className="text-sky-600 font-semibold hover:underline cursor-pointer underline"
          >
            Register here
          </Link>
        </span>

        <button
          type="submit"
          className="w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignIn;
