import styles from "./Game.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { type FunctionComponent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import PlayerStatsBG from "../assets/player-stats-bg.svg?react";
import HeartFull from "../assets/heart_full.svg?react";
import HeartEmpty from "../assets/heart_empty.svg?react";
import banklingBackUrl from "../assets/bankling-back.png?url";
import robotBackUrl from "../assets/robot-back.png?url";
import { useNavigate, useParams } from "react-router";
import { MAX_LIFES, TANGIBLES_HELP_TEXT, type UseCaseTitle, WINNING_ORDERS, type WorkflowTangible } from "../consts";
import { useWhiteboardState } from "../useWhiteboardState.ts";
import tangibleFormUrl from "../assets/tangible-form.png?url";
import tangibleSignUrl from "../assets/tangible-sign.png?url";
import tangibleDataProcessingUrl from "../assets/tangible-data-processing.png?url";
import tangibleApprovalUrl from "../assets/tangible-approval.png?url";
import { isEqual } from "es-toolkit";
import { msToFormattedDuration } from "../utils.ts";
import { Slot } from "../components/Slot.tsx";
import { SpeechBubble } from "../components/SpeechBubble.tsx";

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

const tangibles: Record<WorkflowTangible, string> = {
  "form-flow": tangibleFormUrl,
  "data-processing": tangibleDataProcessingUrl,
  approval: tangibleApprovalUrl,
  signature: tangibleSignUrl,
};

export const ImproperTangible: FunctionComponent = () => "❌";

const useSpeechBubble = () => {
  const [speechText, setSpeechText] = useState<ReactNode | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const clearBubbleTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const hideSpeechBubble = useCallback(() => {
    clearBubbleTimeout();
    setSpeechText(null);
  }, [clearBubbleTimeout]);

  const showSpeechBubble = useCallback(
    ({ text, timeout }: { text: ReactNode; timeout?: number }) => {
      clearBubbleTimeout();
      setSpeechText(text);
      if (timeout) {
        timeoutRef.current = setTimeout(() => {
          hideSpeechBubble();
        }, timeout);
      }
    },
    [clearBubbleTimeout, hideSpeechBubble],
  );

  useEffect(() => {
    return () => {
      clearBubbleTimeout();
    };
  }, [clearBubbleTimeout]);

  return {
    speechText,
    showSpeechBubble,
    hideSpeechBubble,
  };
};

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
  const { speechText, showSpeechBubble, hideSpeechBubble } = useSpeechBubble();
  const helpTangible = useMemo(() => boardState?.s5 as WorkflowTangible | null, [boardState]);

  useEffect(() => {
    if (!helpTangible) {
      hideSpeechBubble();
    } else {
      showSpeechBubble({ text: TANGIBLES_HELP_TEXT[helpTangible] });
    }
  }, [helpTangible, hideSpeechBubble, showSpeechBubble]);

  useEffect(() => {
    if (gameState === "error") {
      setLifesLeft((_) => _ - 1);
      showSpeechBubble({
        text: (
          <>
            Whoopsie!
            <br />
            Let's try again!
          </>
        ),
        timeout: 5000,
      });
    } else if (gameState === "success") {
      stopPlayTime();
      showSpeechBubble({
        text: (
          <>
            Woohoo!
            <br />
            We made it!
          </>
        ),
      });
      setTimeout(() => {
        navigate(`victory/${new Date().getTime() - startTime.getTime()}`, { viewTransition: true });
      }, 4000);
    }
  }, [gameState, navigate, showSpeechBubble, startTime, stopPlayTime]);

  useEffect(() => {
    if (lifesLeft <= 0) {
      stopPlayTime();
      showSpeechBubble({
        text: <>Oh well… chaos takes the crown!</>,
      });
      setTimeout(() => {
        navigate(`game-over`, { viewTransition: true });
      }, 4000);
    }
  }, [lifesLeft, navigate, showSpeechBubble, stopPlayTime]);

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
      <div className={styles.workflow}>
        {workflow.map((tangible, i) => {
          const tangibleUrl = tangible ? tangibles[tangible as keyof typeof tangibles] : null;
          return (
            <Slot
              className={styles.tangibleSlot}
              key={`${i}-${tangible}`}
              type={
                gameState === "success"
                  ? "success"
                  : gameState === "error"
                    ? "error"
                    : tangibleUrl
                      ? "pending"
                      : "neutral"
              }
            >
              {tangible ? (
                tangibleUrl ? (
                  <img src={tangibleUrl} className={styles.tangibleIcon} />
                ) : (
                  <ImproperTangible />
                )
              ) : (
                i + 1
              )}
            </Slot>
          );
        })}
      </div>
      <div className={styles.useCase}>{useCase}</div>
      <div className={styles.heros}>
        <img src={banklingBackUrl} className={styles.bankling} />
        <div className={styles.robotContainer}>
          <img src={robotBackUrl} className={styles.robot} />
          {speechText && <SpeechBubble className={styles.speechBubble}>{speechText}</SpeechBubble>}
        </div>
      </div>
      <div className={styles.villan}></div>
    </SpaceBackground>
  );
}
