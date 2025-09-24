import { useParams } from "react-router";
import type { UseCaseTitle } from "../consts.ts";
import { Highscore } from "../components/Highscore.tsx";

export default function GameVictoryHighscore() {
  const { id, useCase } = useParams<{ useCase: UseCaseTitle; id: string }>();

  return <Highscore useCase={useCase!} highlightedId={parseInt(id!, 10)} autoRefresh />;
}
