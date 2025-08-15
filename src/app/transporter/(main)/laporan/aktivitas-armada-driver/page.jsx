"use client";

import { useState } from "react";

import { Download } from "lucide-react";

import Button from "@/components/Button/Button";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import EmptyStateAktivitas from "@/components/Report/EmptyStateAktivitas";
import LaporanAktivitasArmadaTable from "@/components/Report/LaporanAktivitasArmadaTable";
import LaporanAktivitasDriverTable from "@/components/Report/LaporanAktivitasDriverTable";
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

      {/* Data Table or Empty */}
      {isCurrentEmpty ? (
        <EmptyStateAktivitas type={selectedTab} />
      ) : (
        <>
          {selectedTab === "armada" ? (
            <LaporanAktivitasArmadaTable
              data={getCurrentData()}
              currentPage={currentPage}
              totalPages={2}
              perPage={perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              onPeriodChange={handleSelectPeriod}
              onDownload={handleDownload}
              periodOptions={periodOptions}
              currentPeriodValue={currentPeriodValue}
              recentPeriodOptions={recentPeriodOptions}
              filterConfig={filterConfig}
              onFilter={handleFilter}
              onSearch={handleSearch}
              onSort={handleSort}
              searchValue={searchValue}
              filters={filters}
              sortConfig={{ sort: null, order: null }}
              showFilter={true}
              showSearch={true}
              searchPlaceholder="Cari Armada"
              disabledByPeriod={false}
            />
          ) : (
            <LaporanAktivitasDriverTable
              data={getCurrentData()}
              currentPage={currentPage}
              totalPages={2}
              perPage={perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              onPeriodChange={handleSelectPeriod}
              onDownload={handleDownload}
              periodOptions={periodOptions}
              currentPeriodValue={currentPeriodValue}
              recentPeriodOptions={recentPeriodOptions}
              filterConfig={filterConfig}
              onFilter={handleFilter}
              onSearch={handleSearch}
              onSort={handleSort}
              searchValue={searchValue}
              filters={filters}
              sortConfig={{ sort: null, order: null }}
              showFilter={true}
              showSearch={true}
              searchPlaceholder="Cari Driver"
              disabledByPeriod={false}
            />
          )}
        </>
      )}
    </div>
  );
}
