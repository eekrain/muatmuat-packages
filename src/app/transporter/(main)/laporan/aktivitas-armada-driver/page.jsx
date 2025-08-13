"use client";

import { useState } from "react";

import { Download, Search } from "lucide-react";

import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import FilterDropdown from "@/components/FilterDropdown/FilterDropdown";
import Input from "@/components/Input/Input";
import LaporanAktivitasArmadaDriverTable from "@/components/Report/LaporanAktivitasArmadaDriverTable";
import MuatBongkarStepper from "@/components/Stepper/MuatBongkarStepper";
import {
  Tabs,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("armada");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [filters, setFilters] = useState({});

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

  // Dummy data for Armada activities
  const armadaData = [
    {
      id: 1,
      licensePlate: "B 1234 ABC",
      vehicleType: "Medium Truk 6x2 - Tangki",
      currentLocation: "Jakarta Pusat",
      activeOrderCode: "ORD-001",
      activeOrderRoute: {
        origin: "Kab. Jombang, Kec. Wonosalam",
        destination: "Kab. Jombang, Kec. Wonosalam",
        estimate: "121 km",
      },
      status: "Bertugas",
      statusType: "on_duty",
      image: "/img/mock-armada/truck1.png",
    },
    {
      id: 2,
      licensePlate: "B 5678 DEF",
      vehicleType: "Medium Truk 6x2 - Tangki",
      currentLocation: "Bandung",
      activeOrderCode: "ORD-002",
      activeOrderRoute: "Belum Ada",
      status: "Dijadwalkan",
      statusType: "scheduled",
      image: "/img/mock-armada/truck2.png",
    },
    {
      id: 3,
      licensePlate: "B 9012 GHI",
      vehicleType: "Medium Truk 6x2 - Tangki",
      currentLocation: "Surabaya",
      activeOrderCode: "ORD-003",
      activeOrderRoute: "Belum Ada",
      status: "Menunggu Jam Muat",
      statusType: "waiting",
      image: "/img/mock-armada/truck3.png",
    },
    {
      id: 4,
      licensePlate: "B 3456 JKL",
      vehicleType: "Medium Truk 6x2 - Tangki",
      currentLocation: "Semarang",
      activeOrderCode: "ORD-004",
      activeOrderRoute: "Belum Ada",
      status: "Pengiriman Selesai",
      statusType: "completed",
      image: "/img/mock-armada/truck4.png",
    },
    {
      id: 5,
      licensePlate: "B 7890 MNO",
      vehicleType: "Medium Truk 6x2 - Tangki",
      currentLocation: "Yogyakarta",
      activeOrderCode: "ORD-005",
      activeOrderRoute: "Belum Ada",
      status: "Non - Aktif",
      statusType: "inactive",
      image: "/img/mock-armada/truck5.png",
    },
  ];

  // Dummy data for Driver activities
  const driverData = [
    {
      id: 1,
      name: "Marc Andre",
      phoneNumber: "0821-2089-9123",
      armada: "L 1239 CAM",
      vehicleType: "Colt Diesel Double - Dump",
      location: "Kab. Jombang Kota Surabaya, K...",
      activeOrderCode: "INV/MTR/210504/001/AAA",
      activeOrderRoute: {
        origin: "Kab. Jombang, Kec. Wonosalam",
        destination: "Kab. Jombang, Kec. Wonosalam",
        estimate: "121 km",
      },
      status: "Dijadwalkan",
      statusType: "scheduled",
      image: "/img/avatar.png",
    },
    {
      id: 2,
      name: "Dek Yamal",
      phoneNumber: "0821-2089-9123-1",
      armada: "L 1239 CAM",
      vehicleType: "Colt Diesel Double - Dump",
      location: "Kab. Jombang Kota Surabaya, K...",
      activeOrderCode: "INV/MTR/210504/001/AAA",
      activeOrderRoute: {
        origin: "Kab. Jombang, Kec. Wonosalam",
        destination: "Kab. Jombang, Kec. Wonosalam",
        estimate: "121 km",
      },
      status: "Menunggu Jam Muat",
      statusType: "waiting",
      image: "/img/avatar2.png",
    },
    {
      id: 3,
      name: "Dek Pedri",
      phoneNumber: "0821-2089-9123-1",
      armada: "L 1239 CAM",
      vehicleType: "Colt Diesel Double - Dump",
      location: "Kab. Jombang Kota Surabaya, K...",
      activeOrderCode: "INV/MTR/210504/001/AAA",
      activeOrderRoute: {
        origin: "Kab. Jombang, Kec. Wonosalam",
        destination: "Kab. Jombang, Kec. Wonosalam",
        estimate: "121 km",
      },
      status: "Non - Aktif",
      statusType: "inactive",
      image: "/img/avatar.png",
    },
    {
      id: 4,
      name: "Cubarsi",
      phoneNumber: "0821-2089-9123-1",
      armada: "L 1239 CAM",
      vehicleType: "Colt Diesel Double - Dump",
      location: "Kab. Jombang Kota Surabaya, K...",
      activeOrderCode: "INV/MTR/210504/001/AAA",
      activeOrderRoute: {
        origin: "Kab. Jombang, Kec. Wonosalam",
        destination: "Kab. Jombang, Kec. Wonosalam",
        estimate: "121 km",
      },
      status: "Non - Aktif",
      statusType: "inactive",
      image: "/img/avatar2.png",
    },
    {
      id: 5,
      name: "Rafi Nya",
      phoneNumber: "0821-2089-9123-1",
      armada: "L 1239 CAM",
      vehicleType: "Colt Diesel Double - Dump",
      location: "Kab. Jombang Kota Surabaya, K...",
      activeOrderCode: "INV/MTR/210504/001/AAA",
      activeOrderRoute: {
        origin: "Kab. Jombang, Kec. Wonosalam",
        destination: "Kab. Jombang, Kec. Wonosalam",
        estimate: "121 km",
      },
      status: "Bertugas",
      statusType: "on_duty",
      image: "/img/avatar.png",
    },
    {
      id: 6,
      name: "Cak Lewi",
      phoneNumber: "0821-2089-9123-1",
      armada: "L 1239 CAM",
      vehicleType: "Colt Diesel Double - Dump",
      location: "Kab. Jombang Kota Surabaya, K...",
      activeOrderCode: "INV/MTR/210504/001/AAA",
      activeOrderRoute: {
        origin: "Kab. Jombang, Kec. Wonosalam",
        destination: "Kab. Jombang, Kec. Wonosalam",
        estimate: "121 km",
      },
      status: "Pengiriman Selesai",
      statusType: "completed",
      image: "/img/avatar2.png",
    },
  ];

  // Table columns for Armada
  const armadaColumns = [
    {
      header: "No. Polisi",
      key: "licensePlate",
      sortable: true,
      width: "250px",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt="Vehicle"
            className="h-12 w-12 rounded object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">
              {row.licensePlate}
            </div>
            <div className="text-xs text-gray-600">{row.vehicleType}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Lokasi Terkini",
      key: "currentLocation",
      sortable: false,
      width: "180px",
    },
    {
      header: "Kode Pesanan Aktif",
      key: "activeOrderCode",
      sortable: true,
      width: "100px",
    },
    {
      header: "Rute Pesanan Aktif",
      key: "activeOrderRoute",
      sortable: true,
      width: "220px",
      render: (row) => {
        if (!row.activeOrderRoute || row.activeOrderRoute === "Belum Ada") {
          return <div className="text-sm">Belum Ada</div>;
        }

        // Parse route data to extract pickup and dropoff locations
        const routeData = row.activeOrderRoute;
        let pickupLocations = [];
        let dropoffLocations = [];

        if (routeData.origin && routeData.destination) {
          pickupLocations = [routeData.origin];
          dropoffLocations = [routeData.destination];
        }

        return (
          <div className="space-y-2">
            {routeData.estimate && (
              <div className="text-xs font-medium text-neutral-700">
                Estimasi: {routeData.estimate}
              </div>
            )}
            <MuatBongkarStepper
              pickupLocations={pickupLocations}
              dropoffLocations={dropoffLocations}
              appearance={{
                titleClassName: "text-xs font-medium text-neutral-900",
              }}
            />
          </div>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      width: "200px",
      render: (row) => {
        let bgColor = "bg-gray-200";
        let textColor = "text-gray-600";

        if (row.statusType === "scheduled") {
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-900";
        } else if (row.statusType === "waiting") {
          bgColor = "bg-orange-100";
          textColor = "text-orange-900";
        } else if (row.statusType === "on_duty") {
          bgColor = "bg-blue-100";
          textColor = "text-blue-900";
        } else if (row.statusType === "completed") {
          bgColor = "bg-green-100";
          textColor = "text-green-900";
        } else if (row.statusType === "inactive") {
          bgColor = "bg-gray-100";
          textColor = "text-gray-600";
        }

        return (
          <span
            className={`inline-flex w-full items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold ${bgColor} ${textColor}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Action",
      key: "action",
      sortable: false,
      width: "100px",
      render: (_row) => <Button className="h-8 px-4 text-xs">Detail</Button>,
    },
  ];

  // Table columns for Driver
  const driverColumns = [
    {
      header: "Nama Driver",
      key: "name",
      sortable: true,
      width: "200px",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt="Driver"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-600">{row.phoneNumber}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Armada",
      key: "armada",
      sortable: true,
      width: "250px",
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.armada}</div>
          <div className="text-xs text-gray-600">{row.vehicleType}</div>
          <div className="text-xs text-gray-500">{row.location}</div>
        </div>
      ),
    },
    {
      header: "Kode Pesanan Aktif",
      key: "activeOrderCode",
      sortable: true,
      width: "150px",
    },
    {
      header: "Rute Pesanan Aktif",
      key: "activeOrderRoute",
      sortable: true,
      width: "220px",
      render: (row) => {
        if (!row.activeOrderRoute || row.activeOrderRoute === "Belum Ada") {
          return <div className="text-sm">Belum Ada</div>;
        }

        // Parse route data to extract pickup and dropoff locations
        const routeData = row.activeOrderRoute;
        let pickupLocations = [];
        let dropoffLocations = [];

        if (routeData.origin && routeData.destination) {
          pickupLocations = [routeData.origin];
          dropoffLocations = [routeData.destination];
        }

        return (
          <div className="space-y-2">
            {routeData.estimate && (
              <div className="text-xs font-medium text-neutral-700">
                Estimasi: {routeData.estimate}
              </div>
            )}
            <MuatBongkarStepper
              pickupLocations={pickupLocations}
              dropoffLocations={dropoffLocations}
              appearance={{
                titleClassName: "text-xs font-medium text-neutral-900",
              }}
            />
          </div>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      width: "200px",
      render: (row) => {
        let bgColor = "bg-gray-200";
        let textColor = "text-gray-600";

        if (row.statusType === "scheduled") {
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-900";
        } else if (row.statusType === "waiting") {
          bgColor = "bg-orange-100";
          textColor = "text-orange-900";
        } else if (row.statusType === "on_duty") {
          bgColor = "bg-blue-100";
          textColor = "text-blue-900";
        } else if (row.statusType === "completed") {
          bgColor = "bg-green-100";
          textColor = "text-green-900";
        } else if (row.statusType === "inactive") {
          bgColor = "bg-gray-100";
          textColor = "text-gray-600";
        }

        return (
          <span
            className={`inline-flex w-full items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold ${bgColor} ${textColor}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Action",
      key: "action",
      sortable: false,
      width: "100px",
      render: (_row) => <Button className="h-8 px-4 text-xs">Detail</Button>,
    },
  ];

  // Filter configuration
  const filterConfig = {
    categories: [
      {
        key: "status",
        label: "Status",
        searchable: true,
      },
      {
        key: "vehicleType",
        label: "Jenis Kendaraan",
        searchable: true,
      },
    ],
    data: {
      status: [
        { id: "scheduled", label: "Dijadwalkan" },
        { id: "waiting", label: "Menunggu Jam Muat" },
        { id: "on_duty", label: "Bertugas" },
        { id: "completed", label: "Pengiriman Selesai" },
        { id: "inactive", label: "Non - Aktif" },
      ],
      vehicleType: [
        { id: "truck", label: "Medium Truk 6x2 - Tangki" },
        { id: "colt", label: "Colt Diesel Double - Bak Terbuka" },
        { id: "dump", label: "Colt Diesel Double - Dump" },
      ],
    },
  };

  // Handler untuk filter periode
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

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (_sort, _order) => {};

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (perPageValue) => {
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  const handleDownload = () => {};

  const getCurrentData = () => {
    return selectedTab === "armada" ? armadaData : driverData;
  };

  const getCurrentColumns = () => {
    return selectedTab === "armada" ? armadaColumns : driverColumns;
  };

  const getTotalCount = () => {
    return selectedTab === "armada" ? armadaData.length : driverData.length;
  };

  const getTotalLabel = () => {
    return selectedTab === "armada" ? "Armada" : "Driver";
  };

  const isCurrentEmpty = getCurrentData().length === 0;

  return (
    <div className="mx-auto mt-7 max-w-full px-0">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Laporan Aktivitas</h1>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex items-center justify-between">
        <Tabs
          className="w-full"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="w-1/2">
            <TabsTriggerWithSeparator value="armada" activeColor="primary-700">
              Aktivitas Armada ({armadaData.length})
            </TabsTriggerWithSeparator>
            <TabsTriggerWithSeparator value="driver" activeColor="primary-700">
              Aktivitas Driver ({driverData.length})
            </TabsTriggerWithSeparator>
          </TabsList>
        </Tabs>

        {/* Right side controls - only Unduh and Dropdown Periode */}
        <div className="flex items-center gap-3">
          <DropdownPeriode
            options={periodOptions}
            onSelect={handleSelectPeriod}
            recentSelections={recentPeriodOptions}
            value={currentPeriodValue}
          />
          <Button onClick={handleDownload} iconLeft={<Download size={16} />}>
            Unduh
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="rounded-b-none rounded-t-md border border-none bg-white">
        <CardContent>
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Input
                type="text"
                placeholder={
                  selectedTab === "armada"
                    ? "Cari No. Pol atau Kode Pesanan"
                    : "Cari Nama Driver atau Kode Pesanan"
                }
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                icon={{
                  left: <Search className="h-4 w-4 text-gray-400" />,
                }}
                appearance={{
                  containerClassName: "h-9 w-100",
                  inputClassName: "text-sm",
                }}
              />
              <FilterDropdown
                categories={filterConfig.categories}
                data={filterConfig.data}
                selectedValues={filters}
                onSelectionChange={handleFilter}
                searchPlaceholder="Cari {category}"
              />
            </div>
            <div className="text-sm font-semibold text-neutral-900">
              Total : {getTotalCount()} {getTotalLabel()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table or Empty */}
      {isCurrentEmpty ? (
        <DataEmpty
          title={`Belum ada ${getTotalLabel().toLowerCase()} yang tercatat`}
          subtitle={`Saat ini belum ada data ${getTotalLabel().toLowerCase()} untuk ditampilkan.`}
        />
      ) : (
        <Card className="rounded-b-md rounded-t-none border border-none bg-white">
          <CardContent className="p-0">
            <LaporanAktivitasArmadaDriverTable
              data={getCurrentData()}
              columns={getCurrentColumns()}
              showFilter={false}
              showSearch={false}
              showPagination={false}
              showTotalCount={false}
              currentPage={currentPage}
              totalPages={Math.ceil(getCurrentData().length / perPage)}
              totalItems={getCurrentData().length}
              perPage={perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSort={handleSort}
              filterConfig={filterConfig}
              className="border-0 [&>div:first-child]:!space-y-0 [&>div:first-child]:!p-0"
              headerActions={null}
              tableTitle={null}
            />
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {!isCurrentEmpty && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-yellow-400 text-sm font-semibold text-gray-900">
              {currentPage}
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm text-gray-600">
              2
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Tampilkan Jumlah detail
            </span>
            <Button
              variant="muattrans-warning"
              className="h-8 px-4 text-xs"
              onClick={() => handlePerPageChange(perPage === 10 ? 20 : 10)}
            >
              {perPage}
            </Button>
            <span className="text-sm text-gray-600">40</span>
          </div>
        </div>
      )}
    </div>
  );
}
