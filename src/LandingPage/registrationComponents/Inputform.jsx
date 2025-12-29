import React from "react";

function Inputform(props) {
  const { type, placeholder, name, value, onChange, className } = props;

  return (
    <input
      className={`
        border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className || ""} 
      `}
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
}

export default Inputform;
