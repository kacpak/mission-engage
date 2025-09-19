import "@fontsource-variable/roboto";
import "@fontsource-variable/pixelify-sans";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router";
import { Trailer } from "./flow/Trailer.tsx";
import { Title } from "./flow/Title.tsx";
import { useBoardState } from "./useBoardState.ts";
import { ChooseUseCase } from "./flow/ChooseUseCase.tsx";
import { GameCountdown } from "./flow/GameCountdown.tsx";
import { Game } from "./flow/Game.tsx";
import HowToPlayVideo from "./flow/HowToPlayVideo.tsx";
import { GameReady } from "./flow/GameReady.tsx";
import GameVictory from "./flow/GameVictory.tsx";
import { Presents } from "./flow/Presents.tsx";
import { useEffect } from "react";
import GameOver from "./flow/GameOver.tsx";
import GameVictoryCleanup from "./flow/GameVictoryCleanup.tsx";
import GameOverCleanup from "./flow/GameOverCleanup.tsx";
import GameVictoryHighscore from "./flow/GameVictoryHighscore.tsx";
import { IS_MOCK } from "./consts.client.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HighscoreForScreenshots from "./flow/HighscoreForScreenshots.tsx";
import GameVictoryOutroVideo from "./flow/GameVictoryOutroVideo.tsx";
import GameOverOutroVideo from "./flow/GameOverOutroVideo.tsx";
import GameIntro from "./flow/GameIntro.tsx";
// import { useSound } from "react-sounds";

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
    Component: HowToPlayVideo,
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
        path: "ready",
        Component: GameReady,
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
            children: [
              {
                index: true,
                Component: GameVictoryOutroVideo,
              },
              {
                path: "congrats",
                Component: GameVictory,
              },
              {
                path: ":id/register-and-cleanup",
                Component: GameVictoryCleanup,
              },
              {
                path: ":id/highscore",
                Component: GameVictoryHighscore,
              },
            ],
          },
          {
            path: "game-over",
            children: [
              {
                index: true,
                Component: GameOverOutroVideo,
              },
              {
                path: "message",
                Component: GameOver,
              },
              {
                path: "cleanup",
                Component: GameOverCleanup,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "highscore/:useCase",
    Component: HighscoreForScreenshots,
  },
]);

export const queryClient = new QueryClient();

export function App() {
  // const { play } = useSound("8-bit-Chiptune_AdobeStock_547309534_preview.m4a", {
  //   loop: true,
  // });
  //
  // useEffect(() => {
  //   void play();
  // }, [play]);

  const state = useBoardState();

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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
