import styles from "./GameVictory.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import villanUrl from "../assets/chaos.png?url";

export default function GameOver() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("cleanup", { viewTransition: true, replace: false });
    }, 8_000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <SpaceBackground type="gameplay">
      <div className={styles.content}>
        <div className={styles.title}>Too bad!</div>
        <div className={styles.text}>Maybe next time...</div>
      </div>
      <img src={villanUrl} alt="" className={styles.villan} />
    </SpaceBackground>
  );
}
