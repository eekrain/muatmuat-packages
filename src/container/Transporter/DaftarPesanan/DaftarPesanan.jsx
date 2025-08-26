import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import Filter from "@/components/Filter/Filter";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import Pagination from "@/components/Pagination/Pagination";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import Table from "@/components/Table/Table";
import AssignArmadaWrapper from "@/container/Shared/OrderModal/AssignArmadaWrapper";
import ConfirmReadyModal from "@/container/Shared/OrderModal/ConfirmReadyModal";
import RespondChangeModal from "@/container/Shared/OrderModal/RespondChangeModal";
// Assuming path, adjust if necessary
import { useTranslation } from "@/hooks/use-translation";
import { translatedPeriodOptions } from "@/lib/constants/Shared/periodOptions";
import { cn } from "@/lib/utils";
import { formatLoadTime, formatToYYYYMMDD } from "@/lib/utils/dateFormat";
import {
  ORDER_STATUS,
  getOrderStatusConfig,
} from "@/utils/Transporter/orderStatus";

const DaftarPesanan = ({
  isLoading,
  isFirstTimer,
  orders,
  pagination,
  tabOptions,
  statusRadioOptions,
  recentSelections,
  queryParams,
  lastFilterField,
  currentPeriodValue,
  setCurrentPeriodValue,
  filterType,
  setFilterType,
  onChangeQueryParams,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [tempSearch, setTempSearch] = useState("");

  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [selectedOrderForChange, setSelectedOrderForChange] = useState(null);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);

  // State for Assign Armada Modal
  const [isAssignArmadaModalOpen, setIsAssignArmadaModalOpen] = useState(false);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null);

  // State for Confirm Ready Modal
  const [isConfirmReadyModalOpen, setIsConfirmReadyModalOpen] = useState(false);
  const [selectedOrderForConfirm, setSelectedOrderForConfirm] = useState(null);

  // Handle search
  const handleSearch = (e) => {
    if (e.key === "Enter" && tempSearch.length >= 3) {
      onChangeQueryParams("search", tempSearch);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setTempSearch("");
  };

  // Handle opening the response change modal
  const handleOpenRespondModal = (order) => {
    setSelectedOrderForChange(order);
    setIsRespondModalOpen(true);
  };

  const handleBackFromRespondModal = () => {
    setShowBackConfirmation(true);
  };

  const handleCloseRespondModal = () => {
    setIsRespondModalOpen(false);
    setSelectedOrderForChange(null);
  };

  const confirmNavigation = () => {
    setShowBackConfirmation(false);
    handleCloseRespondModal();
  };

  const cancelNavigation = () => {
    setShowBackConfirmation(false);
    setIsRespondModalOpen(true);
  };

  // Handlers for Assign Armada Modal
  const handleOpenAssignModal = (order) => {
    setSelectedOrderForAssign(order);
    setIsAssignArmadaModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignArmadaModalOpen(false);
    setSelectedOrderForAssign(null);
  };

  // Handlers for Confirm Ready Modal
  const handleOpenConfirmReadyModal = (order) => {
    setSelectedOrderForConfirm(order);
    setIsConfirmReadyModalOpen(true);
  };

  const handleCloseConfirmReadyModal = () => {
    setIsConfirmReadyModalOpen(false);
    setSelectedOrderForConfirm(null);
  };

  const DataEmptyComponent = () => {
    if (lastFilterField === "search") {
      return (
        <DataNotFound
          className="gap-5"
          title="Keyword Tidak Ditemukan"
          width={144}
          height={122}
        />
      );
    } else if (lastFilterField === "status") {
      return (
        <DataNotFound
          className="gap-5"
          title={
            <span>
              Data Tidak Ditemukan.
              <br />
              Mohon coba hapus beberapa filter
            </span>
          }
          width={144}
          height={122}
        />
      );
    } else {
      return (
        <DataNotFound
          type="data"
          className="gap-3"
          title="Tidak ada data"
          width={96}
          height={77}
        />
      );
    }
  };

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
                <Button
                  className="text-xs font-medium"
                  variant="link"
                  onClick={() => {
                    router.push("/monitoring?leftPanel=sos");
                  }}
                >
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
            <Button
              className="min-w-[174px]"
              variant="muattrans-primary"
              onClick={() => handleOpenAssignModal(row)}
            >
              Assign Armada
            </Button>
          ) : null}
          {/* MODIFIED SECTION (Confirm Ready Modal) --- START */}
          {rowIndex === 5 ? (
            <Button
              className="min-w-[174px]"
              variant="muattrans-primary"
              onClick={() => handleOpenConfirmReadyModal(row)}
            >
              Konfirmasi Siap
            </Button>
          ) : null}
          {/* MODIFIED SECTION (Confirm Ready Modal) --- END */}
          {rowIndex === 6 ? (
            <Button
              className="min-w-[174px]"
              variant="muattrans-primary"
              onClick={() => handleOpenRespondModal(row)}
            >
              Respon Perubahan
            </Button>
          ) : null}
          <Button
            className="min-w-[174px]"
            variant="muattrans-primary-secondary"
            onClick={() =>
              router.push(`/daftar-pesanan/${row.id}/detail-pesanan`)
            }
          >
            Detail
          </Button>
        </div>
      ),
    },
  ];

  // Period options untuk dropdown
  const periodOptions = translatedPeriodOptions(t);

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

  const handleSelectPeriod = (selectedOption) => {
    // For custom date range option
    if (selectedOption?.range) {
      // Use string manipulation, not Date object with toISOString()
      const formattedStartDate = formatToYYYYMMDD(selectedOption.start_date);
      const formattedEndDate = formatToYYYYMMDD(selectedOption.end_date);

      onChangeQueryParams("startDate", formattedStartDate);
      onChangeQueryParams("endDate", formattedEndDate);

      // Update recent selections - only add if not already in the array
      // if (
      //   !recentSelections?.some((s) => s?.value === selectedOption?.value)
      // ) {
      //   setRecentPeriodOptions((prev) => [...prev, selectedOption]);
      // }

      // Update the current period value
      setCurrentPeriodValue(selectedOption);
    }
    // For default "Semua Periode" option
    else if (selectedOption?.value === "") {
      onChangeQueryParams("startDate", null);
      onChangeQueryParams("endDate", null);

      // Update the current period value
      setCurrentPeriodValue(selectedOption);
    }
    // For predefined period options (today, last 7 days, etc.)
    else if (selectedOption?.value !== undefined) {
      // Get local dates using direct component extraction, not toISOString()
      const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Get today as end date
      const today = new Date();
      const endDate = getLocalDateString(today);

      // Calculate start date
      let startDate;
      if (selectedOption.value === 0) {
        // Today
        startDate = endDate;
      } else {
        // Other periods (7 days, 30 days, etc.)
        const startDateObj = new Date();
        // Set to noon to avoid any date boundary issues
        startDateObj.setHours(12, 0, 0, 0);
        startDateObj.setDate(today.getDate() - selectedOption.value);
        startDate = getLocalDateString(startDateObj);
      }

      onChangeQueryParams("startDate", startDate);
      onChangeQueryParams("endDate", endDate);

      // Update the current period value
      setCurrentPeriodValue(selectedOption);
    }
  };

  return (
    <div className="flex flex-col gap-y-4 py-6">
      {/* Header sesuai LDG-2 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Daftar Pesanan</h1>
        <DropdownPeriode
          disable={
            isLoading ||
            isFirstTimer ||
            (orders.length === 0 &&
              !queryParams.startDate &&
              !queryParams.endDate)
          }
          options={periodOptions}
          onSelect={handleSelectPeriod}
          recentSelections={recentSelections}
          value={currentPeriodValue}
        />
      </div>

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
                Mulai terima permintaan sekarang untuk menampilkan data pesanan
                disini
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
            <div className="flex flex-col gap-y-6 p-6 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <Input
                    className="gap-0"
                    disabled={orders.length === 0 && !queryParams.search}
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
                    disabled={orders.length === 0 && filterType !== "dropdown"}
                    options={statusRadioOptions}
                    value={filterType === "dropdown" ? queryParams.status : ""}
                    onChange={({ name, value }) => {
                      setFilterType("dropdown");
                      onChangeQueryParams(name, value);
                    }}
                  />
                </div>
                <div className="flex items-center gap-x-3">
                  <span className="text-xs font-bold leading-[14.4px] text-neutral-900">
                    {t("labelTampilkan")}
                  </span>
                  {tabOptions.map((tab, key) => {
                    // Check if this is the "Semua" tab (empty value) and if the current queryParams.status
                    // isn't one of the specific tab values
                    const isActiveAllTab =
                      tab.value === "" &&
                      queryParams.status !==
                        ORDER_STATUS.NEED_CHANGE_RESPONSE &&
                      queryParams.status !==
                        ORDER_STATUS.NEED_CONFIRMATION_READY &&
                      queryParams.status !== ORDER_STATUS.NEED_ASSIGN_FLEET;

                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setFilterType("tab");
                          onChangeQueryParams("seach", "");
                          onChangeQueryParams("status", tab.value);
                        }}
                        className={cn(
                          "relative flex h-7 cursor-pointer items-center rounded-full px-3 py-[6px] font-semibold",
                          (queryParams.status === tab.value &&
                            filterType === "tab") ||
                            isActiveAllTab
                            ? "border border-primary-700 bg-primary-50 text-primary-700"
                            : "bg-neutral-200 text-neutral-900"
                        )}
                      >
                        <span className="text-xxs leading-[1.3]">
                          {tab.label}
                        </span>
                        {tab.value !== "" &&
                        queryParams.status !== tab.value &&
                        tab.count > 0 ? (
                          <div className="absolute right-[11px] top-[6.5px] size-1 rounded-full bg-error-700" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              {filterType === "dropdown" ? (
                <div className="flex items-center gap-x-3">
                  <Button
                    className="font-bold"
                    onClick={() => {
                      setFilterType("tab");
                      onChangeQueryParams("status", "");
                    }}
                    variant="link"
                  >
                    Hapus Semua Filter
                  </Button>
                  <TagBubble
                    withRemove={{
                      onRemove: () => {
                        setFilterType("tab");
                        onChangeQueryParams("status", "");
                      },
                    }}
                  >
                    {getOrderStatusConfig(t)[queryParams.status].label}
                  </TagBubble>
                </div>
              ) : null}
            </div>
            <Table
              columns={columns}
              data={orders}
              loading={isLoading}
              onRowClick={undefined}
              onSort={handleSort}
              sortConfig={{
                sort: queryParams.sort,
                order: queryParams.order,
              }}
              emptyComponent={<DataEmptyComponent />}
            />
          </div>
        )}
      </Card>

      {isFirstTimer || orders.length === 0 ? null : (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          perPage={pagination.itemsPerPage}
          onPageChange={(value) => onChangeQueryParams("page", value)}
          onPerPageChange={(value) => onChangeQueryParams("limit", value)}
          className="py-0"
        />
      )}

      {/* Respond Change Modal */}
      <RespondChangeModal
        isOpen={isRespondModalOpen}
        onClose={handleCloseRespondModal}
        orderData={selectedOrderForChange}
      />

      {/* Confirmation Modal for Respond Change */}
      <ConfirmationModal
        isOpen={showBackConfirmation}
        setIsOpen={setShowBackConfirmation}
        description={{
          text: t(
            "RespondChangeModal.descriptionConfirmNavigation",
            {},
            "Apakah kamu yakin ingin menutup modal? Data yang telah diisi tidak akan disimpan"
          ),
        }}
        confirm={{
          text: t("RespondChangeModal.buttonStay", {}, "Ya"),
          onClick: cancelNavigation,
          cancelClassname: "w-8",
        }}
        cancel={{
          text: t("RespondChangeModal.buttonLeave", {}, "Batal"),
          onClick: confirmNavigation,
          confirmClassname: "w-8",
        }}
      >
        {t(
          "RespondChangeModal.messageConfirmNavigation",
          {},
          "Data yang telah diisi tidak akan disimpan. Apakah kamu yakin ingin menutup modal ini?"
        )}
      </ConfirmationModal>

      {/* Assign Armada Modal */}
      <AssignArmadaWrapper
        isOpen={isAssignArmadaModalOpen}
        onClose={() => {
          setIsAssignArmadaModalOpen(false);
        }}
        orderData={selectedOrderForAssign}
      />

      {/* Confirm Ready Modal */}
      <ConfirmReadyModal
        isOpen={isConfirmReadyModalOpen}
        onClose={handleCloseConfirmReadyModal}
        orderData={selectedOrderForConfirm}
      />
    </div>
  );
};

export default DaftarPesanan;
