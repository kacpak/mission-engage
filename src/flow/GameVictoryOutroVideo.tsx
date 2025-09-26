import { SpaceBackground } from "../components/SpaceBackground.tsx";
import styles from "./Trailer.module.css";
import { useNavigate } from "react-router";
import { useSound } from "react-sounds";

export default function GameVictoryOutroVideo() {
  const navigate = useNavigate();
  const { play: playExplosion } = useSound("sounds/explosion-9-340460.mp3");

  return (
    <SpaceBackground type="gameplay" contentClassName={styles.trailer}>
      <video
        src="outro-positive.mp4"
        autoPlay
        controls={false}
        onPlay={() => {
          setTimeout(playExplosion, 1000);
        }}
        onEnded={() => navigate("congrats", { viewTransition: true })}
      ></video>
    </SpaceBackground>
  );
}
