import "./ws";
import { createPortal } from "react-dom";
import Whiteboard from "./Whiteboard";

export default function WhiteboardDevTools() {
  return createPortal(<Whiteboard />, document.body);
}
