import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Inputform from "../../reusableComponents/Inputform";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";

function Otp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

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

  React.useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = () => {
    setTimer(30);
    setCanResend(false);
    showAlert.success(
      "Sent!",
      "New code sent. Please check your inbox or spam"
    );
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
          <span>Verify email via OTP(One time password)</span>
          <p>
            We sent a verification code to <b>{email}</b>
          </p>
        </div>
        <form onSubmit={handleVerifyOtp} className="mt-2 flex flex-col gap-3">
          <Inputform
            type="text"
            placeholder="I.E 123456"
            name="otp"
            value={otpValue}
            onChange={handleOtpChange}
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
          disabled={!canResend}
          onClick={handleResendOtp}
          className="text-stone-600 font-medium underline w-full flex justify-end mt-3"
        >
          {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
        </button>
      </div>
    </div>
  );
}

export default Otp;
