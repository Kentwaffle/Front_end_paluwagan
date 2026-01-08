import { useState, useEffect } from "react";
import { showAlert } from "../Alerts/SweetAlerts";

export const useOtpTimer = (initialTime = 30) => {
  const [timer, setTimer] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsCounting(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = (email, password = "bypass") => {
    if (isCounting) return;

    if (!email?.trim() || !password?.trim()) {
      showAlert.warning("Error!", "Please enter required information");
      return;
    }

    setTimer(initialTime);
    setIsCounting(true);

    showAlert.success(
      "Sent successfully!",
      `One-time password was sent to <b>${email}</b>. Please check your inbox or spam`
    );

    return true;
  };

  return { timer, isCounting, sendOtp };
};
