import { useState } from "react";

export const useForm = (initialValues, validateFunc) => {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  //Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

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

// const handleRegister = (e) => {
//   e.preventDefault();
//   const { isValid, errors } = ValidateRegister(formData);

//   if (!isValid) {
//     setFormErrors(errors);
//     return;
//   }

//   if (!isAccepted) {
//     showAlert.warning(
//       "Terms & Conditions",
//       "Kailangan mo munang basahin at tanggapin ang aming Terms and Conditions bago makapag-register."
//     );
//     return;
//   }
//   showAlert
//     .success(
//       "Submitted!",
//       `We will send a One-Time Password (OTP) to <b>${formData.email}</b>. Please check your inbox`
//     )
//     .then((result) => {
//       if (result.isConfirmed) {
//         console.log("Succes! Redirecting to OTP");

//         navigate("/Otp", { state: { email: formData.email } });
//       }
//     });
//   console.log("Success! Submitting formData...", formData);
// };
