import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  base: "/mission-engage/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        mock: path.resolve(import.meta.dirname, "src/_mock/index.html"),
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  plugins: [react(), svgr()],
  preview: {
    host: true,
    allowedHosts: ["mateuszkubu.coconet.pl", "mateuszkmbp.coconet.pl"],
  },
});
