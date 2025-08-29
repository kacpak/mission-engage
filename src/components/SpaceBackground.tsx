import type { ReactNode } from "react";
import styles from "./SpaceBackground.module.css";
import classNames from "classnames";

type SpaceBackgroundProps = {
  className?: string;
  contentClassName?: string;
  overlay?: ("black" | "blue")[];
  type?: "gameplay" | "outside";
  children: ReactNode;
};

export function SpaceBackground({
  className,
  contentClassName,
  overlay = ["black", "blue"],
  type = "outside",
  children,
}: SpaceBackgroundProps) {
  return (
    <div className={classNames(className, styles.spaceBackground)} data-overlay={overlay} data-type={type}>
      <div className={classNames(contentClassName, styles.children)}>{children}</div>
    </div>
  );
}
