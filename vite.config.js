// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // When deployed inside Liferay, set the base path if needed:
  // base: "/o/school-registration/",
  server: {
    port: 5001,
    // Proxy Liferay API calls to avoid CORS during local dev
    proxy: {
      "/o/c": {
        target: "https://mahadbt2-qa-dashboard.quantela.com",
        // ← your Liferay URL
        changeOrigin: true,
        credentials: true,
      },
    },
  },
});
