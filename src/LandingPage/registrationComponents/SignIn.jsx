import React from "react";
import Inputform from "./Inputform";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Ina-update nito kung anong input ang binabago
    }));
  };

  return (
    <div className="w-full max-w-lg mt-10 sm:p-10  flex flex-col gap-3 bg-white-300 sm:shadow-lg sm:rounded-lg">
      <h2 className="text-center font-semibold text-xl font-sans mb-3">
        Sign in to your account
      </h2>

      <Inputform
        type="email"
        placeholder="Enter your email"
        name="username"
        value={formData.email}
        onChange={handleChange}
      />

      <Inputform
        type="password"
        placeholder="Enter your password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <span className="text-sm pl-2">
        Dont have an account?{" "}
        <Link
          to="/register"
          className="text-sky-600 font-semibold hover:underline cursor-pointer underline"
        >
          Register here
        </Link>
      </span>

      <button className="mt-2 w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300">
        Sign In
      </button>
    </div>
  );
}

export default SignIn;
