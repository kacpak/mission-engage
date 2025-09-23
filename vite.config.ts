import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) =>
  mode === "client"
    ? {
        base: "./",
        build: {
          rollupOptions: {
            input: {
              main: path.resolve(import.meta.dirname, "index.html"),
              mock: path.resolve(import.meta.dirname, "mock-index.html"),
              admin: path.resolve(import.meta.dirname, "admin.html"),
            },
            output: {
              dir: "./dist/static",
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
        server: {
          proxy: {
            "/api": "http://localhost:4123",
          },
        },
      }
    : {
        cacheDir: "node_modules/.vite-backend",
        build: {
          emptyOutDir: false,
          entry: "./src/index.ts",
          outDir: "./dist",

          target: "node22",
          rollupOptions: {
            input: "./src/server/index.ts",
            output: {
              entryFileNames: "[name].js",
            },
            external: [/node_modules/, /bun:/, /node:/],
          },
          optimizeDeps: {
            exclude: [/bun:/, /node:/],
          },
          minify: false,
        },
      },
);
