import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    "process.env": {},
  },
  server: {
    proxy: {
      "/api": {
        target: "http://54.251.224.183:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
