import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const scores = sqliteTable("scores", {
  id: int().primaryKey({ autoIncrement: true }),
  nickname: text(),
  name: text(),
  email: text(),
  notes: text(),
  wonAt: int().notNull(),
  playTimeInMs: int().notNull(),
  useCase: text().notNull(),
});
