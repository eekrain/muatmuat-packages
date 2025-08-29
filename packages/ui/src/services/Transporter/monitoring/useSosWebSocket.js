import { useEffect, useState } from "react";

// --- Mock Data ---
const mockNewSosAlert = {
  type: "NEW_SOS_ALERT",
  priority: "HIGH",
  timestamp: "2025-07-25T11:35:00Z",
  data: {
    sosId: "sos-uuid-mock-1",
    fleetInfo: {
      fleetId: "fleet-uuid-5",
      licensePlate: "B 1234 ABC",
      driver: {
        driverId: "driver-uuid-1",
        name: "John Doe",
        phoneNumber: "+628123456789",
      },
    },
    sosDetails: {
      category: {
        categoryId: "sos-cat-uuid-1",
        name: "Kecelakaan",
        icon: "accident",
      },
      description: "Kecelakaan ringan butuh bantuan",
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: "Tol Jagorawi KM 15",
      },
      hasPhotos: true,
      photoCount: 2,
    },
    counters: {
      totalActiveSOS: 4,
      unacknowledgedSOS: 3,
    },
  },
};

/**
 * Custom hook to manage SOS WebSocket connection and state.
 * In a real application, this would use a WebSocket client like socket.io-client.
 *
 * @returns {{
 *   latestSosAlert: object | null,
 *   sosCounters: { totalActiveSOS: number, unacknowledgedSOS: number },
 *   acknowledgeSosAlert: () => void
 * }}
 */
const useSosWebSocket = () => {
  const [latestSosAlert, setLatestSosAlert] = useState(null);
  const [sosCounters, setSosCounters] = useState({
    totalActiveSOS: 1,
    unacknowledgedSOS: 1,
  });

  useEffect(() => {
    // Simulate receiving a new SOS alert after 5 seconds for demonstration
    const timer = setTimeout(() => {
      console.log("WebSocket MOCK: Received NEW_SOS_ALERT");
      setLatestSosAlert(mockNewSosAlert.data);
      setSosCounters(mockNewSosAlert.data.counters);
    }, 5000);

    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  const acknowledgeSosAlert = () => {
    if (latestSosAlert) {
      // In a real app, you might send an acknowledgement message to the server.
      setLatestSosAlert(null); // Clear the alert from the UI
    }
  };

  return { latestSosAlert, sosCounters, acknowledgeSosAlert };
};

export default useSosWebSocket;
