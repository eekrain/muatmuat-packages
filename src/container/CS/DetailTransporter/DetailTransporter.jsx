import { useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import DataTable from "@/components/DataTable/DataTable";
import DetailTransporterHeader from "@/container/CS/DetailTransporter/DetailTransporterHeader/DetailTransporterHeader";
import ModalCatatanPenyelesaian from "@/container/CS/DetailTransporter/DetailTransporterHeader/ModalCatatanPenyelesaian";
import { useGetInactiveTransporter } from "@/services/CS/monitoring/permintaan-angkut/getInactiveTransporter";
import { useGetLatestFleetNote } from "@/services/CS/monitoring/permintaan-angkut/getLatestFleetNote";

// Helper to format date and duration
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return `${date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  })} WIB`;
}

function formatDuration(minutes) {
  if (minutes === null || minutes === undefined) return "-";
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  let result = "";
  if (days) result += `${days} hari `;
  if (hours) result += `${hours} jam `;
  if (mins) result += `${mins} menit`;
  return result.trim() || "-";
}

// Column definitions for the DataTable
const armadaNonaktifColumns = [
  {
    key: "licensePlate",
    header: "No. Polisi",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-medium text-neutral-900">
        {row.licensePlate}
      </span>
    ),
  },
  {
    key: "driverName",
    header: "Nama Driver",
    sortable: true,
    render: (row) => (
      <span className="text-wrap text-xs font-medium text-neutral-900">
        {row.driverName}
      </span>
    ),
  },
  {
    key: "tanggalNonaktif",
    header: "Tanggal Nonaktif",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-medium text-neutral-900">
        {row.tanggalNonaktif}
      </span>
    ),
  },
  {
    key: "lamaNonaktif",
    header: "Lama Armada Nonaktif",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-medium text-neutral-900">
        {row.lamaNonaktif}
      </span>
    ),
  },
];

