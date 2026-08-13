import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_PROXY_TARGET || env.VITE_API_BASE_URL || "http://localhost:8080";

  return {
    plugins: [tailwindcss(), react()],
    define: {
      "process.env": {},
      global: "window",
    },
    server: {
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
        },
        "/ws": {
          target,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
