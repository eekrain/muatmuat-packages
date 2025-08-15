"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

export default function DetailDriverPage({ params }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });

  // Mock data for driver detail
  const driverData = {
    id: params.id,
    name: "Marc Andre",
    phoneNumber: "0821-2089-9123",
    vehicleType: "Colt Diesel Double - Dump",
    currentLocation: "Kota Surabaya, Kec. Tegalsari",
    status: "Bertugas",
    statusType: "on_duty",
    image: "/img/avatar.png",
  };

  // Mock data for activities
  const activitiesData = [
    {
      id: 1,
      orderCode: "INV/MTR/210504/001/AAA",
      route: {
        origin: "Kab. Jombang, Kec. Wonosal...",
        destination: "Kab. Jombang, Kec. Wonosal...",
        estimate: "121 km",
      },
      licensePlate: "L 1239 CAM",
      vehicleType: "Colt Diesel Double-Dump",
      loadDate: null,
      unloadDate: null,
      status: "Dijadwalkan",
      statusType: "scheduled",
    },
    {
      id: 2,
      orderCode: "INV/MTR/210504/002/BBB",
      route: {
        origin: "Kab. Jombang, Kec. Wonosal...",
        destination: "Kab. Jombang, Kec. Wonosal...",
        estimate: "121 km",
      },
      licensePlate: "L 1239 CAM",
      vehicleType: "Colt Diesel Double-Dump",
      loadDate: "24 Sep 2024 12:00 WIB",
      unloadDate: null,
      status: "Bertugas",
      statusType: "on_duty",
    },
    {
      id: 3,
      orderCode: "INV/MTR/210504/003/CCC",
      route: {
        origin: "Kab. Jombang, Kec. Wonosal...",
        destination: "Kab. Jombang, Kec. Wonosal...",
        estimate: "121 km",
      },
      licensePlate: "L 1239 CAM",
      vehicleType: "Colt Diesel Double-Dump",
      loadDate: "24 Sep 2024 12:00 WIB",
      unloadDate: "24 Sep 2024 12:00 WIB",
      status: "Pengiriman Selesai",
      statusType: "completed",
    },
  ];

  // Table columns for activities
  const columns = [
    {
      header: "Kode Pesanan",
      key: "orderCode",
      sortable: true,
      width: "200px",
      searchable: true,
    },
    {
      header: "Rute Pesanan",
      key: "route",
      sortable: false,
      width: "250px",
      searchable: false,
      render: (row) => (
        <div className="space-y-2">
          {row.route.estimate && (
            <div className="text-xs font-medium text-neutral-700">
              Estimasi: {row.route.estimate}
            </div>
          )}
          <MuatBongkarStepper
            pickupLocations={[row.route.origin]}
            dropoffLocations={[row.route.destination]}
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
            {row.licensePlate}
          </div>
          <div className="text-xs text-gray-600">{row.vehicleType}</div>
        </div>
      ),
    },
    {
      header: "Tanggal Muat",
      key: "loadDate",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => row.loadDate || "-",
    },
    {
      header: "Tanggal Bongkar",
      key: "unloadDate",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => row.unloadDate || "-",
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => getStatusBadge(row.status, row.statusType),
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

  // Konfigurasi periode
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

  // Breadcrumb data
  const breadcrumbData = [
    { name: "Laporan Aktivitas", href: "/laporan/aktivitas-armada-driver" },
    { name: "Aktivitas Driver", href: "/laporan/aktivitas-armada-driver" },
    { name: "Detail Aktivitas" },
  ];

  const handleBack = () => {
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
    } else if (selectedOption?.value === "") {
      setCurrentPeriodValue(selectedOption);
    } else if (selectedOption?.value !== undefined) {
      setCurrentPeriodValue(selectedOption);
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

  const getStatusBadge = (status, statusType) => {
    let bgColor = "bg-gray-200";
    let textColor = "text-gray-600";

    if (statusType === "scheduled") {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-900";
    } else if (statusType === "on_duty") {
      bgColor = "bg-blue-100";
      textColor = "text-blue-900";
    } else if (statusType === "completed") {
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
    }

    return (
      <span
        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${bgColor} ${textColor}`}
      >
        {status}
      </span>
    );
  };

  const filteredData = activitiesData.filter((row) => {
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      return (
        row.orderCode.toLowerCase().includes(searchLower) ||
        row.licensePlate.toLowerCase().includes(searchLower) ||
        (row.route.origin &&
          row.route.origin.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(filteredData.length / perPage);

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
                  {getStatusBadge(driverData.status, driverData.statusType)}
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

      {/* Search and Filter Bar - only show when there's data */}
      {filteredData.length > 0 && (
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
                Total : {filteredData.length} Aktivitas
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activities Table */}
      <Card className="border-t-none rounded-t-none border-none bg-white">
        <CardContent className="p-0">
          {filteredData.length === 0 ? (
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
              data={filteredData}
              onSort={handleSort}
              sortConfig={sortConfig}
              emptyComponent={
                <div className="px-6 py-8">
                  <DataNotFound
                    type="search"
                    title="Keyword Tidak Ditemukan"
                    className="gap-y-3"
                  />
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination - only show when there's data */}
      {filteredData.length > 0 && (
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
      )}
    </div>
  );
}
