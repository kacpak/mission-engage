import { useNavigate } from "react-router";
import styles from "./Title.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import RobotFront from "../assets/robot-front.svg?react";
import BanklingFront from "../assets/bankling-front.svg?react";
import { useEffect } from "react";

export function Title() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/howTo", { viewTransition: true, replace: false });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <SpaceBackground contentClassName={styles.wrapper}>
      <div className={styles.title}>
        <header>
          <h1>
            <span>Mission:</span>
            <span>Engage</span>
          </h1>
        </header>
      </div>
      <div className={styles.characters}>
        <RobotFront className={styles.robot} />
        <BanklingFront className={styles.bankling} />
      </div>
    </SpaceBackground>
  );
}
