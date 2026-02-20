import { StrictMode } from "react";
import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { Navigate, useLocation } from "react-router-dom";
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
import MainLayout from "./MainComponents/MainLayout";
//Loan
import Loan from "./Loan/Loan";
import ApplyLoan from "./Loan/ApplyLoan";
import PendingStatus from "./Loan/PendingStatus";

//Profile
import Profile from "./Profile/Profile";
import Edit_Profile from "./Profile/Edit_Profile";

//Savings
import Savings from "./Savings/Savings";
import Apply_savings from "./Savings/Apply_savings";
import SavingsPayment from "./Savings/SavingsPayment";

//404
import Eror404 from "./Eror404/404";

//OTP
import Otp from "./LandingPage/registrationComponents/Otp";

//API
import { useFetchData } from "./serviceToApi/fetchData";
import { API_ENDPOINTS } from "./serviceToApi/ApiEndpoint";

//Loading
import { LoadingServer } from "./reusableComponents/loading";
import Error from "./reusableComponents/Error";

//Admin
import Loan_management from "./Admin/Loan_management";
import Saving_management from "./Admin/SavingsAdmin/Saving_management";
//SSE
import { useLoanSSE } from "./reusableComponents/Hooks/SSE";
//Auth
import { useAuth } from "./auth/Auth";
import Auth from "./auth/Auth";

const queryClient = new QueryClient();

const UserIndexRedirect = ({ isStatus }) => {
  const payload = isStatus?.payload;
  if (!payload) return <LoadingServer />;

  if (payload.hasApprovedApplication) return <Navigate to="/loan" replace />;
  if (payload.hasPendingApplication)
    return <Navigate to="/pending_status" replace />;
  return <Navigate to="/apply_loan" replace />;
};

//Pagwalang token ibabalik nya sa main
const ProtectedRoute = ({ children, userRole, isStatus, isStatusLoading }) => {
  const location = useLocation();
  if (isStatusLoading) return <LoadingServer />;
  if (!userRole) return <Navigate to="/auth" replace />;
  if (userRole === "ROLE_ADMIN") return children;

  const payload = isStatus?.payload;
  const currentPath = location.pathname;
  console.log("Gatekeeper checking path:", currentPath);

  // Kung wala pang payload data, wag munang papasukin sa kahit anong path
  if (!payload && userRole === "ROLE_USER") return <LoadingServer />;

  if (userRole === "ROLE_USER") {
    // Approved User logic
    if (payload.hasApprovedApplication) {
      if (["/apply_loan", "/pending_status"].includes(currentPath)) {
        return <Navigate to="/loan" replace />;
      }
    }
    // Pending User logic
    else if (payload.hasPendingApplication) {
      if (["/apply_loan", "/loan", "/"].includes(currentPath)) {
        return <Navigate to="/pending_status" replace />; // <--- DITO PALANG, SIPA NA AGAD!
      }
    }
    // New User logic
    else {
      if (["/loan", "/pending_status"].includes(currentPath)) {
        return <Navigate to="/apply_loan" replace />;
      }
    }

    //Savings\
    if (currentPath === "/savings" || currentPath === "/apply_savings") {
      if (payload.hasSavingsAccount) {
        if (currentPath === "/apply_savings")
          return <Navigate to="/savings" replace />;
      } else {
        if (currentPath === "/savings")
          return <Navigate to="/apply_savings" replace />;
      }
    }
  }

  return children;
};

const PublicRoute = ({ children, userRole }) => {
  if (userRole) {
    // Kung naka-login na at pilit pumasok sa Login page, i-redirect base sa role
    const destination =
      userRole === "ROLE_ADMIN" ? "/admin/loan_management" : "/loan";
    return <Navigate to={destination} replace />;
  }
  return children;
};

const Main = () => {
  const { user, isTokenExpired, token } = useAuth();
  const roles = user?.role;
  useLoanSSE(!!token);

  const { data: isStatus, loading: isStatusLoading } = useFetchData(
    "/api/user/status",
    API_ENDPOINTS.STATUS,
    { enabled: !!token && roles === "ROLE_USER" },
  );

  const router = createBrowserRouter([
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
    // USER ROUTES
    {
      path: "/",
      element: (
        <ProtectedRoute
          userRole={roles}
          isStatus={isStatus}
          isStatusLoading={isStatusLoading}
        >
          <MainLayout isStatus={isStatus} isStatusLoading={isStatusLoading} />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element:
            roles === "ROLE_ADMIN" ? (
              <Navigate to="/admin/loan_management" replace />
            ) : (
              <UserIndexRedirect isStatus={isStatus} />
            ),
        },

        { path: "profile", element: <Profile /> },
        { path: "profile/edit_profile", element: <Edit_Profile /> },

        { path: "loan", element: <Loan /> },
        { path: "apply_loan", element: <ApplyLoan /> },
        { path: "pending_status", element: <PendingStatus /> },
        //Savings
        {
          path: "savings",
          // Pwede mong lagyan ng Layout dito kung gusto mo may common header ang savings pages
          children: [
            { index: true, element: <Savings /> }, // Ito yung /savings
            { path: "apply_savings", element: <Apply_savings /> }, // Ito yung /savings/apply
            { path: "savings_payments", element: <SavingsPayment /> }, // Ito yung /savings/payments
          ],
        },

        // { path: "savings", element: <Savings /> },
        // { path: "apply_savings", element: <Apply_savings /> },
        // { path: "savings/savings_payments", element: <SavingsPayment /> },
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
        { path: "savings_management", element: <Saving_management /> },
      ],
    },
    { path: "*", element: <Eror404 /> },
  ]);

  return (
    <div className="relative">
      <RouterProvider router={router} />

      {/* Dito papasok yung blurred pop-up */}
      {isTokenExpired && (
        <Error error={{ response: { data: { error: "EXPIRED_TOKEN" } } }} />
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Auth>
        <Main />
      </Auth>
    </QueryClientProvider>
  </StrictMode>,
);
