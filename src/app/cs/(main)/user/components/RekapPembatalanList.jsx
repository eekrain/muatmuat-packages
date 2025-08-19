"use client";

import { useState } from "react";

import PropTypes from "prop-types";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import { cn } from "@/lib/utils";
import { useToastActions } from "@/store/Shipper/toastStore";

import ModalFotoPendukung from "./ModalFotoPendukung";

// Helper: order status chip color by label
const getOrderStatusClasses = (label) => {
  const base =
    "inline-flex h-6 w-[70px] items-center justify-center gap-1 rounded-[6px] px-2 text-[12px] font-semibold leading-[1.2]";
  if (label?.toLowerCase() === "instan")
    return cn(base, "bg-emerald-100 text-emerald-700");
  return cn(base, "bg-[#E2F2FF] text-[#176CF7]"); // default Terjadwal
};

/**
 * RekapPembatalanList
 * Renders a list of cancellation records in a card layout.
 * Designed to match the UI from the provided mock screenshot.
 */
const RekapPembatalanList = ({
  title = "Rekap Pembatalan",
  items = [],
  summary = { totalPenaltyPoints: 0 },
  onConfirmPenalty,
  className,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const { addToast } = useToastActions();

  const openConfirm = (item) => {
    setSelectedItem(item);
    setConfirmOpen(true);
  };

  const openPhotoModal = (drivers) => {
    setSelectedDrivers(drivers);
    setPhotoModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedItem) {
      // Notify parent to update state (e.g., set penalized)
      onConfirmPenalty?.(selectedItem);
    }
    // Show success toast
    addToast({
      message: "Berhasil mengenakan poin penalti ke Transporter",
      type: "success",
      duration: 6000,
    });
    setConfirmOpen(false);
    setSelectedItem(null);
  };
  const data = Array.isArray(items) ? items : [];
  const summaryToShow = summary ?? { totalPenaltyPoints: 1 };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <h3 className="text-base font-bold text-neutral-900 md:text-lg">
          {title}
        </h3>
        <div className="text-sm font-semibold text-neutral-900">
          Total : {summaryToShow?.totalPenaltyPoints || 0} Poin Penalti
        </div>
      </div>

      <div className="mt-4 space-y-4 px-6 pb-6">
        {data.map((item, idx) => (
          <CancellationCard
            key={item.id || idx}
            index={item.index ?? idx + 1}
            cancelledAt={item.cancelledAt}
            orderCode={item.orderCode || item.orderId}
            orderStatusLabel={item.orderStatusLabel}
            penaltyStatus={item.penaltyStatus}
            route={
              item.route || {
                origin: item.origin,
                destination: item.destination,
              }
            }
            vehicle={item.vehicle}
            cargo={item.cargo}
            reason={item.reason}
            drivers={item.drivers}
            onConfirmPenalty={() => openConfirm(item)}
            onDriverImageClick={openPhotoModal}
          />
        ))}

        {/* Photo Modal */}
        <ModalFotoPendukung
          isOpen={photoModalOpen}
          onClose={() => setPhotoModalOpen(false)}
          photos={selectedDrivers}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          size="small"
          variant="muattrans"
          isOpen={confirmOpen}
          setIsOpen={setConfirmOpen}
          title={{ text: "Konfirmasi Penalti" }}
          description={{
            text: "Apakah kamu yakin ingin mengenakan poin penalti terkait pembatalan pada pesanan ini?",
          }}
          cancel={{
            classname: "w-[116px]",
            text: "Tidak",
            onClick: () => setConfirmOpen(false),
          }}
          confirm={{
            classname: "w-[116px]",
            text: "Ya",
            onClick: handleConfirm,
          }}
        />
      </div>
    </div>
  );
};

