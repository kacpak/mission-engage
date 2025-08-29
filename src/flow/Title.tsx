import { useWhiteboardState } from "../useWhiteboardState.ts";
import { useNavigate } from "react-router";
import { useUpdateEffect, usePrevious } from "@reactuses/core";
import styles from "./Title.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import robotFrontUrl from "../assets/robot-front.png?url";
import banklingFrontUrl from "../assets/banking-front.png?url";

export function Title() {
  const state = useWhiteboardState();
  const navigate = useNavigate();
  const previousState = usePrevious(state);

  useUpdateEffect(() => {
    if (JSON.stringify(previousState) !== JSON.stringify(state) && previousState !== undefined) {
      navigate("/howTo", { viewTransition: true, replace: false });
    }
  }, [previousState, state, navigate]);

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
