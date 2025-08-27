import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import Table from "@/components/Table/Table";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";

import { translatedPeriodOptions } from "@/lib/constants/Shared/periodOptions";
import {
  formatDate,
  formatDateToDDMonYYYY,
  formatLoadTime,
  formatToYYYYMMDD,
} from "@/lib/utils/dateFormat";

const LaporanPermintaanDibatalkan = ({
  isLoading,
  orders,
  pagination,
  periodHistory,
  hasNoOrders,
  queryParams,
  lastFilterField,
  currentPeriodValue,
  setCurrentPeriodValue,
  onChangeQueryParams,
  onSavePeriodHistory,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [tempSearch, setTempSearch] = useState("");

  const periodOptions = translatedPeriodOptions(t);

  const recentSelections = useShallowMemo(() => {
    return periodHistory.map((item) => ({
      name: item.displayText,
      value: item.displayText,
      start_date: formatDateToDDMonYYYY(item.startDate),
      end_date: formatDateToDDMonYYYY(item.endDate),
    }));
  }, [periodHistory]);

  const columns = [
    {
      key: "cancelledDate",
      header: t(
        "LaporanPermintaanDibatalkan.headerTanggalDibatalkan",
        {},
        "Tanggal Dibatalkan"
      ),
      width: "174px",
      className: "align-top !pl-6 !pr-2.5",
      headerClassName: "pl-6 pr-2.5",
      render: (row) => (
        <span className="mt-1 text-xs font-medium">
          {formatDate(row.cancelledAt, { padDay: true })}
        </span>
      ),
    },
    {
      key: "invoice",
      header: t(
        "LaporanPermintaanDibatalkan.headerNoPesanan",
        {},
        "No. Pesanan"
      ),
      width: "132px",
      className: "align-top !px-2.5",
      headerClassName: "px-2.5",
      render: (row) => (
        <span className="mt-1 text-xs font-medium">{row.orderCode}</span>
      ),
    },
    {
      key: "loadTime",
      header: t(
        "LaporanPermintaanDibatalkan.headerWaktuMuat",
        {},
        "Waktu Muat"
      ),
      width: "180px",
      className: "align-top !px-2.5",
      headerClassName: "px-2.5",
      render: (row, index) => (
        <div className="mt-1 flex flex-col gap-y-3">
          {index % 2 === 0 ? (
            <span className="text-xs font-semibold text-success-400">
              {t(
                "LaporanPermintaanDibatalkan.labelMuatBesok",
                {},
                "Muat Besok"
              )}
            </span>
          ) : null}
          <span className="text-xs font-medium">
            {formatLoadTime(row.loadTimeStart, row.loadTimeEnd)}
          </span>
        </div>
      ),
    },
    {
      key: "location",
      header: t(
        "LaporanPermintaanDibatalkan.headerRuteMuatBongkar",
        {},
        "Rute Muat & Bongkar"
      ),
      // width: "244px",
      headerClassName: "px-2.5",
      className: "align-top !px-2.5",
      render: (row) => (
        <div className="flex max-w-[224px]">
          <MuatBongkarStepperWithModal
            appearance={{
              titleClassName: "line-clamp-1",
            }}
            pickupLocations={[
              {
                fullAddress: "Jalan Mayjend Soengkono 33A, Denanyar, Jombang",
              },
              {
                fullAddress: "Jalan Mayjend Soengkono 33A, Denanyar, Jombang",
              },
              {
                fullAddress: "Jalan Mayjend Soengkono 33A, Denanyar, Jombang",
              },
              {
                fullAddress:
                  "Jl. Kedondong Kidul I/43, Tegalsari, Kota Surabaya",
              },
              {
                fullAddress:
                  "Jl. Kedondong Kidul I/43, Tegalsari, Kota Surabaya",
              },
              {
                fullAddress:
                  "JL. Genuksari Genuksari Genuksari Genuksari Genuksari Genuksari Genuksari Genuksari Genuksari, No. 1, Candisari, Kota Semarang",
              },
            ]}
            dropoffLocations={[
              {
                fullAddress:
                  "Jl. Ladeleng No.52 Rt.1 Kec. Kusan Hilir, Kab. Tanah Bumbu",
              },
              {
                fullAddress:
                  "Jl.Lanan Raya Rt.10 Perumnas, Kec. Balikpapan Utara, Kota Balikpapan,",
              },
              {
                fullAddress: "Jl. Tadulako No.16, Kec. Bunta, Kab. Banggai",
              },
              {
                fullAddress: "Jl. Tadulako No.16, Kec. Bunta, Kab. Banggai",
              },
              {
                fullAddress:
                  "Jl. Kertanegara Barat No. 15, Singosari, Kab. Malang",
              },
              {
                fullAddress:
                  "Jl. Kertanegara Barat No. 15, Singosari, Kab. Malang",
              },
            ]}
          />
        </div>
      ),
    },
    {
      key: "fleet",
      header: t("LaporanPermintaanDibatalkan.headerArmada", {}, "Armada"),
      // width: "244px",
      headerClassName: "px-2.5",
      className: "align-top !px-2.5",
      sortable: false,
      render: (row) => {
        const armadaItems = [
          {
            icons: "/icons/transporter14.svg",
            value: `${row.unit} Unit`,
          },
          {
            isDot: true,
          },
          {
            icons: "/icons/estimasi-kapasitas14.svg",
            value: row.cargo,
            // value: "1.000 kg",
          },
        ];
        return (
          <div className="mt-0.5 flex flex-col gap-y-2">
            <span className="line-clamp-1 text-xs font-semibold">
              {row.truckTypeName}
            </span>
            <span className="line-clamp-1 text-xxs font-medium leading-[1.3]">
              {row.truckCarrier}
            </span>
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
          </div>
        );
      },
    },
    {
      key: "numberOfRequest",
      header: t(
        "LaporanPermintaanDibatalkan.headerPermintaanKe",
        {},
        "Permintaan Ke"
      ),
      width: "116px",
      headerClassName: "px-2.5",
      className: "align-top !px-2.5",
      sortable: false,
      render: (row) => (
        <span className="text-xs font-medium">{row.requestCount}</span>
      ),
    },
    {
      key: "action",
      header: "",
      // width: "142px",
      headerClassName: "pl2.5 pr-6",
      className: "align-top !pl-2.5 !pr-6",
      sortable: false,
      render: (row) => (
        <Button
          className="!px-[36.5px]"
          variant="muattrans-primary"
          onClick={() =>
            router.push(
              `/laporan/permintaan-dibatalkan/${row.id}}/detail-permintaan-dibatalkan`
            )
          }
        >
          {t("LaporanPermintaanDibatalkan.buttonDetail", {}, "Detail")}
        </Button>
      ),
    },
  ];

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

  const handleSelectPeriod = (selectedOption) => {
    // For custom date range option
    if (selectedOption?.range) {
      // Use string manipulation, not Date object with toISOString()
      const formattedStartDate = formatToYYYYMMDD(selectedOption.start_date);
      const formattedEndDate = formatToYYYYMMDD(selectedOption.end_date);

      onChangeQueryParams("startDate", formattedStartDate);
      onChangeQueryParams("endDate", formattedEndDate);

      onSavePeriodHistory(formattedStartDate, formattedEndDate);

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

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {t(
            "LaporanPermintaanDibatalkan.titleLaporanPermintaanDibatalkan",
            {},
            "Laporan Permintaan Dibatalkan"
          )}
        </h1>
        <div className="flex items-center gap-x-3">
          <DropdownPeriode
            disable={orders.length === 0}
            options={periodOptions}
            onSelect={handleSelectPeriod}
            recentSelections={recentSelections}
            value={currentPeriodValue} // Pass the current value to control the dropdown
          />
          <Button
            disabled={orders.length === 0}
            iconLeft="/icons/download16.svg"
            variant="muattrans-primary"
            onClick={() => {}}
          >
            {t("LaporanPermintaanDibatalkan.buttonUnduh", {}, "Unduh")}
          </Button>
        </div>
      </div>
      <Card className="border-none">
        {hasNoOrders ? (
          <div className="flex h-[280px] items-center justify-center">
            <div className="flex flex-col items-center gap-y-3">
              <DataNotFound
                type="data"
                title="Oops, belum ada laporan permintaan jasa angkut yang dibatalkan"
                className="gap-3"
                textClass="w-full"
                width={96}
                height={77}
              />
              <span className="text-xs font-medium text-neutral-600">
                {t(
                  "LaporanPermintaanDibatalkan.labelPermintaanDibatalkanInfo",
                  {},
                  "Permintaan jasa angkut yang telah dibatalkan oleh shipper akan ditampilkan disini"
                )}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-y-6 p-6 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <Input
                    className="gap-0"
                    disabled={orders.length === 0 && !queryParams.search}
                    appearance={{ containerClassName: "w-[262px]" }}
                    placeholder={t(
                      "LaporanPermintaanDibatalkan.placeholderCariPermintaan",
                      {},
                      "Cari Permintaan"
                    )}
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
                </div>
                <span className="text-base font-semibold">
                  {t(
                    "LaporanPermintaanDibatalkan.labelTotalPermintaanDibatalkan",
                    { total: orders.length },
                    "Total : {total} Permintaan Dibatalkan"
                  )}
                </span>
              </div>
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
          </>
        )}
      </Card>
      {orders.length === 0 ? null : (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          perPage={pagination.itemsPerPage}
          onPageChange={(value) => onChangeQueryParams("page", value)}
          onPerPageChange={(value) => onChangeQueryParams("limit", value)}
          className="py-0"
        />
      )}
    </div>
  );
};

export default LaporanPermintaanDibatalkan;
