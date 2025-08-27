"use client";

import { useMemo, useState } from "react";

import { Download } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import { DataTable } from "@/components/DataTable";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import { formatDate } from "@/lib/utils/dateFormat";
import { useGetCsDeliverySummary } from "@/services/CS/dashboard/laporan/getDeliverySummaryCs";
import { useAnalyticsStore } from "@/store/Transporter/analyticStore";

const basePeriodOptions = [
  { name: "Bulan Ini", value: "month" },
  { name: "Hari Ini", value: "today" },
  { name: "1 Minggu Terakhir", value: "week" },
  { name: "30 Hari Terakhir", value: "30days" },
  { name: "1 Tahun Terakhir", value: "365days" },
];

function Page() {
  const { period, setPeriod } = useAnalyticsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    sort: "completedDate",
    order: "desc",
  });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  // Fetching data using the SWR hook
  const { data, isLoading, isError } = useGetCsDeliverySummary({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    sort: sortConfig.sort,
    order: sortConfig.order,
    period: period,
    ...filters,
  });

  const handlePeriodSelect = (selectedOption) => {
    setPeriod(selectedOption.value);
    setCurrentPage(1);
  };

  let selectedOption = basePeriodOptions.find(
    (option) => option.value === period
  );
  const finalOptions = [...basePeriodOptions];
  if (!selectedOption && period) {
    const customOption = { name: period, value: period };
    selectedOption = customOption;
    finalOptions.unshift(customOption);
  }

  const breadcrumbItems = [
    { name: "Dashboard Analytics", href: "/dashboard/analytics" },
    { name: "Laporan Ringkasan Pengiriman" },
  ];

  // ✨ REPLACED: Hardcoded filterConfig is now dynamically generated from API data.
  const filterConfig = useMemo(() => {
    // Map the API's {id, value} structure to the component's expected {id, label} structure.
    const truckTypes =
      data?.dataFilter?.truckTypes?.map((item) => ({
        id: item.id,
        label: item.value,
      })) || [];

    console.log("Truck Types:", truckTypes);

    const carrierTypes =
      data?.dataFilter?.carrierTypes?.map((item) => ({
        id: item.id,
        label: item.value,
      })) || [];

    console.log("Truck Types:", carrierTypes);

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
  }, [data]);

  // Columns are updated to use the correct `headerClassName` prop for alignment
  const columns = useMemo(
    () => [
      {
        key: "completedDate",
        header: "Tanggal Selesai",
        sortable: true,
        render: (row) => (
          <div>
            <p className="w-40 text-xs font-medium text-neutral-900">
              {formatDate(row.completedDate)}
            </p>
          </div>
        ),
      },
      {
        key: "transporter",
        header: "Transporter",
        sortable: true,
        render: (row) => (
          <div className="flex w-full flex-row items-center gap-2">
            <AvatarDriver
              withIcon={false}
              image={row.transporterLogo}
              className="flex-shrink-0"
            />
            <p className="line-clamp-2 w-[124px] text-[14px] font-semibold text-neutral-900">
              {row.transporterName}
            </p>
          </div>
        ),
      },
      {
        key: "loadingaAndUnloadingAddress",
        header: "Rute Muat & Bongkar",
        sortable: true,
        render: (row) => (
          <MuatBongkarStepperWithModal
            appearance={{
              titleClassName: "line-clamp-1",
            }}
            pickupLocations={row.routes.loading.map((location) => ({
              fullAddress: location.address,
            }))}
            dropoffLocations={row.routes.unloading.map((location) => ({
              fullAddress: location.address,
            }))}
          />
        ),
      },
      {
        key: "fleet",
        header: "Armada",
        sortable: true,
        render: (row) => (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-neutral-900">
              {row.fleet?.truckTypeName}
            </p>
            <p className="text-xxs font-medium text-neutral-600">
              Carrier:{" "}
              <a className="text-neutral-900">{row.fleet?.carrierTypeName}</a>
            </p>
            <div className="flex flex-row items-center gap-1">
              <IconComponent src="/icons/monitoring/daftar-pesanan-aktif/truck.svg" />
              <p className="text-xxs font-medium">{row.fleet?.licensePlate}</p>
            </div>
          </div>
        ),
      },
      {
        key: "totalDsitance",
        header: "Jarak Tempuh",
        sortable: true,
        render: (row) => (
          <p className="text-xs font-medium text-neutral-900">
            {row.totalDistance} Km
          </p>
        ),
      },
      {
        key: "totalTonnage",
        header: "Total Tonase",
        sortable: true,
        render: (row) => (
          <p className="text-xs font-medium text-neutral-900">
            {row.totalTonnage} Ton
          </p>
        ),
      },
      {
        render: () => (
          <div className="">
            <Button variant="muattrans-primary-secondary" className="w-[122px]">
              Detail
            </Button>
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

  const handleSort = (sort, order) => {
    setSortConfig({ sort, order });
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[1280px] p-6">
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
        {isError ||
        (!isLoading &&
          (!data?.deliveries || data?.deliveries?.length === 0)) ? (
          <DataEmpty
            title="Oops, laporan ringkasan pengiriman masih kosong"
            subtitle="Belum ada transporter yang menyelesaikan pesanan"
            className="h-[280px]"
          />
        ) : (
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
            paginationCounter={true}
          />
        )}
      </div>
    </>
  );
}

export default Page;
