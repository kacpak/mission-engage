import styles from "./GameInstruction.module.css";
import { useEffect } from "react";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useNavigate } from "react-router";
import { useWhiteboardState } from "../useWhiteboardState.ts";

export function GameInstruction() {
  const state = useWhiteboardState();
  const navigate = useNavigate();
  useEffect(() => {
    if (state && Object.values(state).every((s) => !s)) {
      navigate("../countdown", { viewTransition: true });
    }
  }, [navigate, state]);
  return (
    <SpaceBackground type="gameplay" contentClassName={styles.wrapper}>
      Now remove the robot and grab your tangibles!
    </SpaceBackground>
  );
}
