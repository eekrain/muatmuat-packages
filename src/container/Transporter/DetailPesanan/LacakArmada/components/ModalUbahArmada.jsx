"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import RadioButton from "@/components/Radio/RadioButton";
import Search from "@/components/Search/Search";
import { toast } from "@/lib/toast";

// --- Dummy Data (tanpa hint untuk overload) ---
const dummyDrivers = [
  {
    id: "drv-1",
    fullName: "Ahmad Maulana",
    driverPhotoUrl: "/img/truck.png",
    plateNumber: "AE 6666 LBA",
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    isRecommended: true,
    recommendationHint: "jenis armada sesuai, jarak terdekat",
    isPotentialOverload: false,
    currentVehicle: null,
  },
  {
    id: "drv-2",
    fullName: "Budi Santoso",
    driverPhotoUrl: "/img/truck.png",
    plateNumber: "L 8312 L",
    vehicleType: "Fuso - Bak Tertutup",
    isRecommended: false,
    recommendationHint: "", // tidak ada hint
    isPotentialOverload: true, // hanya badge, tanpa hint
    currentVehicle: "B 1234 XYZ",
  },
  {
    id: "drv-3",
    fullName: "Siti Aminah",
    driverPhotoUrl: "/img/truck.png",
    plateNumber: "B 9021 KCD",
    vehicleType: "CDD - Box",
    isRecommended: false,
    recommendationHint: "",
    isPotentialOverload: false,
    currentVehicle: null,
  },
  {
    id: "drv-4",
    fullName: "Siti Aminah",
    driverPhotoUrl: "/img/truck.png",
    plateNumber: "B 9021 KCD",
    vehicleType: "CDD - Box",
    isRecommended: false,
    recommendationHint: "",
    isPotentialOverload: false,
    currentVehicle: null,
  },
  {
    id: "drv-5",
    fullName: "Siti Aminah",
    driverPhotoUrl: "/img/truck.png",
    plateNumber: "B 9021 KCD",
    vehicleType: "CDD - Box",
    isRecommended: false,
    recommendationHint: "",
    isPotentialOverload: false,
    currentVehicle: null,
  },
];

// --- Item Layout ---
function ArmadaOptionItem({
  selected,
  onSelect,
  plateNumber,
  driverName,
  vehicleDesc,
  photoUrl,
  isRecommended,
  recommendationHint,
  isPotentialOverload,
}) {
  // tampilkan kanan hanya jika ada badge
  const showRightInfo = isRecommended || isPotentialOverload;

  return (
    <div
      className="flex cursor-pointer items-center justify-between gap-3 border-b border-neutral-300 bg-white pb-4 hover:bg-neutral-50"
      onClick={onSelect}
    >
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-300">
          <img src={photoUrl} alt="Armada" className="h-14 w-14 object-cover" />
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-neutral-900">
            {plateNumber}
          </div>

          <div className="mt-3 min-w-0">
            {/* dua baris sejajar pakai grid */}
            <div className="mt-0.5 grid grid-cols-[14px_auto] gap-x-1 gap-y-1 text-[10px] font-medium text-neutral-900">
              {/* row 1: driver */}
              <IconComponent
                src="/icons/user16.svg"
                alt=""
                className="h-3.5 w-3.5 flex-shrink-0"
              />
              <span className="truncate leading-[14px]">{driverName}</span>

              {/* row 2: vehicle */}
              <IconComponent
                src={"/icons/monitoring/daftar-pesanan-aktif/truck.svg"}
                className="h-3.5 w-3.5 flex-shrink-0"
              />
              <span className="truncate leading-[14px]">{vehicleDesc}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT (default kosong; hanya badge jika ada) */}
      <div className="flex items-center gap-3">
        {showRightInfo && (
          <div className="text-right">
            {/* Badge Rekomendasi */}
            {isRecommended && (
              <>
                <div className="inline-flex items-center rounded-md bg-success-400 px-3 py-1 text-[12px] font-semibold text-white">
                  Rekomendasi
                </div>
                {/* hint hanya untuk rekomendasi */}
                {recommendationHint && (
                  <div className="mt-2 text-[10px] font-medium text-neutral-900">
                    {recommendationHint}
                  </div>
                )}
              </>
            )}

            {/* Badge Potensi Overload (tanpa hint) */}
            {isPotentialOverload && (
              <div className="inline-flex items-center rounded-md bg-error-50 px-3 py-1 text-[12px] font-semibold text-error-400">
                Potensi Overload
              </div>
            )}
          </div>
        )}

        {/* Radio */}
        <RadioButton
          name="selectedArmada"
          value={plateNumber}
          checked={!!selected}
          onChange={onSelect}
          className="!gap-0"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

// --- Modal Utama ---
const ModalUbahArmada = ({
  onClose,
  onSuccess,
  vehicleId,
  vehiclePlate = "L 8312 L",
  currentDriverId,
  title = "Ubah Armada",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState(
    currentDriverId || null
  );

  const drivers = dummyDrivers.filter((d) => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return true;
    return (
      d.fullName.toLowerCase().includes(q) ||
      (d.plateNumber || "").toLowerCase().includes(q) ||
      (d.vehicleType || "").toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedDriverId(currentDriverId || null);
  }, [currentDriverId]);

  const handleSave = () => {
    if (selectedDriverId) {
      toast.success("Berhasil mengubah armada (dummy)");
      onClose?.();
      onSuccess?.(vehicleId, selectedDriverId);
    }
  };

  return (
    <Modal
      open={true}
      onOpenChange={(o) => !o && onClose?.()}
      closeOnOutsideClick
    >
      <ModalContent size="small" type="muattrans" className="w-[640px]">
        <div className="p-6">
          <h2 className="mb-4 text-center text-base font-bold">{title}</h2>

          {/* Search */}
          <Search
            placeholder="Cari Plat / Nama Driver / Tipe Armada"
            onSearch={setSearchValue}
            autoSearch
            debounceTime={300}
            defaultValue=""
          />

          {/* List dengan fixed height */}
          <div className="mt-3 h-[291px] space-y-2 overflow-y-auto rounded-lg border border-neutral-400 p-3 pr-2">
            {drivers.length === 0 ? (
              <DataNotFound
                className="h-[291px] gap-y-5"
                title="Keyword Tidak Ditemukan"
              />
            ) : (
              drivers.map((d) => (
                <ArmadaOptionItem
                  key={d.id}
                  selected={selectedDriverId === d.id}
                  onSelect={() => setSelectedDriverId(d.id)}
                  plateNumber={d.plateNumber}
                  driverName={d.fullName}
                  vehicleDesc={d.vehicleType}
                  photoUrl={d.driverPhotoUrl}
                  isRecommended={d.isRecommended}
                  recommendationHint={d.recommendationHint}
                  isPotentialOverload={d.isPotentialOverload}
                />
              ))
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="muattrans-primary-secondary" onClick={onClose}>
              Batal
            </Button>
            <Button variant="muattrans-primary" onClick={handleSave}>
              Simpan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalUbahArmada;
