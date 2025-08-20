import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";

const ModalDetailTransporterTidakAktif = ({
  transporter,
  onClose,
  onSelesaikan,
  onHubungi,
}) => {
  if (!transporter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-[520px] rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <h2 className="text-[16px] font-bold text-neutral-900">
            Detail Transporter Tidak Aktif
          </h2>
          <button
            onClick={onClose}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
          >
            <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-3 flex items-center gap-4">
          <img
            src={transporter.logoUrl || "/icons/company-placeholder.svg"}
            alt={transporter.transporterName}
            className="h-12 w-12 rounded-full border border-neutral-300 object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-neutral-900">
              {transporter.transporterName}
            </div>
            <div className="mt-1 text-xs font-medium">
              <span className="text-error-400">Transporter Tidak Aktif</span>
            </div>
          </div>
        </div>
        <div className="mb-3 text-xs text-neutral-600">
          Transporter terdeteksi login namun tidak melakukan aktivitas apapun
          dalam waktu 30 menit terakhir, hubungi dan pastikan transporter masih
          aktif, himbau untuk kembali menggunakan platform.
        </div>
        <div className="mb-4 flex gap-8">
          <div>
            <div className="mb-1 text-xs text-neutral-600">
              Tanggal Terakhir Aktif
            </div>
            <div className="text-xs font-medium text-neutral-900">
              {transporter.lastActivity
                ? `${new Date(transporter.lastActivity).toLocaleString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Jakarta",
                    }
                  )} WIB`
                : "-"}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs text-neutral-600">
              Lama Tidak Aktif
            </div>
            <div className="text-xs font-medium text-neutral-900">
              {/* Example: 2 Jam, you can replace with actual duration logic if available */}
              {transporter.inactiveDuration || "2 Jam"}
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-between gap-3">
          <Button
            variant="muattrans-primary-secondary"
            className="h-8 w-full rounded-[24px] px-4 text-[14px] font-semibold"
            onClick={onHubungi}
          >
            Hubungi
          </Button>
          <Button
            variant="muattrans-warning"
            className="h-8 w-full rounded-[24px] px-4 text-[14px] font-semibold text-[#461B02]"
            onClick={onSelesaikan}
          >
            Selesaikan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailTransporterTidakAktif;
