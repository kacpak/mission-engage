import { useNavigate } from "react-router";
import styles from "./Countdown.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useEffect } from "react";
import { useState } from "react";

export function Countdown() {
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
    if (countdown === 0) {
      navigate("/useCase/xyz/game", { viewTransition: true });
    }
  }, [countdown, navigate]);

  return (
    <SpaceBackground className={styles.wrapper}>
      <h1>{countdown}</h1>
    </SpaceBackground>
  );
}
