import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import Auth from "./auth/Auth";
import App from "./App";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Auth>
        <App />
      </Auth>
    </QueryClientProvider>
  </StrictMode>,
);
