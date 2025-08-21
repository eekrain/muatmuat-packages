import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetTransportRequestList } from "@/services/Transporter/monitoring/permintaan-angkut/getTransportRequestList";
import { usePostAcceptScheduledTransportRequest } from "@/services/Transporter/monitoring/postAcceptScheduledTransportRequest";

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

const ModalTerimaPermintaan = ({ isOpen, onClose, request, onAccept }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [partialCount, setPartialCount] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showTermsAlert, setShowTermsAlert] = useState(false);
  const [showPartialAlert, setShowPartialAlert] = useState(false);
  const [showAlertExceedFleetUnit, setShowAlertExceedFleetUnit] =
    useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "taken", "unit-change", "suspended"
  const [modalData, setModalData] = useState({});
  const [modalQueue, setModalQueue] = useState([]); // Queue for showing modals in sequence
  const [currentModalIndex, setCurrentModalIndex] = useState(0);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // API hooks
  const { trigger: acceptScheduledRequest, isMutating } =
    usePostAcceptScheduledTransportRequest();

  // Ambil detail data berdasarkan request.id
  const {
    data: listData,
    isLoading,
    error,
  } = useGetTransportRequestList({ id });
  const detail = listData?.requests?.find((r) => r.id === id) || {};

  // Check if order is already taken and show modal
  useEffect(() => {
    if (detail && detail.isTaken && isOpen) {
      setModalType("taken");
      setModalData({
        title: "Pesanan Sudah Diambil",
        message:
          "Maaf, pesanan ini telah diambil oleh transporter lain. Silahkan pilih pesanan lainnya yang tersedia.",
      });
      setShowConfirmModal(true);
    }
  }, [detail, isOpen]);

  if (!isOpen) return null;

  // Function to show modals in sequence
  const showModalSequence = () => {
    const modals = [
      {
        type: "taken",
        title: "Pesanan Sudah Diambil",
        message:
          "Maaf, pesanan ini telah diambil oleh transporter lain. Silahkan pilih pesanan lainnya yang tersedia.",
      },
      {
        type: "unit-change",
        title: "Perubahan Kebutuhan Unit",
        message:
          "Maaf, terdapat perubahan pada kebutuhan unit armada. Periksa kembali sebelum menerima permintaan.",
      },
      {
        type: "suspended",
        title: "Akun Ditangguhkan",
        message:
          "Maaf, kamu tidak bisa menerima pesanan karena akun kamu ditangguhkan, hubungi dukungan pelanggan untuk aktivasi kembali.",
      },
    ];

    setModalQueue(modals);
    setCurrentModalIndex(0);

    // Show first modal
    setModalType(modals[0].type);
    setModalData({
      title: modals[0].title,
      message: modals[0].message,
    });
    setShowConfirmModal(true);
  };

  const handleAccept = () => {
    // Validasi kebutuhan armada
    if (!selectedOption) {
      setShowAlert(true);
      return;
    }

    // Validasi jumlah armada jika memilih "partial"
    if (selectedOption === "partial" && (!partialCount || partialCount < 1)) {
      setShowPartialAlert(true);
      return;
    }

    // Validasi syarat dan ketentuan
    if (!acceptTerms) {
      setShowTermsAlert(true);
      return;
    }

    // Show modal sequence for demo
    showModalSequence();
  };

  const handleConfirmAccept = () => {
    const requestData = {
      id: detail.id || request?.id,
      data: {
        type: selectedOption,
        truckCount: selectedOption === "all" ? detail.truckCount : partialCount,
      },
    };

    console.log("Sending request data:", requestData); // Debug log

    if (request.isTaken) {
      setShowConfirmModal(true);
    }
    acceptScheduledRequest(requestData)
      .then((response) => {
        console.log("Success response:", response); // Debug log

        // Show success toast
        const message =
          response.Data?.toast?.message ||
          `Permintaan ${response.Data?.orderCode || "berhasil"} diterima`;
        toast.success(message);

        // Close modal
        onClose();

        // Call parent callback if needed
        if (onAccept) {
          onAccept(requestData);
        }
      })
      .catch((error) => {
        console.log("Error occurred:", error); // Debug log

        // Handle different error scenarios
        if (error.response?.status === 422) {
          const errors = error.response?.data?.Data?.errors || [];

          // Case 1: Pesanan sudah diambil
          const orderStatusError = errors.find(
            (err) => err.field === "orderStatus"
          );
          if (orderStatusError) {
            setModalType("taken");
            setModalData({
              title: "Pesanan Sudah Diambil",
              message:
                "Maaf, pesanan ini telah diambil oleh transporter lain. Silahkan pilih pesanan lainnya yang tersedia.",
            });
            setShowConfirmModal(true);
            return;
          }

          // Case 2: Perubahan kebutuhan unit
          const vehicleCountError = errors.find(
            (err) => err.field === "vehicleCount"
          );
          if (vehicleCountError) {
            setModalType("unit-change");
            setModalData({
              title: "Perubahan Kebutuhan Unit",
              message:
                "Kebutuhan unit telah berubah. Silahkan refresh halaman dan pilih ulang jumlah unit yang diinginkan.",
            });
            setShowConfirmModal(true);
            return;
          }

          // Case 3: Akun ditangguhkan
          const accountError = errors.find(
            (err) => err.field === "account" || err.field === "userStatus"
          );
          if (
            accountError ||
            error.response?.data?.Message?.Text?.includes("ditangguhkan") ||
            error.response?.data?.Message?.Text?.includes("suspended")
          ) {
            setModalType("suspended");
            setModalData({
              title: "Akun Ditangguhkan",
              message:
                "Maaf, kamu tidak bisa menerima pesanan karena akun kamu ditangguhkan, hubungi dukungan pelanggan untuk aktivasi kembali.",
            });
            setShowConfirmModal(true);
            return;
          }
        }

        // Case untuk error lainnya - show generic error toast
        const errorMessage =
          error.response?.data?.Message?.Text ||
          "Gagal menerima permintaan. Silakan coba lagi.";
        toast.error(errorMessage);
      });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="flex h-[460px] w-[600px] flex-col rounded-xl bg-white p-6">
        {isLoading && <div className="py-8 text-center">Loading...</div>}
        {error && (
          <div className="py-8 text-center text-red-500">
            Gagal memuat detail
          </div>
        )}
        {!isLoading && !error && (
          <>
            {/* Header */}
            <div className="relative mb-4 flex flex-shrink-0 items-center justify-center">
              <h3 className="mx-auto text-base font-bold text-gray-900">
                Tolak Permintaan Jasa Angkut
              </h3>
              <button
                onClick={onClose}
                className="absolute -right-4 -top-4 text-gray-400 hover:text-gray-600"
              >
                <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            {/* Scrollable content only for info box */}
            <div className="mb-3 h-[335px] rounded-lg border border-neutral-400 p-4">
              <div className="mb-2 flex justify-between">
                <span className="text-xs font-medium text-gray-600">
                  Informasi Pesanan
                </span>
                <span className="text-xs font-medium text-gray-600">
                  Potensi Pendapatan
                </span>
              </div>
              <div className="mb-2 flex justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Time Label */}
                  <span
                    className={cn(
                      "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                      detail.isTaken
                        ? "text-neutral-700"
                        : detail.orderType === "INSTANT"
                          ? "bg-success-50 text-success-700"
                          : detail.orderType === "SCHEDULED"
                            ? "bg-primary-50 text-primary-700"
                            : "bg-primary-50 text-primary-700"
                    )}
                  >
                    {detail.orderType === "INSTANT" ? "Instan" : "Terjadwal"}
                  </span>

                  {/* Load Time Label */}
                  {(() => {
                    // Ambil tanggal dari detail, fallback ke request
                    const createdAt = detail.createdAt || request.createdAt;
                    const loadTimeStart =
                      detail.loadTimeStart || request.loadTimeStart;
                    if (!createdAt || !loadTimeStart) {
                      console.warn("Tanggal tidak ditemukan:", {
                        createdAt,
                        loadTimeStart,
                        detail,
                        request,
                      });
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
                      console.warn("Tanggal invalid:", {
                        createdAt,
                        loadTimeStart,
                      });
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
                      label = "Muat Hari Ini";
                      colorClass = "bg-success-50 text-success-700";
                    } else if (diffDays === 1) {
                      label = "Muat Besok";
                      colorClass = "bg-success-50 text-success-700";
                    } else if (diffDays >= 2 && diffDays <= 5) {
                      label = `Muat ${diffDays} Hari`;
                      colorClass = "bg-warning-100 text-warning-900";
                    } else if (diffDays > 5) {
                      label = `Muat ${diffDays} Hari`;
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
                          : "bg-error-50 text-error-700"
                      )}
                    >
                      Potensi Overload
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
                    >
                      Memerlukan pengiriman
                      <br />
                      dengan sertifikasi halal logistik
                    </InfoTooltip>
                  )}
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-primary-700">
                    {formatCurrency(detail.totalPrice)}
                  </span>
                </div>
              </div>
              <div className="mb-2 border-b border-[#C4C4C4]"></div>

              {/* Location Info */}
              <div className="mb-2 flex justify-between">
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
                    Estimasi Jarak
                  </div>
                  <div className="text-[12px] font-semibold text-neutral-900">
                    {detail.estimatedDistance || 121} km
                  </div>
                </div>
              </div>
              <div className="mb-2 border-b border-[#C4C4C4]"></div>

              {/* cargo info */}
              <div className="mb-2 flex w-full items-start justify-between">
                <div className="flex flex-1 items-start gap-3">
                  <IconComponent
                    src="/icons/box16.svg"
                    className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-neutral-600">
                      Informasi Muatan (Total :{" "}
                      {Array.isArray(detail.cargos)
                        ? detail.cargos
                            .reduce(
                              (sum, cargo) => sum + (Number(cargo.weight) || 0),
                              0
                            )
                            .toLocaleString("id-ID")
                        : "0"}{" "}
                      kg)
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
                                +{detail.cargos.length - 1} lainnya
                              </span>
                            }
                          >
                            <div className="text-sm">
                              <div className="mb-2 font-medium">
                                Informasi Muatan
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
              <div className="mb-2 flex items-start gap-3">
                <IconComponent
                  src="/icons/truk16.svg"
                  className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
                />
                <div className="flex-1">
                  <div className="text-xs font-medium text-neutral-600">
                    Kebutuhan Armada
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    {detail.truckCount || request?.truckCount || 3} Unit (
                    {detail.truckTypeName ||
                      request?.truckTypeName ||
                      "Colt Diesel Engkel"}{" "}
                    - {detail.carrierName || request?.carrierName || "Box"})
                  </div>
                </div>
              </div>

              {/* Loading Time Section */}
              <div className="mb-2 flex items-start gap-3">
                <IconComponent
                  src="/icons/calendar16.svg"
                  className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
                />
                <div className="flex-1">
                  <div className="text-xs font-medium text-neutral-600">
                    Waktu Muat
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
                request?.hasAdditionalService) && (
                <div className="rounded-[6px] bg-muat-trans-primary-100 px-3 py-2">
                  <div className="text-[12px] font-semibold text-neutral-900">
                    +{" "}
                    {detail.additionalServices?.[0]?.serviceName ||
                      request?.additionalServices?.[0]?.serviceName ||
                      "Bantuan Tambahan, Kirim Berkas"}
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
                  Saya menyetujui{" "}
                  <span className="ml-1 font-medium text-primary-700">
                    Syarat dan Ketentuan Muatrans
                  </span>
                </span>
              </label>
              {/* Alert for terms validation */}
              {showTermsAlert && (
                <p className="mt-2 px-7 text-xs font-medium text-error-400">
                  Setujui syarat dan ketentuan untuk menerima jasa angkut
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
                Batal
              </Button>
              <Button
                variant="muatparts-error"
                className="h-[34] w-[112px] py-3 text-sm font-semibold"
                onClick={handleAccept}
                disabled={isMutating}
              >
                Tolak
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
          text: modalData?.title || "Pemberitahuan",
          className: "text-base font-bold",
        }}
        description={{
          text: modalData?.message || "",
          className: "text-sm font-medium text-center",
        }}
        withCancel={false}
        confirm={{
          text: modalType === "suspended" ? "Hubungi Customer Service" : "OK",
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

export default ModalTerimaPermintaan;
