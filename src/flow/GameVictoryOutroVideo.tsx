import { SpaceBackground } from "../components/SpaceBackground.tsx";
import styles from "./Trailer.module.css";
import { useNavigate } from "react-router";

export default function GameVictoryOutroVideo() {
  const navigate = useNavigate();
  return (
    <SpaceBackground type="gameplay" contentClassName={styles.trailer}>
      <video
        src="outro-positive.mp4"
        autoPlay
        controls={false}
        onEnded={() => navigate("congrats", { viewTransition: true })}
      ></video>
    </SpaceBackground>
  );
}
