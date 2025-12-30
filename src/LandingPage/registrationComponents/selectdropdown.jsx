import React from "react";

function SelectDropdown({ name, value, onChange, options, className }) {
  return (
    <div className="form-control w-full ">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          className || ""
        }`}
      >
        <option value="" disabled>
          Select Suffix
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectDropdown;
