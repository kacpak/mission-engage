import type { ReactNode } from "react";
import classNames from "classnames";
import styles from "./Slot.module.css";

type SlotProps = {
  className?: string;
  type?: "neutral" | "pending" | "error" | "success";
  children?: ReactNode;
};

export function Slot({ className, type = "neutral", children }: SlotProps) {
  return (
    <div className={classNames(styles.slot, className)} data-type={type}>
      {children}
    </div>
  );
}
