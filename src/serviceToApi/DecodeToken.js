import { jwtDecode } from "jwt-decode";

export const decodeToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    return (decoded.hasLoan && decoded.hasLoan) || false;
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};
