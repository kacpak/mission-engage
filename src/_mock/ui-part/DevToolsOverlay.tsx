import "../hardware-part/ws";
import { createPortal } from "react-dom";
import styles from "./DevToolsOverlay.module.css";

function DevToolsEntry() {
  return (
    <div className={styles.whiteboard}>
      <button
        onClick={() => window.open("/src/_mock/index.html", "mock-playground", "popup=true,width=1000,height=1000")}
      >
        Open playground
      </button>
    </div>
  );
}

export default function WhiteboardDevTools() {
  return createPortal(<DevToolsEntry />, document.body);
}
