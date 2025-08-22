import { useEffect, useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
  useLightbox,
} from "@/components/Lightbox/Lightbox";

const LightboxStateBridge = ({ onChange }) => {
  const { open } = useLightbox();
  useEffect(() => {
    onChange(Boolean(open));
  }, [open, onChange]);
  return null;
};

const ModalDetailTransporterTidakAktif = ({ transporter, detail, onClose }) => {
  const [showHubungiModal, setShowHubungiModal] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!transporter || !detail) return null;

  // Format durasi ke jam
  const formatDuration = (minutes) => {
    if (!minutes) return "-";
    const jam = Math.floor(minutes / 60);
    return `${jam} Jam`;
  };

  // Mock data for fleet notes
  const fleetNoteData = {
    history: {
      reportedAt: "2025-01-15T10:00:00Z",
      notes:
        "Kondisi armada memang sedang maintenance, sehingga aplikasi driver juga tidak diaktifkan karena belum bisa bertugas juga",
      photos: [
        {
          url: "https://cdn.example.com/photos/maintenance_photo_1.jpg",
        },
        {
          url: "https://cdn.example.com/photos/maintenance_photo_2.jpg",
        },
      ],
    },
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 ${showHubungiModal || isLightboxOpen ? "hidden" : ""}`}
      >
        <div className="relative w-[600px] rounded-xl bg-white p-6 shadow-lg">
          {/* Header */}
          <div className="relative mb-2 flex items-center justify-center">
            <h2 className="text-[16px] font-bold text-neutral-900">
              Detail Transporter Tidak Aktif
            </h2>
            <button
              onClick={onClose}
              className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
            >
              <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
            </button>
          </div>
          {/* Card */}
          <div className="mb-4 flex items-start gap-4 rounded-xl border border-neutral-300 p-4">
            <img
              src={transporter.logoUrl || "/icons/company-placeholder.svg"}
              alt={transporter.transporterName}
              className="h-12 w-12 flex-shrink-0 rounded-full border border-neutral-300 object-cover"
            />
            <div className="flex-1">
              <div className="mb-1 text-xs font-bold text-neutral-900">
                {transporter.transporterName}
              </div>
              <div className="mb-1 text-xs font-medium text-error-400">
                Transporter Tidak Aktif
              </div>
              <div className="mb-3 text-xs text-neutral-600">
                {fleetNoteData?.content}
              </div>
              <hr className="my-2 border-neutral-400" />
              <div className="flex gap-12">
                <div>
                  <div className="mb-1 text-xs text-neutral-600">
                    Tanggal Terakhir Aktif
                  </div>
                  <div className="text-xs font-medium text-neutral-900">
                    {detail.lastActiveAt
                      ? `${new Date(detail.lastActiveAt).toLocaleString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "Asia/Jakarta",
                          }
                        )} WIB`
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-neutral-600">
                    Lama Tidak Aktif
                  </div>
                  <div className="text-xs font-medium text-neutral-900">
                    {formatDuration(detail.inactiveDuration)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Detail Penyelesaian (if needed, use fleetNoteData.history) */}
          <div className="h-[187px] rounded-xl border border-neutral-300 pl-3 pr-2 pt-3">
            <div className="mb-4 flex h-[165px] flex-col overflow-y-auto">
              <div className="mb-3 flex items-center">
                <p className="text-xs font-bold text-neutral-900">
                  Detail Penyelesaian
                </p>
              </div>
              <div className="mb-2 flex flex-col gap-2">
                <p className="text-xs font-medium text-neutral-600">
                  Tanggal Diselesaikan
                </p>
                <p className="text-xs font-medium text-neutral-900">
                  {fleetNoteData?.history?.reportedAt
                    ? new Date(
                        fleetNoteData.history.reportedAt
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
              <div className="mb-2 flex flex-col gap-2">
                <p className="text-xs font-medium text-neutral-600">Catatan</p>
                <p className="text-xs font-medium text-neutral-900">
                  {fleetNoteData?.history?.notes || "-"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-neutral-600">
                  Foto Pendukung
                </p>
                <LightboxProvider
                  images={
                    fleetNoteData?.history?.photos?.map((photo) => photo.url) ||
                    []
                  }
                  title="Foto Penyelesaian"
                >
                  <div className="flex flex-row gap-2">
                    {fleetNoteData?.history?.photos?.length > 0 ? (
                      fleetNoteData.history.photos.map((photo, idx) => (
                        <LightboxPreview
                          key={idx}
                          image={photo.url}
                          index={idx}
                          className="h-10 w-10 flex-shrink-0 rounded-[4px] border object-cover"
                          alt={`Foto Penyelesaian ${idx + 1}`}
                        />
                      ))
                    ) : (
                      <span className="text-xs text-neutral-500">
                        Tidak ada foto
                      </span>
                    )}
                  </div>
                  <LightboxStateBridge onChange={setIsLightboxOpen} />
                </LightboxProvider>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="muattrans-primary-secondary"
              className="h-8 w-[105px] rounded-full text-sm font-semibold"
              onClick={() => setShowHubungiModal(true)}
            >
              Hubungi
            </Button>
          </div>
        </div>
      </div>
      <HubungiModal
        isOpen={showHubungiModal}
        onClose={() => setShowHubungiModal(false)}
        transporterContacts={transporter}
      />
    </>
  );
};

export default ModalDetailTransporterTidakAktif;
