import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Inputform from "../../reusableComponents/Inputform";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { useOtpTimer } from "../../reusableComponents/Hooks/SendOTPhook";
import { useForm } from "../../reusableComponents/Hooks/HandleChange&Submit";

//API
import api from "../../serviceToApi/ApiInstance";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

function Otp() {
  const location = useLocation();
  const navigate = useNavigate();

  const { timer, isCounting, sendOtp } = useOtpTimer(30);
  const { formData, handleChange } = useForm({ otp: "" });
  const { email, userId } = location.state || {};

  useEffect(() => {
    console.log("Data from Navigation:", { email, userId });
    if (!userId) {
      showAlert.error(
        "Missing Info",
        "User ID not found. Please register again."
      );
    }
  }, [userId]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    showAlert.loading("Verifiying email", "Please wait");

    // if (otpValue.length < 6) {
    //   showAlert.error("Invalid Code", "Please enter the 6-digit code.");
    //   return;
    // }

    const payload = {
      otp: formData.otp,
    };

    console.log("Full URL:", API_ENDPOINTS.VERIFY_OTP(userId));
    console.log("Payload being sent:", payload);

    try {
      const response = await api.post(API_ENDPOINTS.VERIFY_OTP(userId), {
        otp: formData.otp,
      });

      if (response.status === 200) {
        const result = await showAlert.success(
          "Verified",
          "Please log in you account"
        );
        if (result.isConfirmed) navigate("/");
      }
    } catch (error) {
      const serverMessage = error.response?.data;

      showAlert.error(
        "Verification Failed",
        typeof serverMessage === "string"
          ? serverMessage
          : "Check console for details"
      );
    }
    console.log(userId);
  };

  const handleResend = async () => {
    showAlert.loading("Resending OTP", "Please wait");

    try {
      await api.post(API_ENDPOINTS.RESEND_OTP(userId), {
        email: email,
      });

      sendOtp(email, "Verified User");
      showAlert.success("OTP sent", "New OTP code has been sent successfully!");
    } catch (error) {
      showAlert.error(
        "Error",
        "OTP not send. Please try again after 30 seconds"
      );
    }
  };

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
          onClick={handleResend}
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
