import "@fontsource-variable/roboto";
import "@fontsource-variable/pixelify-sans";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router";
import { Trailer } from "./flow/Trailer.tsx";
import { Title } from "./flow/Title.tsx";
import { HowTo } from "./flow/HowTo.tsx";
import { useWhiteboardState } from "./useWhiteboardState.ts";
import { ChooseUseCase } from "./flow/ChooseUseCase.tsx";
import { GameCountdown } from "./flow/GameCountdown.tsx";
import { Game } from "./flow/Game.tsx";
import GameIntro from "./flow/GameIntro.tsx";
import { GameInstruction } from "./flow/GameInstruction.tsx";
import { IS_MOCK } from "./consts";
import GameVictory from "./flow/GameVictory.tsx";
import { Presents } from "./flow/Presents.tsx";
import { useEffect } from "react";

if (IS_MOCK) {
  const { default: WhiteboardDevTools } = await import("./_mock/ui-part/DevToolsOverlay.tsx");
  createRoot(document.getElementById("mock-root")!).render(<WhiteboardDevTools />);
}

const router = createHashRouter([
  {
    index: true,
    Component: Trailer,
  },
  {
    path: "presents",
    Component: Presents,
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
    path: "chooseUseCase",
    Component: ChooseUseCase,
  },
  {
    path: "useCase/:useCase/game",
    children: [
      {
        index: true,
        Component: GameIntro,
      },
      {
        path: "instruction",
        Component: GameInstruction,
      },
      {
        path: "countdown",
        Component: GameCountdown,
      },
      {
        path: "game",
        children: [
          {
            index: true,
            Component: Game,
          },
          {
            path: "victory/:durationInMs",
            Component: GameVictory,
          },
          {
            path: "failure",
          },
        ],
      },
    ],
  },
]);

export function App() {
  const state = useWhiteboardState();

  useEffect(() => {
    if (state?.s1 === "alien") {
      router.navigate("/");
    } else if (state?.s2 === "alien") {
      router.navigate("/title");
    } else if (state?.s3 === "alien") {
      router.navigate("/chooseUseCase");
    }
  }, [state]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
