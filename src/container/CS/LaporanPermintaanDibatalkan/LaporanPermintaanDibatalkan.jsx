import Button from "@/components/Button/Button";
import CancelledOrderTable from "@/container/CS/LaporanPermintaanDibatalkan/CancelledOrderTable";

const LaporanPermintaanDibatalkan = () => {
  return (
    <main className="mx-auto flex max-w-[1280px] flex-col gap-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Laporan Permintaan Dibatalkan</h1>
        <div className="flex items-center gap-x-3">
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
    </main>
  );
};

export default LaporanPermintaanDibatalkan;
