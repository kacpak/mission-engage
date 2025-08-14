import { useMemo, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "./Draggable";
import { Droppable } from "./Dropable";
import styles from "./Playground.module.css";
import { FIELDS, TANGIBLES } from "../../consts";
import { useUpdateEffect } from "@reactuses/core";

type BoardState = Record<(typeof FIELDS)[number], (typeof TANGIBLES)[number] | null>;

export function Playground() {
  const [state, setState] = useState(() => Object.fromEntries(FIELDS.map((field) => [field, null])) as BoardState);
  const parentless = useMemo(() => {
    const withParent = Object.values(state).filter(Boolean);
    return TANGIBLES.filter((node) => !withParent.includes(node));
  }, [state]);

  useUpdateEffect(() => {
    (window.opener as Window).sendMessageToClients({
      type: "whiteboard-state",
      payload: {
        s1: state["flow-1"],
        s2: state["flow-2"],
        s3: state["flow-3"],
        s4: state["flow-4"],
        s5: state["help"],
      },
    });
  }, [state]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        {Object.entries(state).map(([droppableId, node]) => (
          <Droppable id={droppableId} key={droppableId}>
            {node ? (
              <Draggable key={node} id={node}>
                {node}
              </Draggable>
            ) : (
              droppableId
            )}
          </Droppable>
        ))}
        <div className={styles.tangibles}>
          {parentless.map((node) => (
            <Draggable key={node} id={node}>
              {node}
            </Draggable>
          ))}
        </div>
      </div>
    </DndContext>
  );

  function handleDragEnd({ over, active }: DragEndEvent) {
    if (over?.id) {
      setState((_state) => {
        const oldEntry = Object.entries(_state).find(([, node]) => node === active.id);
        return oldEntry
          ? {
              ..._state,
              [oldEntry[0]]: null,
              [over.id]: active.id,
            }
          : {
              ..._state,
              [over.id]: active.id,
            };
      });
    } else {
      setState((_state) => {
        const oldEntry = Object.entries(_state).find(([, node]) => node === active.id);
        return oldEntry
          ? {
              ..._state,
              [oldEntry[0]]: null,
            }
          : _state;
      });
    }
  }
}
