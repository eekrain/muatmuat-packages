"use client";

import { useEffect, useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";
import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import FilterDropdown from "@/components/FilterDropdown";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { toast } from "@/lib/toast";

const TransporterDetailContainer = ({ transporterId }) => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [activeTab, setActiveTab] = useState("daftar-armada");
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    data: null,
  });
  const [hubungiModalOpen, setHubungiModalOpen] = useState(false);
  const [transporterData, setTransporterData] = useState(null);

  // Mock fleet data
  const mockFleetData = [
    {
      id: "1",
      plateNumber: "L 8310 SH",
      description:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed",
      driverName: "Rizky Pratama",
      vehicleBrand: "Mitsubishi Fuso Heavy Duty",
      vehicleType: "Commercial Diesel Truck Canter 4 Wheels",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "20 Agu 2028",
      status: "Akan Muat Hari Ini",
      image: "/img/truck1.png",
    },
  ];

  // Mock data for other tabs (empty for demonstration)
  const mockDriverData = [];
  const mockPaymentData = [];
  const mockCompanyData = [];
  const mockHistoryData = [];

  useEffect(() => {
    // Mock data for different transporter statuses based on ID
    const mockTransporterVariations = {
      1: {
        id: "1",
        companyName:
          "PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional",
        email: "contact.shipper@mail.com",
        picName: "Ahmad Maulana",
        picPhone: "No. HP : 0822-3100-1231",
        address:
          "Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16951",
        status: "Aktif",
        location: "Depok",
        completedOrders: 124,
        joinDate: "2 Jan 2025",
        logo: "/img/kaltim.png",
      },
      2: {
        id: "2",
        companyName: "PT Transport Nusantara Logistics",
        email: "info@nusantaralogistics.com",
        picName: "Budi Santoso",
        picPhone: "No. HP : 0821-5500-9988",
        address: "Jl. Sudirman No. 45, Jakarta Pusat",
        status: "Non Aktif",
        location: "Jakarta",
        completedOrders: 89,
        joinDate: "15 Mar 2024",
        logo: "/img/kaltim.png",
      },
    };

    const mockTransporterData =
      mockTransporterVariations[transporterId] ||
      mockTransporterVariations["1"];

    // Simulate API call to fetch transporter data
    setTransporterData(mockTransporterData);
  }, [transporterId]);

  const openModal = (type, data) => {
    setModalState({ isOpen: true, type, data });
  };

  const openHubungiModal = () => {
    setHubungiModalOpen(true);
  };

  const closeHubungiModal = () => {
    setHubungiModalOpen(false);
  };

  const handleConfirmAction = () => {
    if (!modalState.data) return;

    if (modalState.type === "deactivate") {
      // Update the transporter status to Non Aktif
      setTransporterData((prevData) => ({
        ...prevData,
        status: "Non Aktif",
      }));
      toast.success("Berhasil menonaktifkan Transporter");
    } else if (modalState.type === "activate") {
      // Update the transporter status to Aktif
      setTransporterData((prevData) => ({
        ...prevData,
        status: "Aktif",
      }));
      toast.success("Berhasil mengaktifkan Transporter");
    }
    setModalState({ isOpen: false, type: "", data: null });
  };

  const getStatusBadge = (status) => {
    let variant = "success";
    if (status === "Verifikasi Ditolak") {
      variant = "error";
    } else if (status === "Dalam Verifikasi") {
      variant = "warning";
    } else if (status === "Non Aktif") {
      variant = "neutral";
    } else if (status === "Akan Muat Hari Ini") {
      variant = "warning";
    }
    return <BadgeStatus variant={variant}>{status}</BadgeStatus>;
  };

  // Fleet table columns
  const fleetColumns = [
    {
      key: "plateNumber",
      header: "No. Pol Armada",
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="relative flex aspect-square h-16 w-16 items-center justify-center rounded-md border border-neutral-400 bg-white object-contain p-1">
            <img
              src={row.image}
              alt="vehicle"
              className="rounded-md object-contain"
            />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold">{row.plateNumber}</div>
            <div className="line-clamp-2 text-xs font-medium text-neutral-600">
              {row.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "driverName",
      header: "Nama Driver",
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium">{row.driverName}</div>
      ),
    },
    {
      key: "vehicleSpecs",
      header: "Merek Kendaraan",
      sortable: false,
      render: (row) => (
        <div className="space-y-1">
          <div className="text-sm font-medium">{row.vehicleBrand}</div>
          <div className="text-xs text-neutral-600">{row.vehicleType}</div>
        </div>
      ),
    },
    {
      key: "vehicleCategory",
      header: "Tipe Kendaraan",
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium">{row.vehicleCategory}</div>
      ),
    },
    {
      key: "stnkExpiry",
      header: "Masa Berlaku STNK",
      sortable: true,
      render: (row) => (
        <div className="text-sm font-medium">{row.stnkExpiry}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => getStatusBadge(row.status),
    },
  ];

  // Get current tab data
  const getCurrentTabData = () => {
    switch (activeTab) {
      case "daftar-armada":
        return mockFleetData;
      case "daftar-driver":
        return mockDriverData;
      case "rekap-pembatalan":
        return mockPaymentData;
      case "data-transporter":
        return mockCompanyData;
      case "riwayat-status":
        return mockHistoryData;
      default:
        return [];
    }
  };

  // Get current tab columns
  const getCurrentTabColumns = () => {
    switch (activeTab) {
      case "daftar-armada":
        return fleetColumns;
      default:
        return fleetColumns; // Use fleet columns as default for now
    }
  };

  // Search and filter logic
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch(searchValue);
    }
  };

  const performSearch = (value) => {
    if (value.length >= 3 || value.length === 0) {
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    performSearch("");
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1);
  };

  const getFilterConfig = () => {
    return {
      categories: [{ key: "status", label: "Status" }],
      data: {
        status: [
          { id: "Akan Muat Hari Ini", label: "Akan Muat Hari Ini" },
          { id: "Dalam Perjalanan", label: "Dalam Perjalanan" },
          { id: "Tersedia", label: "Tersedia" },
        ],
      },
    };
  };

  const getActiveFilters = () => {
    const activeFilters = [];
    Object.entries(filters).forEach(([categoryKey, items]) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          activeFilters.push({
            id: `${categoryKey}-${item.id}`,
            label: item.label,
            categoryKey,
            item,
          });
        });
      } else if (items) {
        activeFilters.push({
          id: `${categoryKey}-${items.id || items}`,
          label: items.label || items,
          categoryKey,
          item: items,
        });
      }
    });
    return activeFilters;
  };

  const handleRemoveFilter = (filter) => {
    const newFilters = { ...filters };
    if (Array.isArray(newFilters[filter.categoryKey])) {
      newFilters[filter.categoryKey] = newFilters[filter.categoryKey].filter(
        (item) => (item.id || item) !== (filter.item.id || filter.item)
      );
      if (newFilters[filter.categoryKey].length === 0) {
        delete newFilters[filter.categoryKey];
      }
    } else {
      delete newFilters[filter.categoryKey];
    }
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.sort === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ sort: key, order });
    setCurrentPage(1);
  };

  // Data filtering and pagination
  const getFilteredData = () => {
    let filteredData = [...getCurrentTabData()];

    if (searchValue.trim() && searchValue.length >= 3) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }

    if (filters.status) {
      const statusValue =
        typeof filters.status === "object" ? filters.status.id : filters.status;
      filteredData = filteredData.filter((item) => item.status === statusValue);
    }

    if (sortConfig.sort && sortConfig.order) {
      filteredData.sort((a, b) => {
        let aValue = a[sortConfig.sort];
        let bValue = b[sortConfig.sort];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.order === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const showPagination = totalItems >= 10;

  // Data state logic
  const hasSearch = searchValue.trim().length > 0;
  const hasFilters = Object.keys(filters).length > 0;
  const hasData = filteredData.length > 0;
  const originalDataExists = getCurrentTabData().length > 0;

  const showNoDataState = !originalDataExists;
  const showSearchNotFoundState = hasSearch && !hasData && originalDataExists;
  const showFilterNotFoundState =
    hasFilters && !hasData && originalDataExists && !hasSearch;

  const renderConfirmationModal = () => {
    if (!modalState.isOpen || !modalState.data) return null;

    const commonProps = {
      isOpen: modalState.isOpen,
      setIsOpen: (val) => setModalState({ ...modalState, isOpen: val }),
      size: "small",
    };

    const isDeactivate = modalState.type === "deactivate";
    const modalConfig = {
      title: isDeactivate ? "Non Aktifkan Transporter" : "Aktifkan Transporter",
      actionText: isDeactivate ? "Ya, Non Aktifkan" : "Ya, Aktifkan",
      question: isDeactivate ? "menonaktifkan" : "mengaktifkan",
    };

    return (
      <ConfirmationModal
        {...commonProps}
        title={{ text: modalConfig.title }}
        description={{
          text: (
            <>
              Apakah kamu yakin ingin {modalConfig.question} Transporter{" "}
              <strong>{transporterData?.companyName}</strong>?
            </>
          ),
        }}
        confirm={{
          text: modalConfig.actionText,
          onClick: handleConfirmAction,
          classname:
            " border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
        }}
        cancel={{
          text: "Kembali",
          classname:
            " bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
          onClick: () => commonProps.setIsOpen(false),
        }}
      />
    );
  };

  const getTabSearchPlaceholder = () => {
    switch (activeTab) {
      case "daftar-armada":
        return "Cari Armada";
      case "daftar-driver":
        return "Cari Driver";
      case "rekap-pembatalan":
        return "Cari Pembatalan";
      case "data-transporter":
        return "Cari Data";
      case "riwayat-status":
        return "Cari Riwayat";
      default:
        return "Cari";
    }
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case "daftar-armada":
        return {
          title: "Belum Ada Armada",
          subtitle: "Hubungi Transporter untuk menambahkan armada",
        };
      case "daftar-driver":
        return {
          title: "Belum Ada Driver",
          subtitle: "Hubungi Transporter untuk menambahkan driver",
        };
      case "rekap-pembatalan":
        return {
          title: "Belum Ada Pembatalan",
          subtitle: "Belum ada riwayat pembatalan",
        };
      case "data-transporter":
        return {
          title: "Belum Ada Data",
          subtitle: "Data transporter belum tersedia",
        };
      case "riwayat-status":
        return {
          title: "Belum Ada Riwayat",
          subtitle: "Belum ada riwayat perubahan status",
        };
      default:
        return {
          title: "Belum Ada Data",
          subtitle: "",
        };
    }
  };

  // Reusable empty tab content component
  const EmptyTabContent = ({ title, subtitle }) => (
    <div className="p-6">
      <div className="flex h-[280px] w-full flex-col items-center justify-center rounded-xl bg-white shadow-muat">
        <DataNotFound type="data" title={title} subtitle={subtitle} />
      </div>
    </div>
  );

  // Reusable status indicator component
  const StatusIndicator = ({ status }) => {
    const isActive = status === "Aktif";
    return (
      <div className="flex items-center space-x-1">
        <div
          className={`aspect-square size-[6px] rounded-[100%] ${
            isActive ? "bg-success-500" : "bg-error-500"
          }`}
        />
        <p>{status}</p>
      </div>
    );
  };

  // Reusable statistics item component
  const StatisticItem = ({ value, label }) => (
    <div className="flex flex-col gap-2 px-3 text-center">
      <div className="text-base font-bold text-black">{value}</div>
      <div className="text-xs text-neutral-900">{label}</div>
    </div>
  );

  if (!transporterData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {/* Transporter Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-start gap-3">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[100%] border border-neutral-400 bg-white p-2">
            <img
              src={transporterData.logo}
              alt="logo"
              className="rounded-[100%] object-contain"
            />
          </div>
          <div className="space-y-3">
            <div>
              <h1 className="text-xl font-bold text-black">
                {transporterData.companyName}
              </h1>
              <div className="mt-2 flex items-center space-x-2 text-sm">
                <StatusIndicator status={transporterData.status} />
                <span>&bull;</span>
                <div className="flex items-center space-x-1">
                  <IconComponent
                    src="/icons/location.svg"
                    className="text-neutral-600"
                    width={16}
                    height={16}
                  />

                  <span className="font-medium text-neutral-900">
                    {transporterData.location}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="muattrans-primary-secondary"
              iconLeft={
                <IconComponent
                  src="/icons/chat16.svg"
                  className="text-black"
                  width={16}
                  height={16}
                />
              }
              onClick={openHubungiModal}
              className="text-black hover:bg-neutral-50"
            >
              Hubungi
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <div className="grid grid-cols-2 items-center divide-x divide-neutral-400">
            <StatisticItem
              value={transporterData.completedOrders}
              label="Pesanan Selesai"
            />
            <StatisticItem
              value={transporterData.joinDate}
              label="Bergabung Sejak"
            />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="">
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-neutral-200 px-6 pt-6">
            <TabsList className="">
              <TabsTriggerWithSeparator
                value="daftar-armada"
                activeColor="primary-700"
                className="!text-base"
              >
                Daftar Armada
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="daftar-driver"
                activeColor="primary-700"
                className="!text-base"
              >
                Daftar Driver
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="rekap-pembatalan"
                activeColor="primary-700"
                className="!text-base"
              >
                Rekap Pembatalan
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="data-transporter"
                activeColor="primary-700"
                className="!text-base"
              >
                Data Transporter
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="riwayat-status"
                activeColor="primary-700"
                showSeparator={false}
                className="!text-base"
              >
                Riwayat Status
              </TabsTriggerWithSeparator>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="daftar-armada" className="">
            <div className="mt-4 overflow-hidden !rounded-xl !bg-white shadow-muat">
              {showNoDataState ? (
                <div className="flex h-[400px] w-full flex-col items-center justify-center">
                  <DataNotFound
                    type="data"
                    title={getEmptyStateMessage().title}
                    subtitle={getEmptyStateMessage().subtitle}
                  />
                </div>
              ) : (
                <>
                  {/* Search and Filter Section */}
                  <div className="px-6 pb-6 pt-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Input
                          icon={{
                            left: (
                              <IconComponent
                                src="/icons/search16.svg"
                                className="!text-neutral-700"
                                width={16}
                                height={16}
                              />
                            ),
                            right: searchValue.length > 0 && (
                              <button onClick={handleClearSearch}>
                                <IconComponent
                                  src="/icons/close20.svg"
                                  width={20}
                                  height={20}
                                />
                              </button>
                            ),
                          }}
                          appearance={{
                            inputClassName: "!text-xs",
                            containerClassName: "!w-full min-w-[262px]",
                          }}
                          placeholder={getTabSearchPlaceholder()}
                          value={searchValue}
                          onChange={(e) => handleSearch(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          disabled={showFilterNotFoundState}
                        />
                        <FilterDropdown
                          triggerClassName="!w-[165px] hover:!border-neutral-600 hover:!bg-white"
                          selectedValues={filters}
                          categories={getFilterConfig().categories}
                          data={getFilterConfig().data}
                          onSelectionChange={handleFilter}
                          multiSelect={false}
                          searchable={false}
                          disabled={showSearchNotFoundState}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">
                          Total: {totalItems} Armada
                        </p>
                      </div>
                    </div>

                    {/* Active Filters */}
                    {Object.keys(filters).length > 0 && (
                      <div className="mt-6">
                        <ActiveFiltersBar
                          filters={getActiveFilters()}
                          onRemoveFilter={handleRemoveFilter}
                          onClearAll={handleClearAllFilters}
                        />
                      </div>
                    )}
                  </div>

                  {/* Table */}
                  <Table
                    data={paginatedData}
                    columns={getCurrentTabColumns()}
                    emptyComponent={
                      showSearchNotFoundState ? (
                        <DataNotFound
                          type="search"
                          title="Keyword Tidak Ditemukan"
                        />
                      ) : showFilterNotFoundState ? (
                        <DataNotFound
                          type="data"
                          title="Data tidak Ditemukan."
                          subtitle="Mohon coba hapus beberapa filter"
                        />
                      ) : (
                        <DataNotFound
                          type="data"
                          title={getEmptyStateMessage().title}
                          subtitle={getEmptyStateMessage().subtitle}
                        />
                      )
                    }
                    onSort={handleSort}
                    sortConfig={sortConfig}
                  />

                  {/* Pagination */}
                  {showPagination && hasData && (
                    <div className="mt-6">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        perPage={perPage}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        variants="muatrans"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Other Tab Contents (for now, just showing empty states) */}
          <TabsContent value="daftar-driver" className="">
            <EmptyTabContent
              title="Belum Ada Driver"
              subtitle="Hubungi Transporter untuk menambahkan driver"
            />
          </TabsContent>

          <TabsContent value="rekap-pembatalan" className="">
            <EmptyTabContent
              title="Belum Ada Pembatalan"
              subtitle="Belum ada riwayat pembatalan"
            />
          </TabsContent>

          <TabsContent value="data-transporter" className="">
            <EmptyTabContent
              title="Belum Ada Data"
              subtitle="Data transporter belum tersedia"
            />
          </TabsContent>

          <TabsContent value="riwayat-status" className="">
            <EmptyTabContent
              title="Belum Ada Riwayat"
              subtitle="Belum ada riwayat perubahan status"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {renderConfirmationModal()}
      <HubungiModal
        isOpen={hubungiModalOpen}
        onClose={closeHubungiModal}
        transporterData={transporterData}
      />
    </div>
  );
};

export default TransporterDetailContainer;
