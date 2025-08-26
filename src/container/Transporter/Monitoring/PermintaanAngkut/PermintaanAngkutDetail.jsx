import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetTransportRequestList } from "@/services/Transporter/monitoring/permintaan-angkut/getTransportRequestList";

import DetailContent from "./components/DetailContent";
import ModalTerimaPermintaan from "./components/ModalTerimaPermintaan";
import ModalTolakPermintaan from "./components/ModalTolakPermintaan";

const PermintaanAngkutDetail = ({
  request,
  onBack,
  onUnderstand,
  onAccept,
}) => {
  const { t } = useTranslation();

  // Fetch detail data from list
  const { data: listData, isLoading } = useGetTransportRequestList({});
  const detailData = listData?.requests?.find((r) => r.id === request?.id);
  const displayData = detailData || request;

  // State
  const [isSaved, setIsSaved] = useState(displayData?.isSaved || false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showTolakModal, setShowTolakModal] = useState(false);

  // Bookmark handler
  const handleSave = () => {
    setIsSaved((prev) => !prev);
    // TODO: API call for bookmark
  };

  const router = useRouter();

  // Accept modal handler
  const handleAcceptClick = () => {
    if (request.orderType === "SCHEDULED") {
      setShowAcceptModal(true);
    } else {
      if (onAccept) {
        onAccept(request);
      }
      router.push(`/monitoring/pilih-armada?id=${request.id}`);
    }
  };

  // Tolak modal handler
  const handleTolakClick = () => {
    setShowTolakModal(true);
  };
  const handleModalAccept = (acceptData) => {
    toast.success(
      t(
        "PermintaanAngkutDetail.toastSuccessRequestAccepted",
        {
          orderCode: displayData?.orderCode,
          truckCount: acceptData.truckCount,
        },
        `Permintaan ${displayData?.orderCode} berhasil diterima dengan ${acceptData.truckCount} unit`
      )
    );
    setShowAcceptModal(false);
    onBack();
  };

  // Understand handler
  const handleUnderstand = () => {
    toast.success(
      t(
        "PermintaanAngkutDetail.toastSuccessRequestClosed",
        { orderCode: displayData?.orderCode || request?.orderCode },
        `Permintaan ${
          displayData?.orderCode || request?.orderCode
        } berhasil ditutup`
      )
    );
    if (onUnderstand) onUnderstand(displayData?.id || request?.id);
    onBack();
  };

  // Helper functions
  const getOrderTypeStyle = (orderType) => {
    if (orderType === "INSTANT") return "bg-success-50 text-success-400";
    if (orderType === "SCHEDULED") return "bg-primary-50 text-primary-700";
    return "bg-primary-50 text-primary-700";
  };
  const getTimeLabelStyle = (timeLabelText) => {
    if (!timeLabelText) return "bg-primary-50 text-primary-700";
    const lowerText = timeLabelText.toLowerCase();
    if (lowerText.includes("hari ini") || lowerText.includes("besok"))
      return "bg-success-50 text-success-400";
    const dayMatch = lowerText.match(/muat (\d+) hari/);
    if (dayMatch) {
      const days = parseInt(dayMatch[1]);
      if (days >= 2 && days <= 5) return "bg-warning-100 text-warning-900";
      if (days > 5) return "bg-primary-50 text-primary-700";
    }
    return "bg-primary-50 text-primary-700";
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
            displayData?.isTaken ? "text-neutral-600" : "text-neutral-900"
          )}
        >
          {t(
            "PermintaanAngkutDetail.titleDetailPermintaanJasaAngkut",
            {},
            "Detail Permintaan Jasa Angkut"
          )}
        </h1>
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full pt-2"
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

      {/* Scrollable Content */}
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
                  {t(
                    "PermintaanAngkutDetail.messageErrorRequestTaken",
                    {},
                    "Permintaan sudah diambil transporter lain"
                  )}
                </span>
              </div>
              <Button
                variant="muattrans-primary"
                className="w-full py-3 text-[14px] font-semibold"
                onClick={handleUnderstand}
              >
                {t("PermintaanAngkutDetail.buttonUnderstand", {}, "Mengerti")}
                <NotificationDot
                  position="absolute"
                  positionClasses="right-[1px] top-[-1px]"
                  size="md"
                  color="red"
                  animated={true}
                />
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="muattrans-error-secondary"
                className="flex-1 py-2 text-[14px] font-semibold"
                onClick={handleTolakClick}
              >
                {t("PermintaanAngkutDetail.buttonReject", {}, "Tolak")}
              </Button>
              <Button
                variant="muattrans-primary"
                className="flex-1 py-2 text-[14px] font-semibold"
                onClick={handleAcceptClick}
              >
                {t("PermintaanAngkutDetail.buttonAccept", {}, "Terima")}
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

      {/* Modal Tolak Permintaan */}
      <ModalTolakPermintaan
        isOpen={showTolakModal}
        onClose={() => setShowTolakModal(false)}
        request={displayData}
      />
    </div>
  );
};

export default PermintaanAngkutDetail;
