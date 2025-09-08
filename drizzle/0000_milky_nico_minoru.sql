CREATE TABLE `scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`email` text,
	`wonAt` integer NOT NULL,
	`playTimeInMs` integer NOT NULL,
	`useCase` text NOT NULL
);