const CancellationCard = ({
  index,
  cancelledAt,
  orderCode,
  orderStatusLabel = "Terjadwal",
  penaltyStatus = "pending",
  route = { origin: "-", destination: "-" },
  vehicle = { name: "-", body: "-" },
  cargo = { unitCount: 1, unitLabel: "Unit", name: "-", weight: null },
  reason = "-",
  drivers = [],
  onConfirmPenalty,
  onDriverImageClick,
}) => {
  const showDrivers = Array.isArray(drivers) && drivers.length > 0;
  const [showAllCargo, setShowAllCargo] = useState(false);

  return (
    <div className="box-border flex w-full flex-col items-start gap-6 overflow-hidden rounded-[12px] border border-[#C4C4C4] bg-white">
      {/* heading */}
      <div className="box-border flex h-[52px] w-full flex-row items-center gap-4 bg-[#F8F8FB] px-4 py-3">
        <div className="flex min-w-0 flex-row items-center gap-2">
          <span className="text-[12px] font-medium leading-[1.2] text-[#7B7B7B]">
            Pembatalan Ke :
          </span>
          <span className="text-[12px] font-semibold leading-[1.2] text-black">
            {index}
          </span>
        </div>
        <div className="flex min-w-0 flex-row items-center gap-2">
          <span className="text-[12px] font-medium leading-[1.2] text-[#7B7B7B]">
            Tanggal Pembatalan :
          </span>
          <span className="text-[12px] font-semibold leading-[1.2] text-black">
            {cancelledAt || "-"}
          </span>
        </div>

        {/* Right-side header badge for penalty status */}
        <HeaderPenaltyBadge status={penaltyStatus} />
      </div>

      {/* jenis pesanan - main content */}
      <div className="z-[2] box-border flex w-full flex-row items-start gap-6 px-4 pb-4">
        {/* Left - Order & Route */}
        <div className="flex w-[930px] max-w-full flex-row items-start gap-3">
          {/* order code and status */}
          <div className="flex w-[92px] flex-col justify-center gap-3 py-1">
            <div className="flex w-[92px] flex-col gap-3">
              <div className="w-full text-[12px] font-medium leading-[1.2] text-[#176CF7]">
                {orderCode || "-"}
              </div>
              <span className={getOrderStatusClasses(orderStatusLabel)}>
                {orderStatusLabel}
              </span>
            </div>
          </div>

          {/* route block with MuatBongkarStepper */}
          <div className="flex w-[261px] flex-col gap-3 py-1">
            <MuatBongkarStepperWithModal
              pickupLocations={[{ fullAddress: route?.origin || "-" }]}
              dropoffLocations={[{ fullAddress: route?.destination || "-" }]}
              appearance={{
                titleClassName:
                  "text-[10px] font-semibold leading-[130%] text-neutral-900",
              }}
              maxVisibleLocations={2}
            />
          </div>

          {/* Vehicle & Cargo */}
          <div className="flex w-[340px] flex-col gap-3 py-1">
            <div className="flex flex-col gap-3">
              <div className="w-full text-[12px] font-semibold leading-[1.2] text-black">
                {vehicle?.name || "-"}
              </div>
              <div className="w-full text-[10px] font-semibold leading-[1.3] text-black">
                {vehicle?.body || "-"}
              </div>
            </div>
            <div className="flex flex-row items-center gap-[6px]">
              {!!cargo?.unitCount && (
                <span className="flex items-center gap-1 text-[10px] font-medium leading-[1.3] text-black">
                  <IconComponent src="/icons/transporter16.svg" />
                  {cargo.unitCount} {cargo.unitLabel || "Unit"}
                </span>
              )}

              {cargo?.weight && (
                <>
                  <span className="text-[8px]">&bull;</span>
                  <div className="flex max-w-[200px] items-center gap-1 text-[10px] font-medium leading-[1.3] text-black">
                    <IconComponent
                      src="/icons/estimasi-kapasitas14.svg"
                      className={"shrink-0"}
                    />
                    <div>
                      {/* cargo name(s): show first + clickable `+N lainnya` when multiple */}
                      {(() => {
                        const items = Array.isArray(cargo?.items)
                          ? cargo.items
                          : null;
                        const itemsCount =
                          typeof cargo?.itemsCount === "number"
                            ? cargo.itemsCount
                            : null;
                        const totalFromArray = items ? items.length : null;
                        const total = totalFromArray ?? itemsCount ?? null;
                        const first = items?.[0] ?? cargo?.name;
                        if (!first) return null;

                        // If we have an array of items and more than one, allow expanding
                        if (items && items.length > 1) {
                          if (showAllCargo) {
                            return (
                              <span className="text-[10px] font-medium leading-[1.3] text-black">
                                {items.join(", ")}
                              </span>
                            );
                          }
                          const remaining = items.length - 1;
                          return (
                            <span className="text-[10px] font-medium leading-[1.3] text-black">
                              {first},{" "}
                              <button
                                type="button"
                                onClick={() => setShowAllCargo(true)}
                                className="text-[#176CF7] hover:underline"
                              >
                                +{remaining} lainnya
                              </button>
                            </span>
                          );
                        }
                        // Fallback: show computed label using first and itemsCount if provided (non-clickable if no array)
                        if (total && total > 1) {
                          const remaining = total - 1;
                          return (
                            <span className="text-[10px] font-medium leading-[1.3] text-black">
                              {first}, +{remaining} lainnya
                            </span>
                          );
                        }
                        return (
                          <span className="text-[10px] font-medium leading-[1.3] text-black">
                            {first}
                          </span>
                        );
                      })()}{" "}
                      ({cargo.weight})
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right - Reason, Drivers, Action */}
        <div className="flex w-[201px] shrink-0 flex-col items-start gap-3 py-1">
          <div className="w-full text-[12px] font-semibold leading-[1.2] text-black">
            {reason || "-"}
          </div>

          {showDrivers && (
            <DriverImageList drivers={drivers} onClick={onDriverImageClick} />
          )}
        </div>
        <div className="w-full">
          {penaltyStatus === "pending" && (
            <Button
              className="inline-flex w-full items-center justify-center rounded-[24px] bg-[#FFC217] px-6 py-3 text-[14px] font-semibold leading-[1.2] text-[#461B02] hover:brightness-[.95]"
              onClick={onConfirmPenalty}
            >
              Konfirmasi Penalti
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const HeaderPenaltyBadge = ({ status }) => {
  if (status === "exempt") {
    return (
      <span className="ml-auto inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700">
        Pembatalan pada pesanan ini tidak dikenakan poin penalti
      </span>
    );
  }
  if (status === "penalized") {
    return (
      <span className="ml-auto inline-flex items-center rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700">
        Pembatalan pada pesanan ini dikenakan poin penalti
      </span>
    );
  }
  return <span className="ml-auto" />; // keep layout
};

const DriverImageList = ({ drivers = [], onClick }) => {
  const handleClick = () => {
    if (onClick && drivers.length > 0) {
      onClick(drivers);
    }
  };

  return (
    <div className="flex h-10 items-center gap-2">
      {drivers.slice(0, 4).map((d, i) => (
        <button
          key={i}
          onClick={handleClick}
          className="h-10 w-10 cursor-pointer rounded-[4px] bg-white transition-opacity hover:opacity-80"
        >
          <img
            src={d.photo || d.image || "/img/default-avatar.png"}
            alt={d.name || "driver"}
            className="h-10 w-10 rounded-[4px] object-cover"
          />
        </button>
      ))}
    </div>
  );
};

RekapPembatalanList.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  summary: PropTypes.shape({
    totalPenaltyPoints: PropTypes.number,
  }),
  onConfirmPenalty: PropTypes.func,
  className: PropTypes.string,
};

export default RekapPembatalanList;
