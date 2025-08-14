import { type ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import styles from "./Playground.module.css";

export function Droppable(props: { id: string; children?: ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} className={styles.droppable} data-id={props.id} data-is-over={isOver}>
      {props.children}
    </div>
  );
}
