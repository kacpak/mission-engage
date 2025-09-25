import styles from "./Game.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import {
  type ComponentProps,
  type ComponentType,
  type FunctionComponent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PlayerStatsBG from "../assets/player-stats-bg.svg?react";
import HeartFull from "../assets/heart_full.svg?react";
import HeartEmpty from "../assets/heart_empty.svg?react";
import { useNavigate, useParams } from "react-router";
import { MAX_LIFES, type UseCaseTitle, WINNING_ORDERS, type WorkflowTangible } from "../consts.ts";
import { useBoardState } from "../useBoardState.ts";
import TangibleForm from "../assets/tangible-form.svg?react";
import TangibleSign from "../assets/tangible-sign.svg?react";
import TangibleDataProcessing from "../assets/tangible-data.svg?react";
import TangibleApproval from "../assets/tangible-accept.svg?react";
import villanUrl from "../assets/chaos.png?url";
import villanHandUrl from "../assets/chaos-hand.png?url";
import { isEqual } from "es-toolkit";
import { msToFormattedDuration } from "../utils.ts";
import { Slot } from "../components/Slot.tsx";
import { SpeechBubble } from "../components/SpeechBubble.tsx";
import { useTimeoutFn } from "@reactuses/core";
import classNames from "classnames";
import { TANGIBLES_HELP_TEXT } from "../consts.client.ts";
import { useSound } from "react-sounds";
import { useUpdateEffect } from "@reactuses/core";

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

const tangibles: Record<WorkflowTangible, ComponentType<ComponentProps<"svg">>> = {
  "form-flow": TangibleForm,
  "data-processing": TangibleDataProcessing,
  approval: TangibleApproval,
  signature: TangibleSign,
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
  const { play: playErrorSound } = useSound("sounds/error-sound-39539.mp3");
  const { play: playSlotIn } = useSound("sounds/slot-in-47863-shortened.mp3");
  const { boardState, sendMessage } = useBoardState();
  const { useCase } = useParams<{ useCase: UseCaseTitle }>();
  const workflow = useMemo(() => [boardState?.s1, boardState?.s2, boardState?.s3, boardState?.s4], [boardState]);
  const gameState = useMemo(
    () =>
      workflow.every((_) => !!_) ? (isEqual(workflow, WINNING_ORDERS[useCase!]) ? "success" : "error") : "pending",
    [workflow, useCase],
  );
  useUpdateEffect(() => {
    playSlotIn();
  }, [boardState]);
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
      showSpeechBubble({ text: TANGIBLES_HELP_TEXT[useCase!][helpTangible] });
    }
  }, [helpTangible, hideSpeechBubble, showSpeechBubble, useCase]);

  const [isPendingVictoryNavigation, startNavigationToVictoryScreen] = useTimeoutFn(
    () => navigate(`victory/${new Date().getTime() - startTime.getTime()}`, { viewTransition: true }),
    500,
    { immediate: false },
  );

  const [isPendingGameOverNavigation, startNavigationToGameOver] = useTimeoutFn(
    () => navigate(`game-over`, { viewTransition: true }),
    500,
    { immediate: false },
  );
  const [isShaking, setIsShaking] = useState(false);

  const isPendingNavigation = isPendingVictoryNavigation || isPendingGameOverNavigation;

  useEffect(() => {
    if (isPendingNavigation) {
      return;
    }

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
      void playErrorSound();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    } else if (gameState === "success") {
      stopPlayTime();
      sendMessage("blink");
      // showSpeechBubble({
      //   text: (
      //     <>
      //       Woohoo!
      //       <br />
      //       We made it!
      //     </>
      //   ),
      // });
      startNavigationToVictoryScreen();
    }
  }, [
    gameState,
    isPendingNavigation,
    // playErrorSound,
    sendMessage,
    showSpeechBubble,
    startNavigationToVictoryScreen,
    stopPlayTime,
  ]);

  useEffect(() => {
    if (isPendingNavigation) {
      return;
    }
    if (lifesLeft <= 0) {
      stopPlayTime();
      // showSpeechBubble({
      //   text: <>Oh well… chaos takes the crown!</>,
      // });
      startNavigationToGameOver();
    }
  }, [isPendingNavigation, lifesLeft, showSpeechBubble, startNavigationToGameOver, stopPlayTime]);

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
      <img src={villanUrl} alt="" className={classNames(styles.villan)} />
      <div className={classNames(styles.workflow, isShaking && styles.slotsShaking)}>
        {workflow.map((tangible, i) => {
          const Tangible = tangible ? tangibles[tangible as keyof typeof tangibles] : null;
          return (
            <Slot
              className={styles.tangibleSlot}
              key={`${i}-${tangible}`}
              type={
                gameState === "success" ? "success" : gameState === "error" ? "error" : Tangible ? "pending" : "neutral"
              }
            >
              {tangible ? Tangible ? <Tangible className={styles.tangibleIcon} /> : <ImproperTangible /> : i + 1}
            </Slot>
          );
        })}
      </div>
      <img src={villanHandUrl} alt="" className={classNames(styles.villanHand)} />
      <div className={styles.useCase}>{useCase}</div>
      <div className={styles.heroes}>
        <div className={styles.bankling} />
        <div className={styles.robotContainer}>
          <div className={styles.robot} />
          {speechText && <SpeechBubble className={styles.speechBubble}>{speechText}</SpeechBubble>}
        </div>
      </div>
    </SpaceBackground>
  );
}
