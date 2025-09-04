import styles from "./Presents.module.css";
import { SpaceBackground } from "../components/SpaceBackground.tsx";
import coconetUrl from "../assets/coconet.svg?url";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Presents() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/title")
    }, 5000)
  })

  return (
    <SpaceBackground type="presents" contentClassName={styles.wrapper}>
      <img src={coconetUrl} className={styles.coconetLogo} alt="coconet" />
      presents
    </SpaceBackground>
  );
}
