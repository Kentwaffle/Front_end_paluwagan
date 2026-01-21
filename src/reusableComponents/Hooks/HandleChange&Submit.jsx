import { useState, useEffect } from "react";

export const useForm = (initialValues, validateFunc) => {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  // useEffect(() => {
  //   if (initialValues && initialValues.firstName) {
  //     setFormData(initialValues);
  //   }
  // }, [initialValues?.firstName]); // Isa lang ay sapat na para magsilbing "signal"

  useEffect(() => {
    // Para sa Edit Profile (May firstName)
    if (initialValues && initialValues.firstName) {
      setFormData(initialValues);
    }
    // Para sa Loan/Other Forms (Walang firstName pero may initial values gaya ng startdate)
    else if (initialValues && initialValues.startdate && !formData.startdate) {
      setFormData((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);
  //Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === "borrow") {
      finalValue = value.replace(/\D/g, ""); // Numero lang
    }

    if (
      name.toLowerCase().includes("otp") ||
      name === "number" ||
      name === "phoneNumber"
    ) {
      const maxLength = name.toLowerCase().includes("otp") ? 6 : 11;
      finalValue = value.replace(/\D/g, "").slice(0, maxLength);
    }

    const newFormData = { ...formData, [name]: finalValue };
    setFormData(newFormData);

    const validationResults = validateFunc(newFormData);

    setFormErrors((prev) => ({
      ...prev,
      [name]: validationResults.errors[name] || "",
    }));
  };

  //Submit
  const handleSubmit = async (e, callback, extraChecks = {}) => {
    e.preventDefault();

    const { isValid, errors } = validateFunc(formData);

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    if (extraChecks.condition === false) {
      extraChecks.onError();
      return;
    }

    await callback();
    console.log("Success! Submitting formData...", formData);
  };

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    handleChange,
    handleSubmit,
  };
};
