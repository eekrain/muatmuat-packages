import Card from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";

const CancelledOrderTable = () => {
  return (
    <Card className="border-none">
      <div className="my-6 flex min-h-[232px] items-center justify-center">
        <div className="flex flex-col items-center gap-y-3">
          <DataNotFound
            type="data"
            width={96}
            height={77}
            className="w-full gap-3"
            title="Oops, belum ada laporan permintaan jasa angkut yang dibatalkan"
            textClass="w-full"
          />
          <span className="text-xs font-medium text-neutral-600">
            Permintaan jasa angkut yang telah dibatalkan oleh shipper akan
            ditampilkan disini
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CancelledOrderTable;
