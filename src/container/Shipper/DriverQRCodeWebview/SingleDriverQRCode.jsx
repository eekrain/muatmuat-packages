"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { getStatusScanMetadata } from "@/lib/normalizers/detailpesanan/getStatusScanMetadata";
import { useGetDriverQRCodeById } from "@/services/Shipper/detailpesanan/getDriverQRCodeById";
import { useLoadingAction } from "@/store/Shipper/loadingStore";

const SingleDriverQRCode = () => {
  const params = useParams();
  const { qrData, isLoading } = useGetDriverQRCodeById({
    orderId: params.orderId,
    driverId: params.driverId,
  });

  const statusScan = getStatusScanMetadata(qrData?.driverInfo?.statusScan);

  const { setIsGlobalLoading } = useLoadingAction();
  useEffect(() => {
    setIsGlobalLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, qrData]);

  if (!qrData) return null;

  return (
    <div className="flex justify-center px-4 pt-8">
      <div className="flex w-full max-w-[450px] flex-col items-center gap-y-6 border border-neutral-400 bg-neutral-50 px-6 py-9">
        <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
          {/* {statusScan().statusTitle} */}
          QR Code Lokasi Muat & Bongkar
        </h1>
        <div className="flex flex-col items-center gap-y-3">
          <BadgeStatusPesanan
            className="w-fit"
            variant={statusScan.hasScan ? "success" : "error"}
          >
            {statusScan.statusText}
          </BadgeStatusPesanan>

          <AvatarDriver
            name={qrData?.driverInfo.name}
            image={qrData?.driverInfo.driverImage}
            licensePlate={qrData?.driverInfo.licensePlate}
          />
        </div>
        <div className="h-[124px] w-[124px]">
          {qrData?.qrCodeImage && (
            <img
              src={qrData?.qrCodeImage}
              className="h-full w-full object-contain"
              alt="QR Code Lokasi Muat & Bongkar"
            />
          )}
        </div>
        <span className="text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
          *Tunjukkan QR Code ini kepada pihak driver agar dapat melanjutkan ke
          proses muat.
        </span>
      </div>
    </div>
  );
};

export default SingleDriverQRCode;
