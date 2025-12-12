import React from "react";
import { InputForms } from "../paluwaganMain";
import { useState } from "react";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <div className="w-full max-w-lg sm:p-10 p-10 flex flex-col gap-3 bg-white-300 shadow-lg rounded-lg">
      <h1>Welcome Back</h1>
      <h2>Sign in to your account</h2>

      <InputForms
        type="text"
        placeholder="Enter your username"
        name="username"
        // value={formData.email}
        // onChange={handleChange}
      />

      <InputForms
        type="password"
        placeholder="Enter your password"
        name="password"
        // value={formData.email}
        // onChange={handleChange}
      />

      <button className="mt-6 w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300">
        Sign In
      </button>
    </div>
  );
}

export default SignIn;
