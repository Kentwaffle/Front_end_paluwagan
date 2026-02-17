import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";

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

export const ValidateOTP = (formData) => {
  let errors = {};
  if (!formData.otp) {
    errors.otp = "OTP is required";
  } else if (formData.otp.length < 6) {
    errors.otp = "OTP must be 6 digits";
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

export const ValidateEditProfile = (formData) => {
  let errors = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
  }
  const phoneRegex = /^09\d{9}$/;
  if (!formData.phoneNumber) {
    errors.phoneNumber = "Mobile number is required";
  } else if (!formData.phoneNumber.startsWith("09")) {
    errors.phoneNumber = "Number must start 09";
  } else if (!phoneRegex.test(formData.phoneNumber)) {
    errors.phoneNumber = "Enter a valid 11-digit number";
  }
  if (formData.newPassword && !formData.oldPassword) {
    errors.oldPassword = "Current password is required.";
  }
  if (!formData.newPassword && formData.oldPassword) {
    errors.newPassword = "New password is required.";
  }
  if (formData.newPassword && formData.newPassword.length < 8) {
    errors.newPassword = "New password must be at least 8 characters.";
  }

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

export const ValidateLoan = (formData) => {
  let errors = {};
  if (!formData.loanAmount) {
    errors.loanAmount = "Please enter the amount you want to borrow";
  } else if (formData.loanAmount > 20000) {
    errors.loanAmount = "20,000 is the maximum loan";
  } else if (formData.loanAmount < 1000) {
    errors.loanAmount = "1,000 is the minimun loan";
  }

  if (!formData.endDate.trim()) {
    errors.endDate = "Select loan end date";
  } else {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const diffInTime = end.getTime() - start.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    if (diffInDays < 7) {
      errors.endDate = "Loan period must be at least 7 days";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const ValidateSavings = (formData) => {
  let errors = {};
  if (!formData.targetAmount) {
    errors.targetAmount = "Please enter a target amount";
  } else if (formData.targetAmount < 5000) {
    errors.targetAmount = "Minimun target is 5000";
  }

  if (!formData.sourceOfFunds) {
    errors.sourceOfFunds = "Please select source of fund";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const ValidateSavingsDeposit = (formData) => {
  let errors = {};
  if (!formData.amountDeposit) {
    errors.amountDeposit = "Please enter a deposit amount";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
