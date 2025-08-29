import { useNavigate } from "react-router";
import styles from "./GameCountdown.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useEffect } from "react";
import { useState } from "react";

export function GameCountdown() {
  const navigate = useNavigate();
  const [countdown, setCoundown] = useState(3);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCoundown((_) => _ - 1);
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
