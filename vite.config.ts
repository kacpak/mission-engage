import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import hono from "@hono/vite-build/node";
import honoDevServer from "@hono/vite-dev-server";

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
            "/api": "http://localhost:3000",
          },
        },
      }
    : {
        cacheDir: "node_modules/.vite-backend",
        plugins: [
          hono({
            entry: "./src/server/index.ts",
            port: 4123,
          }),
          honoDevServer({
            entry: "./src/server/index.ts",
          }),
        ],
        build: {
          target: "node22",
          rollupOptions: {
            external: /node_modules/,
          },
          minify: false,
        },
        server: {
          port: 3000,
        },
      },
);
