import Button from "@/components/Button/Button";
// import { DataTable } from "@/components/DataTable";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

import NoOrderTable from "./NoOrderTable";

const RiwayatTransporterTidakAktif = () => {
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
  const mockData = [
    {
      date: "10 Jan 2025 10:00 WIB",
      transporter: "PT Siba Surya",
      condition: "Armada Nonaktif Terlalu Banyak (10/11)",
    },
    {
      date: "10 Jan 2025 10:00 WIB",
      transporter:
        "PT Batavia Prosperindo Angkut Teknologi Indonesia Trans Nusantara Sejahtera Abadi Selalu Tbk",
      condition: "Admin Terdeteksi Sering Idle (5/7 Order)",
    },
    {
      date: "10 Jan 2025 10:00 WIB",
      transporter: "Transporter AA",
      condition: "Transporter Tidak Aktif",
    },
  ];

  const columns = [
    {
      key: "done-date",
      header: "Tanggal Selesai",
      width: "174px",
      className: "align-top !pl-6 !pr-2.5",
      headerClassName: "pl-6 pr-2.5",
      render: (row) => (
        <span className="flex w-[150px] text-xs font-medium">{row.date}</span>
      ),
    },
    {
      key: "transporter",
      header: "Transporter",
      width: "132px",
      className: "align-top !px-2.5",
      headerClassName: "px-2.5",
      render: (row, index) => (
        <div className="flex w-[430px] gap-5">
          <img
            src="/icons/data-not-found.svg"
            alt=""
            className="size-12 rounded-full border border-neutral-400 p-2"
          />
          <div className="mt-1 flex flex-col gap-y-2">
            <span className="line-clamp-1 text-xs font-bold text-neutral-900">
              {row.transporter}
            </span>

            <div className="flex items-center gap-2 text-xs font-medium text-primary-500 hover:cursor-pointer">
              <IconComponent src={"/icons/call-blue.svg"} />
              <div>Hubungi</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "condition",
      header: "Kondisi",
      width: "180px",
      className: "align-top !px-2.5",
      headerClassName: "px-2.5",
      render: (row, index) => (
        <span className="flex w-[430px] text-xs font-semibold text-error-400">
          {row.condition}
        </span>
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
        <h1 className="text-xl font-bold">
          Laporan Riwayat Transporter Tidak Aktif
        </h1>
        <div className="flex items-center gap-x-3">
          <DropdownPeriode
            disable={true}
            options={periodOptions}
            onSelect={() => {}}
            recentSelections={[]}
            value={null} // Pass the current value to control the dropdown
          />
          <Button
            disabled
            iconLeft="/icons/download16.svg"
            variant="muattrans-primary"
            onClick={() => {}}
          >
            Unduh
          </Button>
        </div>
      </div>
      {/* {mockData.length === 0 ? ( */}
      <NoOrderTable />
      {/* ) : (
        <DataTable
          data={mockData}
          columns={columns}
          searchPlaceholder="Cari Transporter "
          totalCountLabel="Laporan"
          currentPage={1}
          totalPages={1}
          totalItems={mockData.length}
          perPage={10}
          onPageChange={() => {}}
          onPerPageChange={() => {}}
          onSearch={() => {}}
          onSort={() => {}}
          loading={false}
          showPagination
          showFilter={true}
          filterConfig={[]}
        />
      )} */}
    </div>
  );
};

export default RiwayatTransporterTidakAktif;
