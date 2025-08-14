import styles from "./Game.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";

export function Game() {
  return (
    <SpaceBackground className={styles.wrapper}>
      <h1>Game!</h1>
    </SpaceBackground>
  );
}
