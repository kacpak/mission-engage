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
            port: 4000
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
        },
        server: {
          port: 4000,
        },
      },
);
