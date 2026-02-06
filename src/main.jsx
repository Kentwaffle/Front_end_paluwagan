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
import MainLayout from "./MainComponents/MainLayout";
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
import Loan_management from "./Admin/Loan_management";

const queryClient = new QueryClient();

// 1. RoleBasedRedirect (Keep your updated version)
const RoleBasedRedirect = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/auth" replace />;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;
    const currentPath = window.location.pathname;

    if (userRole === "ROLE_ADMIN") {
      if (!currentPath.startsWith("/admin"))
        return <Navigate to="/admin/loan_management" replace />;
    } else if (userRole === "ROLE_USER") {
      if (currentPath === "/" || currentPath === "/auth")
        return <Navigate to="/loan" replace />;
    }
  } catch (err) {
    return <Navigate to="/auth" replace />;
  }
  return null;
};

//Pagwalang token ibabalik nya sa main
const ProtectedRoute = ({ children, userRole, isStatus, isStatusLoading }) => {
  if (isStatusLoading) return <LoadingServer />;
  if (!userRole) return <Navigate to="/auth" replace />;
  if (userRole === "ROLE_ADMIN") return children;

  if (userRole === "ROLE_USER") {
    const hasActiveLoan =
      isStatus?.payload?.hasApprovedApplication ||
      isStatus?.payload?.hasPendingApplication;
    const currentPath = window.location.pathname;

    if (hasActiveLoan && currentPath.includes("/apply_loan"))
      return <Navigate to="/loan" replace />;
    if (!hasActiveLoan && currentPath.includes("/loan"))
      return <Navigate to="/apply_loan" replace />;
  }
  return children;
};
// const ProtectedRoute = ({
//   children,
//   requireLoan = false,
//   allowedRoles = [],
// }) => {
//   const token = localStorage.getItem("token");
//   //Mga guard na ayaw mag papasok pag walang ID kala mo taga-pag mana ng school
//   if (!token) return <Navigate to="/auth" replace />;

//   const decodedTokenMain = jwtDecode(token);
//   const roles = decodedTokenMain.role;
//   // if (!allowedRoles.includes(roles)) return <Navigate to="/auth" replace />;
//   if (allowedRoles.length > 0 && !allowedRoles.includes(roles)) {
//     return <Navigate to="/auth" replace />;
//   }
//   const isUser = roles === "ROLE_USER";
//   const {
//     data: isStatus,
//     loading: isLoading,
//     error: isError,
//   } = useFetchData("/api/loan/status", API_ENDPOINTS.APPLY_STATUS, {
//     enabled: !!token && isUser, // DITO LANG DAPAT
//   });

//   if (!isUser) {
//     if (!isStatus || !isStatus.payload) {
//       return <LoadingServer />;
//     }
//     if (isLoading) return <LoadingServer />;
//     if (isError) return <Error error={isError} />;
//     const hasActiveLoan = isStatus?.payload?.hasActiveLoan;
//     const hasApproved = isStatus?.payload?.hasApprovedApplication;
//     const currentPath = window.location.pathname;

//     if (currentPath === "/apply_loan") {
//       if (hasActiveLoan) return <Navigate to="/loan" replace />;
//     }

//     if (requireLoan) {
//       if (hasApproved || hasActiveLoan) {
//         return children;
//       }
//       return <Navigate to="/apply_loan" replace />;
//     }
//   }

//   return <div className="route-wrapper">{children}</div>;
// };

//Pag meron token psok para smooth ang tete
// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     const decoded = jwtDecode(token);
//     // Diretsong redirect na dito, huwag nang dumaan sa ibang component
//     const target =
//       decoded.role === "ROLE_ADMIN" ? "/admin/loan_management" : "/loan";
//     return <Navigate to={target} replace />;
//   }

//   return <div className="route-wrapper">{children}</div>;
// };
const PublicRoute = ({ children, userRole }) => {
  if (userRole) {
    // Kung naka-login na at pilit pumasok sa Login page, i-redirect base sa role
    const destination =
      userRole === "ROLE_ADMIN" ? "/admin/loan_management" : "/loan";
    return <Navigate to={destination} replace />;
  }
  return children;
};
const App = () => {
  const token = localStorage.getItem("token");
  let roles = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      roles = decoded.role;
    } catch (e) {
      localStorage.removeItem("token");
    }
  }

  const { data: isStatus, loading: isStatusLoading } = useFetchData(
    "/api/loan/status",
    API_ENDPOINTS.APPLY_STATUS,
    { enabled: !!token && roles === "ROLE_USER" },
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RoleBasedRedirect />,
    },
    {
      path: "/auth",
      element: (
        <PublicRoute userRole={roles}>
          <PaluwaganMain />
        </PublicRoute>
      ),
      children: [
        { index: true, element: <SignIn /> },
        { path: "register", element: <Register /> },
      ],
    },
    { path: "/register/otp", element: <Otp /> },
    {
      path: "forgot-password",
      children: [
        { index: true, element: <ForgotPassword /> },
        { path: "changepassword", element: <ChangePassword /> },
      ],
    },
    // ADMIN ROUTES
    {
      path: "/admin",
      element: (
        <ProtectedRoute userRole={roles} isStatusLoading={false}>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="loan_management" replace /> },
        { path: "loan_management", element: <Loan_management /> },
      ],
    },
    // USER ROUTES
    {
      path: "/",
      element: (
        <ProtectedRoute
          userRole={roles}
          isStatus={isStatus}
          isStatusLoading={isStatusLoading}
        >
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "loan", element: <Loan /> },
        { path: "savings", element: <Savings /> },
        { path: "profile", element: <Profile /> },
        { path: "profile/edit_profile", element: <Edit_Profile /> },
        { path: "apply_loan", element: <ApplyLoan /> },
      ],
    },
    { path: "*", element: <Eror404 /> },
  ]);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
