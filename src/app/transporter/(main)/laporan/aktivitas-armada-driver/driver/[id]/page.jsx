"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Download, MapPin, Phone, Truck } from "lucide-react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import PageTitle from "@/components/PageTitle/PageTitle";
import Pagination from "@/components/Pagination/Pagination";
import Search from "@/components/Search/Search";
import MuatBongkarStepper from "@/components/Stepper/MuatBongkarStepper";
import Table from "@/components/Table/Table";
import { useGetDriverDetailData } from "@/services/Transporter/laporan/aktivitas/getDriverDetailData";

export default function DetailDriverPage({ params }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [hasInitialData, setHasInitialData] = useState(false);

  // Helper function untuk mendapatkan startDate dan endDate dari periode
  const getPeriodDates = () => {
    if (!currentPeriodValue) return { startDate: "", endDate: "" };

    // Handle custom date range (dari modal)
    if (currentPeriodValue?.range && currentPeriodValue?.iso_start_date) {
      return {
        startDate: currentPeriodValue.iso_start_date,
        endDate: currentPeriodValue.iso_end_date,
      };
    }

    // Handle predefined options
    if (currentPeriodValue?.startDate && currentPeriodValue?.endDate) {
      return {
        startDate: currentPeriodValue.startDate,
        endDate: currentPeriodValue.endDate,
      };
    }

    return { startDate: "", endDate: "" };
  };

  // Get driver detail activities from API
  const { data: detailData, isLoading: detailLoading } = useGetDriverDetailData(
    params.id,
    {
      limit: perPage,
      page: currentPage,
      ...(sortConfig.sort !== null &&
        sortConfig.order !== null && {
          sort: sortConfig.sort,
          order: sortConfig.order,
        }),
      search: searchValue.length >= 3 ? searchValue : "",
      ...getPeriodDates(),
    }
  );

  // Get driver data from API
  const driverData = {
    id: params.id,
    name: detailData?.driverInfo?.name || "Loading...",
    phoneNumber: detailData?.driverInfo?.phoneNumber || "Loading...",
    vehicleType: detailData?.driverInfo?.currentFleet
      ? `${detailData.driverInfo.currentFleet.truckType || ""} - ${detailData.driverInfo.currentFleet.carrierType || ""}`.trim() ||
        "Loading..."
      : "Loading...",
    currentLocation:
      detailData?.driverInfo?.currentFleet?.currentLocation || "Loading...",
    status: "READY_FOR_ORDER", // Default status, bisa diupdate sesuai kebutuhan
    image: detailData?.driverInfo?.profileImage || "/img/avatar.png",
  };

  // Get activities from detail API
  const activitiesData = detailData.activities || [];

  // Table columns for activities
  const columns = [
    {
      header: "Kode Pesanan",
      key: "invoiceNumber",
      sortable: true,
      width: "200px",
      searchable: true,
      render: (row) => {
        if (!row.orderInfo?.orderCode || row.orderInfo.orderCode === "") {
          return <div className="text-sm text-gray-500">Belum Ada</div>;
        }
        return <div className="text-sm">{row.orderInfo.orderCode}</div>;
      },
    },
    {
      header: "Rute Pesanan",
      key: "orderInfo",
      sortable: false,
      width: "250px",
      searchable: false,
      render: (row) => (
        <div className="space-y-2">
          {row.orderInfo?.estimatedDistance && (
            <div className="text-xs font-medium text-neutral-700">
              Estimasi: {row.orderInfo.estimatedDistance} km
            </div>
          )}
          <MuatBongkarStepper
            pickupLocations={[row.orderInfo?.pickupLocation || ""]}
            dropoffLocations={[row.orderInfo?.dropoffLocation || ""]}
            appearance={{
              titleClassName: "text-xs font-medium text-neutral-900",
            }}
          />
        </div>
      ),
    },
    {
      header: "No. Polisi",
      key: "licensePlate",
      sortable: true,
      width: "200px",
      searchable: true,
      render: (row) => (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">
            {row.fleetInfo?.licensePlate || "Belum Ada"}
          </div>
          <div className="text-xs text-gray-600">
            {row.fleetInfo
              ? `${row.fleetInfo.truckType} - ${row.fleetInfo.carrierType}`
              : "Belum Ada"}
          </div>
        </div>
      ),
    },
    {
      header: "Tanggal Muat",
      key: "loadingTime",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => {
        if (!row.orderInfo?.loadTimeStart) {
          return <div className="text-sm text-gray-500">Belum Ada</div>;
        }
        return (
          <div className="text-sm">
            {new Date(row.orderInfo.loadTimeStart).toLocaleString("id-ID")}
          </div>
        );
      },
    },
    {
      header: "Tanggal Bongkar",
      key: "unloadingTime",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => {
        if (!row.orderInfo?.loadTimeEnd) {
          return <div className="text-sm text-gray-500">Belum Ada</div>;
        }
        return (
          <div className="text-sm">
            {new Date(row.orderInfo.loadTimeEnd).toLocaleString("id-ID")}
          </div>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => getStatusBadge(row.orderInfo?.status),
    },
    {
      header: "Action",
      key: "action",
      sortable: false,
      width: "100px",
      searchable: false,
      render: (_row) => (
        <Button
          className="h-8 px-4 text-xs"
          onClick={() => {
            // Handle detail activity click
            // TODO: Implement detail activity navigation
          }}
        >
          Detail
        </Button>
      ),
    },
  ];

  // Konfigurasi periode dengan startDate dan endDate
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
      startDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      endDate: new Date().toISOString().split("T")[0],
    },
    {
      name: "1 Minggu Terakhir",
      value: 7,
      format: "day",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    {
      name: "30 Hari Terakhir",
      value: 30,
      format: "month",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    {
      name: "90 Hari Terakhir",
      value: 90,
      format: "month",
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    {
      name: "1 Tahun Terakhir",
      value: 365,
      format: "year",
      startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
  ];

  // Breadcrumb data
  const breadcrumbData = [
    { name: "Laporan Aktivitas", href: "/laporan/aktivitas-armada-driver" },
    { name: "Aktivitas Driver", href: "/laporan/aktivitas-armada-driver" },
    { name: "Detail Aktivitas" },
  ];

  const handleBack = () => {
    // Store the current tab (driver) to sessionStorage before going back
    sessionStorage.setItem("laporan_selected_tab", "driver");
    router.back();
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleSelectPeriod = (selectedOption) => {
    if (selectedOption?.range) {
      if (
        !recentPeriodOptions?.some((s) => s?.value === selectedOption?.value)
      ) {
        setRecentPeriodOptions((prev) => [...prev, selectedOption]);
      }
      setCurrentPeriodValue(selectedOption);
      setCurrentPage(1); // Reset pagination when period changes
    } else if (selectedOption?.value === "") {
      setCurrentPeriodValue(selectedOption);
      setCurrentPage(1); // Reset pagination when period changes
    } else if (selectedOption?.value !== undefined) {
      setCurrentPeriodValue(selectedOption);
      setCurrentPage(1); // Reset pagination when period changes
    }
  };

  const handleDownload = () => {
    // Handle download logic
    // TODO: Implement download functionality
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (perPageValue) => {
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  const handleSort = (sort) => {
    if (!sort) {
      setSortConfig({ sort: null, order: null });
      return;
    }

    let newOrder = null;
    let newSort = sort;

    if (sortConfig.sort === sort) {
      // Same column: cycle through asc → desc → null
      if (sortConfig.order === "asc") {
        newOrder = "desc";
      } else if (sortConfig.order === "desc") {
        newOrder = null;
        newSort = null;
      } else {
        newOrder = "asc";
      }
    } else {
      // Different column: start with asc
      newOrder = "asc";
    }

    setSortConfig({ sort: newSort, order: newOrder });
  };

  const getStatusBadge = (status) => {
    let bgColor = "bg-gray-200";
    let textColor = "text-gray-600";
    let displayStatus = status || "Unknown";

    if (status === "LOADING") {
      bgColor = "bg-blue-100";
      textColor = "text-blue-900";
      displayStatus = "Sedang Muat";
    } else if (status === "COMPLETED") {
      bgColor = "bg-green-100";
      textColor = "text-green-900";
      displayStatus = "Selesai";
    } else if (status === "PENDING") {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-900";
      displayStatus = "Menunggu";
    } else if (status === "CANCELLED") {
      bgColor = "bg-red-100";
      textColor = "text-red-900";
      displayStatus = "Dibatalkan";
    } else if (status === "ON_DUTY") {
      bgColor = "bg-blue-100";
      textColor = "text-blue-900";
      displayStatus = "Bertugas";
    } else if (status === "READY_FOR_ORDER") {
      bgColor = "bg-green-100";
      textColor = "text-green-900";
      displayStatus = "Siap Menerima Order";
    } else if (status === "NOT_PAIRED") {
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
      displayStatus = "Belum Dipasangkan";
    } else if (status === "INACTIVE") {
      bgColor = "bg-red-100";
      textColor = "text-red-900";
      displayStatus = "Nonaktif";
    } else if (status === null || status === "") {
      bgColor = "bg-gray-100";
      textColor = "text-gray-500";
      displayStatus = "Tidak Ada Status";
    }

    return (
      <span
        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${bgColor} ${textColor}`}
      >
        {displayStatus}
      </span>
    );
  };

  // Calculate total pages based on API data
  const totalPages = Math.ceil(activitiesData.length / perPage);

  // Set hasInitialData when data is first loaded
  useEffect(() => {
    if (activitiesData.length > 0 && !hasInitialData) {
      setHasInitialData(true);
    }
  }, [activitiesData.length, hasInitialData]);

  return (
    <div className="mx-auto mt-7 max-w-full px-0">
      {/* Header Section */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <BreadCrumb data={breadcrumbData} className="mb-2" />

        {/* Title and Download Button in one row */}
        <div className="flex items-center justify-between">
          <PageTitle className="mt-3" onClick={handleBack}>
            Detail Aktivitas
          </PageTitle>
          <Button onClick={handleDownload} iconLeft={<Download size={16} />}>
            Unduh
          </Button>
        </div>
      </div>

      {/* Driver Information Card - Using existing components */}
      <Card className="mb-6 border border-gray-200 bg-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            {/* Left side: Driver Image and Details */}
            <div className="flex items-start gap-4">
              {/* Driver Image */}
              <div className="flex-shrink-0">
                <img
                  src={driverData.image}
                  alt="Driver"
                  className="h-20 w-20 rounded-full object-cover"
                />
              </div>

              {/* Driver Details */}
              <div className="flex flex-col gap-3">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(driverData.status)}
                </div>

                {/* Driver Name */}
                <h2 className="text-2xl font-bold text-gray-900">
                  {driverData.name}
                </h2>

                {/* Phone Number with Phone Icon */}
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                  <span className="text-sm">{driverData.phoneNumber}</span>
                </div>

                {/* Vehicle Type with Truck Icon */}
                <div className="flex gap-2">
                  {/* Vehicle Type with Truck Icon */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Truck className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                    <span className="text-sm">{driverData.vehicleType}</span>
                  </div>

                  {/* Location with MapPin Icon */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                    <span className="text-sm">
                      {driverData.currentLocation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Bar - always show */}
      <Card className="border-b-none rounded-b-none border border-gray-200 bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search
                placeholder="Cari Kode Pesanan, Rute atau lainnya"
                onSearch={handleSearch}
                containerClassName="w-80"
              />
              <DropdownPeriode
                options={periodOptions}
                onSelect={handleSelectPeriod}
                recentSelections={recentPeriodOptions}
                value={currentPeriodValue}
              />
            </div>
            <div className="text-sm font-semibold text-neutral-900">
              Total : {activitiesData.length} Aktivitas
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card className="border-t-none rounded-t-none border-none bg-white">
        <CardContent className="p-0">
          {activitiesData.length === 0 && !hasInitialData ? (
            // Show DataNotFound only when there's no initial data at all
            <div className="flex h-64 flex-col items-center justify-center px-6 py-12">
              <DataNotFound
                type="data"
                title="Belum ada Aktivitas Driver"
                className="gap-y-3"
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-neutral-500">
                  Pastikan Driver aktif dan siap menerima pesanan.
                </p>
              </div>
            </div>
          ) : (
            <Table
              columns={columns}
              data={activitiesData}
              onSort={handleSort}
              sortConfig={sortConfig}
              emptyComponent={
                <div className="px-6 py-8">
                  <DataNotFound
                    type="search"
                    title="Data tidak ditemukan"
                    description="Coba ubah kata kunci pencarian atau filter periode"
                    className="gap-y-3"
                  />
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination - always show */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          variants="muatrans"
          className="pb-0"
        />
      </div>
    </div>
  );
}
