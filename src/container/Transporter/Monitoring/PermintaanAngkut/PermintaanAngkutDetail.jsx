import { useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetTransportRequestDetail } from "@/services/Transporter/monitoring/getTransportRequestListDetail";

import DetailContent from "./components/DetailContent";
import ModalTerimaPermintaan from "./components/ModalTerimaPermintaan";

const PermintaanAngkutDetail = ({ request, onBack, onUnderstand }) => {
  // Get detailed data using the request ID
  const { data: detailData, isLoading } = useGetTransportRequestDetail(
    request?.id
  );

  // Use detailed data if available, fallback to basic request data
  const displayData = detailData || request;

  // Local state for bookmark toggle
  const [isSaved, setIsSaved] = useState(displayData?.isSaved || false);

  // Modal state
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  // Handle bookmark toggle
  const handleSave = () => {
    setIsSaved((prev) => !prev);
    console.log(
      "Bookmark toggled for:",
      displayData?.orderCode,
      "New state:",
      !isSaved
    );
    // TODO: Implement API call to save/unsave bookmark
  };

  // Handle accept button click
  const handleAcceptClick = () => {
    setShowAcceptModal(true);
  };

  // Handle modal accept
  const handleModalAccept = (acceptData) => {
    // TODO: Implement API call to accept request
    toast.success(
      `Permintaan ${displayData?.orderCode} berhasil diterima dengan ${acceptData.truckCount} unit`
    );

    console.log("Request accepted:", acceptData);
    setShowAcceptModal(false);

    // Close detail view after successful accept
    onBack();
  };

  // Handle understand button click
  const handleUnderstand = () => {
    // Show success toast with order code
    toast.success(`Permintaan ${request.orderCode} berhasil ditutup`);

    // Call parent callback to remove the card from list
    if (onUnderstand) {
      onUnderstand(request.id);
    }

    // Close the detail view
    onBack();

    // TODO: Implement additional understand functionality if needed
    console.log("Understand clicked for:", request.orderCode);
  };

  // Helper functions for status tag colors
  const getOrderTypeStyle = (orderType) => {
    if (orderType === "INSTANT") {
      return "bg-green-50 text-green-700";
    } else if (orderType === "SCHEDULED") {
      return "bg-blue-50 text-blue-700";
    }
    return "bg-primary-50 text-primary-700"; // fallback
  };

  const getTimeLabelStyle = (timeLabelText) => {
    if (!timeLabelText) return "bg-primary-50 text-primary-700";

    const lowerText = timeLabelText.toLowerCase();

    // Green: Muat Hari Ini, Muat Besok
    if (lowerText.includes("hari ini") || lowerText.includes("besok")) {
      return "bg-green-50 text-green-700";
    }

    // Yellow: Muat 2-5 Hari
    const dayMatch = lowerText.match(/muat (\d+) hari/);
    if (dayMatch) {
      const days = parseInt(dayMatch[1]);
      if (days >= 2 && days <= 5) {
        return "bg-yellow-50 text-yellow-700";
      } else if (days > 5) {
        return "bg-blue-50 text-blue-700";
      }
    }

    return "bg-primary-50 text-primary-700"; // fallback
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Rp0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatWeight = (weight, unit) => {
    if (!weight) return "-";
    return `${weight.toLocaleString("id-ID")} ${unit || "kg"}`;
  };

  const formatDateTime = (startTime, endTime) => {
    if (!startTime || !endTime) return "-";

    const start = new Date(startTime);
    const end = new Date(endTime);

    const dateFormat = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    };

    const timeFormat = {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    };

    const dateStr = start.toLocaleDateString("id-ID", dateFormat);
    const startTimeStr = start.toLocaleTimeString("id-ID", timeFormat);
    const endTimeStr = end.toLocaleTimeString("id-ID", timeFormat);

    return `${dateStr} ${startTimeStr} WIB s/d ${endTimeStr} WIB`;
  };

  // Combine all cargo into one description
  const combinedCargoDescription = useMemo(() => {
    if (!displayData?.cargos?.length)
      return displayData?.cargoDescription || "-";

    return displayData.cargos
      .map((cargo) => {
        const parts = [cargo.name];
        if (cargo.weight && cargo.weightUnit) {
          parts.push(`(${formatWeight(cargo.weight, cargo.weightUnit)})`);
        }
        return parts.join(" ");
      })
      .join(", ");
  }, [displayData?.cargos, displayData?.cargoDescription]);

  // Get route description
  const routeDescription = useMemo(() => {
    const pickup = displayData?.pickupLocations?.[0];
    const dropoff = displayData?.dropoffLocations?.[0];

    if (!pickup || !dropoff) return "Route tidak tersedia";

    return `${pickup.city}, ${pickup.province} → ${dropoff.city}, ${dropoff.province}`;
  }, [displayData?.pickupLocations, displayData?.dropoffLocations]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-92px-48px)] flex-col bg-white">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 text-neutral-500">
            <IconComponent
              src="/icons/loader-truck-spinner.svg"
              className="h-6 w-6 animate-spin"
            />
            <span className="text-sm font-medium">Memuat detail...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[calc(100vh-92px-48px)] flex-col bg-white",
        displayData?.isTaken
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex flex-shrink-0 justify-between bg-white px-4",
          displayData?.isTaken && "grayscale"
        )}
      >
        <h1
          className={cn(
            "py-6 text-base font-bold",
            displayData?.isTaken && "grayscale"
              ? "text-neutral-600"
              : "text-neutral-900"
          )}
        >
          Detail Permintaan Jasa Angkut
        </h1>

        {/* Close Button */}
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full pt-2 hover:bg-neutral-100"
        >
          <IconComponent
            src="/icons/close24.svg"
            className={cn(
              "h-5 w-5",
              displayData?.isTaken ? "text-neutral-600" : "text-neutral-700"
            )}
          />
        </button>
      </div>

      {/* Scrollable Content - Using DetailContent Component */}
      <DetailContent
        displayData={displayData}
        request={request}
        formatCurrency={formatCurrency}
        getOrderTypeStyle={getOrderTypeStyle}
        getTimeLabelStyle={getTimeLabelStyle}
        handleSave={handleSave}
        isSaved={isSaved}
      />

      {/* Action Buttons */}
      <div className="flex-shrink-0 border-t border-neutral-400 bg-white px-5 py-3">
        <div className="flex gap-2">
          {displayData?.isTaken ? (
            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full rounded-xl bg-error-50 p-2">
                <span className="text-xs font-semibold text-error-400">
                  Permintaan sudah diambil transporter lain
                </span>
              </div>
              <Button
                variant="muattrans-primary"
                className="w-full py-3 text-[14px] font-semibold"
                onClick={handleUnderstand}
              >
                Mengerti
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="muattrans-error-secondary"
                className="flex-1 py-2 text-[14px] font-semibold"
                onClick={onBack}
              >
                Tolak
              </Button>
              <Button
                variant="muattrans-primary"
                className="flex-1 py-2 text-[14px] font-semibold"
                onClick={handleAcceptClick}
              >
                Terima
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modal Terima Permintaan */}
      <ModalTerimaPermintaan
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        request={displayData}
        onAccept={handleModalAccept}
      />
    </div>
  );
};

export default PermintaanAngkutDetail;
