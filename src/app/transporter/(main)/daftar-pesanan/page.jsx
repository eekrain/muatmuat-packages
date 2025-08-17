"use client";

import { useState } from "react";

import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import DataTable from "@/components/DataTable/DataTable";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import Filter from "@/components/Filter/Filter";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import RespondChangeModal from "@/container/Transporter/DaftarPesanan/components/RespondChangeModal";

const DaftarPesananPage = () => {
  const [selectedTab, setSelectedTab] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [currentPeriodValue, setCurrentPeriodValue] = useState({
    name: "Semua Periode (Default)",
    value: "",
    format: "day",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [selectedOrderForChange, setSelectedOrderForChange] = useState(null);

  // Handle tab click
  const handleTabClick = (tabValue) => {
    setSelectedTab(tabValue);
    console.log("Selected tab:", tabValue);
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchValue(tempSearch);
      console.log("Search:", tempSearch);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setTempSearch("");
    setSearchValue("");
  };

  // Handle opening the response change modal
  const handleOpenRespondModal = (order) => {
    setSelectedOrderForChange(order);
    setIsRespondModalOpen(true);
  };

  const handleCloseRespondModal = () => {
    setSelectedOrderForChange(null);
    setIsRespondModalOpen(false);
  };

  // Tab options sesuai design
  const tabOptions = [
    { label: "Semua", value: "semua" },
    { label: "Perlu Respon Perubahan (2)", value: "perlu-respon" },
    { label: "Perlu Konfirmasi Siap (2)", value: "perlu-konfirmasi" },
    { label: "Perlu Assign Armada (3)", value: "perlu-assign" },
  ];

  // Simple mock data
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
      actionType: "perlu-respon-perubahan",
      changeDetails: {
        oldLoadTime: "13 Apr 2025, 18:30 WIB s/d 19:00 WIB",
        newLoadTime: "14 Apr 2025, 09:00 WIB s/d 09:30 WIB",
        oldDistance: "50 km",
        newDistance: "60 km",
        oldRoute: "Kota Bekasi Timur - DKI Jakarta, Kec. Tambora",
        newRoute: "Kota Bekasi Timur - DKI Jakarta, Kec. Palmerah",
        oldIncome: "Rp 500.000",
        newIncome: "Rp 550.000",
      },
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
    {
      id: "uuid5",
      noPesanan: "MT25CHANGE05",
      tipeOrder: "terjadwal",
      waktuMuat: {
        date: "16 Apr 2025",
        time: "07:00 WIB s/d 11:00 WIB",
      },
      locations: {
        pickup: [{ fullAddress: "Dukuh Pakis, Kota Surabaya" }],
        dropoff: [{ fullAddress: "Tuban, Kab. Tuban" }],
      },
      armada: {
        type: "Trailer",
        carrier: "Lowbed",
        unit: 1,
        capacity: "25 ton",
      },
      status: "perlu-respon-perubahan",
      actionType: "perlu-respon-perubahan",
      changeRequestDetails: {
        old: {
          loadTimeStart: "2025-04-14T08:00:00.000+07:00",
          loadTimeEnd: "2025-04-14T12:00:00.000+07:00",
          totalPrice: 2500000,
          route: [
            { type: "pickup", city: "Surabaya" },
            { type: "dropoff", city: "Gresik" },
          ],
          distance: 150,
        },
        new: {
          loadTimeStart: "2025-04-16T07:00:00.000+07:00",
          loadTimeEnd: "2025-04-16T11:00:00.000+07:00",
          totalPrice: 2800000,
          route: [
            { type: "pickup", city: "Surabaya" },
            { type: "dropoff", city: "Tuban" },
          ],
          distance: 200,
        },
        changeReason: "Shipper requested a change in destination.",
        changeRequestedBy: "SHIPPER",
        changeRequestedAt: "2025-04-13T10:00:00.000+07:00",
      },
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
        ) : row.status === "perlu-respon-perubahan" ? (
          <Button
            variant="muattrans-primary"
            className="!h-8 !w-[174px] !rounded-3xl text-xs font-semibold"
            onClick={() => handleOpenRespondModal(row)}
          >
            Respon Perubahan
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

  // Period options untuk dropdown
  const periodOptions = [
    {
      name: "Semua Periode (Default)",
      value: "",
      format: "day",
    },
    {
      name: "Hari Ini",
      value: 0,
      format: "day",
    },
    {
      name: "1 Minggu Terakhir",
      value: 7,
      format: "day",
    },
    {
      name: "30 Hari Terakhir",
      value: 30,
      format: "month",
    },
    {
      name: "90 Hari Terakhir",
      value: 90,
      format: "month",
    },
    {
      name: "1 Tahun Terakhir",
      value: 365,
      format: "year",
    },
  ];

  // Helper function to format DD-MM-YYYY to YYYY-MM-DD
  const formatToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";

    // Handle DD-MM-YYYY format (with dashes)
    const dashParts = dateStr.split("-");
    if (dashParts.length === 3 && dashParts[0].length <= 2) {
      return `${dashParts[2]}-${dashParts[1]}-${dashParts[0]}`;
    }

    // Handle DD/MM/YYYY format (with slashes)
    const slashParts = dateStr.split("/");
    if (slashParts.length === 3 && slashParts[0].length <= 2) {
      return `${slashParts[2]}-${slashParts[1]}-${slashParts[0]}`;
    }

    // If already in YYYY-MM-DD format, return as is
    return dateStr;
  };

  // Handle select period dari dropdown
  const handleSelectPeriod = (selectedOption) => {
    // For custom date range option
    if (selectedOption?.range) {
      const formattedStartDate = formatToYYYYMMDD(selectedOption.start_date);
      const formattedEndDate = formatToYYYYMMDD(selectedOption.end_date);

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);

      // Update recent selections
      if (
        !recentPeriodOptions?.some((s) => s?.value === selectedOption?.value)
      ) {
        setRecentPeriodOptions((prev) => [...prev, selectedOption]);
      }

      setCurrentPeriodValue(selectedOption);
    }
    // For default "Semua Periode" option
    else if (selectedOption?.value === "") {
      setStartDate(null);
      setEndDate(null);
      setCurrentPeriodValue(selectedOption);
    }
    // For predefined period options
    else if (selectedOption?.value !== undefined) {
      const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const today = new Date();
      const endDateStr = getLocalDateString(today);

      let startDateStr;
      if (selectedOption.value === 0) {
        // Today
        startDateStr = endDateStr;
      } else {
        // Other periods
        const startDateObj = new Date();
        startDateObj.setHours(12, 0, 0, 0);
        startDateObj.setDate(today.getDate() - selectedOption.value);
        startDateStr = getLocalDateString(startDateObj);
      }

      setStartDate(startDateStr);
      setEndDate(endDateStr);
      setCurrentPeriodValue(selectedOption);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header sesuai LDG-2 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold leading-none text-neutral-900">
          Daftar Pesanan
        </h1>
        <DropdownPeriode
          disable={mockData.length === 0}
          options={periodOptions}
          onSelect={handleSelectPeriod}
          recentSelections={recentPeriodOptions}
          value={currentPeriodValue}
        />
      </div>

      {/* Table sesuai LDG-2 design */}
      <div className="rounded-lg bg-white shadow-[0px_4px_11px_0px_#41414140]">
        {/* Custom header dengan Search + Filter + Tabs */}
        <div className="flex-shrink-0 space-y-2 px-6 pb-0 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <Input
                className="gap-0"
                disabled={mockData.length === 0}
                appearance={{ containerClassName: "w-[262px]" }}
                placeholder="Cari pesanan"
                icon={{
                  left: "/icons/search16.svg",
                  right: tempSearch ? (
                    <IconComponent
                      src="/icons/silang16.svg"
                      onClick={handleClearSearch}
                    />
                  ) : null,
                }}
                value={tempSearch}
                onChange={({ target: { value } }) => setTempSearch(value)}
                onKeyUp={handleSearch}
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
      {selectedOrderForChange && (
        <RespondChangeModal
          isOpen={isRespondModalOpen}
          onClose={handleCloseRespondModal}
          orderData={selectedOrderForChange}
        />
      )}
    </div>
  );
};

export default DaftarPesananPage;
