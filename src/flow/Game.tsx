import styles from "./Game.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import { useEffect, useState } from "react";

const usePlayTime = (startDate: Date) => {
  const [playTime, setPlayTime] = useState("00:00");
  useEffect(() => {
    const interval = setInterval(() => {
      const timePlayedInSeconds = Math.floor((new Date().getTime() - startDate.getTime()) / 1000);
      const seconds = timePlayedInSeconds % 60;
      const minutes = Math.floor(timePlayedInSeconds / 60);

      setPlayTime(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [startDate]);
  return playTime;
};

export function Game() {
  const [startTime] = useState(new Date());
  const playTime = usePlayTime(startTime);
  return (
    <SpaceBackground className={styles.wrapper} type="gameplay" overlay={["black"]}>
      <h1>Game! Play time: {playTime}</h1>
    </SpaceBackground>
  );
}
