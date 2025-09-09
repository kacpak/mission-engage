import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import path from "node:path";
import { addNewScore, db, getAllScores, getHighScores, updateScore } from "./db.ts";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { zValidator as validator } from "@hono/zod-validator";
import * as z from "zod";
import { USE_CASES } from "../consts.ts";
import { logger } from "hono/logger";

console.log("Migrating database...");
migrate(db, { migrationsFolder: "./drizzle" });
console.log("✅ Migrated database.");

const app = new Hono();

app.use(logger());
app.use("/*", serveStatic({ root: path.join(import.meta.dirname, "static") }));

const useCaseValidator = validator(
  "param",
  z.object({
    useCase: z.literal(USE_CASES.map((_) => _.title)),
  }),
);

const useCaseAndIdValidator = validator(
  "param",
  z.object({
    useCase: z.literal(USE_CASES.map((_) => _.title)),
    id: z.coerce.number(),
  }),
);

const idValidator = validator(
  "param",
  z.object({
    id: z.coerce.number(),
  }),
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app
  .get("/api/highscore/:useCase/:id", useCaseAndIdValidator, async (c) => {
    const { id, useCase } = c.req.valid("param");
    const scores = await getHighScores({ useCase, id });
    return c.json(scores);
  })
  .get("/api/all-scores/:useCase", useCaseValidator, async (c) => {
    const { useCase } = c.req.valid("param");
    const scores = await getAllScores({ useCase });
    return c.json(scores);
  })
  .post(
    "/api/highscore/:useCase",
    useCaseValidator,
    validator("json", z.object({ playTimeInMs: z.int() })),
    async (c) => {
      const { useCase } = c.req.valid("param");
      const { playTimeInMs } = c.req.valid("json");

      const [result] = await addNewScore({
        useCase,
        playTimeInMs,
      });
      return c.json(result);
    },
  )
  .put(
    "/api/highscore/:id",
    idValidator,
    validator(
      "json",
      z.object({
        name: z.string().optional(),
        email: z.email().optional(),
        notes: z.string().optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { name, email, notes } = c.req.valid("json");
      const [updatedScore] = await updateScore({
        id,
        name,
        email,
        notes,
      });
      return c.json(updatedScore);
    },
  );

export type AppType = typeof route;

export default app;
