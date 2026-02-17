import { useState, useEffect } from "react";

export const useTodayDate = () => {
  const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [currentDate, setCurrentDate] = useState(getTodayDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(getTodayDate());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return currentDate;
};
