import { SpaceBackground } from "../components/SpaceBackground.tsx";
import styles from "./Trailer.module.css";
import { useNavigate } from "react-router";
import { useSound } from "react-sounds";

export default function GameOverOutroVideo() {
  const navigate = useNavigate();
  const { play: playExplosion } = useSound("sounds/explosion-9-340460.mp3");
  const { play: playGameOver } = useSound("sounds/game-over-arcade-6435.mp3");
  const { play: playLaugh } = useSound("sounds/evil-demonic-laugh-6925.mp3");

  return (
    <SpaceBackground type="gameplay" contentClassName={styles.trailer}>
      <video
        src="outro-negative.mp4"
        autoPlay
        controls={false}
        onPlay={() => {
          void playGameOver();
          void playLaugh();
          setTimeout(playExplosion, 1000);
        }}
        onEnded={() => navigate("message", { viewTransition: true })}
      ></video>
    </SpaceBackground>
  );
}
