import styles from "./GameVictory.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useParams } from "react-router";
import { type UseCaseTitle } from "../consts";
import { msToFormattedDuration } from "../utils.ts";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import robotFrontUrl from "../assets/robot-front.png?url";
import banklingFrontUrl from "../assets/bankling-front.png?url";

export default function GameVictory() {
  const { useCase, durationInMs } = useParams<{ useCase: UseCaseTitle; durationInMs: string }>();

  return (
    <SpaceBackground type="gameplay">
      <Fireworks className={styles.canvas} autorun={{ speed: 2 }} />
      <div className={styles.content}>
        <div className={styles.title}>Congrats!</div>
        <div className={styles.text}>You solved "{useCase}" in</div>
        <div className={styles.time}>{msToFormattedDuration(parseInt(durationInMs!))}</div>
      </div>
      <img src={robotFrontUrl} alt="" className={styles.robot} />
      <img src={banklingFrontUrl} alt="" className={styles.bankling} />
    </SpaceBackground>
  );
}
