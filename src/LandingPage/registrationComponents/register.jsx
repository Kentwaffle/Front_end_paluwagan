import React from "react";
import { InputForms } from "../paluwaganMain";
import { useState } from "react";

function register() {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    number: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="w-full max-w-lg sm:p-10 p-10 flex flex-col gap-3 bg-white-300 shadow-lg rounded-lg">
      <h2 className="text-center">Register for Paluwagan</h2>

      <InputForms
        type="text"
        placeholder="Enter your username"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />

      <InputForms
        type="text"
        placeholder="first_name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
      />
      <InputForms
        type="text"
        placeholder="middle_name"
        name="middle_name"
        value={formData.middle_name}
        onChange={handleChange}
      />
      <InputForms
        type="text"
        placeholder="last_name"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
      />
      <InputForms
        type="email"
        placeholder="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <InputForms
        type="text"
        placeholder="number"
        name="number"
        value={formData.number}
        onChange={handleChange}
      />

      <InputForms
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <button className="mt-6 w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300">
        Register
      </button>
    </div>
  );
}

export default register;
