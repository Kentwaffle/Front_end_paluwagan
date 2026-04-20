import { useState, useEffect } from "react";

export const useCountdown = (expiryDate) => {
  const [timeLeft, setTimeLeft] = useState("00:00");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiryDate) return;

    const targetDate = new Date(expiryDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        setIsExpired(true);
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
      setIsExpired(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  return { timeLeft, isExpired };
};
