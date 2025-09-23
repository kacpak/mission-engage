import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { AppType } from "../server";
import { hc } from "hono/client";
import type { UseCaseTitle } from "../consts.ts";
import { msToFormattedDuration } from "../utils.ts";
import styles from "./GameVictoryHighscore.module.css";
import { useRefreshHighscores } from "../useRefreshHighscore.ts";

const client = hc<AppType>("");
const $getHighscores = client.api.highscore[":useCase"].$get;

export default function HighscoreForScreenshots() {
  const { useCase } = useParams<{ useCase: UseCaseTitle }>();
  useRefreshHighscores();

  const { data } = useQuery({
    queryKey: ["highscores", useCase],
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
    <SpaceBackground type="gameplay">
      <div className={styles.title}>Highscores</div>
      <ul className={styles.list}>
        {data?.map(({ rank, id: myId, playTimeInMs, nickname }) => {
          const playerName = nickname || `Player ${myId}`;
          return (
            <li key={myId} className={styles.listItem}>
              <div className={styles.rank}>{rank}</div>
              <div className={styles.name}>
                {playerName}
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
