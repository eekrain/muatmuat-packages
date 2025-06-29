import { useEffect, useRef, useState } from "react";

import { differenceInSeconds } from "date-fns";

export const useCountdown = ({ endingDate, isNeedCountdown }) => {
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
          setCountdown("00:00");
          setIsCountdownFinished(true);
          clearInterval(intervalRef.current);
          return;
        }

        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;

        if (hours > 0) {
          setCountdown(
            `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          );
        } else {
          setCountdown(
            `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`
          );
        }
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
