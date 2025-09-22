import { useMutation, useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { AppType } from "../server";
import { useState } from "react";
import { USE_CASES, type UseCaseTitle } from "../consts.ts";
import { msToFormattedDuration } from "../utils.ts";
import styles from "./Dashboard.module.css";
import classNames from "classnames";
import type { InferResponseType, InferRequestType } from "hono/client";
import { queryClient } from "./admin.tsx";
import { Link } from "react-router";

const client = hc<AppType>("");
const $getHighscores = client.api["all-scores"][":useCase"].$get;
const $updateScore = client.api.highscore[":id"].$put;
const $deleteScore = client.api["highscore-data"][":id"].$delete;
const $deleteAllScores = client.api["highscore-data"].$delete;

type ScoreItem = InferResponseType<typeof $getHighscores>[number];

export default function Dashboard() {
  const [useCase, setUseCase] = useState<UseCaseTitle>(USE_CASES[0].title);
  const { data } = useQuery({
    queryKey: ["scores", useCase],
    queryFn: async () => {
      const res = await $getHighscores({
        param: {
          useCase: useCase!,
        },
      });
      if (!res.ok) {
        throw new Error();
      }
      return await res.json();
    },
  });

  const { mutate: deleteAllScores, isPending: isPendingDeletion } = useMutation<
    InferResponseType<typeof $deleteScore>,
    Error
  >({
    mutationFn: async () => {
      const res = await $deleteAllScores();
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["scores", useCase] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div
      className={styles.wrapper}
      style={{
        opacity: isPendingDeletion ? 0.5 : 1,
      }}
    >
      <h1>mission:engage administration</h1>
      <ul>
        <li>
          <a href={`api/export-database`} download>
            Export database for backup
          </a>
        </li>
      </ul>
      <div className={styles.tabs}>
        {USE_CASES.map(({ title }) => (
          <button
            key={title}
            className={styles.tab}
            onClick={() => setUseCase(title)}
            aria-selected={useCase === title}
          >
            {title}
          </button>
        ))}
      </div>
      <h2>Links</h2>
      <ul>
        <li>
          <a href={`api/export/${useCase}`} download>
            Export entries with email
          </a>
        </li>
        <li>
          <a href={`./#/highscore/${useCase}`}>Show nice highscores for screenshots</a>
        </li>
      </ul>
      <h2>Scores</h2>
      <div className={styles.tableWrapper}>
        <div className={styles.table}>
          <div className={classNames(styles.row, styles.headerRow)}>
            <div>ID</div>
            <div>Play time</div>
            <div>Won at</div>
            <div>Options</div>
            <div>Nickname</div>
            <div>Full name</div>
            <div>Email</div>
            <div>Notes</div>
            <div>Save changes</div>
          </div>
          {data?.map((item) => (
            <ScoreRow key={item.id} item={item} />
          ))}
        </div>
      </div>
      <hr />
      <div>
        <h2>Danger zone</h2>

        <button
          type="button"
          data-type="danger"
          onClick={() => {
            if (confirm(`Are you sure you want to delete ALL the entries?`)) {
              if (confirm(`Are you really really sure? It cannot be undone unless you have backup.`)) {
                deleteAllScores();
              }
            }
          }}
        >
          Delete ALL entries for ALL use cases
        </button>
      </div>
    </div>
  );
}

function ScoreRow({ item }: { item: ScoreItem }) {
  const { mutate: updateScore, isPending: isPendingUpdate } = useMutation<
    InferResponseType<typeof $updateScore>,
    Error,
    InferRequestType<typeof $updateScore>["json"]
  >({
    mutationFn: async ({ nickname, name, email, notes }) => {
      const res = await $updateScore({
        param: {
          id: "" + item.id,
        },
        json: {
          nickname,
          name,
          email,
          notes,
        },
      });
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["scores", item.useCase] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: deleteScore, isPending: isPendingDeletion } = useMutation<
    InferResponseType<typeof $deleteScore>,
    Error
  >({
    mutationFn: async () => {
      const res = await $deleteScore({
        param: {
          id: "" + item.id,
        },
      });
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["scores", item.useCase] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const isPending = isPendingUpdate || isPendingDeletion;

  return (
    <form
      key={item.id}
      className={styles.row}
      style={{
        opacity: isPendingDeletion ? 0.5 : 1,
      }}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateScore({
          nickname: formData.get("nickname") as string,
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          notes: formData.get("notes") as string,
        });
      }}
    >
      <div>{item.id}</div>
      <div>{msToFormattedDuration(item.playTimeInMs)}</div>
      <div>{new Date(item.wonAt).toLocaleString()}</div>
      <div>
        <Link to={`update-user/${item.id}`} target="_blank">
          Register user
        </Link>
      </div>
      <div>
        <input type="text" name="nickname" defaultValue={item.nickname ?? ""} disabled={isPending} />
      </div>
      <div>
        <input type="text" name="name" defaultValue={item.name ?? ""} disabled={isPending} />
      </div>
      <div>
        <input type="email" name="email" defaultValue={item.email ?? ""} disabled={isPending} />
      </div>
      <div>
        <textarea name="notes" defaultValue={item.notes ?? ""} disabled={isPending} />
      </div>
      <div>
        <button type="submit" disabled={isPending}>
          Save
        </button>{" "}
        <button type="reset" disabled={isPending}>
          Reset
        </button>{" "}
        <button
          type="button"
          data-type="danger"
          disabled={isPending}
          onClick={() => {
            if (confirm(`Are you sure you want to delete entry ${item.id}?`)) {
              deleteScore();
            }
          }}
        >
          Delete entry
        </button>
      </div>
    </form>
  );
}
