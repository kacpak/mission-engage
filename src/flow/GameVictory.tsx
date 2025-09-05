import styles from "./GameVictory.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useNavigate, useParams } from "react-router";
import { type UseCaseTitle } from "../consts";
import { msToFormattedDuration } from "../utils.ts";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import RobotFront from "../assets/robot-front.svg?react";
import BanklingFront from "../assets/bankling-front.svg?react";
import { useEffect } from "react";

export default function GameVictory() {
  const { useCase, durationInMs } = useParams<{ useCase: UseCaseTitle; durationInMs: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("register-and-cleanup", { viewTransition: true, replace: false });
    }, 8_000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);

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
