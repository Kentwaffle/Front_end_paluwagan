import { useState, useEffect } from "react";

export const useForm = (initialValues, validateFunc) => {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // I-check kung may laman ang initialValues (halimbawa galing sa API fetch)
    const hasValues =
      initialValues && Object.values(initialValues).some((v) => v !== "");

    if (hasValues) {
      // Gumamit ng functional update para i-merge lang ang bago,
      // iwasan ang pag-overwrite kung nag-type na ang user
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
    // Gagamit tayo ng JSON.stringify para i-check kung "deeply equal" ang values
    // imbes na "reference" ng object.
  }, [JSON.stringify(initialValues)]);

  //Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === "loanAmount") finalValue = value.replace(/\D/g, "");

    if (value instanceof Date || name === "birthDay") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
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

    if (typeof validateFunc === "function") {
      const validationResults = validateFunc(newFormData);
      setFormErrors((prev) => ({
        ...prev,
        [name]: validationResults.errors[name] || "",
      }));
    }
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
  const noValidation = () => ({ isValid: true, errors: {} });
  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    handleChange,
    handleSubmit,
  };
};
