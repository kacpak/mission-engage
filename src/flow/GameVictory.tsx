import styles from "./GameVictory.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useNavigate, useParams } from "react-router";
import { type UseCaseTitle } from "../consts.ts";
import { msToFormattedDuration } from "../utils.ts";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import RobotFront from "../assets/robot-front.svg?react";
import BanklingFront from "../assets/bankling-front.svg?react";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";
import { hc } from "hono/client";
import type { AppType } from "../server";
import { queryClient } from "../main.tsx";

const client = hc<AppType>("");
const $addNewHighscore = client.api.highscore[":useCase"].$post;

export default function GameVictory() {
  const { useCase, durationInMs } = useParams<{ useCase: UseCaseTitle; durationInMs: string }>();
  const navigate = useNavigate();

  const { data, mutate: addHighScore } = useMutation<
    InferResponseType<typeof $addNewHighscore>,
    Error,
    InferRequestType<typeof $addNewHighscore>["json"]
  >({
    mutationFn: async ({ playTimeInMs }) => {
      const res = await $addNewHighscore({
        param: {
          useCase: useCase!,
        },
        json: {
          playTimeInMs,
        },
      });
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["highscores"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    addHighScore({
      playTimeInMs: parseInt(durationInMs!, 10),
    });
  }, [addHighScore, durationInMs]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(`../${data?.id}/register-and-cleanup`, { viewTransition: true, replace: false });
    }, 8_000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate, data]);

  return (
    <SpaceBackground type="gameplay">
      <Fireworks className={styles.canvas} autorun={{ speed: 2 }} />
      <div className={styles.content}>
        <div className={styles.title}>Congrats!</div>
        <div className={styles.text}>You solved "{useCase}" in</div>
        <div className={styles.time}>{msToFormattedDuration(parseInt(durationInMs!))}</div>
      </div>
      <RobotFront className={styles.robot} />
      <BanklingFront className={styles.bankling} />
    </SpaceBackground>
  );
}
