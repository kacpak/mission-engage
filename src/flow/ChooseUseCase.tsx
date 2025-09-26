import { useBoardState } from "../useBoardState.ts";
import { useNavigate } from "react-router";
import styles from "./ChooseUseCase.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import OkIcon from "../assets/ok-icon.svg?react";
import RobotFront from "../assets/robot-front.svg?react";
import Arrow from "../assets/arrow.svg?react";
import { useEffect, useMemo, useState } from "react";
import { USE_CASES } from "../consts.ts";
import { Slot } from "../components/Slot.tsx";
import { useSound } from "react-sounds";
import { useUpdateEffect } from "@reactuses/core";

const COUNTDOWN_FROM = 5;

const useTimer = (choice: string | undefined) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(0);

  const to = useMemo(() => {
    if (choice) {
      const date = new Date();
      date.setSeconds(date.getSeconds() + COUNTDOWN_FROM + 1);
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
  const { boardState: state } = useBoardState();
  const navigate = useNavigate();

  const choice = Object.entries(state ?? {}).find(
    ([key, value]) => value === "astronaut" && ["s1", "s2", "s3"].includes(key),
  )?.[0];
  const timeLeft = useTimer(choice);
  const timeLeftFormatted = useMemo(
    () => (timeLeft ? `00:${String(Math.max(0, Math.floor(timeLeft))).padStart(2, "0")}` : null),
    [timeLeft],
  );

  const { play } = useSound("sounds/success_bling.mp3");

  useUpdateEffect(() => {
    if (timeLeftFormatted && timeLeftFormatted !== `00:${("" + COUNTDOWN_FROM).padStart(2, "0")}`) {
      void play();
    }
  }, [timeLeftFormatted]);

  useUpdateEffect(() => {
    if (choice) {
      void play();
    }
  }, [choice]);

  useEffect(() => {
    if (choice && typeof timeLeft === "number" && timeLeft <= 0) {
      navigate(`/useCase/${USE_CASES[parseInt(choice.slice(1)) - 1].title}/game`, { viewTransition: true });
    }
  }, [choice, navigate, timeLeft]);

  return (
    <SpaceBackground className={styles.wrapper} contentClassName={styles.inner}>
      <h1>Choose a workflow</h1>
      {typeof timeLeft === "number" ? (
        <div className={styles.onSelectedText}>
          <div>
            Workflow selected. The game will start in: <span>{timeLeftFormatted}</span>
          </div>
          <div>You can still change your selection.</div>
        </div>
      ) : (
        <ol>
          <li>Move the robot on one of the workflows</li>
          <li>The game will start automatically after some time</li>
        </ol>
      )}
      <div className={styles.useCases}>
        {USE_CASES.map(({ title, description }, i) => {
          const isSelected = `s${i + 1}` === choice;
          return (
            <Slot key={i} className={styles.useCase} type={isSelected ? "success" : "neutral"}>
              <div className={styles.title}>{title}</div>
              <div className={styles.choice}>{isSelected ? <OkIcon className={styles.tangible} /> : i + 1}</div>
              <div className={styles.description}>{description}</div>
            </Slot>
          );
        })}
        {!choice && (
          <>
            <Arrow className={styles.arrow} />
            <RobotFront className={styles.tangibleDummy} />
          </>
        )}
      </div>
    </SpaceBackground>
  );
}
