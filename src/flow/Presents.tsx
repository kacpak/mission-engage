import styles from "./Presents.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import coconetUrl from "../assets/coconet.svg?url";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSound } from "react-sounds";

export function Presents() {
  const { play } = useSound("sounds/CocoGames.mp3");

  useEffect(() => {
    void play();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/title", { viewTransition: true });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <SpaceBackground type="presents" contentClassName={styles.wrapper}>
      <img src={coconetUrl} className={styles.coconetLogo} alt="coconet" />
      presents
    </SpaceBackground>
  );
}
