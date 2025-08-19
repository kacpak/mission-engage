import { useWhiteboardState } from "../useWhiteboardState.ts";
// import { useNavigate } from "react-router";
import styles from "./ChooseUseCase.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
// import { usePrevious, useUpdateEffect } from "@reactuses/core";
import AstronautTangible from "../assets/astronaut-tangible.svg?react";
import Arrow from "../assets/arrow.svg?react";
// import { useEffect } from "react";

export function ChooseUseCase() {
  const state = useWhiteboardState();
  // const navigate = useNavigate();

  const choice = Object.entries(state ?? {}).find(([, value]) => value === "astronaut")?.[0];

  // useEffect(() => {
  //   navigate(`/chooseUseCase/${choice ?? ""}`, { viewTransition: true });
  // }, [choice, navigate]);

  // const previousState = usePrevious(state);
  // useUpdateEffect(() => {
  //   if (JSON.stringify(previousState) !== JSON.stringify(state) && previousState !== undefined) {
  //     navigate("/useCase/xyz/start", { viewTransition: true });
  //   }
  // }, [previousState, state, navigate]);

  return (
    <SpaceBackground className={styles.wrapper} contentClassName={styles.inner}>
      <h1>How to choose a use case</h1>
      <ol>
        <li>Move the astronaut on one of the use cases</li>
        <li>The game will start automatically after some time</li>
      </ol>
      <div className={styles.useCases}>
        {!choice && (
          <>
            <Arrow className={styles.arrow} />
            <AstronautTangible className={styles.tangibleDummy} />
          </>
        )}
        {["Self service", "Account opening", "Accept terms and conditions"].map((text, i) => (
          <div key={i} className={styles.useCase}>
            <div className={styles.box}>
              {`s${i + 1}` === choice ? <AstronautTangible className={styles.tangible} /> : i + 1}
            </div>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </SpaceBackground>
  );
}
