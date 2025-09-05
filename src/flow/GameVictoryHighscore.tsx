import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function GameVictoryHighscore() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/", { viewTransition: true, replace: false });
    }, 15_000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <SpaceBackground type="gameplay">
      Here we will display highscore list after we implement a server :) In 15s you'll be redirected to looping trailer
    </SpaceBackground>
  );
}
