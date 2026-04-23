import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../serviceToApi/ApiInstance";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

function Auth({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const queryClient = useQueryClient();

  const verifySession = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.VERIFY_SESSION);
      setUser(response.data);
      sessionStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Session invalid");
      setUser(null);
      sessionStorage.removeItem("user");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (window.location.pathname.startsWith("/auth")) {
        setIsLoadingAuth(false);
        return;
      }
      try {
        await verifySession();
      } catch (err) {
        console.error("No active session found.");
        setUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    initAuth();
  }, []);

  const logout = async () => {
    try {
      await api.get(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("user");
      setUser(null);
      queryClient.clear();
      window.location.assign("/auth");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoadingAuth }}>
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
