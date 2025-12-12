import React from "react";
import SignIn from "./registrationComponents/SignIn";
import Register from "./registrationComponents/register";
import { useState } from "react";

function paluwaganMain() {
  const [currentView, setCurrentView] = useState("signin");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const renderForm = () => {
    if (currentView === "signin") {
      return <SignIn />;
    } else if (currentView === "register") {
      return <Register />;
    }
    return null;
  };
  return (
    <div className="h-screen w-full flex flex-col items-center p-10">
      <div>This is the logo</div>
      <div className="flex gap-5 pt-5">
        <button
          className={`btn p-3 font-semibold transition duration-300 ${
            currentView === "signin"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleViewChange("signin")}
        >
          Sign In
        </button>
        <button
          className={`btn p-3 font-semibold transition duration-300 ${
            currentView === "register"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleViewChange("register")}
        >
          Register
        </button>
      </div>
      <div className="pt-5 w-full flex justify-center">{renderForm()}</div>
    </div>
  );
}

export default paluwaganMain;

export function InputForms(props) {
  const { type, placeholder, name, value, onChange } = props;

  return (
    <input
      className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
}
