import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";
import process from "node:process";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "build",
  },

  server: {
    port: 8080,
  },

  define: {
    "process.env": process.env,
  },
});
