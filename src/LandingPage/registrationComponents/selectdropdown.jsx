import React from "react";

function selectdropdown(name, value, onChange, options, className) {
  return (
    <div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${className}`}
      >
        <option value="">None</option> {/* Default option */}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default selectdropdown;
