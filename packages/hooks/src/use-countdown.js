import { useEffect, useRef, useState } from "react";

import { differenceInSeconds } from "date-fns";

export const useCountdown = ({
  endingDate,
  isNeedCountdown,
  withHours = true,
}) => {
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [countdown, setCountdown] = useState("");
  const intervalRef = useRef();

  useEffect(() => {
    if (isNeedCountdown && endingDate) {
      const updateCountdown = () => {
        const now = new Date();
        const dueDate = new Date(endingDate);
        const diffInSeconds = differenceInSeconds(dueDate, now);

        if (diffInSeconds <= 0) {
          setCountdown(withHours ? "00:00:00" : "00:00");
          setIsCountdownFinished(true);
          clearInterval(intervalRef.current);
          return;
        }

        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;
        const hh = !isNaN(hours) ? hours.toString().padStart(2, "0") : "00";
        const mm = !isNaN(minutes) ? minutes.toString().padStart(2, "0") : "00";
        const ss = !isNaN(seconds) ? seconds.toString().padStart(2, "0") : "00";

        setCountdown(withHours ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`);
      };

      updateCountdown();
      intervalRef.current = setInterval(updateCountdown, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [endingDate, isNeedCountdown]);

  return { countdown, isCountdownFinished };
};

export function useFlexibleCountdown(startTime, durationSeconds) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const endTime = new Date(startTime.getTime() + durationSeconds * 1000);
    return Math.floor((endTime.getTime() - now.getTime()) / 1000);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const endTime = new Date(startTime.getTime() + durationSeconds * 1000);
      const diff = Math.floor((endTime.getTime() - now.getTime()) / 1000);
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationSeconds]);

  const minutes = Math.floor(Math.abs(timeLeft) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.abs(timeLeft % 60)
    .toString()
    .padStart(2, "0");

  return {
    timeLeft, // dalam detik, bisa negatif
    formatted: `${minutes}:${seconds}`,
    isNegative: timeLeft < 0,
  };
}
