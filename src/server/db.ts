import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./db/schema";
import { desc, eq, sql, getTableColumns, or, lte, asc, and, isNotNull } from "drizzle-orm";
import { DB_FILENAME, type UseCaseTitle } from "../consts.ts";

export const db = drizzle({ connection: DB_FILENAME, schema });

export const getAllScores = async ({ useCase }: { useCase: UseCaseTitle }) => {
  return await db.query.scores.findMany({
    orderBy: desc(schema.scores.wonAt),
    where: eq(schema.scores.useCase, useCase),
  });
};

export const getHighScoresIncludingId = async ({ id, useCase }: { id?: number; useCase: UseCaseTitle }) => {
  const whereUseCaseAndRegistered = and(eq(schema.scores.useCase, useCase), isNotNull(schema.scores.email));
  const rankedScores = db.$with("ranked").as(
    db
      .select({
        ...getTableColumns(schema.scores),
        rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${schema.scores.playTimeInMs} ASC)`.as("rank"),
      })
      .from(schema.scores)
      .where(id ? or(whereUseCaseAndRegistered, eq(schema.scores.id, id)) : whereUseCaseAndRegistered),
  );

  return db
    .with(rankedScores)
    .select()
    .from(rankedScores)
    .where(id ? or(lte(sql`rank`, 10), eq(rankedScores.id, id)) : lte(sql`rank`, 10))
    .orderBy(asc(sql`rank`))
    .limit(11);
};

export const getHighScoresForExport = async ({ useCase }: { useCase: UseCaseTitle }) => {
  return db
    .select({
      ...getTableColumns(schema.scores),
      rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${schema.scores.playTimeInMs} ASC)`.as("rank"),
    })
    .from(schema.scores)
    .where(and(eq(schema.scores.useCase, useCase), isNotNull(schema.scores.email)))
    .orderBy(asc(sql`rank`));
};

export const addNewScore = async ({ useCase, playTimeInMs }: { useCase: UseCaseTitle; playTimeInMs: number }) => {
  return db
    .insert(schema.scores)
    .values({
      useCase,
      playTimeInMs,
      wonAt: new Date().getTime(),
    })
    .returning();
};

export const updateScore = async ({
  id,
  nickname,
  name,
  email,
  notes,
}: {
  id: number;
  nickname?: string;
  name?: string;
  email?: string;
  notes?: string;
}) => {
  return db.update(schema.scores).set({ nickname, name, email, notes }).where(eq(schema.scores.id, id)).returning();
};
