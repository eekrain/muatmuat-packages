import Button from "@/components/Button/Button";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import CancelledOrderTable from "@/container/CS/LaporanPermintaanDibatalkan/CancelledOrderTable";
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
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Laporan Permintaan Dibatalkan</h1>
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
      <CancelledOrderTable />
    </div>
  );
};

export default LaporanPermintaanDibatalkan;
