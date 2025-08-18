import { Fragment } from "react";

import Button from "@/components/Button/Button";
import { DataTable } from "@/components/DataTable";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import IconComponent from "@/components/IconComponent/IconComponent";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import { useTranslation } from "@/hooks/use-translation";

const LaporanPermintaanDibatalkan = () => {
  const { t } = useTranslation();
  const periodOptions = [
    {
      name: `${t("EksekusiTenderIndexSemuaPeriode")} (Default)`,
      value: "",
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProdukHariIni"),
      value: 0,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1MingguTerakhir"),
      value: 7,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk30HariTerakhir"),
      value: 30,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk90HariTerakhir"),
      value: 90,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1TahunTerakhir"),
      value: 365,
      format: "year",
    },
  ];

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

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Laporan Permintaan Dibatalkan</h1>
        <div className="flex items-center gap-x-3">
          <DropdownPeriode
            // disable={true}
            options={periodOptions}
            onSelect={() => {}}
            recentSelections={[]}
            value={null} // Pass the current value to control the dropdown
          />
          <Button
            // disabled
            iconLeft="/icons/download16.svg"
            variant="muattrans-primary"
            onClick={() => {}}
          >
            Unduh
          </Button>
        </div>
      </div>
      {/* <CancelledOrderTable /> */}
      <DataTable
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        columns={columns}
        searchPlaceholder="Cari Permintaan "
        totalCountLabel="Permintaan Dibatalkan"
        currentPage={2}
        totalPages={20}
        totalItems={5}
        perPage={10}
        onPageChange={() => {}}
        onPerPageChange={() => {}}
        onSearch={() => {}}
        onSort={() => {}}
        loading={false}
        showPagination
      />
    </div>
  );
};

export default LaporanPermintaanDibatalkan;
