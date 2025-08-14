import { useWhiteboardState } from "../useWhiteboardState.ts";
import { useNavigate } from "react-router";
import styles from "./Game.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useEffect } from "react";
import { useState } from "react";

export function Game() {
  const state = useWhiteboardState();
  const navigate = useNavigate();

  return (
    <SpaceBackground className={styles.wrapper}>
      <h1>Game!</h1>
    </SpaceBackground>
  );
}
