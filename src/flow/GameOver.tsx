import styles from "./GameVictory.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";

export default function GameOver() {
  return (
    <SpaceBackground type="gameplay">
      <div className={styles.content}>
        <div className={styles.title}>Too bad!</div>
        <div className={styles.text}>Maybe next time...</div>
      </div>
    </SpaceBackground>
  );
}
