import { useWhiteboardState } from "../useWhiteboardState.ts";
import { useNavigate } from "react-router";
import { useUpdateEffect, usePrevious } from "@reactuses/core";
import styles from "./Title.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import CoconetLogo from "../assets/coconet-logo.svg?react";
import ArrowDouble from "../assets/arrow-double.svg?react";
import Astronaut from "../assets/astronaut.svg?react";
import GamingMachine from "../assets/gaming-machine.svg?react";

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
      <div className={styles.gamingMachine}>
        <GamingMachine />
      </div>
      <div className={styles.astronaut}>
        <Astronaut />
      </div>
      <div className={styles.title}>
        <header>
          <CoconetLogo aria-hidden="true" />
          <h1>Workflow Studio Quest</h1>
          <p>
            <ArrowDouble />
            Let’s play and win!
          </p>
        </header>
      </div>
    </SpaceBackground>
  );
}
