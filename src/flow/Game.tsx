import styles from "./Game.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { type FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import PlayerStatsBG from "../assets/player-stats-bg.svg?react";
import HeartFull from "../assets/heart_full.svg?react";
import HeartEmpty from "../assets/heart_empty.svg?react";
import banklingBackUrl from "../assets/bankling-back.png?url";
import robotBackUrl from "../assets/robot-back.png?url";
import { useNavigate, useParams } from "react-router";
import { MAX_LIFES, type TANGIBLES, type UseCaseTitle, WINNING_ORDERS } from "../consts.ts";
import { useWhiteboardState } from "../useWhiteboardState.ts";
import type { ComponentType, ComponentProps } from "react";
import TangibleForm from "../assets/tangible-form.svg?react";
import TangibleSign from "../assets/tangible-sign.svg?react";
import TangibleDataProcessing from "../assets/tangible-data-processing.svg?react";
import TangibleApproval from "../assets/tangible-approval.svg?react";
import { isEqual } from "es-toolkit";
import { msToFormattedDuration } from "../utils.ts";
import { Slot } from "../components/Slot.tsx";

const usePlayTime = (startDate: Date) => {
  const [playTime, setPlayTime] = useState("00:00");
  const interval = useRef<ReturnType<typeof setInterval>>(null);
  useEffect(() => {
    interval.current = setInterval(() => {
      setPlayTime(msToFormattedDuration(new Date().getTime() - startDate.getTime()));
    }, 100);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [startDate]);
  const stopPlayTime = useCallback(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }
  }, []);
  return { playTime, stopPlayTime };
};

const tangibles: Partial<Record<(typeof TANGIBLES)[number], ComponentType<ComponentProps<"svg">>>> = {
  "form-flow": TangibleForm,
  "data-processing": TangibleDataProcessing,
  approval: TangibleApproval,
  signature: TangibleSign,
};

export const ImproperTangible: FunctionComponent = () => "❌";

export function Game() {
  const boardState = useWhiteboardState();
  const { useCase } = useParams<{ useCase: UseCaseTitle }>();
  const workflow = useMemo(() => [boardState?.s1, boardState?.s2, boardState?.s3, boardState?.s4], [boardState]);
  const gameState = useMemo(
    () =>
      workflow.every((_) => !!_) ? (isEqual(workflow, WINNING_ORDERS[useCase!]) ? "success" : "error") : "pending",
    [workflow, useCase],
  );
  const [startTime] = useState(new Date());
  const [lifesLeft, setLifesLeft] = useState(MAX_LIFES);
  const { playTime, stopPlayTime } = usePlayTime(startTime);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameState === "error") {
      setLifesLeft((_) => _ - 1);
    } else if (gameState === "success") {
      stopPlayTime();
      navigate(`victory/${new Date().getTime() - startTime.getTime()}`);
    }
  }, [gameState, navigate, startTime, stopPlayTime]);

  useEffect(() => {
    if (lifesLeft <= 0) {
      stopPlayTime();
      alert("you lost");
    }
  }, [lifesLeft, stopPlayTime]);

  return (
    <SpaceBackground className={styles.wrapper} type="gameplay" overlay={["black"]}>
      <div className={styles.playerStats}>
        <PlayerStatsBG className={styles.playerStatsBg} />
        <div className={styles.player}>Player 1</div>
        <div className={styles.lifeGauge}>
          {Array(MAX_LIFES)
            .fill(null)
            .map((_, i) => (lifesLeft >= i + 1 ? <HeartFull key={i} /> : <HeartEmpty key={i} />))}
        </div>
        <div className={styles.playTime}>{playTime}</div>
      </div>
      <div className={styles.heros}>
        <img src={banklingBackUrl} className={styles.bankling} />
        <img src={robotBackUrl} className={styles.robot} />
      </div>
      <div className={styles.villan}></div>
      <div className={styles.workflow}>
        {workflow.map((tangible, i) => {
          const TangibleIcon = tangible ? (tangibles[tangible as keyof typeof tangibles] ?? ImproperTangible) : null;
          return (
            <Slot
              className={styles.tangibleSlot}
              key={`${i}-${tangible}`}
              type={
                gameState === "success"
                  ? "success"
                  : gameState === "error"
                    ? "error"
                    : TangibleIcon
                      ? "pending"
                      : "neutral"
              }
            >
              {TangibleIcon ? <TangibleIcon className={styles.tangibleIcon} /> : i + 1}
            </Slot>
          );
        })}
      </div>
      <div className={styles.useCase}>{useCase}</div>
    </SpaceBackground>
  );
}
