import "@fontsource-variable/roboto";
import WhiteboardDevTools from "./_mock/ui-part/DevToolsOverlay.tsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router";
import { Trailer } from "./flow/Trailer.tsx";
import { Title } from "./flow/Title.tsx";
import { HowTo } from "./flow/HowTo.tsx";
import { useWhiteboardState } from "./useWhiteboardState.ts";

const router = createHashRouter([
  {
    index: true,
    Component: Trailer,
  },
  {
    path: "title",
    Component: Title,
  },
  {
    path: "howTo",
    Component: HowTo,
  },
  {
    path: "useCase",
    Component() {
      return "select use case";
    },
  },
  {
    path: "useCase/:useCase/game",
    Component() {
      return "game";
    },
  },
  {
    path: "victory",
    Component() {
      return "victory";
    },
  },
]);

export function App() {
  useWhiteboardState();
  return (
    <>
      <RouterProvider router={router} />
      <WhiteboardDevTools />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
