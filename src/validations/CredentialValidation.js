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

  const phoneRegex = /^09\d{9}$/;
  if (!formData.phoneNumber) {
    errors.phoneNumber = "Mobile number is required";
  } else if (!formData.phoneNumber.startsWith("09")) {
    errors.phoneNumber = "Number must start 09";
  } else if (!phoneRegex.test(formData.phoneNumber)) {
    errors.phoneNumber = "Enter a valid 11-digit number";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Must be at least 8 characters";
  } else if (!/[A-Z]/.test(formData.password)) {
    errors.password = "Must contain at least one uppercase letter";
  } else if (!/[0-9]/.test(formData.password)) {
    errors.password = "Must contain at least one number";
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
  }

  if (!formData.otp) {
    errors.otp = "OTP is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const ValidateForgotPassword = (formData) => {
  let errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Invalid email format";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const ValidateChangePassword = (formData) => {
  let errors = {};
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Must be at least 8 characters";
  } else if (!/[A-Z]/.test(formData.password)) {
    errors.password = "Must contain at least one uppercase letter";
  } else if (!/[0-9]/.test(formData.password)) {
    errors.password = "Must contain at least one number";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirmpassword is required";
  }

  if (!formData.otp) {
    errors.otp = "OTP is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
