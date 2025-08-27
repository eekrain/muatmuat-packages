"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

// 👉 import helpers mapping
import { statusDisplayMap } from "../helpers/pesananCard.helpers";

const CancelFleetModal = ({
  isOpen,
  onClose,
  vehicles = [],
  isLoading,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  // reset saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setSelected([]);
      setError("");
    }
  }, [isOpen]);

  const handleToggle = (vehicleId) => {
    setSelected((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
    setError("");
  };

  const handleToggleAll = () => {
    if (selected.length === vehicles.length) {
      setSelected([]);
    } else {
      setSelected(vehicles.map((v) => v.id));
    }
    setError("");
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      setError(t("cancelFleetModal.errorRequired", {}, "Armada wajib dipilih"));
      return;
    }
    onSubmit(selected);
  };

  // mapping status → text & variant dari helpers (memo biar hemat render)
  const mappedVehicles = useMemo(() => {
    return (vehicles || []).map((v) => {
      const mapped = statusDisplayMap[v.status] || {
        text: (v.status || "").replace(/_/g, " "),
        variant: "primary",
      };
      return {
        ...v,
        _statusText: mapped.text,
        _statusVariant: mapped.variant,
      };
    });
  }, [vehicles]);

  const allSelected = useMemo(
    () =>
      mappedVehicles.length > 0 && selected.length === mappedVehicles.length,
    [selected, mappedVehicles]
  );

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[480px]">
        <div className="p-6 py-8">
          <ModalTitle>
            {t(
              "cancelFleetModal.title",
              {},
              "Pilih Armada Yang Ingin Dibatalkan"
            )}
          </ModalTitle>

          <div className="mt-4 max-h-[350px] overflow-y-auto rounded-xl border border-neutral-400 p-3 pb-0">
            {isLoading ? (
              <div className="flex h-[100px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent" />
              </div>
            ) : mappedVehicles.length === 0 ? (
              <div className="py-6 text-center text-sm text-neutral-700">
                {t("cancelFleetModal.empty", {}, "Tidak ada armada.")}
              </div>
            ) : (
              <>
                <div className="mb-1 px-2 py-2">
                  <Checkbox
                    label={t(
                      "cancelFleetModal.selectAll",
                      {},
                      "Pilih Semua Armada"
                    )}
                    checked={allSelected}
                    onChange={handleToggleAll}
                    disabled={isLoading}
                  />
                </div>

                {mappedVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-start justify-between border-b border-neutral-400 px-2 py-4 last:border-b-0"
                  >
                    <Checkbox
                      checked={selected.includes(v.id)}
                      onChange={() => handleToggle(v.id)}
                      className="!items-start"
                      disabled={isLoading}
                    >
                      <div className="ml-2 flex items-start gap-3 rounded-xl">
                        <Image
                          src="/img/truck.png"
                          alt="truck_image"
                          className="rounded-lg border border-neutral-400"
                          width={52}
                          height={52}
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-bold">{v.licensePlate}</p>
                          <div className="flex items-center gap-1">
                            <IconComponent
                              src="/icons/user16.svg"
                              width={16}
                              height={16}
                            />
                            <p className="text-xs font-medium text-neutral-900">
                              {v.driverName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Checkbox>

                    <BadgeStatusPesanan
                      variant={v._statusVariant}
                      className="!h-fit !max-w-[133px] !py-1 px-2 text-center"
                    >
                      {v._statusText}
                    </BadgeStatusPesanan>
                  </div>
                ))}
              </>
            )}
          </div>

          {error && (
            <p className="mt-4 text-xs font-medium text-error-500">{error}</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-bold">
              {t(
                "cancelFleetModal.totalSelected",
                { selected: selected.length, total: mappedVehicles.length },
                `Total Unit Dibatalkan : ${selected.length}/${mappedVehicles.length} Unit`
              )}
            </p>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {t("cancelFleetModal.submitButton", {}, "Batalkan Armada")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default CancelFleetModal;
