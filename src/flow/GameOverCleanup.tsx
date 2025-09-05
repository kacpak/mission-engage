import styles from "./GameOverCleanup.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useBoardState } from "../useBoardState.ts";
import { useNavigate } from "react-router";
import { useCallback, useEffect } from "react";

export default function GameOverCleanup() {
  const boardState = useBoardState();
  const navigate = useNavigate();

  const goToTrailer = useCallback(() => navigate("/", { viewTransition: true, replace: false }), [navigate]);

  useEffect(() => {
    if (boardState && Object.values(boardState).every((_) => !_)) {
      goToTrailer();
    }
  }, [boardState, goToTrailer, navigate]);

  useEffect(() => {
    const timeout = setTimeout(goToTrailer, 15_000);
    return () => {
      clearTimeout(timeout);
    };
  }, [goToTrailer]);

  return (
    <SpaceBackground type="gameplay" contentClassName={styles.wrapper}>
      Please please clear the playing area!
      <br />
      Thank you!
    </SpaceBackground>
  );
}
