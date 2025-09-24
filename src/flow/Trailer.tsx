import { useBoardState } from "../useBoardState.ts";
import { useNavigate } from "react-router";
import { useUpdateEffect, usePrevious } from "@reactuses/core";
import styles from "./Trailer.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useReducer } from "react";
import type { UseCaseTitle } from "../consts.ts";
import { TimedOutHighscore } from "../components/Highscore.tsx";

const order: ("video" | `useCase:${UseCaseTitle}`)[] = [
  "video",
  "useCase:Self service",
  "useCase:Account opening",
  "useCase:Accept terms & conditions",
];

export function Trailer() {
  const { boardState: state } = useBoardState();
  const navigate = useNavigate();
  const previousState = usePrevious(state);
  const [viewIndex, nextView] = useReducer((state) => (state + 1) % order.length, 0);
  const view = order[viewIndex];
  const useCase = view.startsWith("useCase") ? (view.replace("useCase:", "") as UseCaseTitle) : null;

  useUpdateEffect(() => {
    if (
      JSON.stringify(previousState) !== JSON.stringify(state) &&
      previousState !== undefined &&
      !Object.values(state).includes("alien")
    ) {
      navigate("/presents", { viewTransition: true, replace: false });
    }
  }, [previousState, state, navigate]);

  return (
    <SpaceBackground>
      <div className={styles.trailer}>
        {view === "video" ? (
          <video src="intro.mp4" muted loop autoPlay controls={false} onEnded={nextView}></video>
        ) : (
          <TimedOutHighscore timeout={6000} onTimeout={nextView} key={view} useCase={useCase!} />
        )}
      </div>
    </SpaceBackground>
  );
}
