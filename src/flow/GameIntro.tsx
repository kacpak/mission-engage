import { SpaceBackground } from "../components/SpaceBackground.tsx";
import styles from "./Trailer.module.css";
import { useNavigate } from "react-router";

export default function GameIntro() {
  const navigate = useNavigate();
  return (
    <SpaceBackground type="gameplay" contentClassName={styles.trailer}>
      <video
        src="intro.mp4"
        autoPlay
        controls={false}
        onEnded={() => navigate("ready", { viewTransition: true })}
      ></video>
    </SpaceBackground>
  );
}
