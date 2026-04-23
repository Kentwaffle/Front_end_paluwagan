import Inputform from "../../reusableComponents/Forms/Inputform";
import { data, Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { Eye, EyeClosed } from "lucide-react";
import { usePasswordToggle } from "../../reusableComponents/Forms/ToggleEye";
import { ValidateLogIn } from "../../validations/CredentialValidation";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
import { useOtpTimer } from "../../reusableComponents/Hooks/SendOTPhook";

//Api
import api from "../../serviceToApi/ApiInstance";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { usePostData } from "../../serviceToApi/PostData";
import { useAuth } from "../../auth/Auth";
function SignIn() {
  const { formData, formErrors, handleChange, setFormErrors, handleSubmit } =
    useForm(
      {
        email: "",
        password: "",
        otp: "",
      },
      ValidateLogIn,
    );

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { timer, isCounting, sendOtp } = useOtpTimer(30);
  const passwordField = usePasswordToggle();
  const [hasSent, setHasSent] = useState(false);

  const { mutate: loginMutate } = usePostData(API_ENDPOINTS.AUTH.LOGIN);

  const handleSendOtpTrigger = async () => {
    showAlert.loading("Sending", "Please wait");

    try {
      await api.post(API_ENDPOINTS.SEND_OTP, {
        email: formData.email,
        password: formData.password,
      });
      sendOtp(formData.email, formData.password);
      setHasSent(true);
    } catch (error) {
      console.log(error);
      showAlert.error("Error", error.response?.data?.message || "Failed");
    }
  };

  // const { data: isStatusLogin, refetch: fetchStatus } = useFetchData(
  //   "/api/loan/status",
  //   API_ENDPOINTS.APPLY_STATUS,
  //   { enabled: false },
  // );
  const onSigninSuccess = async () => {
    showAlert.loading("Verifying OTP...", "Please wait");

    if (!formData.otp) {
      showAlert.warning("Wait!", "Please enter the OTP sent to your email.");
      return;
    }

    loginMutate(formData, {
      onSuccess: (data) => {
        console.log("Mutation Data:", data);

        if (data?.status === "success") {
          const userData = {
            userId: data.userId,
            email: data.email,
            role: data.role,
            expiresAt: data.expiresAt,
          };

          sessionStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
          showAlert.success("Success!", "Logged in successfully!").then(() => {
            navigate("/");
          });
        } else {
          showAlert.error(
            "Error",
            data?.message || "Login was not successful.",
          );
        }
      },
      onError: (error) => {
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || "Something went wrong";
        const errorStatus = errorData?.status;

        if (errorStatus === "failed - OTP expired") {
          showAlert.error("Expired", "Your One Time Password has expired.");
        } else if (errorStatus === "failed - invalid OTP") {
          showAlert.error(
            "Invalid OTP",
            "Wrong One Time Password. Please try again.",
          );
        } else {
          showAlert.error("Login Failed", errorMessage);
        }
      },
    });
  };

  return (
    <div className="w-full max-w-lg flex flex-col gap-3 bg-slate-50 md:px-5 md:py-0 dark:bg-slate-950">
      <h2 className="text-center font-semibold text-2xl font-sans mb-3  text-stone-700 md:mb-5 dark:text-slate-50">
        Sign in to your account
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e, onSigninSuccess, {
            onError: () => showAlert.warning("Error!", "Wrong credential"),
          });
        }}
        className="flex flex-col gap-3 p-1"
      >
        <div>
          <Inputform
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={
              formErrors.email
                ? "input-error border-red-500 dark:border-red-500  "
                : ""
            }
          />
          {formErrors.email && (
            <span className="text-red-500 text-xs mt-1 dark:text-red-400">
              {formErrors.email}
            </span>
          )}
        </div>

        <div>
          <div
            className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
              formErrors.password
                ? "border-red-500  dark:border-red-500"
                : "border-gray-300 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 dark:focus-within:border-sky-400 dark:focus-within:ring-sky-400"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Inputform
                type={passwordField.type}
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent dark:text-slate-200  dark:placeholder:text-slate-400"
              />
              <div onClick={passwordField.toggle} className="cursor-pointer">
                {passwordField.show ? <Eye /> : <EyeClosed />}
              </div>
            </div>
          </div>
          {formErrors.password && (
            <span className="text-red-500 text-xs mt-1 dark:text-red-400">
              {formErrors.password}
            </span>
          )}
        </div>

        <div>
          <div
            className={`flex items-center border rounded-md px-3 transition-all duration-200 ${
              formErrors.otp
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 dark:focus-within:border-sky-400 dark:focus-within:ring-sky-400"
            }`}
          >
            <Inputform
              type="text"
              placeholder="Enter OTP(One time password)"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="!border-none !outline-none !ring-0 !focus:ring-0 !focus:outline-none w-full px-0 shadow-none bg-transparent dark:text-slate-200 dark:placeholder:text-slate-400"
            />
            <span className="text-stone-400 px-3">|</span>
            <button
              type="button"
              disabled={isCounting}
              onClick={handleSendOtpTrigger}
              className={`whitespace-nowrap text-sm font-semibold transition-colors duration-200 ${
                isCounting
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-sky-600 hover:text-sky-500 cursor-pointer dark:text-sky-400 dark:hover:text-sky-300"
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
            <span className="text-red-500 text-xs mt-1 dark:text-red-400">
              {formErrors.otp}
            </span>
          )}
        </div>
        <span className="text-sm text-center">
          <label className="text-slate-700 dark:text-slate-300">
            Forgot password?
          </label>
          <Link
            to="/forgot-password"
            className="text-sky-600 text-sm font-semibold hover:underline cursor-pointer underline ml-1"
          >
            Click here
          </Link>
        </span>
        <button
          type="submit"
          className="w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300"
        >
          Sign In
        </button>
      </form>
      <span className="text-sm text-center">
        <label className="text-slate-700 dark:text-slate-300">
          Don't have an account?
        </label>
        <Link
          to="/auth/register"
          className="text-sky-600 font-semibold hover:underline cursor-pointer underline dark:text-sky-400"
        >
          Register here
        </Link>
      </span>
    </div>
  );
}

export default SignIn;
