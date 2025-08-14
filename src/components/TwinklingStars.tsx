import styles from "./TwinklingStars.module.css";
import { useMemo, type CSSProperties } from "react";

type Star = {
  id: number;
  left: number; // percent
  top: number; // percent
  size: number; // px
  delay: number; // s
  duration: number; // s
  opacityMin: number;
  opacityMax: number;
};

type TwinklingStarsProps = {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speedMultiplier?: number;
  className?: string;
};

export function TwinklingStars({
  count = 150,
  color = "#fff",
  minSize = 1,
  maxSize = 3.5,
  speedMultiplier = 1,
}: TwinklingStarsProps) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, id): Star => {
        const duration = (1.5 + Math.random() * 4.5) / speedMultiplier;
        return {
          id,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: minSize + Math.random() * (maxSize - minSize),
          duration,
          delay: Math.random() * duration * -1,
          opacityMin: 0.05 + Math.random() * 0.2,
          opacityMax: 0.6 + Math.random() * 0.4,
        };
      }),
    [count, maxSize, minSize, speedMultiplier],
  );

  return (
    <div aria-hidden className={styles.wrapper}>
      {stars.map((s) => (
        <div
          key={s.id}
          className={styles.twinkleStar}
          style={
            {
              viewTransitionName: `star-${s.id}`,
              "--left": `${s.left}%`,
              "--top": `${s.top}%`,
              "--size": s.size,
              "--opacity-min": s.opacityMin,
              "--opacity-max": s.opacityMax,
              "--animation-delay": `${s.delay}s`,
              "--animation-duration": `${s.duration}s`,
              "--color": color,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
