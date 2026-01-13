import { StrictMode } from "react";
import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { Navigate } from "react-router-dom";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//landing
import PaluwaganMain from "./LandingPage/paluwaganMain";
import SignIn from "./LandingPage/registrationComponents/SignIn";
import Register from "./LandingPage/registrationComponents/register";

//forgot pass
import ForgotPassword from "./LandingPage/registrationComponents/ForgotPassword";
import ChangePassword from "./LandingPage/registrationComponents/ChangePassword";

//Main
import Loan from "./Loan/Loan";
import Savings from "./Savings/Savings";
import Profile from "./Profile/Profile";

//404
import Eror404 from "./Eror404/404";

//OTP
import Otp from "./LandingPage/registrationComponents/Otp";

const queryClient = new QueryClient();

//Pagwalang token ibabalik nya sa main route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

//Pag meron token psok para smooth ang tete
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/loan" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <PaluwaganMain />
      </PublicRoute>
    ),
    children: [
      { path: "/", element: <SignIn /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/register/otp",
    element: <Otp />,
  },
  {
    path: "forgot-password",
    children: [
      { index: true, element: <ForgotPassword /> },
      { path: "changepassword", element: <ChangePassword /> },
    ],
  },
  {
    path: "/loan",
    element: (
      <ProtectedRoute>
        <Loan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/savings",
    element: (
      <ProtectedRoute>
        <Savings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Eror404 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
