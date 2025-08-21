import { X } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";

function AlertPerubahanLokasi() {
  return (
    <div className="flex items-center justify-between gap-1 bg-secondary-100 px-4 py-2 text-xs">
      <div className="flex items-center gap-1">
        <IconComponent src={"/icons/warning16.svg"} className="h-4 w-4" />
        Terdapat perubahan lokasi muat dan jam muat pada 2 pesanan.
        {/* masih perlu penyesuaian kondisi */}
        {true ? (
          <button
            className="cursor-pointer font-medium text-primary-700"
            onClick={() => alert("Lihat Pesanan")}
          >
            Lihat Pesanan
          </button>
        ) : (
          <button
            className="cursor-pointer font-medium text-primary-700"
            onClick={() => alert("Kembali ke default Pesanan")}
          >
            Kembali Ke Default
          </button>
        )}
      </div>
      <button onClick={() => alert("close alert perubahan")}>
        <X className="h-[14px] w-[14px] text-primary-700" />
      </button>
    </div>
  );
}

export default AlertPerubahanLokasi;
