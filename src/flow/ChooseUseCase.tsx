import { useWhiteboardState } from "../useWhiteboardState.ts";
import { useNavigate } from "react-router";
import styles from "./ChooseUseCase.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { usePrevious, useUpdateEffect } from "@reactuses/core";

export function ChooseUseCase() {
  const state = useWhiteboardState();
  const navigate = useNavigate();

  const previousState = usePrevious(state);
  useUpdateEffect(() => {
    if (JSON.stringify(previousState) !== JSON.stringify(state) && previousState !== undefined) {
      navigate("/useCase/xyz/start", { viewTransition: true });
    }
  }, [previousState, state, navigate]);

  return <SpaceBackground className={styles.wrapper}>How to choose a use case</SpaceBackground>;
}
