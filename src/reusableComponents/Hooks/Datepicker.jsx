import DatePicker from "react-datepicker";

const DatePickerField = ({
  label,
  name,
  value,
  onChange,
  error,
  className,
  minDate, // 1. Idagdag ito bilang prop
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {/* ... existing label code ... */}

      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => {
          if (date) {
            const formatted = date.toISOString().split("T")[0];
            onChange({ target: { name, value: formatted } });
          }
        }}
        onKeyDown={(e) => e.preventDefault()}
        dateFormat="yyyy/MM/dd"
        placeholderText="yyyy/mm/dd"
        minDate={minDate}
        className={
          "w-full border py-2 text-sm font-semibold text-center outline-none transition-all rounded-lg border-slate-300 shadow-sm"
        }
        {...props}
      />
      {/* ... existing error code ... */}
    </div>
  );
};
export default DatePickerField;
