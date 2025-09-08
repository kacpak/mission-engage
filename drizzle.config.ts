import { defineConfig } from "drizzle-kit";

import { DB_FILENAME } from "./src/consts.ts";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: DB_FILENAME,
  },
});
