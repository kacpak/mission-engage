import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { upgradeWebSocket, websocket } from "hono/bun";
import path from "node:path";
import {
  addNewScore,
  db,
  getAllScores,
  getHighScoresIncludingId,
  getHighScoresForExport,
  updateScore,
  getHighScoreData,
  removeHighScoreData,
  removeAllScores,
} from "./db.ts";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { zValidator as validator } from "@hono/zod-validator";
import * as z from "zod";
import { DB_FILENAME, USE_CASES } from "../consts.ts";
import { logger } from "hono/logger";
import Papa from "papaparse";
import type { ServerWebSocket } from "bun";

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

const wsClients = new Set<ServerWebSocket>();

app.get(
  "/client-ws",
  upgradeWebSocket(() => ({
    onOpen(_event, _ws) {
      console.log("OPEN!");
      const ws = _ws.raw as ServerWebSocket;
      ws.ping();
      ws.send("ping");

      wsClients.add(ws);
    },
    onMessage(event, ws) {
      console.log(`Message from client: ${event.data}`);
      ws.send("Hello from server!");
    },
    onClose: (_event, ws) => {
      wsClients.delete(ws.raw);
      console.log("Connection closed");
    },
  })),
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app
  .get("/api/highscore/:useCase/:id", useCaseAndIdValidator, async (c) => {
    const { id, useCase } = c.req.valid("param");
    const scores = await getHighScoresIncludingId({ useCase, id });
    return c.json(scores);
  })
  .get("/api/highscore/:useCase", useCaseValidator, async (c) => {
    const { useCase } = c.req.valid("param");
    const scores = await getHighScoresIncludingId({ useCase });
    return c.json(scores);
  })
  .get("/api/highscore-data/:id", idValidator, async (c) => {
    const { id } = c.req.valid("param");
    const data = await getHighScoreData({ id });
    return c.json(data);
  })
  .delete("/api/highscore-data", async (c) => {
    const data = await removeAllScores();
    return c.json(data);
  })
  .delete("/api/highscore-data/:id", idValidator, async (c) => {
    const { id } = c.req.valid("param");
    const data = await removeHighScoreData({ id });
    return c.json(data);
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
        nickname: z.string().optional(),
        name: z.string().optional(),
        email: z.email().optional(),
        notes: z.string().optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { nickname, name, email, notes } = c.req.valid("json");
      const [updatedScore] = await updateScore({
        id,
        nickname,
        name,
        email,
        notes,
      });
      wsClients.forEach((ws) =>
        ws.send(
          JSON.stringify({
            type: "refresh-highscores",
          }),
        ),
      );
      return c.json(updatedScore);
    },
  );

app.get("/api/export/:useCase", useCaseValidator, async (c) => {
  const { useCase } = c.req.valid("param");
  const data = await getHighScoresForExport({ useCase });
  const csv = Papa.unparse(data);
  c.header("Content-Disposition", `attachment; filename=${useCase} scores.csv`);
  return c.body(csv);
});

app.get("/api/export-database", async (c) => {
  c.header("Content-Disposition", `attachment; filename=mission-engage.db`);

  const stream = Bun.file(DB_FILENAME).stream();
  return c.body(stream);
});

export type AppType = typeof route;

Bun.serve({
  fetch: app.fetch,
  websocket,
  port: 4123,
});
