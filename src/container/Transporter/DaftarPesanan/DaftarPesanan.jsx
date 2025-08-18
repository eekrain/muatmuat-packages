import { Fragment, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DataTable from "@/components/DataTable/DataTable";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import Filter from "@/components/Filter/Filter";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import Table from "@/components/Table/Table";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { formatLoadTime } from "@/lib/utils/dateFormat";

// Import the new function

const DaftarPesanan = ({
  isFirstTimer,
  orders,
  pagination,
  queryParams,
  onChangeQueryParams,
}) => {
  const { t } = useTranslation();

  const [tempSearch, setTempSearch] = useState("");
  console.log("isFirstTimer", isFirstTimer);
  const [selectedTab, setSelectedTab] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
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
    if (e.key === "Enter" && tempSearch.length >= 3) {
      onChangeQueryParams("search", tempSearch);
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

  // Define columns sesuai LDG-2 design
  // DIBACA: SEMENTARA PAKEK ROW INDEX CUMAN BUAT KLUARIN VARIASI DESIGN!!!
  const columns = [
    {
      key: "orderCode",
      header: "No. Pesanan",
      sortable: true,
      width: "215px",
      className: "align-top !pl-6 !pr-3",
      headerClassName: "pl-6 pr-3",
      render: (row, rowIndex) => (
        <div className="mt-1 flex flex-col gap-y-3">
          <span className="text-xs font-medium">{row.orderCode}</span>
          <BadgeStatusPesanan
            className="w-fit"
            variant={rowIndex % 2 === 0 ? "success" : "primary"}
          >
            {rowIndex % 2 === 0 ? "Instan" : "Terjadwal"}
          </BadgeStatusPesanan>
        </div>
      ),
    },
    {
      key: "loadingTime",
      header: "Waktu Muat",
      sortable: true,
      width: "202px",
      className: "align-top !px-3",
      headerClassName: "px-3",
      render: (row) => (
        <div className="mt-1 flex flex-col gap-y-3">
          <span className="text-xs font-medium">
            {formatLoadTime(row.loadTimeStart, row.loadTimeEnd)}
          </span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Rute Muat & Bongkar",
      sortable: true,
      width: "203px",
      className: "align-top !px-3",
      headerClassName: "px-3",
      render: (row, rowIndex) => (
        <div className="flex max-w-[179px]">
          <MuatBongkarStepperWithModal
            appearance={{
              titleClassName: "line-clamp-1",
            }}
            pickupLocations={
              rowIndex === 2
                ? [{ fullAddress: "Kota Surabaya, Kec. Tegalsari" }]
                : rowIndex % 2 === 0
                  ? [{ fullAddress: row.pickupLocation }]
                  : [
                      {
                        fullAddress:
                          "Jalan Dinoyo No. 111, Kec. Tegalsari, Kota Surabaya",
                      },
                    ]
            }
            dropoffLocations={
              rowIndex === 2
                ? [{ fullAddress: "Kab. Malang, Kec. Singosari" }]
                : rowIndex % 2 === 0
                  ? [{ fullAddress: row.dropoffLocation }]
                  : [
                      {
                        fullAddress:
                          "Jl. Terusan Kawi No.16 Bareng, Kec. Klojen, Kab. Pasuruan",
                      },
                      {
                        fullAddress:
                          "Jalan Raden Intan Kav. 14, Kec. Blimbing, Malang",
                      },
                    ]
            }
          />
        </div>
      ),
    },
    {
      key: "fleet",
      header: "Armada",
      width: "204px",
      className: "align-top !px-3",
      headerClassName: "px-3",
      sortable: false,
      render: (row, rowIndex) => {
        const armadaItems = [
          {
            icons: "/icons/transporter14.svg",
            value: rowIndex % 2 === 0 ? "1 Unit" : "4 Unit",
          },
          {
            isDot: true,
          },
          {
            icons: "/icons/estimasi-kapasitas14.svg",
            value: "1.000 kg",
          },
        ];
        return (
          <div className="mt-0.5 flex flex-col gap-y-2">
            <span className="text-xs font-bold">{row.truckTypeName}</span>
            <div className="flex items-center gap-x-1 text-xxs font-medium leading-[1.3]">
              <span className="text-neutral-600">{`Carrier :`}</span>
              <span className="">{row.carrierName}</span>
            </div>
            <div className="flex items-center gap-x-2">
              {armadaItems.map((item, key) => (
                <Fragment key={key}>
                  {item.isDot ? (
                    <div className="size-0.5 rounded-full bg-neutral-600" />
                  ) : (
                    <div className="flex items-center gap-x-1">
                      <IconComponent
                        className="text-muat-trans-secondary-900"
                        src={item.icons}
                        width={14}
                        height={14}
                      />
                      <span className="text-xxs font-medium leading-[1.3]">
                        {item.value}
                      </span>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            {rowIndex === 0 || rowIndex === 1 ? (
              <div className="flex items-center gap-x-2">
                <div className="flex h-3.5 items-center rounded bg-error-400 px-1 text-[8px] font-bold leading-[1.3] text-neutral-50">
                  <span>{rowIndex === 0 ? "SOS" : "SOS : 1 Unit"}</span>
                </div>
                <Button className="text-xs font-medium" variant="link">
                  Lihat SOS
                </Button>
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      width: "198px",
      className: "align-top !pl-3 pr-2.5",
      headerClassName: "pl-3 pr-2.5",
      sortable: false,
      render: (row, rowIndex) => (
        <BadgeStatusPesanan
          variant={
            rowIndex === 4 || rowIndex === 6
              ? "warning"
              : rowIndex === 5
                ? "error"
                : "primary"
          }
          icon={{
            iconLeft:
              rowIndex === 4 || rowIndex === 5 || rowIndex === 6
                ? "/icons/warning14.svg"
                : null,
          }}
        >
          <div className="flex items-center gap-x-1">
            {rowIndex === 2 ? (
              <InfoTooltip
                appearance={{
                  iconClassName: "text-primary-700 w-3.5 h-3.5",
                }}
              >
                <p className="max-w-[312px]">
                  Armada kamu telah tercatat untuk pesanan ini, harap menunggu
                  maks. 1 jam untuk konfirmasi dari shipper.
                </p>
              </InfoTooltip>
            ) : null}
            {rowIndex === 2
              ? "Menunggu Konfirmasi"
              : rowIndex === 4
                ? "Perlu Assign Armada"
                : rowIndex === 5
                  ? "Perlu Konfirmasi Siap"
                  : rowIndex === 6
                    ? "Perlu Respon Perubahan"
                    : "Proses Muat"}
          </div>
        </BadgeStatusPesanan>
      ),
    },
    {
      key: "action",
      header: "",
      width: "203px",
      className: "align-top !pl-2.5 pr-6",
      headerClassName: "pl-2.5 pr-6",
      sortable: false,
      render: (row, rowIndex) => (
        <div className="flex flex-col gap-y-3">
          {rowIndex === 4 ? (
            <Button className="min-w-[174px]" variant="muattrans-primary">
              Assign Armada
            </Button>
          ) : null}
          {rowIndex === 5 ? (
            <Button className="min-w-[174px]" variant="muattrans-primary">
              Konfirmasi Siap
            </Button>
          ) : null}
          {rowIndex === 6 ? (
            <Button className="min-w-[174px]" variant="muattrans-primary">
              Respon Perubahan
            </Button>
          ) : null}
          <Button
            className="min-w-[174px]"
            variant="muattrans-primary-secondary"
          >
            Detail
          </Button>
        </div>
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

  // Generic function to handle sorting for any column
  const handleSort = (columnName) => {
    // If sort is empty or not the current column, set to current column and order to desc
    if (queryParams.sort !== columnName) {
      onChangeQueryParams("sort", columnName);
      onChangeQueryParams("order", "desc");
    }
    // If sort is the current column and order is desc, change to asc
    else if (queryParams.sort === columnName && queryParams.order === "desc") {
      onChangeQueryParams("order", "asc");
    }
    // If sort is the current column and order is asc, reset sort and order
    else {
      onChangeQueryParams("sort", "");
      onChangeQueryParams("order", "");
    }
  };

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
    <div className="flex flex-col gap-y-4 py-6">
      {/* Header sesuai LDG-2 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Daftar Pesanan</h1>
        <DropdownPeriode
          //   disable
          // disable={orders.length === 0}
          options={periodOptions}
          onSelect={handleSelectPeriod}
          recentSelections={recentPeriodOptions}
          value={currentPeriodValue}
        />
      </div>

      {true ? (
        <Card className="border-none">
          {isFirstTimer ? (
            <div className="flex h-[280px] items-center justify-center">
              <div className="flex flex-col items-center gap-y-3">
                <DataNotFound
                  type="data"
                  title="Oops, daftar pesananmu masih kosong"
                  className="gap-3"
                  textClass="w-full"
                  width={96}
                  height={77}
                />
                <span className="text-xs font-medium text-neutral-600">
                  Mulai terima permintaan sekarang untuk menampilkan data
                  pesanan disini
                </span>
                <Button
                  variant="muattrans-primary"
                  onClick={() => {}}
                  className="w-fit md:px-[32.5px]"
                >
                  Lihat Permintaan
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-x-3">
                  <Input
                    className="gap-0"
                    // disabled={
                    //   hasNoOrders || (!hasFilteredOrders && !queryParams.search)
                    // }
                    appearance={{ containerClassName: "w-[262px]" }}
                    placeholder={t("placeholderCariPesanan")}
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
                  <Filter
                    // disabled={
                    //   hasNoOrders ||
                    //   (!hasFilteredOrders &&
                    //     !statusRadioOptions
                    //       .flatMap((item) => item.children)
                    //       .some((item) => item.value === queryParams.status))
                    // }
                    options={[]}
                    // value={queryParams.status}
                    value=""
                    onChange={
                      ({ name, value }) => {}
                      //   onChangeQueryParams(name, value)
                    }
                  />
                </div>
                <div className="flex items-center gap-x-3">
                  <span className="text-xs font-bold leading-[14.4px] text-neutral-900">
                    {t("labelTampilkan")}
                  </span>
                  {[
                    { value: "", label: "Semua" },
                    {
                      value: "WAITING_PAYMENT",
                      label: `Perlu Respon Perubahan (2)`,
                    },
                    {
                      value: "WAITING_REPAYMENT",
                      label: `Perlu Konfirmasi Siap (2)`,
                    },
                    {
                      value: "DOCUMENT_SHIPPING",
                      label: `Perlu Assign Armada (3)`,
                    },
                  ].map((tab, key) => {
                    // Check if this is the "Semua" tab (empty value) and if the current queryParams.status
                    // isn't one of the specific tab values
                    const isActiveAllTab = tab.value === "";
                    //   &&
                    //   queryParams.status !== "WAITING_PAYMENT" &&
                    //   queryParams.status !== "WAITING_REPAYMENT" &&
                    //   queryParams.status !== "DOCUMENT_SHIPPING";

                    return (
                      <div
                        key={key}
                        onClick={() => onChangeQueryParams("status", tab.value)}
                        className={cn(
                          "relative flex h-7 cursor-pointer items-center rounded-full px-3 py-[6px] font-semibold",
                          queryParams.status === tab.value || isActiveAllTab
                            ? "border border-primary-700 bg-primary-50 text-primary-700"
                            : "bg-neutral-200 text-neutral-900"
                        )}
                      >
                        <span className="text-xxs leading-[1.3]">
                          {tab.label}
                        </span>
                        {!isActiveAllTab ? (
                          <div className="absolute right-[11px] top-[6.5px] size-1 rounded-full bg-error-700" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Table
                columns={columns}
                data={orders}
                loading={false}
                onRowClick={undefined}
                onSort={handleSort}
                sortConfig={{
                  sort: queryParams.sort,
                  order: queryParams.order,
                }}
                //   emptyComponent={renderEmptyState()}
              />
            </div>
          )}
        </Card>
      ) : (
        <>
          {/* Table sesuai LDG-2 design */}
          <div className="rounded-lg bg-white shadow-[0px_4px_11px_0px_#41414140]">
            {/* Custom header dengan Search + Filter + Tabs */}
            <div className="flex-shrink-0 space-y-2 px-6 pb-0 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Search Input */}
                  <Input
                    className="gap-0"
                    disabled={orders.length === 0}
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
                    disabled={orders.length === 0}
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
              data={orders}
              columns={columns}
              currentPage={currentPage}
              totalPages={Math.ceil(orders.length / perPage)}
              totalItems={orders.length}
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
            totalPages={Math.ceil(orders.length / perPage)}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
            variants="muatrans"
          />
          {/* {selectedOrderForChange && (
            <RespondChangeModal
              isOpen={isRespondModalOpen}
              onClose={handleCloseRespondModal}
              orderData={selectedOrderForChange}
            />
          )} */}
        </>
      )}
      <Pagination
        currentPage={1}
        totalPages={1}
        perPage={10}
        onPageChange={() => {}}
        onPerPageChange={() => {}}
        className="py-0"
      />
    </div>
  );
};

export default DaftarPesanan;
