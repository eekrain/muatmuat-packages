"use client";

import { useTranslation } from "@/hooks/use-translation";

const RiwayatTab = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-[500px] items-center justify-center rounded-lg bg-white p-4 text-center text-neutral-500 shadow-md">
      <p>
        {t(
          "daftarPesanan.historyTabPlaceholder",
          {},
          "Konten Riwayat akan diimplementasikan oleh developer lain."
        )}
      </p>
    </div>
  );
};

export default RiwayatTab;
