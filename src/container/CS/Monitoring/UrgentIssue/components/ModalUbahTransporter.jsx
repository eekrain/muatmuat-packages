// Ganti path import sesuai dengan struktur proyek Anda
import { useState } from "react";

// Hook helper baru

// Import komponen UI Anda
import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import RadioButton from "@/components/Radio/RadioButton";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslation } from "@/hooks/use-translation";
import { useGetAvailableTransporter } from "@/services/CS/monitoring/urgent-issue/getAvailableTransporter";
import { useGetTransporterVehicles } from "@/services/CS/monitoring/urgent-issue/getTransporterVehicles";

/**
 * Sub-komponen untuk menampilkan daftar kendaraan milik satu transporter.
 * Komponen ini akan memanggil hook useGetTransporterVehicles secara kondisional.
 */
const TransporterVehicles = ({
  transporterId,
  issueId,
  selectedArmada,
  onSelectArmada,
}) => {
  const { t } = useTranslation();
  const {
    data: vehicles,
    isLoading,
    isError,
  } = useGetTransporterVehicles(transporterId, { issue_id: issueId });

  if (isLoading) {
    return <div className="p-4 text-center text-xs">Memuat armada...</div>;
  }
  if (isError) {
    return (
      <div className="p-4 text-center text-xs text-error-400">
        Gagal memuat armada.
      </div>
    );
  }

  return (
    <>
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="space-y-2 bg-neutral-50">
          <div
            className={`flex items-center justify-between border-t border-neutral-400 p-4 ${vehicle.is_recommended ? "bg-[#E3F5ED]" : "bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <RadioButton
                name={`armada-${transporterId}`}
                value={vehicle.id}
                checked={selectedArmada?.id === vehicle.id}
                onClick={() => onSelectArmada(vehicle)}
              />
              <img
                src="/truck-placeholder.png"
                alt="Truck"
                className="h-14 w-14 rounded border"
              />
              <div className="space-y-2">
                {vehicle.is_recommended && (
                  <div className="inline-block text-xs font-bold text-success-400">
                    {t(
                      "ModalUbahTransporter.labelRekomendasi",
                      {},
                      "Rekomendasi"
                    )}
                  </div>
                )}
                <div className="text-xs font-semibold text-neutral-800">
                  <span className="text-xs font-bold text-neutral-900">
                    {vehicle.plate_number}
                  </span>{" "}
                  - {vehicle.driver_name}
                </div>
                <div className="text-[10px] text-neutral-600">
                  <IconComponent
                    src="/icons/lokasi20.svg"
                    className="mr-1 inline-block h-[14px] w-[14px] text-muat-trans-secondary-900"
                  />
                  {t("ModalUbahTransporter.labelJarakDariLokasi", {
                    jarak: `${vehicle.distance_km} km`,
                  })}{" "}
                  -{" "}
                  <span className="font-medium text-neutral-900">
                    {vehicle.location_address}
                  </span>
                </div>
              </div>
            </div>
            {vehicle.status === "available" && (
              <span
                className={`rounded-md px-8 py-2 text-xs font-semibold ${vehicle.is_recommended ? "bg-success-400 text-success-50" : "bg-success-50 text-success-400"}`}
              >
                {t("ModalUbahTransporter.labelAktif", {}, "Aktif")}
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

const ModalUbahTransporter = ({ open, onClose, issueId, issueData }) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [selectedArmada, setSelectedArmada] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showArmadaAlert, setShowArmadaAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy] = useState("recommendation"); // 'recommendation', 'distance', 'name'
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce 500ms

  // 1. Menggunakan hook untuk mengambil data transporter
  const {
    data: transporterList,
    isLoading: isLoadingTransporters,
    isError: isErrorTransporters,
  } = useGetAvailableTransporter({
    issue_id: issueId,
    search: debouncedSearchTerm,
    sort_by: sortBy,
  });

  if (!open) return null;

  const handleSelectTransporter = (transporter) => {
    setSelectedTransporter(transporter);
    // Reset pilihan armada jika transporter berubah
    setSelectedArmada(null);
    // Buka expander untuk transporter yang dipilih
    setExpandedId(transporter.id);
  };

  const handleToggleExpand = (transporterId) => {
    setExpandedId(expandedId === transporterId ? null : transporterId);
  };

  const handleNext = () => {
    if (!selectedArmada) {
      setShowArmadaAlert(true);
    } else {
      setShowDetail(true);
      setShowArmadaAlert(false);
    }
  };

  // Tampilan detail/konfirmasi
  if (showDetail) {
    // Tampilan detail perubahan transporter mirip gambar
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 ${
          showConfirmModal ? "hidden" : ""
        }`}
      >
        <div className="relative w-[800px] rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-center">
            <h2 className="text-[18px] font-bold text-neutral-900">
              Informasi Perubahan Transporter
            </h2>
            <button
              onClick={onClose}
              className="absolute right-2 top-2 text-primary-700 hover:text-primary-800"
            >
              <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
            </button>
          </div>
          <div className="rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3">
            <div className="mb-3 flex h-14 items-center gap-4 border-b border-neutral-300 bg-neutral-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muat-trans-primary-400">
                <IconComponent src="/icons/truk16.svg" className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-neutral-900">
                Perubahan Transporter
              </p>
            </div>
            <div className="flex gap-6">
              {/* Transporter Awal */}
              <div className="w-[336px] flex-1">
                <div className="mb-4 text-xs font-medium text-neutral-600">
                  Transporter Awal
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={
                      issueData?.transporter?.logo || "/logo-placeholder.png"
                    }
                    alt="Logo"
                    className="h-12 w-12 rounded-full border"
                  />
                  <div>
                    <div className="mb-2 text-xs font-bold text-neutral-900">
                      {issueData?.transporter?.name || "-"}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
                      <IconComponent
                        src="/icons/phone16.svg"
                        className="h-4 w-4"
                      />
                      {issueData?.transporter?.phone || "-"}
                    </div>
                  </div>
                </div>
                <div className="mb-4 text-xs font-medium text-neutral-600">
                  Armada Awal
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/truck-placeholder.png"
                    alt="Truck"
                    className="h-12 w-12 rounded-lg border"
                  />
                  <div>
                    <div className="mb-2 text-xs font-bold text-neutral-900">
                      {selectedArmada?.plate_number || "-"}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
                      <IconComponent
                        src="/icons/profile16.svg"
                        className="h-4 w-4 shrink-0"
                      />
                      {selectedArmada?.driver_name || "-"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-l border-neutral-300"></div>
              {/* Transporter Baru */}
              <div className="w-[336px] flex-1">
                <div className="mb-4 text-xs font-medium text-neutral-600">
                  Transporter Baru
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={selectedTransporter?.logo || "/logo-placeholder.png"}
                    alt="Logo"
                    className="h-12 w-12 rounded-full border"
                  />
                  <div>
                    <div className="mb-2 text-xs font-bold text-neutral-900">
                      {selectedTransporter?.name || "-"}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
                      <IconComponent
                        src="/icons/phone16.svg"
                        className="h-4 w-4"
                      />
                      {selectedTransporter?.phone || "-"}
                    </div>
                  </div>
                </div>
                <div className="mb-4 text-xs font-medium text-neutral-600">
                  Armada Awal
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/truck-placeholder.png"
                    alt="Truck"
                    className="h-12 w-12 rounded-lg border"
                  />
                  <div>
                    <div className="mb-2 text-xs font-bold text-neutral-900">
                      {selectedArmada?.plate_number || "-"}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
                      <IconComponent
                        src="/icons/profile16.svg"
                        className="h-4 w-4 shrink-0"
                      />
                      {selectedArmada?.driver_name || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={() => setShowDetail(false)}
              variant="muattrans-primary-secondary"
            >
              {t("ModalUbahTransporter.buttonKembali", {}, "Kembali")}
            </Button>
            <Button
              onClick={() => setShowConfirmModal(true)}
              variant="muattrans-primary"
            >
              {t(
                "ModalUbahTransporter.buttonKirimPerubahan",
                {},
                "Kirim Perubahan"
              )}
            </Button>
          </div>
        </div>
        <ConfirmationModal
          isOpen={showConfirmModal}
          setIsOpen={setShowConfirmModal}
          title={{ text: "Batalkan Armada", className: "" }}
          withCancel={false}
          description={{
            text: "Maaf, kamu belum memiliki akses. Pembatalan Armada maupun Pesanan hanya bisa dilakukan oleh akses sebagai GM.",
          }}
          confirm={{ text: "Oke", onClick: () => setShowConfirmModal(false) }}
        />
        {/* <ConfirmationModal
          isOpen={showConfirmModal}
          setIsOpen={setShowConfirmModal}
          title={{ text: "Batalkan Armada", className: "" }}
          description={{
            text: "Apakah kamu yakin ingin membatalkan armada dengan No. Polisi L 1111 AA dari Transporter PT Siba Surya?",
          }}
          cancel={{ text: "Kembali" }}
          confirm={{
            text: "Ya, Batalkan",
            onClick: () => setShowConfirmModal(false),
          }}
        /> */}
      </div>
    );
  }

  // Tampilan utama
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-[600px] rounded-xl bg-white py-6 shadow-lg">
        {/* ... Header Modal ... */}
        <div className="mb-4 flex items-center justify-center">
          <h2 className="text-[16px] font-bold text-neutral-900">
            Ubah Transporter
          </h2>
          <button
            onClick={onClose}
            className="absolute right-2 top-2 text-primary-700 hover:text-primary-800"
          >
            <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
          </button>
        </div>

        <Input
          placeholder="Cari No. Polisi / Nama Driver / Transporter"
          icon={{ left: "/icons/search.svg" }}
          className="w-full px-6 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <p className="mb-3 mt-3 px-6 text-xs font-bold">
          Pilih 1 unit armada untuk ditugaskan
        </p>

        <div className="pl-6 pr-4">
          <div className="max-h-[266px] space-y-3 overflow-y-auto pr-2">
            {isLoadingTransporters && (
              <p className="text-center">Loading transporters...</p>
            )}
            {isErrorTransporters && (
              <p className="text-center text-error-400">
                Gagal memuat transporter.
              </p>
            )}

            {!isLoadingTransporters &&
              transporterList.map((transporter) => (
                <div
                  key={transporter.id}
                  className="relative overflow-hidden rounded-lg border border-neutral-400 bg-neutral-100"
                >
                  {transporter.is_recommended && (
                    <span className="absolute right-0 top-0 rounded-bl bg-success-400 px-11 py-[6px] text-xs font-semibold text-white">
                      Rekomendasi
                    </span>
                  )}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <RadioButton
                        name="transporter"
                        value={transporter.id}
                        checked={selectedTransporter?.id === transporter.id}
                        onClick={() => handleSelectTransporter(transporter)}
                        disabled={transporter.has_rejected}
                      />
                      <img
                        src={transporter.logo}
                        alt={transporter.name}
                        className="h-14 w-14 rounded-full border bg-white"
                      />
                      <div className="space-y-2">
                        <div className="text-xs font-bold">
                          {transporter.name}
                        </div>
                        <div className="text-xs font-medium">
                          {transporter.vehicle_count.matching} Armada Yang Cocok
                        </div>
                        <div className="flex gap-3 text-[10px] font-medium">
                          <span className="flex items-center gap-1">
                            <IconComponent
                              src="/icons/transporter12.svg"
                              className="inline-block h-3 w-3"
                            />
                            {transporter.vehicle_count.active} Armada Aktif
                          </span>
                          <span className="flex items-center gap-1">
                            <IconComponent
                              src="/icons/transporter12.svg"
                              className="inline-block h-3 w-3"
                            />
                            {transporter.vehicle_count.inactive} Armada Nonaktif
                          </span>
                        </div>
                        {transporter.has_rejected && (
                          <span className="text-xs font-bold text-error-400">
                            Transporter Menolak
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="muattrans-primary-secondary">
                        Hubungi
                      </Button>
                      <button
                        onClick={() => handleToggleExpand(transporter.id)}
                      >
                        <IconComponent
                          src="/icons/chevron-down.svg"
                          className={`h-6 w-6 transition-transform ${
                            expandedId === transporter.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* 2. Render komponen anak secara kondisional */}
                  {expandedId === transporter.id && (
                    <TransporterVehicles
                      transporterId={transporter.id}
                      issueId={issueId}
                      selectedArmada={selectedArmada}
                      onSelectArmada={setSelectedArmada}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* ... Footer dengan tombol ... */}
        <div className="mt-4 flex flex-col px-6">
          {showArmadaAlert && (
            <p className="mb-4 text-xs font-medium text-error-400">
              Armada Wajib Diisi
            </p>
          )}
          <div className="flex justify-between">
            <Button variant="muattrans-error-secondary" onClick={onClose}>
              Batalkan Armada
            </Button>
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="muattrans-primary-secondary"
                className="w-[112px]"
              >
                Batal
              </Button>
              <Button
                onClick={handleNext}
                variant="muattrans-primary"
                className="w-[124px]"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUbahTransporter;
