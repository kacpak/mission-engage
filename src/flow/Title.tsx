import { useNavigate } from "react-router";
import styles from "./Title.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import robotFrontUrl from "../assets/robot-front.png?url";
import banklingFrontUrl from "../assets/bankling-front.png?url";
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
        <img src={robotFrontUrl} className={styles.robot} />
        <img src={banklingFrontUrl} className={styles.bankling} />
      </div>
    </SpaceBackground>
  );
}
