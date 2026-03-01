import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerField = ({
  label,
  name,
  value,
  onChange,
  error,
  minDate = new Date(), // Default sa current date
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && (
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          {label}
        </label>
      )}

      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => {
          if (date) {
            // Gamit ang local date formatting para hindi mag-shift ang timezone
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - offset * 60 * 1000);
            const formatted = localDate.toISOString().split("T")[0];

            onChange({ target: { name, value: formatted } });
          }
        }}
        onKeyDown={(e) => e.preventDefault()}
        dropdownMode="select"
        dateFormat="MMMM dd yyyy"
        minDate={minDate}
        // Pinagsamang classes para sa Modern Sky + Dark Mode look
        className={`
          w-full border py-2 text-sm rounded-md font-semibold text-center outline-none transition-all
          bg-gray-50 border-slate-300 text-slate-800
          focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:focus:border-sky-400
          ${error ? "border-red-500" : "border-slate-300"}
        `}
        calendarClassName="custom-calendar-style"
        popperClassName="z-50"
        placeholderText="Select Date"
        {...props}
      />

      {error && (
        <span className="text-xs text-red-500 font-medium ml-1 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
};

export default DatePickerField;
