export const ValidateRegister = (formData) => {
  let errors = {};

  if (!formData.first_name.trim()) {
    errors.first_name = "First name is required";
  }

  if (!formData.last_name.trim()) {
    errors.last_name = "Last name is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  const phoneRegex = /^[0-9]{11}$/;
  if (!formData.number) {
    errors.number = "Mobile number is required";
  } else if (!phoneRegex.test(formData.number)) {
    errors.number = "Enter a valid 11-digit number";
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
