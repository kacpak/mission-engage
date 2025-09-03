export const msToFormattedDuration = (ms: number) => {
  const durationInSeconds = Math.floor(ms / 1000);
  const seconds = durationInSeconds % 60;
  const minutes = Math.floor(durationInSeconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
