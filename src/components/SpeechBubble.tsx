import type { ReactNode } from "react";
import classNames from "classnames";
import styles from "./SpeechBubble.module.css";
import SpeechBubbleTail from "../assets/speech-bubble-tail.svg?react";

type SpeechBubbleProps = {
  className?: string;
  children?: ReactNode;
};

export function SpeechBubble({ className, children }: SpeechBubbleProps) {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <SpeechBubbleTail className={styles.tail} />
      <div className={styles.bubble}>{children}</div>
    </div>
  );
}
