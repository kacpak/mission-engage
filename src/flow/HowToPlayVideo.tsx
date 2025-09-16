import { SpaceBackground } from "../components/SpaceBackground.tsx";
import styles from "./Trailer.module.css";
import { useNavigate } from "react-router";

export default function HowToPlayVideo() {
  const navigate = useNavigate();
  return (
    <SpaceBackground type="gameplay" contentClassName={styles.trailer}>
      <video
        src="how-to-play.mp4"
        autoPlay
        controls={false}
        onEnded={() => navigate("/chooseUseCase", { viewTransition: true })}
      ></video>
    </SpaceBackground>
  );
}
