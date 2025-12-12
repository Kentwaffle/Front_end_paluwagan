import { StrictMode } from "react";
import React from "react";
import "./index.css";
// import App from './App.jsx'
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//landing
import PaluwaganMain from "./LandingPage/paluwaganMain";

//404
import Eror404 from "./Eror404/404";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <PaluwaganMain />,
    errorElement: <Eror404 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