const DetailTransporter = ({ breadcrumbData }) => {
  // State for pagination (should be declared first)
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // State for Modals
  const [showHubungiModal, setShowHubungiModal] = useState(false);
  const [showCatatanModal, setShowCatatanModal] = useState(false);

  // Fetch alert summary for totalIncrease
  const { data: alertData } = useGetInactiveTransporter();
  const totalIncrease = alertData?.alertSummary?.totalIncrease ?? 0;

  // Fetch latest fleet note data
  const transporterId = "transporter-uuid-2"; // Example, should be dynamic
  const { data: fleetNoteData, isLoading: isFleetNoteLoading } =
    useGetLatestFleetNote(transporterId, {
      page: currentPage,
      limit: perPage,
    });

  // Ambil nama transporter dari data
  const transporterName =
    fleetNoteData?.Data?.latestNote?.relatedEntities?.transporterName || "-";
  const transporter = {
    name: transporterName,
    logoUrl: "/icons/company-placeholder.svg",
  };

  // Map data to DataTable format
  const armadaNonaktifData = (fleetNoteData?.Data?.details || []).map(
    (item) => ({
      licensePlate: item.licensePlate,
      driverName: item.driverName,
      tanggalNonaktif: formatDate(item.inactiveDate),
      lamaNonaktif: formatDuration(item.inactiveDuration),
    })
  );

  // Use pagination from API response
  const pagination = fleetNoteData?.Data?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.totalItems || armadaNonaktifData.length;

  return (
    <div className="w-full p-6">
      <BreadCrumb data={breadcrumbData} maxWidth={111} />
      <div className="my-4 flex gap-x-6">
        <div className="w-[340px] min-w-[320px]">
          <DetailTransporterHeader transporter={transporter} />
        </div>
      </div>
      <div className="flex w-full items-start gap-4">
        {/* Left Column: Admin Info Card */}
        <div className="flex flex-col gap-4">
          <div className="flex w-[340px] flex-col gap-5 rounded-xl bg-neutral-50 p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <img
                src={transporter.logoUrl}
                alt={transporter.name}
                className="h-14 w-14 flex-shrink-0 rounded-full border border-neutral-400 bg-white object-cover"
              />
              <div className="flex flex-col justify-center">
                <p className="text-xs font-bold text-neutral-900">
                  {transporter.name}
                </p>
                <p className="text-xs font-medium text-error-400">
                  Armada Nonaktif Terlalu Banyak (10/11)
                </p>
              </div>
            </div>
            <p className="text-xs font-medium text-neutral-600">
              {fleetNoteData?.Data?.latestNote?.content || "-"}
            </p>
            <div className="flex justify-between gap-3">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-full rounded-[24px] px-4 text-[14px] font-semibold"
                onClick={() => setShowHubungiModal(true)}
              >
                Hubungi
              </Button>
              {fleetNoteData?.Data?.latestNote?.status === "active" && (
                <Button
                  variant="muattrans-warning"
                  className="h-8 w-full rounded-[24px] px-4 text-[14px] font-semibold text-[#461B02]"
                  onClick={() => setShowCatatanModal(true)}
                >
                  Selesaikan
                </Button>
              )}
            </div>
          </div>
          {fleetNoteData?.Data?.latestNote?.status === "completed" && (
            <div className="flex w-[340px] flex-col rounded-xl bg-neutral-50 p-6 shadow-lg">
              <div className="mb-6 flex items-center">
                <p className="text-xs font-semibold text-neutral-900">
                  Detail Penyelesaian
                </p>
              </div>
              <div className="mb-3 flex flex-col gap-2">
                <p className="text-xs font-medium text-neutral-600">
                  Tanggal Diselesaikan
                </p>
                <p className="text-xs font-medium text-neutral-900">
                  {fleetNoteData?.Data?.latestNote?.history?.reportedAt
                    ? new Date(
                        fleetNoteData.Data.latestNote.history.reportedAt
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
              <div className="mb-3 flex flex-col gap-2">
                <p className="text-xs font-medium text-neutral-600">Catatan</p>
                <p className="text-xs font-medium text-neutral-900">
                  {fleetNoteData?.Data?.latestNote?.history?.notes || "-"}
                </p>
              </div>
              <div className="mb-3 flex flex-col gap-2">
                <p className="text-xs font-medium text-neutral-600">
                  Foto Pendukung
                </p>
                <div className="flex flex-row gap-2">
                  {fleetNoteData?.Data?.latestNote?.history?.photos?.length >
                  0 ? (
                    fleetNoteData.Data.latestNote.history.photos.map(
                      (photo, idx) => (
                        <div
                          key={idx}
                          className="h-10 w-10 flex-shrink-0 rounded-[4px] border"
                        >
                          <img
                            src={photo.url}
                            alt={`Foto Pendukung ${idx + 1}`}
                            className="h-full w-full rounded-[4px] object-cover"
                          />
                        </div>
                      )
                    )
                  ) : (
                    <span className="text-xs text-neutral-500">
                      Tidak ada foto
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <HubungiModal
          isOpen={showHubungiModal}
          onClose={() => setShowHubungiModal(false)}
          transporterData={null} // TODO: pass actual transporter data
        />
        <ModalCatatanPenyelesaian
          isOpen={showCatatanModal}
          onClose={() => setShowCatatanModal(false)}
          onConfirm={() => setShowCatatanModal(false)}
        />

        {/* Right Column: DataTable */}
        <div className="w-full flex-grow">
          {fleetNoteData?.Data?.latestNote?.status === "active" && (
            <div className="flex w-full rounded-xl bg-neutral-50 px-6 pt-5">
              <div className="flex w-full justify-center rounded-md bg-error-50 py-2">
                <p className="text-xs font-semibold text-error-400">
                  Armada nonaktif bertambah {totalIncrease} dari follow-up
                  terakhir.
                  <span className="cursor-pointer font-medium text-primary-700">
                    Lihat Catatan Terakhir
                  </span>
                </p>
              </div>
            </div>
          )}

          <DataTable
            data={armadaNonaktifData}
            columns={armadaNonaktifColumns}
            searchPlaceholder="Cari Nama Driver / No. Polisi"
            totalCountLabel="Armada Nonaktif"
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
            showFilter={false}
            showPagination={true}
            showTotalCount={true}
            loading={isFleetNoteLoading}
            className="w-full flex-grow rounded-xl border-0 bg-neutral-50 text-xs font-semibold text-neutral-900 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default DetailTransporter;
