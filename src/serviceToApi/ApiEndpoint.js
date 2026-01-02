export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  //   LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,

  RESEND_OTP: (userId) => `/api/auth/resend-email/${userId}`,
  VERIFY_OTP: (userId) => `/api/auth/otp/${userId}`,
};
