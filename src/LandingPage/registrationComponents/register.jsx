import React from "react";
import Inputform from "./Inputform";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import TermsModal from "../termModal";
import SelectDropdown from "./selectdropdown";
import { ValidateRegister } from "../../validations/signInValidation";
import { Eye } from "lucide-react";
import { EyeClosed } from "lucide-react";

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
  const modalRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});

  const openTermsModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    const finalValue =
      name === "number" ? value.replace(/\D/g, "").slice(0, 11) : value;
    setFormData((prevData) => ({ ...prevData, [name]: finalValue }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();
    const { isValid, errors } = ValidateRegister(formData);

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    console.log("Success! Submitting data...", formData);
  };

  return (
    <div className="w-full max-w-lg sm:p-10 py-5 flex flex-col gap-3 bg-white-300 sm:shadow-lg sm:rounded-lg">
      <h2 className="text-center font-semibold text-xl font-sans">
        Register for Paluwagan
      </h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span>First name</span>
          <Inputform
            type="text"
            placeholder="i.e Juan"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={
              formErrors.first_name ? "input-error border-red-500" : ""
            }
          />
          {formErrors.first_name && (
            <span className="text-red-500 text-xs mt-1">
              {formErrors.first_name}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span>Middle name</span>
          <Inputform
            type="text"
            placeholder="i.e. Garcia"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <span>Last name</span>
          <Inputform
            type="text"
            placeholder="i.e. Dela Cruz"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={formErrors.last_name ? "input-error border-red-500" : ""}
          />
          {formErrors.last_name && (
            <span className="text-red-500 text-xs mt-1">
              {formErrors.last_name}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span>Suffix</span>
          <SelectDropdown
            name="suffix"
            value={formData.suffix}
            onChange={handleChange}
            options={["Jr.", "Sr.", "II", "III", "IV"]}
            className={formErrors.suffix ? "input-error border-red-500" : ""}
          />
          {formErrors.first_name && (
            <span className="text-red-500 text-xs mt-1">
              {formErrors.suffix}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span>Phone number</span>
          <Inputform
            type="text"
            placeholder="0912 345 6789"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className={formErrors.number ? "input-error border-red-500" : ""}
          />
          {formErrors.number && (
            <span className="text-red-500 text-xs mt-1">
              {formErrors.number}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span>Email address</span>
          <Inputform
            type="email"
            placeholder="example@email.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={formErrors.email ? "input-error border-red-500" : ""}
          />
          {formErrors.first_name && (
            <span className="text-red-500 text-xs mt-1">
              {formErrors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span>Password</span>
          <Inputform
            type="password"
            placeholder="Minimun 8 characters"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={formErrors.password ? "input-error border-red-500" : ""}
          />
          <Eye />
          {formErrors.first_name && (
            <span className="text-red-500 text-xs mt-1">
              {formErrors.password}
            </span>
          )}
        </div>

        {/* Terms */}
        <span className="flex gap-1 justify-center items-center">
          <input
            type="checkbox"
            defaultChecked
            className="checkbox  checkbox-sm"
          />
          <a
            className="underline text-center text-sky-300 hover:text-sky-400 transition duration-150"
            onClick={openTermsModal}
          >
            Please read our Terms and Conditions
          </a>
        </span>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-sky-500 font-semibold p-2 rounded shadow-sm hover:bg-sky-600 transition duration-300"
        >
          Register
        </button>
      </form>

      <span className="text-sm  pl-2 text-center">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-sky-600 font-semibold hover:underline cursor-pointer underline"
        >
          Sign in here
        </Link>
      </span>

      {/* renderTerm */}
      <TermsModal ref={modalRef} />
    </div>
  );
}

export default Register;
