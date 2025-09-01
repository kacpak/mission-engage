import { useWhiteboardState } from "../useWhiteboardState.ts";
import { useNavigate } from "react-router";
import styles from "./ChooseUseCase.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import AstronautTangible from "../assets/astronaut-tangible.svg?react";
import Arrow from "../assets/arrow.svg?react";
import { useEffect, useMemo, useState } from "react";
import { USE_CASES } from "../consts.ts";

const useTimer = (choice: string | undefined) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(0);

  const to = useMemo(() => {
    if (choice) {
      const date = new Date();
      date.setSeconds(date.getSeconds() + 11);
      return date;
    } else {
      return null;
    }
  }, [choice]);

  useEffect(() => {
    if (to) {
      const interval = setInterval(() => {
        setTimeLeft((to.getTime() - new Date().getTime()) / 1000);
      }, 100);
      return () => {
        clearInterval(interval);
      };
    } else {
      setTimeLeft(null);
    }
  }, [to]);

  return timeLeft;
};

export function ChooseUseCase() {
  const state = useWhiteboardState();
  const navigate = useNavigate();

  const choice = Object.entries(state ?? {}).find(
    ([key, value]) => value === "astronaut" && ["s1", "s2", "s3"].includes(key),
  )?.[0];
  const timeLeft = useTimer(choice);

  useEffect(() => {
    if (choice && typeof timeLeft === "number" && timeLeft <= 0) {
      navigate(`/useCase/${USE_CASES[parseInt(choice.slice(1)) - 1]}/game`, { viewTransition: true });
    }
  }, [choice, navigate, timeLeft]);

  return (
    <SpaceBackground className={styles.wrapper} contentClassName={styles.inner}>
      <h1>How to choose a use case</h1>
      {typeof timeLeft === "number" ? (
        <div className={styles.onSelectedText}>
          <div>
            Use case selected. The game will start in: <span>00:{String(Math.floor(timeLeft)).padStart(2, "0")}</span>
          </div>
          <div>You can still change your selection.</div>
        </div>
      ) : (
        <ol>
          <li>Move the astronaut on one of the use cases</li>
          <li>The game will start automatically after some time</li>
        </ol>
      )}
      <div className={styles.useCases}>
        {!choice && (
          <>
            <Arrow className={styles.arrow} />
            <AstronautTangible className={styles.tangibleDummy} />
          </>
        )}
        {USE_CASES.map((text, i) => (
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
