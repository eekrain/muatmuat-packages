import { useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import DataTable from "@/components/DataTable/DataTable";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import DetailTransporterHeader from "@/container/CS/DetailTransporter/DetailTransporterHeader/DetailTransporterHeader";
import ModalCatatanPenyelesaian from "@/container/CS/DetailTransporter/DetailTransporterHeader/ModalCatatanPenyelesaian";
import { formatDate } from "@/lib/utils/dateFormat";
import { useGetTransporterInactiveFleetDetails } from "@/services/CS/laporan/riwayat-transporter-tidak-aktif/getTransporterInactiveDetail";

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

const DetailTransporter = ({ breadcrumbData }) => {
  // State for pagination (should be declared first)
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // State for Modals
  const [showHubungiModal, setShowHubungiModal] = useState(false);
  const [showCatatanModal, setShowCatatanModal] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    sort: "licensePlate",
    order: "asc",
  });

  // Fetch fleet details data using the correct hook
  const transporterId = "transporter-uuid-2"; // Example, should be dynamic
  const { data: fleetDetailsData, isLoading: isFleetDetailsLoading } =
    useGetTransporterInactiveFleetDetails({
      transporterId,
      page: currentPage,
      limit: perPage,
    });

  // Extract transporter info and fleet data
  const transporterInfo = fleetDetailsData?.Data?.transporterInfo || {};
  const inactiveFleets = fleetDetailsData?.Data?.inactiveFleets || [];
  const pagination = fleetDetailsData?.Data?.pagination || {};

  // Ambil nama transporter dari data
  const transporterName = transporterInfo.name || "-";
  const transporter = {
    name: transporterName,
    logoUrl: "/icons/company-placeholder.svg",
  };

  // Map data to DataTable format
  let armadaNonaktifData = inactiveFleets.map((item) => ({
    licensePlate: item.licensePlate,
    driverName: item.driverName,
    tanggalNonaktif: formatDate(item.inactiveDate),
    lamaNonaktif: formatDuration(item.inactiveDuration),
    _rawTanggalNonaktif: item.inactiveDate,
    _rawLamaNonaktif: item.inactiveDuration,
  }));

  // Filter data based on search query (when character count is 0 or > 2)
  if (searchQuery.trim().length === 0 || searchQuery.trim().length > 2) {
    if (searchQuery.trim().length > 2) {
      armadaNonaktifData = armadaNonaktifData.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
          item.licensePlate?.toLowerCase().includes(query) ||
          item.driverName?.toLowerCase().includes(query)
        );
      });
    }
    // If length is 0, show all data (no filtering)
  }

  // Sorting
  if (sortConfig?.sort) {
    armadaNonaktifData = [...armadaNonaktifData].sort((a, b) => {
      let aValue = a[sortConfig.sort];
      let bValue = b[sortConfig.sort];
      // Custom sort for tanggalNonaktif and lamaNonaktif
      if (sortConfig.sort === "tanggalNonaktif") {
        aValue = a._rawTanggalNonaktif;
        bValue = b._rawTanggalNonaktif;
      } else if (sortConfig.sort === "lamaNonaktif") {
        aValue = a._rawLamaNonaktif;
        bValue = b._rawLamaNonaktif;
      }
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (typeof aValue === "string" && typeof bValue === "string") {
        if (sortConfig.sort === "tanggalNonaktif") {
          // Compare date string
          return sortConfig.order === "asc"
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }
        return sortConfig.order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      // Number sort (lamaNonaktif)
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.order === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }

  // Use pagination from API response
  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.totalItems || armadaNonaktifData.length;

  const handleSort = (sort, order) => {
    setSortConfig({ sort, order });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
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
              <div className="flex flex-col justify-center space-y-2">
                <p className="text-xs font-bold text-neutral-900">
                  {transporter.name}
                </p>
                <p className="text-xs font-medium text-error-400">
                  Armada Nonaktif Terlalu Banyak (10/11)
                </p>
              </div>
            </div>
            {/* <p className="text-xs font-medium text-neutral-600">
              {fleetNoteData?.Data?..content || "-"}
            </p> */}
            <div className="flex justify-between gap-3">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-full rounded-[24px] px-4 text-[14px] font-semibold"
                onClick={() => setShowHubungiModal(true)}
              >
                Hubungi
              </Button>
            </div>
          </div>
          <div className="flex w-[340px] flex-col rounded-xl bg-neutral-50 p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <p className="text-xs font-semibold text-neutral-900">
                Detail Penyelesaian
              </p>
            </div>
            <div className="mb-3 flex flex-col gap-2">
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
            <div className="mb-3 flex flex-col gap-2">
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
                title="Foto Pendukung"
              >
                <div className="flex flex-row gap-2">
                  {fleetNoteData?.history?.photos?.length > 0 ? (
                    fleetNoteData.history.photos.map((photo, idx) => (
                      <LightboxPreview
                        key={idx}
                        image={photo.url}
                        index={idx}
                        className="h-10 w-10 flex-shrink-0 rounded-[4px] border object-cover"
                        alt={`Foto Pendukung ${idx + 1}`}
                      />
                    ))
                  ) : (
                    <span className="text-xs text-neutral-500">
                      Tidak ada foto
                    </span>
                  )}
                </div>
              </LightboxProvider>
            </div>
          </div>
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
          {/* {fleetNoteData?..status === "active" && (
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
          )} */}

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
            onSearch={handleSearch}
            showFilter={false}
            showPagination={true}
            showTotalCount={true}
            onSort={handleSort}
            loading={isFleetDetailsLoading}
            className="w-full flex-grow rounded-xl border-0 bg-neutral-50 text-xs font-semibold text-neutral-900 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default DetailTransporter;
