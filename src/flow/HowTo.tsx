import { useWhiteboardState } from "../useWhiteboardState.ts";
import { useNavigate } from "react-router";
import { useUpdateEffect, usePrevious } from "@reactuses/core";
import type { CSSProperties } from "react";
import styles from "./HowTo.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import GoalImage from "../assets/goal.svg?react";
import ControlsImage from "../assets/controls.svg?react";
import HelpImage from "../assets/help.svg?react";
import RocketMan from "../assets/rocket-man.svg?react";

export function HowTo() {
  const state = useWhiteboardState();
  const navigate = useNavigate();
  const previousState = usePrevious(state);

  useUpdateEffect(() => {
    if (JSON.stringify(previousState) !== JSON.stringify(state) && previousState !== undefined) {
      navigate("/howTo");
    }
  }, [previousState, state, navigate]);

  return (
    <SpaceBackground className={styles.wrapper}>
      <div className={styles.howTo}>
        <header>
          <h1>How to play</h1>
        </header>
        <div className={styles.rules}>
          {[
            {
              title: "Goal",
              image: <GoalImage />,
              description: <>Your goal is to rebuit a workflow for a chosen use case.</>,
            },
            {
              title: "Controls",
              image: <ControlsImage />,
              description: (
                <>
                  The playground and tangibles on it are your controls. You can place tangibles on the interactive
                  fields.
                </>
              ),
            },
            {
              title: "Help",
              image: <HelpImage />,
              description: (
                <>
                  <strong>This little dude knows things!</strong>
                  <br />
                  Place a tangible on the “help” area to get more information.
                </>
              ),
            },
          ].map(({ title, image, description }, i) => (
            <div className={styles.rule} style={{ "--i": i } as CSSProperties}>
              <h2>{title}</h2>
              <div className={styles.image}>{image}</div>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <p className={styles.next}>Once you have read this, move the astronaut on “help”.</p>
      </div>
      <RocketMan className={styles.rocketMan} />
    </SpaceBackground>
  );
}
