export const ValidateRegister = (formData) => {
  let errors = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  const phoneRegex = /^[0-9]{11}$/;
  if (!formData.phoneNumber) {
    errors.phoneNumber = "Mobile number is required";
  } else if (!phoneRegex.test(formData.phoneNumber)) {
    errors.phoneNumber = "Enter a valid 11-digit number";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Must be at least 8 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const ValidateLogIn = (formData) => {
  let errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Must be at least 8 characters";
  }

  if (!formData.otp) {
    errors.otp = "OTP is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
