import { SpaceBackground } from "./SpaceBackground.tsx";
import styles from "./Highscore.module.css";
import { msToFormattedDuration } from "../utils.ts";
import { hc } from "hono/client";
import type { AppType } from "../server";
import { useQuery } from "@tanstack/react-query";
import type { UseCaseTitle } from "../consts.ts";
import { useEffect } from "react";

const client = hc<AppType>("");
const $getHighscoresForId = client.api.highscore[":useCase"][":id"].$get;
const $getHighscores = client.api.highscore[":useCase"].$get;

type HighscoreProps = {
  useCase: UseCaseTitle;
  highlightedId?: number;
  autoRefresh?: boolean;
};

export function Highscore({ highlightedId, useCase, autoRefresh }: HighscoreProps) {
  const { data } = useQuery({
    queryKey: ["highscores", { highlightedId, useCase }],
    refetchInterval: autoRefresh ? 700 : false,
    queryFn: async () => {
      const res = await (highlightedId
        ? $getHighscoresForId({
            param: {
              useCase,
              id: "" + highlightedId,
            },
          })
        : $getHighscores({ param: { useCase } }));

      if (!res.ok) {
        throw new Error();
      }

      return await res.json();
    },
  });

  return (
    <SpaceBackground type="gameplay">
      <div className={styles.title}>Highscore list</div>
      <ul className={styles.list}>
        {data?.map(({ rank, id, playTimeInMs, nickname }) => {
          const isHighlighted = highlightedId === id;
          const playerName = nickname || `Player ${id}`;
          return (
            <li key={id} className={styles.listItem} data-is-me={isHighlighted}>
              <div className={styles.rank}>{rank}</div>
              <div className={styles.name}>
                {isHighlighted ? `You (${playerName})` : playerName}
                <div className={styles.dots} />
              </div>
              <div className={styles.time}>{msToFormattedDuration(playTimeInMs)}</div>
            </li>
          );
        })}
      </ul>
      <div className={styles.useCase}>{useCase}</div>
    </SpaceBackground>
  );
}

export const TimedOutHighscore = ({
  timeout,
  onTimeout,
  ...props
}: HighscoreProps & { timeout: number; onTimeout: () => void }) => {
  useEffect(() => {
    const timeoutId = setTimeout(onTimeout, timeout);
    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line -- only once
  }, []);

  return <Highscore {...props} />;
};
