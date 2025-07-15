import { useEffect, useRef, useState } from "react";

import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useSWRHook } from "@/hooks/use-swr";

const useGetFleetSearchStatus = (orderId, shouldRefetch = false) => {
  const intervalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const previousShowPopupRef = useRef(false);

  const { data: fleetSearchStatusData, mutate: refetchFleetSearchStatus } =
    useSWRHook(`v1/orders/${orderId}/fleet-search-status`);

  const fleetSearchStatus = fleetSearchStatusData?.Data || null;
  const shouldShowPopup =
    (fleetSearchStatus?.shouldShowPopup || false) && !isShow;

  // Function to clear the interval
  const clearRefetchInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Effect to track changes in shouldShowPopup
  useEffect(() => {
    // Check if shouldShowPopup changed from false to true
    if (shouldShowPopup && !previousShowPopupRef.current) {
      setIsOpen(true);
      // Stop the interval when popup should be shown
      clearRefetchInterval();
    }

    // Update the ref with current value for next comparison
    previousShowPopupRef.current = shouldShowPopup;
  }, [shouldShowPopup]);

  useShallowCompareEffect(() => {
    // Clear any existing interval first
    clearRefetchInterval();

    // Only set up auto-refresh if shouldRefetch is true and shouldShowPopup is false
    if (shouldRefetch && !shouldShowPopup) {
      // Perform an initial fetch when shouldRefetch becomes true
      refetchFleetSearchStatus();

      // Set up the interval for auto-refresh
      intervalRef.current = setInterval(
        () => {
          refetchFleetSearchStatus();
        },
        3 * 60 * 1000
      ); // 3 minutes interval
    }

    // Clean up function
    return () => {
      clearRefetchInterval();
    };
  }, [shouldRefetch, shouldShowPopup]);

  // NEW: Effect to clear interval when isShow becomes true
  useEffect(() => {
    if (isShow) {
      clearRefetchInterval();
    }
  }, [isShow]);

  return {
    isOpen,
    isShow,
    setIsOpen,
    setIsShow,
  };
};

export default useGetFleetSearchStatus;
