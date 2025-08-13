"use client";

import { useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import DataTable from "@/components/DataTable/DataTable";
import Filter from "@/components/Filter/Filter";
import { Select } from "@/components/Form/Select";
import Pagination from "@/components/Pagination/Pagination";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";

const DaftarPesananPage = () => {
  const [selectedTab, setSelectedTab] = useState("semua");
  const [selectedPeriode, setSelectedPeriode] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");

  // Handle tab click
  const handleTabClick = (tabValue) => {
    setSelectedTab(tabValue);
    console.log("Selected tab:", tabValue);
  };

  // Tab options sesuai design
  const tabOptions = [
    { label: "Semua", value: "semua" },
    { label: "Perlu Respon Perubahan (2)", value: "perlu-respon" },
    { label: "Perlu Konfirmasi Siap (2)", value: "perlu-konfirmasi" },
    { label: "Perlu Assign Armada (3)", value: "perlu-assign" },
  ];

  // Mock data sesuai dengan design - menambah lebih banyak data seperti di LDG-2
  const mockData = [
    {
      id: 1,
      noPesanan: "MT25A010A",
      tipeOrder: "instan",
      waktuMuat: {
        label: "Muat Hari Ini",
        date: "13 Apr 2025",
        time: "17:39 WIB s/d 18:00 WIB",
      },
      locations: {
        pickup: [{ fullAddress: "Kota Tangerang Selatan Kota T..." }],
        dropoff: [{ fullAddress: "DKI Jakarta, Kec. Kepulauan S..." }],
      },
      armada: {
        type: "Colt Diesel Engkel",
        carrier: "Box",
        unit: 1,
        capacity: "2.500 kg",
      },
      status: "menunggu-konfirmasi",
      actionType: "detail",
    },
    {
      id: 2,
      noPesanan: "MT25A011B",
      tipeOrder: "terjadwal",
      waktuMuat: {
        date: "13 Apr 2025",
        time: "18:30 WIB s/d 19:00 WIB",
      },
      locations: {
        pickup: [{ fullAddress: "Kota Bekasi Timur" }],
        dropoff: [{ fullAddress: "DKI Jakarta, Kec. Tambora" }],
      },
      armada: {
        type: "Colt Diesel Engkel",
        carrier: "Box",
        unit: 1,
        capacity: "2.500 kg",
      },
      status: "perlu-respon-perubahan",
      actionType: "detail",
    },
    {
      id: 3,
      noPesanan: "MT25A012C",
      tipeOrder: "instan",
      waktuMuat: {
        date: "13 Apr 2025",
        time: "19:00 WIB s/d 19:30 WIB",
      },
      locations: {
        pickup: [{ fullAddress: "Jakarta Pusat" }],
        dropoff: [{ fullAddress: "Depok, Jawa Barat" }],
      },
      armada: {
        type: "Colt Diesel Double",
        carrier: "Box",
        unit: 1,
        capacity: "3.000 kg",
      },
      status: "perlu-konfirmasi-siap",
      actionType: "detail",
    },
    {
      id: 4,
      noPesanan: "MT25A013D",
      tipeOrder: "terjadwal",
      waktuMuat: {
        date: "14 Apr 2025",
        time: "08:00 WIB s/d 08:30 WIB",
      },
      locations: {
        pickup: [{ fullAddress: "Tangerang Selatan" }],
        dropoff: [{ fullAddress: "Bogor, Jawa Barat" }],
      },
      armada: {
        type: "Truk Engkel",
        carrier: "Bak",
        unit: 2,
        capacity: "4.500 kg",
      },
      status: "perlu-assign-armada",
      actionType: "assign-armada",
    },
    {
      id: 5,
      noPesanan: "MT25A014E",
      tipeOrder: "instan",
      waktuMuat: {
        date: "14 Apr 2025",
        time: "09:00 WIB s/d 09:30 WIB",
      },
      locations: {
        pickup: [{ fullAddress: "Jakarta Selatan" }],
        dropoff: [{ fullAddress: "Bekasi, Jawa Barat" }],
      },
      armada: {
        type: "Colt Diesel Engkel",
        carrier: "Box",
        unit: 1,
        capacity: "2.500 kg",
      },
      status: "pesanan-dijadwalkan",
      actionType: "detail",
    },
  ];

  // Define columns sesuai LDG-2 design
  const columns = [
    {
      key: "noPesanan",
      label: "No. Pesanan",
      header: "No. Pesanan",
      sortable: true,
      width: "183.6px",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold leading-none text-black">
            {row.noPesanan}
          </span>
          {row.tipeOrder === "instan" && (
            <div className="flex h-6 w-fit items-center justify-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium leading-none text-green-600">
              Instan
            </div>
          )}
          {row.tipeOrder === "terjadwal" && (
            <div className="flex h-6 w-fit items-center justify-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium leading-none text-blue-600">
              Terjadwal
            </div>
          )}
        </div>
      ),
    },
    {
      key: "waktuMuat",
      label: "Waktu Muat",
      header: "Waktu Muat",
      sortable: true,
      width: "183.6px",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {row.waktuMuat.label && (
            <span className="text-xs font-medium leading-none text-green-600">
              {row.waktuMuat.label}
            </span>
          )}
          <span className="text-xs leading-none text-black">
            {row.waktuMuat.date} {row.waktuMuat.time}
          </span>
        </div>
      ),
    },
    {
      key: "ruteMuatBongkar",
      label: "Rute Muat & Bongkar",
      header: "Rute Muat & Bongkar",
      width: "183.6px",
      render: (row) => {
        const firstPickupDropoff = [
          row.locations.pickup[0],
          row.locations.dropoff[0],
        ];

        return (
          <div className="relative flex flex-col gap-3">
            <TimelineContainer>
              {firstPickupDropoff.map((item, key) => (
                <NewTimelineItem
                  key={key}
                  variant="bullet"
                  index={key}
                  activeIndex={0}
                  isLast={key === firstPickupDropoff.length - 1}
                  title={item.fullAddress}
                  className="pb-3"
                  appearance={{
                    titleClassname:
                      "line-clamp-1 break-all text-xs text-black leading-none",
                  }}
                />
              ))}
            </TimelineContainer>
            {/* Only show "Lihat Lokasi Lainnya" if there are multiple pickup or dropoff locations */}
            {(row.locations.pickup.length > 1 ||
              row.locations.dropoff.length > 1) && (
              <button className="text-left text-xs font-medium text-primary-700">
                Lihat Lokasi Lainnya
              </button>
            )}
          </div>
        );
      },
    },
    {
      key: "armada",
      label: "Armada",
      header: "Armada",
      width: "183.6px",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs leading-none text-black">
              {row.armada.type}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-black">
            <span>Carrier : {row.armada.carrier}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-black">
            <div className="flex items-center gap-1">
              <img
                src="/icons/icon-mini-truck.png"
                alt="truck"
                className="h-3 w-3"
              />
              <span>{row.armada.unit} Unit</span>
            </div>
            <div className="flex items-center gap-1">
              <img
                src="/icons/icon-scale.png"
                alt="weight"
                className="h-3 w-3"
              />
              <span>{row.armada.capacity}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      header: "Status",
      width: "183.6px",
      render: (row) => (
        <div className="flex items-center">
          {row.status === "menunggu-konfirmasi" && (
            <div className="flex h-6 w-44 items-center gap-1 rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              <img
                src="/icons/icon-information.png"
                alt="info"
                className="h-3 w-3"
              />
              <span>Menunggu Konfirmasi</span>
            </div>
          )}
          {row.status === "perlu-assign-armada" && (
            <div className="flex h-6 w-44 items-center gap-1 rounded-md bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
              <img
                src="/icons/icon-warning-kuning.png"
                alt="warning"
                className="h-3 w-3"
              />
              <span>Perlu Assign Armada</span>
            </div>
          )}
          {row.status === "perlu-respon-perubahan" && (
            <div className="flex h-6 w-44 items-center gap-1 rounded-md bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
              <img
                src="/icons/icon-warning-kuning.png"
                alt="warning"
                className="h-3 w-3"
              />
              <span>Perlu Respon Perubahan</span>
            </div>
          )}
          {row.status === "perlu-konfirmasi-siap" && (
            <div className="flex h-6 w-44 items-center gap-1 rounded-md bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
              <img
                src="/icons/icon-warning-kuning.png"
                alt="warning"
                className="h-3 w-3"
              />
              <span>Perlu Konfirmasi Siap</span>
            </div>
          )}
          {row.status === "pesanan-dijadwalkan" && (
            <div className="flex h-6 w-44 items-center justify-center rounded-md bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
              <span>Pesanan Dijadwalkan</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "action",
      label: "",
      header: "",
      width: "183.6px",
      sortable: false,
      render: (row) =>
        row.status === "perlu-assign-armada" ? (
          <Button
            variant="muattrans-primary"
            className="!h-8 !w-[174px] !rounded-3xl text-xs font-semibold"
          >
            Assign Armada
          </Button>
        ) : (
          <Button
            variant="muattrans-primary-secondary"
            className="!h-8 !w-[174px] !rounded-3xl !border !border-[#461B02] !bg-white text-xs font-semibold !text-[#461B02]"
          >
            Detail
          </Button>
        ),
    },
  ];

  // Status radio options untuk hierarchical filter
  const statusRadioOptions = [
    {
      key: "status",
      label: "Status",
      children: [
        { value: "menunggu-konfirmasi", label: "Menunggu Konfirmasi" },
        { value: "perlu-assign-armada", label: "Perlu Assign Armada" },
        { value: "perlu-konfirmasi-siap", label: "Perlu Konfirmasi Siap" },
        { value: "pesanan-dijadwalkan", label: "Pesanan Dijadwalkan" },
        { value: "pesanan-selesai", label: "Pesanan Selesai" },
      ],
    },
  ];

  // Handle filter change
  const handleFilterChange = ({ name, value }) => {
    setSelectedStatus(value);
    console.log("Filter changed:", name, value);
  };

  // Get selected filter for display
  const getSelectedFilter = () => {
    if (!selectedStatus) return null;

    const allOptions = statusRadioOptions.flatMap(
      (item) => item.children || []
    );
    return allOptions.find((option) => option.value === selectedStatus);
  };

  const selectedFilter = getSelectedFilter();

  return (
    <div className="space-y-6 p-6">
      {/* Header sesuai LDG-2 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold leading-none text-neutral-900">
          Daftar Pesanan
        </h1>
        <Select
          value={selectedPeriode}
          onChange={setSelectedPeriode}
          placeholder="Semua Periode"
          options={[
            { value: "all", label: "Semua Periode" },
            { value: "today", label: "Hari Ini" },
            { value: "week", label: "1 Minggu Terakhir" },
            { value: "month", label: "1 Bulan Terakhir" },
          ]}
          className="w-48"
        />
      </div>

      {/* Table sesuai LDG-2 design */}
      <div className="rounded-lg bg-white shadow-[0px_4px_11px_0px_#41414140]">
        {/* Custom header dengan Search + Filter + Tabs */}
        <div className="flex-shrink-0 space-y-2 px-6 pb-0 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Cari pesanan"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyUp={(e) =>
                  e.key === "Enter" && console.log("Search:", searchValue)
                }
                className="h-8 w-[262px] rounded-md border border-neutral-300 px-3 text-xs font-medium placeholder:text-neutral-500 focus:border-primary-700 focus:outline-none"
              />

              {/* Filter Component */}
              <Filter
                options={statusRadioOptions}
                value={selectedStatus}
                onChange={handleFilterChange}
                disabled={mockData.length === 0}
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-neutral-700">
                Tampilkan :
              </span>
              <div className="flex items-center gap-2">
                {tabOptions.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleTabClick(tab.value)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedTab === tab.value
                        ? "border border-primary-700 bg-primary-50 text-primary-700"
                        : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filter Display */}
          {selectedFilter && (
            <div className="flex h-8 items-center gap-x-3">
              <button
                className="text-xs font-bold leading-[14.4px] text-primary-700"
                onClick={() => setSelectedStatus("")}
              >
                Hapus Semua Filter
              </button>
              <TagBubble
                withRemove={{
                  onRemove: () => setSelectedStatus(""),
                }}
              >
                {selectedFilter.label}
              </TagBubble>
            </div>
          )}
        </div>

        <DataTable
          data={mockData}
          columns={columns}
          currentPage={currentPage}
          totalPages={Math.ceil(mockData.length / perPage)}
          totalItems={mockData.length}
          perPage={perPage}
          onPageChange={setCurrentPage}
          onPerPageChange={setPerPage}
          className="!rounded-lg !border-transparent"
          showFilter={false}
          showSearch={false}
          tableTitle={null}
          showTotalCount={false}
          showPagination={false}
          headerActions={null}
        />
      </div>

      {/* Pagination di luar container putih */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(mockData.length / perPage)}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
        variants="muatrans"
      />
    </div>
  );
};

export default DaftarPesananPage;
