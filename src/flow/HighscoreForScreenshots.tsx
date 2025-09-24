import { useParams } from "react-router";
import type { UseCaseTitle } from "../consts.ts";
import { Highscore } from "../components/Highscore.tsx";

export default function HighscoreForScreenshots() {
  const { useCase } = useParams<{ useCase: UseCaseTitle }>();

  return <Highscore useCase={useCase!} />;
}
