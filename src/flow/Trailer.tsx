import { useBoardState } from "../useBoardState.ts";
import { useNavigate } from "react-router";
import { useUpdateEffect, usePrevious } from "@reactuses/core";
import styles from "./Trailer.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useMemo, useReducer } from "react";
import type { UseCaseTitle } from "../consts.ts";
import { TimedOutHighscore } from "../components/Highscore.tsx";

const order: (`video:${string}` | `useCase:${UseCaseTitle}`)[] = [
  "video:intro.mp4",
  "video:prizes.mp4",
  "useCase:Self service",
  "useCase:Account opening",
  "useCase:Accept terms & conditions",
];

type Parse<T> = T extends `${infer Type}:${infer Specifier}` ? { type: Type; specifier: Specifier } : never;
type ParsedOrder = Parse<(typeof order)[number]>;

export function Trailer() {
  const { boardState: state } = useBoardState();
  const navigate = useNavigate();
  const previousState = usePrevious(state);
  const [viewIndex, nextView] = useReducer((state) => (state + 1) % order.length, 0);

  const mode = useMemo((): ParsedOrder => {
    const view = order[viewIndex];
    const [type, specifier] = view.split(":");
    return {
      type,
      specifier,
    } as ParsedOrder;
  }, [viewIndex]);

  useUpdateEffect(() => {
    if (
      JSON.stringify(previousState) !== JSON.stringify(state) &&
      !Object.values(state).includes("alien") &&
      (previousState ? !Object.values(previousState).includes("alien") : false)
    ) {
      navigate("/presents", { viewTransition: true, replace: false });
    }
  }, [previousState, state, navigate]);

  return mode.type === "video" ? (
    <SpaceBackground key={mode.specifier}>
      <div className={styles.trailer}>
        <video src={mode.specifier} muted autoPlay controls={false} onEnded={nextView} />
      </div>
    </SpaceBackground>
  ) : (
    <TimedOutHighscore timeout={15000} onTimeout={nextView} key={mode.specifier} useCase={mode.specifier} />
  );
}
