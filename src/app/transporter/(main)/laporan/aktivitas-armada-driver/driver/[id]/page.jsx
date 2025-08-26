"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Download, MapPin, Phone, Truck } from "lucide-react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import PageTitle from "@/components/PageTitle/PageTitle";
import Pagination from "@/components/Pagination/Pagination";
import Search from "@/components/Search/Search";
import MuatBongkarStepper from "@/components/Stepper/MuatBongkarStepper";
import Table from "@/components/Table/Table";
import { useTranslation } from "@/hooks/use-translation";
import { useGetDriverDetailData } from "@/services/Transporter/laporan/aktivitas/getDriverDetailData";

export default function DetailDriverPage({ params }) {
  const { t } = useTranslation();
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
  };

  // Function to format phone number with "-" separator every 4 digits
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";

    // Remove any existing non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Add separator every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1-");

    return formatted;
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
      header: t("DetailDriverPage.columnOrderCode", {}, "Kode Pesanan"),
      key: "invoiceNumber",
      sortable: true,
      width: "200px",
      searchable: true,
      render: (row) => {
        if (
          !row.orderInfo?.invoiceNumber ||
          row.orderInfo.invoiceNumber === ""
        ) {
          return <div className="text-sm">-</div>;
        }
        return (
          <div className="text-sm font-semibold">
            {row.orderInfo.invoiceNumber}
          </div>
        );
      },
    },
    {
      header: t("DetailDriverPage.columnOrderRoute", {}, "Rute Pesanan"),
      key: "orderInfo",
      sortable: false,
      width: "250px",
      searchable: false,
      render: (row) => (
        <div className="space-y-2">
          {row.orderInfo?.estimatedDistance && (
            <div className="text-xs font-medium">
              {t(
                "DetailDriverPage.estimateDistance",
                { distance: row.orderInfo.estimatedDistance },
                `Estimasi: ${row.orderInfo.estimatedDistance} km`
              )}
            </div>
          )}
          <MuatBongkarStepper
            className="ms-2"
            pickupLocations={[row.orderInfo?.pickupLocation || ""]}
            dropoffLocations={[row.orderInfo?.dropoffLocation || ""]}
            appearance={{
              titleClassName: "text-xs font-semibold text-neutral-900",
            }}
            truncate={true}
            maxLength={20}
          />
        </div>
      ),
    },
    {
      header: t("DetailDriverPage.columnLicensePlate", {}, "No. Polisi"),
      key: "licensePlate",
      sortable: true,
      width: "200px",
      searchable: true,
      render: (row) => (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">
            {row.fleetInfo?.licensePlate ||
              t("DetailDriverPage.notAvailable", {}, "Belum Ada")}
          </div>
          <div className="text-xs font-medium">
            {row.fleetInfo
              ? `${row.fleetInfo.truckType} - ${row.fleetInfo.carrierType}`
              : t("DetailDriverPage.notAvailable", {}, "Belum Ada")}
          </div>
        </div>
      ),
    },
    {
      header: t("DetailDriverPage.columnLoadingDate", {}, "Tanggal Muat"),
      key: "loadingTime",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => {
        if (!row.orderInfo?.loadTimeStart) {
          return <div className="text-sm">-</div>;
        }
        return (
          <div className="text-sm">
            {formatDateTime(row.orderInfo.loadTimeStart)}
          </div>
        );
      },
    },
    {
      header: t("DetailDriverPage.columnUnloadingDate", {}, "Tanggal Bongkar"),
      key: "unloadingTime",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => {
        if (!row.orderInfo?.loadTimeEnd) {
          return <div className="text-sm">-</div>;
        }
        return (
          <div className="text-sm">
            {formatDateTime(row.orderInfo.loadTimeEnd)}
          </div>
        );
      },
    },
    {
      header: t("DetailDriverPage.columnStatus", {}, "Status"),
      key: "status",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => getStatusBadge(row.orderInfo?.status),
    },
    {
      header: t("DetailDriverPage.columnAction", {}, "Action"),
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
          {t("DetailDriverPage.buttonDetail", {}, "Detail")}
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
    {
      name: t(
        "DetailDriverPage.breadcrumbActivityReport",
        {},
        "Laporan Aktivitas"
      ),
      href: "/laporan/aktivitas-armada-driver",
    },
    {
      name: t(
        "DetailDriverPage.breadcrumbDriverActivities",
        {},
        "Aktivitas Driver"
      ),
      href: "/laporan/aktivitas-armada-driver",
    },
    {
      name: t(
        "DetailDriverPage.breadcrumbActivityDetails",
        {},
        "Detail Aktivitas"
      ),
    },
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
      displayStatus = t("DetailDriverPage.statusLoading", {}, "Sedang Muat");
    } else if (status === "COMPLETED") {
      bgColor = "bg-green-100";
      textColor = "text-green-900";
      displayStatus = t("DetailDriverPage.statusCompleted", {}, "Selesai");
    } else if (status === "PENDING") {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-900";
      displayStatus = t("DetailDriverPage.statusWaiting", {}, "Menunggu");
    } else if (status === "CANCELLED") {
      bgColor = "bg-red-100";
      textColor = "text-red-900";
      displayStatus = t("DetailDriverPage.statusCancelled", {}, "Dibatalkan");
    } else if (status === "ON_DUTY") {
      bgColor = "bg-blue-100";
      textColor = "text-blue-900";
      displayStatus = t("DetailDriverPage.statusOnDuty", {}, "Bertugas");
    } else if (status === "READY_FOR_ORDER") {
      bgColor = "bg-green-100";
      textColor = "text-green-900";
      displayStatus = t(
        "DetailDriverPage.statusReadyForOrder",
        {},
        "Siap Menerima Order"
      );
    } else if (status === "WAITING_PAYMENT_1") {
      bgColor = "bg-orange-100";
      textColor = "text-orange-900";
      displayStatus = t(
        "DetailDriverPage.statusWaitingPayment",
        {},
        "Menunggu Pembayaran"
      );
    } else if (status === "NOT_PAIRED") {
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
      displayStatus = t(
        "DetailDriverPage.statusNotPaired",
        {},
        "Belum Dipasangkan"
      );
    } else if (status === "INACTIVE") {
      bgColor = "bg-red-100";
      textColor = "text-red-900";
      displayStatus = t("DetailDriverPage.statusInactive", {}, "Nonaktif");
    } else if (status === null || status === "") {
      bgColor = "bg-gray-100";
      textColor = "text-gray-500";
      displayStatus = t(
        "DetailDriverPage.statusNoStatus",
        {},
        "Tidak Ada Status"
      );
    }

    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-medium ${bgColor} ${textColor} h-6 w-36`}
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
            {t("DetailDriverPage.titleActivityDetails", {}, "Detail Aktivitas")}
          </PageTitle>
          <Button onClick={handleDownload} iconLeft={<Download size={16} />}>
            {t("DetailDriverPage.buttonDownload", {}, "Unduh")}
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
                <LightboxProvider
                  image={driverData.image}
                  title={t(
                    "DetailDriverPage.driverImageTitle",
                    {},
                    "Gambar Driver"
                  )}
                >
                  <LightboxPreview
                    image={driverData.image}
                    alt="Driver"
                    className="h-20 w-20"
                  />
                </LightboxProvider>
              </div>

              {/* Driver Details */}
              <div className="flex flex-col gap-3">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(driverData.status)}
                </div>

                {/* Driver Name */}
                <h2 className="text-xl font-bold text-gray-900">
                  {driverData.name}
                </h2>

                {/* Vehicle Type with Truck Icon */}
                <div className="flex items-center gap-2 text-gray-600">
                  {/* Phone Number */}
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                    <span className="text-sm font-medium">
                      {formatPhoneNumber(driverData.phoneNumber)}
                    </span>
                  </div>

                  {/* Bullet Separator */}
                  <span className="text-gray-400">•</span>

                  {/* Vehicle Type */}
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                    <span className="text-sm font-medium">
                      {driverData.vehicleType}
                    </span>
                  </div>

                  {/* Bullet Separator */}
                  <span className="text-gray-400">•</span>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                    <span className="text-sm font-medium">
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
                placeholder={t(
                  "DetailDriverPage.searchPlaceholder",
                  {},
                  "Cari Kode Pesanan, Rute atau lainnya"
                )}
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
              {t(
                "DetailDriverPage.totalActivities",
                { count: activitiesData.length },
                `Total : ${activitiesData.length} Aktivitas`
              )}
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
                title={t(
                  "DetailDriverPage.emptyDriverActivities",
                  {},
                  "Belum ada Aktivitas Driver"
                )}
                className="gap-y-3"
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-neutral-500">
                  {t(
                    "DetailDriverPage.emptyDriverActivitiesDesc",
                    {},
                    "Pastikan Driver aktif dan siap menerima pesanan."
                  )}
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
                    title={t(
                      "DetailDriverPage.dataNotFound",
                      {},
                      "Data tidak ditemukan"
                    )}
                    description={t(
                      "DetailDriverPage.dataNotFoundDesc",
                      {},
                      "Coba ubah kata kunci pencarian atau filter periode"
                    )}
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
