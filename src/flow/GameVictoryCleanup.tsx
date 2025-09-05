import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useNavigate, useParams } from "react-router";
import { msToFormattedDuration } from "../utils.ts";
import { useBoardState } from "../useBoardState.ts";
import { useCallback, useEffect } from "react";
import styles from "./GameVictoryCleanup.module.css";

export default function GameVictoryCleanup() {
  const { durationInMs } = useParams<{ durationInMs: string }>();
  const boardState = useBoardState();
  const navigate = useNavigate();

  const goToHighscore = useCallback(
    () => navigate("../highscore", { viewTransition: true, replace: false }),
    [navigate],
  );

  useEffect(() => {
    if (boardState && Object.values(boardState).every((_) => !_)) {
      goToHighscore();
    }
  }, [boardState, goToHighscore, navigate]);

  useEffect(() => {
    const timeout = setTimeout(goToHighscore, 15_000);
    return () => {
      clearTimeout(timeout);
    };
  }, [goToHighscore]);

  return (
    <SpaceBackground type="gameplay" contentClassName={styles.wrapper}>
      <div className={styles.text}>
        Please please clear the playing area and register your time with a sales person!
      </div>
      <div className={styles.yourTimeLabel}>Your time</div>
      <div className={styles.yourTime}>{msToFormattedDuration(parseInt(durationInMs!))}</div>
    </SpaceBackground>
  );
}
