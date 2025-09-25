import { useNavigate } from "react-router";
import styles from "./GameCountdown.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useEffect } from "react";
import { useState } from "react";
import { useSound } from "react-sounds";

export function GameCountdown() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const { play: playCountdown } = useSound("sounds/timer_countdown-345137-shortened.mp3");

  useEffect(() => {
    void playCountdown();
    const interval = window.setInterval(() => {
      setCountdown((_) => _ - 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (countdown < 0) {
      navigate("../game", { viewTransition: true });
    }
  }, [countdown, navigate]);

  return (
    <SpaceBackground type="gameplay" className={styles.wrapper}>
      {countdown > 0 ? `${countdown}...` : "Go!"}
    </SpaceBackground>
  );
}
