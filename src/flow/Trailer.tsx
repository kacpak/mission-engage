import { useBoardState } from "../useBoardState.ts";
import { useNavigate } from "react-router";
import { useUpdateEffect, usePrevious } from "@reactuses/core";
import styles from "./Trailer.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";

export function Trailer() {
  const { boardState: state } = useBoardState();
  const navigate = useNavigate();
  const previousState = usePrevious(state);

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
        <video src="trailer.mp4" loop autoPlay controls={false}></video>
      </div>
    </SpaceBackground>
  );
}
