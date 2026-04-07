import React from "react";

const RadioField = ({ options, name, value, onChange, label, error }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 ml-1">
          {label}
        </label>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              className={`
                relative flex items-center justify-between p-4 cursor-pointer rounded-2xl border-2 transition-all duration-200
                ${
                  isSelected
                    ? "border-sky-500 bg-sky-50/50 dark:bg-sky-900/20 ring-4 ring-sky-500/10"
                    : "border-slate-100 bg-white dark:bg-slate-800 dark:border-slate-700 hover:border-slate-200"
                }
              `}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={onChange}
                className="hidden" // Itatago natin yung default radio para custom UI
              />

              <div className="flex items-center gap-1">
                {option.icon && (
                  <div
                    className={`p-2 rounded-lg ${isSelected ? "text-sky-600" : "text-slate-400"}`}
                  >
                    {option.icon}
                  </div>
                )}
                <span
                  className={`font-bold text-sm ${isSelected ? "text-sky-700 dark:text-sky-400" : "text-slate-500"}`}
                >
                  {option.label}
                </span>
              </div>

              {/* Custom Check Indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? "border-sky-500 bg-sky-500" : "border-slate-200"
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <span className="text-red-500 text-xs font-medium ml-1">{error}</span>
      )}
    </div>
  );
};

export default RadioField;
