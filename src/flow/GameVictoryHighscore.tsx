import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { AppType } from "../server";
import { hc } from "hono/client";
import type { UseCaseTitle } from "../consts.ts";
import { msToFormattedDuration } from "../utils.ts";
import styles from "./GameVictoryHighscore.module.css";

const client = hc<AppType>("");
const $getHighscores = client.api.highscore[":useCase"][":id"].$get;

export default function GameVictoryHighscore() {
  const { id, useCase } = useParams<{ useCase: UseCaseTitle; id: string }>();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["highscores", id, useCase],
    queryFn: async () => {
      const res = await $getHighscores({
        param: {
          useCase: useCase!,
          id: id!,
        },
      });
      if (!res.ok) {
        throw new Error();
      }
      return await res.json();
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/", { viewTransition: true, replace: false });
    }, 15_000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <SpaceBackground type="gameplay">
      <div className={styles.title}>Highscores</div>
      <ul className={styles.list}>
        {data?.map(({ rank, id: myId, playTimeInMs, name }) => {
          const isMe = parseInt(id!, 10) === myId;
          const playerName = name ?? `Player ${myId}`;
          return (
            <li key={id} className={styles.listItem} data-is-me={isMe}>
              <div className={styles.rank}>{rank}</div>
              <div className={styles.name}>
                {isMe ? `You (${playerName})` : playerName}
                <div className={styles.dots} />
              </div>
              <div className={styles.time}>{msToFormattedDuration(playTimeInMs)}</div>
            </li>
          );
        })}
      </ul>
    </SpaceBackground>
  );
}
