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
import Edit_Profile from "./Profile/Edit_Profile";
import ApplyLoan from "./Loan/ApplyLoan";
//404
import Eror404 from "./Eror404/404";

//OTP
import Otp from "./LandingPage/registrationComponents/Otp";

//API
import { jwtDecode } from "jwt-decode";
import { useFetchData } from "./serviceToApi/fetchData";
import { API_ENDPOINTS } from "./serviceToApi/ApiEndpoint";

//Loading
import { LoadingServer } from "./reusableComponents/loading";
import Error from "./reusableComponents/Error";

//Admin
import AdminPanel from "./Admin/AdminPanel";

const queryClient = new QueryClient();

//Pagwalang token ibabalik nya sa main
const ProtectedRoute = ({
  children,
  requireLoan = false,
  allowedRoles = ["ROLE_ADMIN"],
}) => {
  const token = localStorage.getItem("token");
  //Mga guard na ayaw mag papasok pag walang ID kala mo taga-pag mana ng school
  if (!token) return <Navigate to="/" replace />;

  const decodedTokenMain = jwtDecode(token);
  const roles = decodedTokenMain.role;
  if (!allowedRoles.includes(roles)) return <Navigate to="/" replace />;

  const {
    data: isStatus,
    loading: isLoading,
    error: isError,
  } = useFetchData("/api/loan/status", API_ENDPOINTS.APPLY_STATUS, {
    enabled: !!token && roles === "ROLE_USER",
  });

  if (roles === "ROLE_USER") {
    if (!isStatus || !isStatus.payload) {
      return <LoadingServer />;
    }
    if (isLoading) return <LoadingServer />;
    if (isError) return <Error error={isError} />;
    const hasActiveLoan = isStatus?.payload?.hasActiveLoan;
    const hasApproved = isStatus?.payload?.hasApprovedApplication;
    const currentPath = window.location.pathname;

    if (currentPath === "/apply_loan") {
      if (hasActiveLoan) return <Navigate to="/loan" replace />;
    }

    if (requireLoan) {
      if (hasApproved || hasActiveLoan) {
        return children;
      }
      return <Navigate to="/apply_loan" replace />;
    }
  }

  return <div className="route-wrapper">{children}</div>;
};

//Pag meron token psok para smooth ang tete
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/loan" replace />;
  }
  return <div className="route-wrapper">{children}</div>;
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
      <ProtectedRoute requireLoan={true} allowedRoles={["ROLE_USER"]}>
        <Loan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/savings",
    element: (
      <ProtectedRoute requireLoan={false} allowedRoles={["ROLE_USER"]}>
        <Savings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute requireLoan={false} allowedRoles={["ROLE_USER"]}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/edit_profile",
    element: (
      <ProtectedRoute requireLoan={false} allowedRoles={["ROLE_USER"]}>
        <Edit_Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "apply_loan",
    element: (
      <ProtectedRoute requireLoan={false} allowedRoles={["ROLE_USER"]}>
        <ApplyLoan />
      </ProtectedRoute>
    ),
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminPanel />
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
  </StrictMode>,
);
