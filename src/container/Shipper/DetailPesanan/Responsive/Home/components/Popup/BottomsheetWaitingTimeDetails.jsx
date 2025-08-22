import { useState } from "react";

import { Alert } from "@/components/Alert/Alert";
import {
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

/**
 * Fungsi pembantu untuk memformat angka menjadi format mata uang Rupiah (IDR).
 * @param {number} amount - Jumlah uang yang akan diformat.
 * @returns {string} String yang telah diformat sebagai mata uang.
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Komponen BottomSheet untuk menampilkan detail waktu tunggu driver dengan expandable sections.
 */
const BottomsheetWaitingTimeDetails = () => {
  const { t } = useTranslation();
  // State untuk mengontrol expanded state setiap driver
  const [expandedDrivers, setExpandedDrivers] = useState({});

  // Data driver - bisa dijadikan props jika diperlukan
  const driverData = [
    {
      id: 1,
      name: "Noel Gallagher",
      location: "Lokasi Muat",
      duration: "0 Jam 59 Menit",
      cost: 100000,
      dateRange: "06 jun 2024 17:01 WIB s/d 06 jun 2024 18:00 WIB",
    },
    {
      id: 2,
      name: "Bagus Dharmawan",
      location: "Lokasi Muat",
      duration: "0 Jam 55 Menit",
      cost: 100000,
      dateRange: "06 jun 2024 17:05 WIB s/d 06 jun 2024 18:00 WIB",
    },
    {
      id: 3,
      name: "Ragil Poetra",
      location: "Lokasi Muat",
      duration: "0 Jam 52 Menit",
      cost: 100000,
      dateRange: "06 jun 2024 17:05 WIB s/d 06 jun 2024 18:00 WIB",
    },
  ];

  // Fungsi untuk toggle expanded state
  const toggleExpanded = (driverId) => {
    setExpandedDrivers((prev) => ({
      ...prev,
      [driverId]: !prev[driverId],
    }));
  };

  // Fungsi untuk menghitung total
  const calculateTotal = () => {
    return driverData.reduce((total, driver) => total + driver.cost, 0);
  };

  return (
    <BottomSheetContent>
      {/* Header BottomSheet dengan tombol tutup dan judul */}
      <BottomSheetHeader>
        <div className="relative flex h-full w-full items-center">
          <BottomSheetClose asChild>
            <button
              className="absolute left-0 rounded-full p-1 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              aria-label={t(
                "BottomsheetWaitingTimeDetails.ariaLabelCloseDetail",
                {},
                "Tutup detail waktu tunggu"
              )}
            >
              <IconComponent
                src="/icons/close-x.svg"
                width={24}
                height={24}
                className="text-neutral-900"
              />
            </button>
          </BottomSheetClose>
          <BottomSheetTitle className="mx-auto text-base font-bold text-neutral-900">
            {t(
              "BottomsheetWaitingTimeDetails.title",
              {},
              "Detail Waktu Tunggu"
            )}
          </BottomSheetTitle>
        </div>
      </BottomSheetHeader>

      {/* Konten Utama */}
      <div className="p-4">
        {/* Alert Peringatan */}
        <Alert variant="warning" className="mb-6 flex items-center gap-2">
          <IconComponent
            src="/icons/warning-filled.svg"
            width={20}
            height={20}
            className="flex-shrink-0 text-warning-500"
          />
          <p className="text-xs font-medium text-neutral-900">
            {t(
              "BottomsheetWaitingTimeDetails.warningFreeHours",
              {},
              "FREE untuk 12 jam awal dan dikenakan biaya waktu tunggu lebih dari 12 jam"
            )}
          </p>
        </Alert>

        {/* Detail Driver dengan Expandable Sections */}
        <div className="space-y-4">
          {driverData.map((driver) => (
            <div key={driver.id} className="border-b border-neutral-300 pb-2">
              {/* Driver Header - Clickable untuk expand/collapse */}
              <div
                className="flex cursor-pointer items-center justify-between py-2"
                onClick={() => toggleExpanded(driver.id)}
              >
                <div className="flex-1">
                  <h3 className="mb-1 text-base font-semibold text-neutral-900">
                    {t(
                      "BottomsheetWaitingTimeDetails.driverLabel",
                      { driverName: driver.name },
                      "Driver: {driverName}"
                    )}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {expandedDrivers[driver.id]
                      ? ""
                      : t(
                          "BottomsheetWaitingTimeDetails.totalDuration",
                          { duration: driver.duration },
                          "Durasi Total: {duration}"
                        )}
                  </p>
                </div>

                {/* Chevron Icon */}
                <button
                  className="rounded-full hover:bg-neutral-100"
                  aria-label={
                    expandedDrivers[driver.id]
                      ? t(
                          "BottomsheetWaitingTimeDetails.ariaLabelCloseDetail",
                          {},
                          "Tutup detail"
                        )
                      : t(
                          "BottomsheetWaitingTimeDetails.ariaLabelOpenDetail",
                          {},
                          "Buka detail"
                        )
                  }
                >
                  <IconComponent
                    src="/icons/chevron-down.svg"
                    width={20}
                    height={20}
                    className={`text-neutral-600 transition-transform duration-200 ${
                      expandedDrivers[driver.id] ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Expandable Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedDrivers[driver.id]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-1 rounded-lg bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-900">
                      {driver.location}: {driver.duration}
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {formatCurrency(driver.cost)}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-600">
                    {driver.dateRange}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Keseluruhan */}
        <div className="mt-6 flex items-center justify-between border-neutral-200 py-2">
          <span className="text-base font-bold text-neutral-900">
            {t("BottomsheetWaitingTimeDetails.totalLabel", {}, "Total")}
          </span>
          <span className="text-base font-bold text-neutral-900">
            {formatCurrency(calculateTotal())}
          </span>
        </div>
      </div>
    </BottomSheetContent>
  );
};

export default BottomsheetWaitingTimeDetails;
