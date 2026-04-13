// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // When deployed inside Liferay, set the base path if needed:
  // base: "/o/school-registration/",
  server: {
    port: 3000,
    // Proxy Liferay API calls to avoid CORS during local dev
    proxy: {
      "/o/c": {
        target: "http://localhost:8080",  // ← your Liferay URL
        changeOrigin: true,
        credentials: true,
      },
    },
  },
});
