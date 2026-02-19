import DatePicker from "react-datepicker";

const DatePickerField = ({
  label,
  name,
  value,
  onChange,
  error,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}

      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => {
          if (date) {
            const formatted = date.toISOString().split("T")[0];
            onChange({ target: { name, value: formatted } });
          }
        }}
        onKeyDown={(e) => e.preventDefault()}
        dateFormat="yyyy/dd/MM"
        placeholderText="YYYY/DD/MM"
        minDate={new Date()}
        // 1. Inuna natin ang default styles
        // 2. Ginamit ang `${className}` sa dulo para ito ang masunod (Override)
        className={`w-full border py-2.5 text-sm font-semibold text-center outline-none transition-all 
          ${error ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-sky-500 bg-gray-50/50"} 
          ${className ? className : "rounded-md"}`}
        {...props}
      />

      {error && <span className="text-red-500 text-[10px] ml-1">{error}</span>}
    </div>
  );
};
export default DatePickerField;
