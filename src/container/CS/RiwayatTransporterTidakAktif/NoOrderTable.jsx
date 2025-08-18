import Card from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";

const NoOrderTable = () => {
  return (
    <Card className="border-none">
      <div className="my-6 flex min-h-[232px] items-center justify-center">
        <div className="flex flex-col items-center gap-y-3">
          <DataNotFound
            type="data"
            width={96}
            height={77}
            className="w-full gap-3"
            title="Belum ada Laporan Riwayat Transporter Tidak Aktif"
            textClass="w-full"
          />
          <span className="text-xs font-medium text-neutral-600">
            Laporan Riwayat Transporter Tidak Aktif yang telah di selesaikan
            Customer Service akan ditampilkan disini
          </span>
        </div>
      </div>
    </Card>
  );
};

export default NoOrderTable;
