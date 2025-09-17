import { SpaceBackground } from "../components/SpaceBackground.tsx";
import styles from "./Trailer.module.css";
import { useNavigate } from "react-router";

export default function GameOverOutroVideo() {
  const navigate = useNavigate();
  return (
    <SpaceBackground type="gameplay" contentClassName={styles.trailer}>
      <video
        src="outro-negative.mp4"
        autoPlay
        controls={false}
        onEnded={() => navigate("message", { viewTransition: true })}
      ></video>
    </SpaceBackground>
  );
}
