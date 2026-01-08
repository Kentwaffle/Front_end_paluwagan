export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,

  SEND_OTP: `${BASE_URL}/api/auth/login-send-otp`,
  RESEND_OTP: (userId) => ` ${BASE_URL}/api/auth/resend-email/${userId}`,
  VERIFY_OTP: (userId) => `/api/auth/otp/${userId}`,

  FORGOT_PASSWORD_OTP: `${BASE_URL}/api/auth/forgot-password`,
  VERIFY_OTP_FORGOT_PASSWORD: `${BASE_URL}/api/auth/verify-forgotPass`,
};
