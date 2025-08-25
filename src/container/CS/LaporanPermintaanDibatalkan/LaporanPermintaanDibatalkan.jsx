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
import { formatDateToDDMonYYYY } from "@/lib/utils/dateFormat";

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
}) => {
  const { t } = useTranslation();

  const [tempSearch, setTempSearch] = useState("");

  const periodOptions = translatedPeriodOptions(t);

  const recentSelections = useShallowMemo(() => {
    return periodHistory.map((item) => ({
      name: item.displayText,
      value: item.displayText,
      start_date: formatDateToDDMonYYYY(item.startate),
      end_date: formatDateToDDMonYYYY(item.endDate),
    }));
  }, [periodHistory]);

  const columns = [
    {
      key: "cancelledDate",
      header: "Tanggal Dibatalkan",
      width: "174px",
      className: "align-top !pl-6 !pr-2.5",
      headerClassName: "pl-6 pr-2.5",
      render: (row) => (
        <span className="mt-1 text-xs font-medium">13 Apr 2025 17:39 WIB</span>
      ),
    },
    {
      key: "invoice",
      header: "No. Pesanan",
      width: "132px",
      className: "align-top !px-2.5",
      headerClassName: "px-2.5",
      render: (row) => (
        <span className="mt-1 text-xs font-medium">MT25A002A</span>
      ),
    },
    {
      key: "loadTime",
      header: "Waktu Muat",
      width: "180px",
      className: "align-top !px-2.5",
      headerClassName: "px-2.5",
      render: (row, index) => (
        <div className="mt-1 flex flex-col gap-y-3">
          {index % 2 === 0 ? (
            <span className="text-xs font-semibold text-success-400">
              Muat Besok
            </span>
          ) : null}
          <span className="text-xs font-medium">
            13 Apr 2025 17:39 WIB s/d 18:00 WIB
          </span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Rute Muat & Bongkar",
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
      header: "Armada",
      // width: "244px",
      headerClassName: "px-2.5",
      className: "align-top !px-2.5",
      sortable: false,
      render: (row) => {
        const armadaItems = [
          {
            icons: "/icons/transporter14.svg",
            value: "1 Unit",
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
            <span className="text-xs font-semibold">Colt Diesel Engkel</span>
            <span className="text-xxs font-medium leading-[1.3]">Box</span>
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
      header: "Permintaan Ke",
      width: "116px",
      headerClassName: "px-2.5",
      className: "align-top !px-2.5",
      sortable: false,
      render: (row) => <span className="text-xs font-medium">10</span>,
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
          onClick={() => {}}
        >
          Detail
        </Button>
      ),
    },
  ];

  const DataEmptyComponent = () => {
    if (lastFilterField !== "search") {
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
        <h1 className="text-xl font-bold">Laporan Permintaan Dibatalkan</h1>
        <div className="flex items-center gap-x-3">
          <DropdownPeriode
            disable={orders.length === 0}
            options={periodOptions}
            onSelect={() => {}}
            recentSelections={recentSelections}
            value={null} // Pass the current value to control the dropdown
          />
          <Button
            disabled={orders.length === 0}
            iconLeft="/icons/download16.svg"
            variant="muattrans-primary"
            onClick={() => {}}
          >
            Unduh
          </Button>
        </div>
      </div>
      {/* <CancelledOrderTable /> */}
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
                Permintaan jasa angkut yang telah dibatalkan oleh shipper akan
                ditampilkan disini
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
                    placeholder="Cari Permintaan "
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
                  {`Total : ${orders?.length} Permintaan Dibatalkan`}
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
