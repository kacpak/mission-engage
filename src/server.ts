import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import path from "node:path";

const app = new Hono();

app.use("/*", serveStatic({ root: path.join(import.meta.dirname, "static") }));

app.get("/api/yoyo", (c) => {
  return c.text("Hello Hono!");
});

export default app;
