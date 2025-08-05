import { useRef, useState } from "react";

import { addMinutes, isPast } from "date-fns";

import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { fetcherMuatrans } from "@/lib/axios";
import { DriverStatusScanEnum } from "@/lib/constants/detailpesanan/driver-status.enum";

const useMockData = false; // toggle mock data

const apiResultQRCode = {
  data: {
    Message: {
      code: 200,
      text: "QR Code generated successfully",
    },
    Data: {
      qrCodeImage:
        "data:image/png;base64,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",
      driverInfo: {
        driverId: "550e8400-e29b-41d4-a716-446655440090",
        driverImage: "https://picsum.photos/50",
        name: "Hendra",
        licensePlate: "B 1234 CD",
        statusScan: DriverStatusScanEnum.BELUM_SCAN_MUAT,
      },
      shareLink: "https://app.muattrans.com/qr/ABC123XYZ789",
      expiryTime: addMinutes(new Date(), 15),
    },
    Type: "QR_CODE_GENERATION",
  },
};

const exampleBody = {
  orderId: "550e8400-e29b-41d4-a716-446655440090",
  driverId: "550e8400-e29b-41d4-a716-446655440090",
};

export const useGetDriverQRCodeById = ({ orderId, driverId } = exampleBody) => {
  const [qrData, setQRData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  const generateQRCode = async () => {
    if (!orderId || !driverId) return;
    try {
      let result;
      if (useMockData) {
        result = apiResultQRCode;
      } else {
        result = await fetcherMuatrans.post("v1/orders/qr-codes/generate", {
          orderId,
          driverId,
        });
      }
      setQRData(result.data.Data);
    } catch (error) {
      console.log("Error generate QR Code", error);
    } finally {
      setIsLoading(false);
    }
  };

  useShallowCompareEffect(() => {
    // Handle case standby
    generateQRCode();

    // Set up auto-refresh
    intervalRef.current = setInterval(() => {
      if (
        qrData?.data?.expiryTime &&
        isPast(new Date(qrData.data.expiryTime))
      ) {
        generateQRCode();
      }
    }, 1000 * 60);

    return () => clearInterval(intervalRef.current);
  }, [orderId, driverId]);

  return { qrData, isLoading };
};
