import type { ReactNode } from "react";
import styles from "./SpaceBackground.module.css";
import { TwinklingStars } from "./TwinklingStars";
import classNames from "classnames";

type SpaceBackgroundProps = {
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function SpaceBackground({ className, contentClassName, children }: SpaceBackgroundProps) {
  return (
    <div className={classNames(className, styles.spaceBackground)}>
      <TwinklingStars count={100} />
      <div className={classNames(contentClassName, styles.children)}>{children}</div>
    </div>
  );
}
