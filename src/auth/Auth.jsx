import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../serviceToApi/ApiInstance";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";

const AuthContext = createContext();

function Auth({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const getDecodedToken = (t) => {
    try {
      return jwtDecode(t);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = getDecodedToken(token);
      if (decoded) {
        setUser(decoded);

        // Expiry Check Logic
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          setIsTokenExpired(true);
        } else {
          const delay = (decoded.exp - currentTime) * 1000;
          const timeout = setTimeout(() => setIsTokenExpired(true), delay);
          return () => clearTimeout(timeout);
        }
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const logout = async () => {
    try {
      await api.get(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      queryClient.clear();
      window.location.assign("/auth");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setToken, isTokenExpired, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an Auth Provider");
  }
  return context;
};
export default Auth;
