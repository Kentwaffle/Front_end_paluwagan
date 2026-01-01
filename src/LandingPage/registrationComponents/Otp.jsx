import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Inputform from "../../reusableComponents/Inputform";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { useOtpTimer } from "../../reusableComponents/Hooks/SendOTPhook";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";
function Otp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState("");
  const { timer, isCounting, sendOtp } = useOtpTimer(30);
  const { formData, handleChange } = useForm({ otp: "" });

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtpValue(val);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otpValue.length < 6) {
      showAlert.error("Invalid Code", "Please enter the 6-digit code.");
      return;
    }

    if (otpValue === "123456") {
      const result = await showAlert.success(
        "Email verified!",
        "Your email has been successfully verified. Click OK to sign in."
      );

      if (result.isConfirmed) {
        navigate("/");
      }
    } else {
      showAlert.error("Wrong Code!", "Please check your inbox or spam");
    }

    console.log("Success Nega!", otpValue);
  };

  const email = location.state?.email || "your email";

  return (
    <div>
      <div className="flex flex-col m-5">
        <div className="w-full flex justify-end">
          <button>
            <Link to={"/register"} className="cursor-pointer  font-semibold">
              <X />
            </Link>
          </button>
        </div>
        <div className="flex gap-3 flex-col">
          <span className="text-xl font-semibold">
            Verify email via OTP(One time password)
          </span>
          <p>
            We sent a verification code to <b>{email}</b>
          </p>
        </div>
        <form onSubmit={handleVerifyOtp} className="mt-2 flex flex-col gap-3">
          <Inputform
            type="text"
            placeholder="I.E 123456"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-sky-500 text-white p-2 rounded hover:bg-sky-600 font-semibold"
          >
            Verify Code
          </button>
        </form>
        <button
          type="button"
          disabled={isCounting}
          onClick={() => sendOtp(email, "bypass-password")}
          className={`text-sm text-end py-2 font-semibold underline transition-colors ${
            isCounting
              ? "text-gray-400 cursor-not-allowed"
              : "text-sky-600 hover:text-sky-700"
          }`}
        >
          {!isCounting ? "Resend OTP" : `Resend again in ${timer}s`}
        </button>
      </div>
    </div>
  );
}

export default Otp;
