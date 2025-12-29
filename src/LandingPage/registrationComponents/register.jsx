import React from "react";
import Inputform from "./Inputform";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import TermsModal from "../termModal";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    email: "",
    number: "",
    password: "",
  });
  // const modalRef = useRef(null);

  // const openTermsModal = () => {
  //   if (modalRef.current) {
  //     modalRef.current.showModal();
  //   }
  // };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="w-full max-w-lg sm:p-10 py-5 flex flex-col gap-3 bg-white-300 sm:shadow-lg sm:rounded-lg">
      <h2 className="text-center font-semibold text-xl font-sans">
        Register for Paluwagan
      </h2>

      <h3>First name</h3>
      <Inputform
        type="text"
        placeholder="i.e Juan"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
      />

      <h3>Middle name</h3>
      <Inputform
        type="text"
        placeholder="i.e. Garcia"
        name="middle_name"
        value={formData.middle_name}
        onChange={handleChange}
      />

      <h3>Last name</h3>
      <Inputform
        type="text"
        placeholder="i.e. Dela Cruz"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
      />

      <h3>Suffix</h3>
      <select
        name="suffix"
        value={formData.suffix}
        onChange={handleChange}
        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">Optional</option>
        <option value="Jr.">Jr. (Junior)</option>
        <option value="Sr.">Sr. (Senior)</option>
        <option value="II">II</option>
        <option value="III">III</option>
        <option value="IV">IV</option>
      </select>

      <h3>Phone number</h3>
      <Inputform
        type="text"
        placeholder="0912 345 6789"
        name="number"
        value={formData.number}
        onChange={handleChange}
      />

      <h3>Email address</h3>
      <Inputform
        type="email"
        placeholder="example@email.com"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <h3>Password</h3>
      <Inputform
        type="password"
        placeholder="Minimun 8 characters"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      {/* <div className="flex gap-1 justify-center">
        <a
          className="underline text-center text-blue-600 hover:text-blue-800 transition duration-150"
          onClick={openTermsModal}
        >
          Read terms and conditions
        </a>
      </div> */}
      <span className="text-sm  pl-2 text-center">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-sky-600 font-semibold hover:underline cursor-pointer underline"
        >
          Sign in here
        </Link>
      </span>
      <button className="w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300">
        Register
      </button>

      {/* 
      <TermsModal ref={modalRef} /> */}
    </div>
  );
}

export default Register;
