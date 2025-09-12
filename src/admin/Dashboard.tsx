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
  return (
    <div>
      <h1>Scores</h1>
      <div>
        {USE_CASES.map(({ title }) => (
          <button key={title} onClick={() => setUseCase(title)}>
            {title}
          </button>
        ))}
      </div>
      <hr />
      <div>
        <a href={`api/export/${useCase}`} download>
          Export entries with email
        </a>{" "}
        / <a href={`./index.html#/highscore/${useCase}`}>Show nice highscores for screenshots</a>
      </div>
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
  );
}

function ScoreRow({ item }: { item: ScoreItem }) {
  const { mutate: updateScore, isPending } = useMutation<
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

  return (
    <form
      key={item.id}
      className={styles.row}
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
        <Link to={`update-user/${item.id}`}>Register user</Link>
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
        </button>
      </div>
    </form>
  );
}
