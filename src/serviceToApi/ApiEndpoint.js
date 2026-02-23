export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,

  SEND_OTP: `${BASE_URL}/api/auth/login-send-otp`,
  RESEND_OTP: (userId) => `/api/auth/resend-email/${userId}`,
  VERIFY_OTP: (userId) => `/api/auth/otp/${userId}`,

  FORGOT_PASSWORD_OTP: `${BASE_URL}/api/auth/forgot-password`,
  VERIFY_OTP_FORGOT_PASSWORD: `${BASE_URL}/api/auth/verify-forgotPass`,

  STATUS: `${BASE_URL}/api/user/status`,

  PROFILE_GET: `${BASE_URL}/api/profile/info`,
  PROFILE_POST: `${BASE_URL}/api/profile/update`,

  LOAN_GET: `${BASE_URL}/api/loan/user-details`,
  APPLY_LOAN: `${BASE_URL}/api/loan/calculate-loan`,
  APPLY_LOAN_POST: `${BASE_URL}/api/loan/apply-loan`,
  APPLICATION_DETAILS: `${BASE_URL}/api/loan/status/details`,
  ADMIN_CHANGE_STATUS: `${BASE_URL}/api/admin/loan/change-status`,
  GET_PAYMENT: `${BASE_URL}/api/loan/payment/filter`,

  ADMIN_PENDING: `${BASE_URL}/api/admin/loan/pending`,
  ADMIN_APPROVED: `${BASE_URL}/api/admin/loan/approve`,
  ADMIN_REJECTED: `${BASE_URL}/api/admin/loan/rejected`,
  ADMIN_COUNT: `${BASE_URL}/api/admin/loan/status-counts`,
  SSE: `${BASE_URL}/api/loan/updates`,

  APPLY_SAVINGS: `${BASE_URL}/api/savings/apply`,
  SAVINGS_DEPOSIT: `${BASE_URL}/api/savings/remit`,
  SAVINGS_DETAILS: `${BASE_URL}/api/savings/summary`,
  SAVINGS_OFFSET: `${BASE_URL}/api/savings/withdraw`,
  SAVINGS_PAYMENT_FILTER: `${BASE_URL}/api/savings/payment/filter`,
  SAVINGS_ADMIN_MEMBERS: `${BASE_URL}/api/admin/savings/members`,
  SAVINGS_MEMBER_URL: `${BASE_URL}/api/admin/savings/members/{savingsId}`,
  SAVINGS_FILTER_APPROVED: `${BASE_URL}/api/admin/savings/payment/filter/{savingsId}`,
  SAVINGS_ACCEPT_PAYMENT: `${BASE_URL}/api/admin/savings/payment`,

  LOGOUT: `${BASE_URL}/api/auth/logout`,
};
