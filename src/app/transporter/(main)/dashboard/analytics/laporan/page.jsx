"use client";

import { useMemo, useState } from "react";

import { Download } from "lucide-react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import { DataTable } from "@/components/DataTable";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import PageTitle from "@/components/PageTitle/PageTitle";
import { generateDynamicPeriodOptions } from "@/lib/utils/generateDynamicPeriodOptions";
import { useGetCarrierTypes } from "@/services/Transporter/dashboard/laporan/getCarrierTypes";
import { useGetDeliverySummary } from "@/services/Transporter/dashboard/laporan/getDeliverySummary";
import { useGetFleetTypes } from "@/services/Transporter/dashboard/laporan/getFleetTypes";
import { useAnalyticsStore } from "@/store/Transporter/analyticStore";

const periodOptions = generateDynamicPeriodOptions();

function Page() {
  const { period, label, startDate, endDate, setPeriodOption } =
    useAnalyticsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    sort: "desc",
    order: "licensePlate",
  });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  const apiParams = useMemo(() => {
    // ✨ FIX: Join the array of IDs into a single comma-separated string.
    // This prevents incorrect URL serialization and ensures the API receives a valid format.
    const fleetTypeIds = filters.truckTypes?.map((item) => item.id).join(",");
    const carrierTypeIds = filters.carrierTypes
      ?.map((item) => item.id)
      .join(",");

    return {
      page: currentPage,
      limit: perPage,
      search: searchValue,
      sort: sortConfig.sort,
      order: sortConfig.order,
      startDate: startDate,
      endDate: endDate,
      fleetType: fleetTypeIds,
      carrierType: carrierTypeIds,
    };
  }, [
    currentPage,
    perPage,
    searchValue,
    sortConfig,
    startDate,
    endDate,
    filters,
  ]);

  // --- API Calls ---
  const { data, isLoading } = useGetDeliverySummary(apiParams);
  const { data: fleetTypesData } = useGetFleetTypes();
  const { data: carrierTypesData } = useGetCarrierTypes();

  const handlePeriodSelect = (selectedOption) => {
    if (selectedOption.range) {
      const newOption = {
        name: selectedOption.value,
        value: `Dalam Periode ${selectedOption.value}`,
        startDate: selectedOption.iso_start_date,
        endDate: selectedOption.iso_end_date,
      };
      setPeriodOption(newOption);
    } else {
      setPeriodOption(selectedOption);
    }
    setCurrentPage(1);
  };

  let selectedOption = periodOptions.find((option) => option.name === period);
  const finalOptions = [...periodOptions];

  if (!selectedOption && period) {
    const customOption = { name: period, value: label };
    selectedOption = customOption;
    finalOptions.unshift(customOption);
  }

  const breadcrumbItems = [
    { name: "Dashboard Analytics", href: "/dashboard/analytics" },
    { name: "Laporan Ringkasan Pengiriman" },
  ];

  const filterConfig = useMemo(() => {
    const truckTypes =
      fleetTypesData?.map((item) => ({
        id: item.id,
        label: item.name,
      })) || [];

    const carrierTypes =
      carrierTypesData?.map((item) => ({
        id: item.id,
        label: item.name,
      })) || [];

    return {
      data: {
        truckTypes,
        carrierTypes,
      },
      categories: [
        {
          key: "truckTypes",
          label: "Jenis Truk",
          type: "checkbox",
        },
        {
          key: "carrierTypes",
          label: "Jenis Carrier",
          type: "checkbox",
        },
      ],
    };
  }, [fleetTypesData, carrierTypesData]);

  const columns = useMemo(
    () => [
      {
        key: "licensePlate",
        header: "No. Polisi",
        sortable: true,
        render: (row) => (
          <div>
            <p className="text-xs font-medium text-neutral-900">
              {row.licensePlate}
            </p>
          </div>
        ),
      },
      {
        key: "fleet",
        header: "Armada",
        sortable: false,
        render: (row) => (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-neutral-900">
              {row.fleet?.truckTypeName}
            </p>
            <p className="text-xxs font-medium text-neutral-600">
              Carrier:{" "}
              <a className="text-neutral-900">{row.fleet?.carrierTypeName}</a>
            </p>
          </div>
        ),
      },
      {
        key: "totalDistance",
        header: "Jarak Tempuh",
        headerClassName: "flex justify-end pr-20",
        sortable: true,
        render: (row) => (
          <p className="pl-36 pr-8 text-start text-xs font-medium text-neutral-900">
            {row.totalDistance} Km
          </p>
        ),
      },
      {
        key: "totalTonnage",
        header: "Total Tonase",
        headerClassName: "",
        sortable: true,
        render: (row) => (
          <p className="text-xs font-medium text-neutral-900">
            {row.totalTonnage} Ton
          </p>
        ),
      },
      {
        render: () => (
          <div className="flex w-full justify-end">
            <Button className="w-[122px]">Detail</Button>
          </div>
        ),
      },
    ],
    []
  );

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1);
  };

  const handleSort = (field, direction) => {
    setSortConfig({ order: field, sort: direction });
  };

  return (
    <div className="pb-6 pt-6">
      <BreadCrumb data={breadcrumbItems} />
      <div className="flex flex-row items-center justify-between pt-4">
        <PageTitle>Laporan Ringkasan Pengiriman</PageTitle>
        <div className="flex flex-row gap-3 pb-3">
          <DropdownPeriode
            options={finalOptions}
            onSelect={handlePeriodSelect}
            value={selectedOption}
          />
          <Button
            iconLeft={<Download size={16} />}
            disabled={isLoading || !data?.hasData}
          >
            Unduh
          </Button>
        </div>
      </div>

      <DataTable
        data={data?.deliveries || []}
        columns={columns}
        loading={isLoading}
        searchPlaceholder="Cari No. Pesanan / No. Polisi"
        totalCountLabel="Pengiriman"
        currentPage={data?.currentPage || 1}
        totalPages={data?.totalPages || 1}
        totalItems={data?.totalItems || 0}
        perPage={data?.itemsPerPage || perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSearch={handleSearch}
        onSort={handleSort}
        showFilter={true}
        showPagination={true}
        showTotalCount={false}
        filterConfig={filterConfig}
        onFilter={handleFilter}
      />
    </div>
  );
}

export default Page;
