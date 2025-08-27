import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useGetTransportRequestList } from "@/services/Transporter/monitoring/permintaan-angkut/getTransportRequestList";
import { useAcceptInstantTransport } from "@/services/Transporter/monitoring/permintaan-angkut/postAcceptInstantTransport";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

// Utility function for currency formatting
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp");
};

const ModalTerimaPermintaanInstant = ({
  isOpen,
  onClose,
  request,
  onAccept,
}) => {
  const { t } = useTranslation();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsAlert, setShowTermsAlert] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "taken", "unit-change", "suspended"
  const [modalData, setModalData] = useState({});
  const [modalQueue, setModalQueue] = useState([]); // Queue for showing modals in sequence
  const [currentModalIndex, setCurrentModalIndex] = useState(0);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // API hooks
  const { acceptTransport, isAccepting: isMutating } =
    useAcceptInstantTransport();

  // Ambil detail data berdasarkan request.id
  const {
    data: listData,
    isLoading,
    error,
  } = useGetTransportRequestList({ id });
  const detail = useMemo(
    () => listData?.requests?.find((r) => r.id === id) || {},
    [listData, id]
  );
  // Check if order is already taken and show modal
  useEffect(() => {
    if (detail && detail.isTaken && isOpen) {
      setModalType("taken");
      setModalData({
        title: t(
          "ModalTerimaPermintaanInstant.titleOrderTaken",
          {},
          "Pesanan Sudah Diambil"
        ),
        message: t(
          "ModalTerimaPermintaanInstant.messageErrorOrderTaken",
          {},
          "Maaf, pesanan ini telah diambil oleh transporter lain. Silahkan pilih pesanan lainnya yang tersedia."
        ),
      });
      setShowConfirmModal(true);
    }
  }, [detail, isOpen, t]);

  if (!isOpen) return null;

  const handleAccept = () => {
    // Validasi syarat dan ketentuan
    if (!acceptTerms) {
      setShowTermsAlert(true);
      return;
    }

    // Get the transport request ID
    const requestId = detail.id || request?.id;

    // Validate required data
    if (!requestId) {
      toast.error(
        t(
          "ModalTerimaPermintaanInstant.toastErrorMissingRequest",
          {},
          "Data permintaan tidak ditemukan"
        )
      );
      return;
    }

    // For instant transport, we need to use the request/transport ID as the vehicleId
    // This is based on the UI which shows information about a specific vehicle
    const vehicleId = requestId;

    const payload = {
      vehicleId: vehicleId,
      acceptTerms: acceptTerms,
    };

    const requestData = {
      id: requestId,
      payload: payload,
    };

    // Call the API directly
    acceptTransport(requestData)
      .then((response) => {
        // Show success toast
        const message =
          response.Data?.toast?.message ||
          t(
            "ModalTerimaPermintaanInstant.toastSuccessRequestAccepted",
            { orderCode: response.Data?.orderCode || "berhasil" },
            "Permintaan {orderCode} diterima"
          );
        toast.success(message);

        // Close modal
        onClose();

        // Call parent callback if needed
        if (onAccept) {
          onAccept(requestData);
        }
      })
      .catch((error) => {
        // Handle different error scenarios
        if (error.response?.status === 409) {
          // Conflict - request or vehicle no longer available
          setModalType("taken");
          setModalData({
            title: t(
              "ModalTerimaPermintaanInstant.titleOrderTaken",
              {},
              "Pesanan Sudah Diambil"
            ),
            message: t(
              "ModalTerimaPermintaanInstant.messageErrorOrderTaken",
              {},
              "Maaf, pesanan ini telah diambil oleh transporter lain. Silahkan pilih pesanan lainnya yang tersedia."
            ),
          });
          setShowConfirmModal(true);
          return;
        }

        // Handle validation errors
        if (error.response?.status === 400) {
          toast.error(
            t(
              "ModalTerimaPermintaanInstant.toastErrorValidation",
              {},
              "Data yang dimasukkan tidak valid"
            )
          );
          return;
        }

        // Case untuk error lainnya - show generic error toast
        const errorMessage =
          error.response?.data?.Message?.Text ||
          t(
            "ModalTerimaPermintaanInstant.toastErrorFailedToAccept",
            {},
            "Gagal menerima permintaan. Silakan coba lagi."
          );
        toast.error(errorMessage);
      });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 ${
        showConfirmModal ? "hidden" : ""
      }`}
    >
      <div className="flex h-auto w-[600px] flex-col rounded-xl bg-white p-6">
        {isLoading && <LoadingStatic />}
        {error && (
          <div className="py-8 text-center text-red-500">
            {t(
              "ModalTerimaPermintaanInstant.messageErrorLoadDetails",
              {},
              "Gagal memuat detail"
            )}
          </div>
        )}
        {!isLoading && !error && (
          <>
            {/* Header */}
            <div className="relative mb-4 flex flex-shrink-0 items-center justify-center">
              <h3 className="mx-auto text-base font-bold text-gray-900">
                {t(
                  "ModalTerimaPermintaanInstant.titleAcceptTransportRequest",
                  {},
                  "Terima Permintaan Jasa Angkut"
                )}
              </h3>
              <button
                onClick={onClose}
                className="absolute -right-4 -top-4 text-gray-400 hover:text-gray-600"
              >
                <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
              </button>
            </div>
            {/* Armada Selection */}
            <div className="mb-3 rounded-lg border border-neutral-400 p-4">
              <span className="mb-2 text-xs font-medium text-gray-600">
                {t(
                  "ModalTerimaPermintaanInstant.titleFleetInformation",
                  {},
                  "Informasi Armada"
                )}
              </span>
              <div className="flex items-center justify-between">
                <div className="w-[351px]">
                  <span className="text-xs font-bold text-gray-900">
                    {request?.licensePlate || detail.licensePlate || "-"}
                  </span>
                  <span className="ml-1 text-xs font-medium text-gray-900">
                    ({request?.truckTypeName || detail.truckTypeName || "-"} -{" "}
                    {request?.carrierName || detail.carrierName || "-"})
                  </span>
                </div>
                {request?.operationalStatus === "READY_FOR_ORDER" && (
                  <span className="rounded bg-success-50 px-3 py-1 text-xs font-semibold text-success-400">
                    {t(
                      "ModalTerimaPermintaanInstant.statusReadyForOrder",
                      {},
                      "Siap Menerima Order"
                    )}
                  </span>
                )}
                {request?.operationalStatus === "ON_DUTY" && (
                  <span className="rounded bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                    {t(
                      "ModalTerimaPermintaanInstant.statusOnDuty",
                      {},
                      "Sedang Bertugas"
                    )}
                  </span>
                )}
                {request?.operationalStatus === "WAITING_LOADING_TIME" && (
                  <span className="rounded bg-warning-100 px-3 py-1 text-xs font-semibold text-warning-900">
                    {t(
                      "ModalTerimaPermintaanInstant.statusWaitingLoadingTime",
                      {},
                      "Menunggu Waktu Muat"
                    )}
                  </span>
                )}
              </div>
              <div className="mt-2 flex h-5 w-[371px] items-center gap-1">
                <IconComponent
                  src="/icons/profile-driver.svg"
                  className="h-[14px] w-[14px] shrink-0"
                />
                <span className="text-[10px] font-medium text-gray-900">
                  {request?.driver?.name || detail.driver?.name || "-"}
                </span>
              </div>

              <div className="mt-2 flex w-[371px] items-center gap-1">
                <IconComponent
                  src="/icons/location-driver.svg"
                  className="h-[14px] w-[14px] shrink-0"
                />
                <span className="text-xs font-medium text-gray-900">
                  {request?.location?.address ||
                    detail.location?.address ||
                    "-"}
                  {typeof (
                    request?.distanceFromPickup ?? detail.distanceFromPickup
                  ) === "number" && (
                    <span className="ml-1 text-xs font-medium text-neutral-600">
                      (
                      {t(
                        "ModalTerimaPermintaanInstant.labelDistanceFromPickup",
                        {
                          distance:
                            request?.distanceFromPickup ??
                            detail.distanceFromPickup,
                        },
                        "{distance} km dari lokasi muat"
                      )}
                      )
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Content */}
            {/* Scrollable content only for info box */}
            <div className="mb-3 h-[175px] overflow-y-auto rounded-lg border border-neutral-400 p-4">
              <div className="mb-4 flex justify-between">
                <span className="text-xs font-medium text-gray-600">
                  {t(
                    "ModalTerimaPermintaanInstant.titleOrderInformation",
                    {},
                    "Informasi Pesanan"
                  )}
                </span>
                <span className="text-xs font-medium text-gray-600">
                  {t(
                    "ModalTerimaPermintaanInstant.titlePotentialRevenue",
                    {},
                    "Potensi Pendapatan"
                  )}
                </span>
              </div>
              <div className="mb-4 flex justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Time Label */}
                  <span
                    className={cn(
                      "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                      detail.isTaken
                        ? "text-neutral-700"
                        : detail.orderType === "INSTANT"
                          ? "bg-success-50 text-success-400"
                          : detail.orderType === "SCHEDULED"
                            ? "bg-primary-50 text-primary-700"
                            : "bg-primary-50 text-primary-700"
                    )}
                  >
                    {detail.orderType === "INSTANT"
                      ? t(
                          "ModalTerimaPermintaanInstant.badgeInstant",
                          {},
                          "Instan"
                        )
                      : t(
                          "ModalTerimaPermintaanInstant.badgeScheduled",
                          {},
                          "Terjadwal"
                        )}
                  </span>

                  {/* Load Time Label */}
                  {(() => {
                    // Ambil tanggal dari detail, fallback ke request
                    const createdAt = detail.createdAt || request.createdAt;
                    const loadTimeStart =
                      detail.loadTimeStart || request.loadTimeStart;
                    if (!createdAt || !loadTimeStart) {
                      return (
                        <span className="flex h-6 items-center rounded-[6px] bg-primary-50 px-2 text-xs font-semibold text-primary-700">
                          -
                        </span>
                      );
                    }
                    const createdDate = new Date(createdAt);
                    const loadDate = new Date(loadTimeStart);
                    if (
                      isNaN(createdDate.getTime()) ||
                      isNaN(loadDate.getTime())
                    ) {
                      return (
                        <span className="flex h-6 items-center rounded-[6px] bg-primary-50 px-2 text-xs font-semibold text-primary-700">
                          -
                        </span>
                      );
                    }
                    const diffTime = loadDate - createdDate;
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    let label = "";
                    let colorClass = "";
                    if (diffDays === 0) {
                      label = t(
                        "ModalTerimaPermintaanInstant.badgeLoadToday",
                        {},
                        "Muat Hari Ini"
                      );
                      colorClass = "bg-success-50 text-success-400";
                    } else if (diffDays === 1) {
                      label = t(
                        "ModalTerimaPermintaanInstant.badgeLoadTomorrow",
                        {},
                        "Muat Besok"
                      );
                      colorClass = "bg-success-50 text-success-400";
                    } else if (diffDays >= 2 && diffDays <= 5) {
                      label = t(
                        "ModalTerimaPermintaanInstant.badgeLoadInDays",
                        { count: diffDays },
                        "Muat {count} Hari"
                      );
                      colorClass = "bg-warning-100 text-warning-900";
                    } else if (diffDays > 5) {
                      label = t(
                        "ModalTerimaPermintaanInstant.badgeLoadInDays",
                        { count: diffDays },
                        "Muat {count} Hari"
                      );
                      colorClass = "bg-primary-50 text-primary-700";
                    } else {
                      label = "-";
                      colorClass = "bg-primary-50 text-primary-700";
                    }
                    return (
                      <span
                        className={cn(
                          "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                          request.isTaken ? "text-neutral-700" : colorClass
                        )}
                      >
                        {label}
                      </span>
                    );
                  })()}

                  {/* Overload Badge */}
                  {detail.hasOverload && (
                    <span
                      className={cn(
                        "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                        detail.isTaken
                          ? "text-neutral-700"
                          : "bg-error-50 text-error-400"
                      )}
                    >
                      {t(
                        "ModalTerimaPermintaanInstant.badgePotentialOverload",
                        {},
                        "Potensi Overload"
                      )}
                    </span>
                  )}

                  {/* Halal Certification Required Badge */}
                  {detail.isHalalLogistics && (
                    <InfoTooltip
                      side="left"
                      align="center"
                      sideOffset={8}
                      trigger={
                        <div
                          className={cn(
                            "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md px-1 py-2",
                            detail.isTaken ? "" : "bg-[#F7EAFD]"
                          )}
                        >
                          <IconComponent
                            src="/icons/halal.svg"
                            className={cn(
                              "h-4 w-3",
                              detail.isTaken ? "text-neutral-700" : ""
                            )}
                          />
                        </div>
                      }
                      render={t(
                        "ModalTerimaPermintaanInstant.infoTooltipHalalLogistics",
                        {},
                        "Memerlukan pengiriman<br />dengan sertifikasi halal logistik"
                      )}
                    />
                  )}
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-blue-700">
                    {formatCurrency(detail.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="mb-4 border-b border-[#C4C4C4]"></div>

              {/* Location Info */}
              <div className="mb-4 flex justify-between">
                <div className="w-auto">
                  <TimelineContainer>
                    {[
                      {
                        fullAddress:
                          detail.pickupLocations?.[0]?.fullAddress ||
                          "Kota Surabaya, Kec. Tegalsari",
                        type: "pickup",
                      },
                      {
                        fullAddress:
                          detail.dropoffLocations?.[0]?.fullAddress ||
                          "Kab. Pasuruan, Kec. Klojen",
                        type: "dropoff",
                      },
                    ].map((location, index) => (
                      <NewTimelineItem
                        key={index}
                        variant="bullet"
                        index={index}
                        activeIndex={0}
                        isLast={index === 1}
                        title={
                          location.fullAddress?.length > 38
                            ? `${location.fullAddress.substring(0, 38)}...`
                            : location.fullAddress
                        }
                        className="pb-2"
                        appearance={{
                          titleClassname:
                            "line-clamp-1 break-all text-xs font-bold text-neutral-900",
                        }}
                      />
                    ))}
                  </TimelineContainer>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-medium text-neutral-600">
                    {t(
                      "ModalTerimaPermintaanInstant.labelEstimatedDistance",
                      {},
                      "Estimasi Jarak"
                    )}
                  </div>
                  <div className="text-[12px] font-semibold text-neutral-900">
                    {detail.estimatedDistance || 121} km
                  </div>
                </div>
              </div>
              <div className="mb-4 border-b border-[#C4C4C4]"></div>

              {/* cargo info */}
              <div className="mb-4 flex w-full items-start justify-between">
                <div className="flex flex-1 items-start gap-3">
                  <IconComponent
                    src="/icons/box16.svg"
                    className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-neutral-600">
                      {t(
                        "ModalTerimaPermintaanInstant.labelCargoInformationTotal",
                        {
                          totalWeight: Array.isArray(detail.cargos)
                            ? detail.cargos
                                .reduce(
                                  (sum, cargo) =>
                                    sum + (Number(cargo.weight) || 0),
                                  0
                                )
                                .toLocaleString("id-ID")
                            : "0",
                        },
                        "Informasi Muatan (Total : {totalWeight} kg)"
                      )}
                    </div>
                    <div className="text-xs font-semibold text-neutral-900">
                      {detail.cargos?.length > 1 ? (
                        <>
                          {detail.cargos[0]?.name || "Peralatan Tangga"},{" "}
                          <InfoTooltip
                            side="top"
                            align="start"
                            sideOffset={8}
                            trigger={
                              <span
                                style={{
                                  color: "#176CF7",
                                  cursor: "pointer",
                                }}
                              >
                                +
                                {t(
                                  "ModalTerimaPermintaanInstant.labelMoreItems",
                                  { count: detail.cargos.length - 1 },
                                  "{count} lainnya"
                                )}
                              </span>
                            }
                          >
                            <div className="text-sm">
                              <div className="mb-2 font-medium">
                                {t(
                                  "ModalTerimaPermintaanInstant.titleCargoInformation",
                                  {},
                                  "Informasi Muatan"
                                )}
                              </div>
                              <div className="space-y-1">
                                {detail.cargos.slice(1).map((cargo, index) => (
                                  <div key={index} className="text-sm">
                                    {index + 1}. {cargo.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </InfoTooltip>
                        </>
                      ) : (
                        detail.cargos?.[0]?.name || "Peralatan Tangga"
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className="rounded-[6px] border border-[#7A360D] bg-white px-2 py-2 text-xs font-semibold text-[#7A360D]">
                    {detail.orderCode || "MT25A001A"}
                  </span>
                </div>
              </div>

              {/* Fleet Requirements Section */}
              <div className="mb-4 flex items-start gap-3">
                <IconComponent
                  src="/icons/truk16.svg"
                  className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
                />
                <div className="flex-1">
                  <div className="text-xs font-medium text-neutral-600">
                    {t(
                      "ModalTerimaPermintaanInstant.titleFleetRequirements",
                      {},
                      "Kebutuhan Armada"
                    )}
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    {t(
                      "ModalTerimaPermintaanInstant.labelFleetRequirements",
                      {
                        count: detail.truckCount || request?.truckCount || 3,
                        truckType:
                          detail.truckTypeName ||
                          request?.truckTypeName ||
                          "Colt Diesel Engkel",
                        carrierType:
                          detail.carrierName || request?.carrierName || "Box",
                      },
                      "{count} Unit ({truckType} - {carrierType})"
                    )}
                  </div>
                </div>
              </div>

              {/* Loading Time Section */}
              <div className="mb-4 flex items-start gap-3">
                <IconComponent
                  src="/icons/calendar16.svg"
                  className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
                />
                <div className="flex-1">
                  <div className="text-xs font-medium text-neutral-600">
                    {t(
                      "ModalTerimaPermintaanInstant.labelLoadingTime",
                      {},
                      "Waktu Muat"
                    )}
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    {detail.loadDateTime ||
                      request?.loadDateTime ||
                      "03 Jan 2025 09:00 WIB s/d 04 Jan 2025 11:00 WIB"}
                  </div>
                </div>
              </div>

              {/* Additional Services Section */}
              {(detail.additionalServices?.length > 0 ||
                request?.additionalServices?.length > 0) && (
                <div className="rounded-[6px] bg-muat-trans-primary-100 px-3 py-2">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    +{" "}
                    {(detail.additionalServices?.length > 0
                      ? detail.additionalServices
                      : request?.additionalServices || []
                    )
                      .map((service) => service.serviceName)
                      .join(", ")}
                  </div>
                </div>
              )}
            </div>

            {/* Syarat & Ketentuan (not scrollable) */}
            <div className="mb-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    setShowTermsAlert(false);
                  }}
                  className="h-4 w-4 text-primary-600"
                />
                <span className="flex justify-center text-xs font-medium text-neutral-900">
                  {t(
                    "ModalTerimaPermintaanInstant.checkboxAgree",
                    {},
                    "Saya menyetujui"
                  )}{" "}
                  <span className="ml-1 font-medium text-primary-700">
                    {t(
                      "ModalTerimaPermintaanInstant.linkTermsAndConditions",
                      {},
                      "Syarat dan Ketentuan Muatrans"
                    )}
                  </span>
                </span>
              </label>
              {/* Alert for terms validation */}
              {showTermsAlert && (
                <p className="mt-2 px-7 text-xs font-medium text-error-400">
                  {t(
                    "ModalTerimaPermintaanInstant.messageErrorAgreeToTerms",
                    {},
                    "Setujui syarat dan ketentuan untuk menerima jasa angkut"
                  )}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="muattrans-primary-secondary"
                className="h-[34] w-[112px] rounded-[24px] py-3 text-[14px] font-semibold"
                onClick={onClose}
              >
                {t("ModalTerimaPermintaanInstant.buttonCancel", {}, "Batal")}
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-[34] w-[112px] py-3 text-sm font-semibold"
                onClick={handleAccept}
                disabled={isMutating}
              >
                {t("ModalTerimaPermintaanInstant.buttonAccept", {}, "Terima")}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        setIsOpen={setShowConfirmModal}
        title={{
          text:
            modalData?.title ||
            t(
              "ModalTerimaPermintaanInstant.titleNotification",
              {},
              "Pemberitahuan"
            ),
          className: "text-base font-bold",
        }}
        description={{
          text: modalData?.message || "",
          className: "text-sm font-medium text-center",
        }}
        withCancel={false}
        confirm={{
          text:
            modalType === "suspended"
              ? t(
                  "ModalTerimaPermintaanInstant.buttonContactCS",
                  {},
                  "Hubungi Customer Service"
                )
              : t("ModalTerimaPermintaanInstant.buttonOK", {}, "OK"),
          className:
            "bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700",
          onClick: () => {
            setShowConfirmModal(false);

            // Check if there are more modals in the queue
            const nextIndex = currentModalIndex + 1;
            if (nextIndex < modalQueue.length) {
              // Show next modal after a short delay
              setTimeout(() => {
                const nextModal = modalQueue[nextIndex];
                if (nextModal) {
                  setModalType(nextModal.type);
                  setModalData({
                    title: nextModal.title,
                    message: nextModal.message,
                  });
                  setCurrentModalIndex(nextIndex);
                  setShowConfirmModal(true);
                }
              }, 500); // 500ms delay between modals
            } else {
              // All modals shown, handle final action
              switch (modalType) {
                case "taken":
                case "suspended":
                  onClose(); // Close main modal
                  break;
                case "unit-change":
                  // Just close confirmation modal, keep main modal open for user to re-select
                  break;
                default:
                  onClose();
                  break;
              }

              // Reset modal state
              setModalType("");
              setModalData({});
              setModalQueue([]);
              setCurrentModalIndex(0);
            }
          },
        }}
      />
    </div>
  );
};

export default ModalTerimaPermintaanInstant;
