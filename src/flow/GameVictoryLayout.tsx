import { Outlet } from "react-router";
import { useSound } from "react-sounds";
import { useEffect } from "react";

export function GameVictoryLayout() {
  const { play: playVictorySound } = useSound("sounds/victory-chime-366449.mp3");
  const { play: playFireworks } = useSound("sounds/fireworks.mp3");

  useEffect(() => {
    void playVictorySound();
    setTimeout(() => void playFireworks({ loop: true, volume: 0.5 }), 3000);
  }, []);

  return <Outlet />;
}
