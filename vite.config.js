// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5001,
      historyApiFallback: true,
    proxy: {
      // ── Object Definition APIs (form data) ───────────────
      "/o/c": {
        target: "https://mahadbt2-qa-dashboard.quantela.com",
        changeOrigin: true,
        secure: false,
      },
      // ── Headless Delivery API (file uploads) ─────────────
      "/o/headless-delivery": {
        target: "https://mahadbt2-qa-dashboard.quantela.com",
        changeOrigin: true,
        secure: false,
      },
      // ── Headless Admin User ───────────────────────────────
      "/o/headless-admin-user": {
        target: "https://mahadbt2-qa-dashboard.quantela.com",
        changeOrigin: true,
        secure: false,
      },
      // ── Headless Admin List Type (Picklists) ──────────────
      // Required for getPicklist() — Standard/Grade, Ownership etc.
      "/o/headless-admin-list-type": {
        target: "https://mahadbt2-qa-dashboard.quantela.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});