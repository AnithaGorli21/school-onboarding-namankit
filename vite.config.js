// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // When deployed inside Liferay, set the base path if needed:
  // base: "/o/school-registration/",
  server: {
    port: 5001,
    proxy: {
      // ── Object Definition APIs (your form data) ──────────
      "/o/c": {
        target: "https://mahadbt2-uat-dashboard.quantela.com",
        changeOrigin: true,
        secure: false,       // allow self-signed certs on UAT
      },

      // ── Headless Delivery API (file uploads) ─────────────
      // Required by src/api/upload.js for uploading to Documents & Media
      "/o/headless-delivery": {
        target: "https://mahadbt2-uat-dashboard.quantela.com",
        changeOrigin: true,
        secure: false,
      },

      // ── Headless Admin (optional — for site listing) ──────
      "/o/headless-admin-user": {
        target: "https://mahadbt2-uat-dashboard.quantela.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});