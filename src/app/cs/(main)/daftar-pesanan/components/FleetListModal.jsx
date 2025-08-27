"use client";

import Image from "next/image";
import { useState } from "react";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

const FleetItem = ({ vehicle }) => (
  <>
    <div className="mb-3 flex items-center gap-3 rounded-xl border border-neutral-400 px-3 py-3 last:mb-0">
      <Image
        src="/img/truck.png"
        alt="truck_image"
        className="rounded-lg border border-neutral-400"
        width={52}
        height={52}
      />
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold">{vehicle.licensePlate}</p>
        <div className="flex items-center gap-1">
          <IconComponent src={"/icons/user16.svg"} width={16} height={16} />
          <p className="text-xs font-medium text-neutral-900">
            {vehicle.driverName}
          </p>
        </div>
      </div>
    </div>
  </>
);

const FleetListModal = ({ isOpen, onClose, vehicles, isLoading }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      v.driverName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[600px]">
        <div className="px-3 py-6">
          <ModalTitle>
            {t("fleetListModal.title", {}, "Daftar Armada")}
          </ModalTitle>
          {vehicles.length > 1 && (
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "fleetListModal.searchPlaceholder",
                {},
                "Cari No. Polisi / Nama Driver"
              )}
              icon={{
                left: (
                  <IconComponent src="/icons/datatable-search.svg" width={16} />
                ),
              }}
              className="mt-4 px-3.5"
            />
          )}
          <div className="mt-4 max-h-[300px] overflow-y-auto px-3">
            {isLoading ? (
              <div className="flex h-[100px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
              </div>
            ) : filteredVehicles.length > 0 ? (
              filteredVehicles.map((v) => <FleetItem key={v.id} vehicle={v} />)
            ) : (
              <p className="py-8 text-center text-sm text-neutral-500">
                {t("fleetListModal.notFound", {}, "Armada tidak ditemukan")}
              </p>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default FleetListModal;
