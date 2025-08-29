import { useEffect } from "react";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useNavigate } from "react-router";

export default function GameIntro() {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("instruction", { viewTransition: true });
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);
  return <SpaceBackground type="gameplay">Here we will play a game intro and after it ends....</SpaceBackground>;
}
