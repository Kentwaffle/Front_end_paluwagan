import { StrictMode } from "react";
import React from "react";
import "./index.css";
// import App from './App.jsx'
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//landing
import PaluwaganMain from "./LandingPage/paluwaganMain";
import SignIn from "./LandingPage/registrationComponents/SignIn";
import Register from "./LandingPage/registrationComponents/register";

//forgot pass
import ForgotPassword from "./LandingPage/registrationComponents/ForgotPassword";
import ChangePassword from "./LandingPage/registrationComponents/ChangePassword";

//dashboard
import Dashboard from "./Dashboard/Dashboard";

//404
import Eror404 from "./Eror404/404";

import Otp from "./LandingPage/registrationComponents/Otp";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <PaluwaganMain />,
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
    path: "/dashboard",
    element: <Dashboard />,
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
