"use client";

import { useState } from "react";

import Search from "@/components/Search/Search";
import { Select } from "@/components/Select";
import { useTranslation } from "@/hooks/use-translation";

const FleetSelector = ({
  value,
  onValueChange,
  disabled = false,
  isError = false,
  placeholder = "Pilih Armada",
  fleetOptions = [],
  className = "",
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter fleet options based on search term
  const filteredFleetOptions = fleetOptions.filter((fleet) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      fleet.licensePlate.toLowerCase().includes(searchLower) ||
      fleet.driverName.toLowerCase().includes(searchLower)
    );
  });

  // Get selected fleet details for display
  const getSelectedFleetDisplay = () => {
    const selected = fleetOptions.find((f) => f.id === value);
    if (!selected) return null;
    return `${selected.licensePlate} - ${selected.driverName}`;
  };

  return (
    <div className="relative w-full">
      <Select.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <Select.Trigger
          placeholder={placeholder}
          className={`h-8 w-full text-xs ${className}`}
          isError={isError}
        >
          <Select.Value>
            {getSelectedFleetDisplay() ||
              t("FleetSelector.placeholder", {}, "Pilih Armada")}
          </Select.Value>
        </Select.Trigger>
        <Select.Content maxHeight="330px" className="overflow-hidden">
          {/* Search Component */}
          <div className="sticky top-0 z-10 bg-white p-3">
            <Search
              placeholder={t(
                "FleetSelector.searchPlaceholder",
                {},
                "Cari No. Polisi / Driver"
              )}
              onSearch={setSearchTerm}
              autoSearch={true}
              containerClassName="w-full"
              inputClassName="h-8"
            />
          </div>

          {/* Fleet Options */}
          <div className="max-h-[300px] overflow-y-auto">
            {/* Case: No data from the backend */}
            {fleetOptions.length === 0 ? (
              <div className="font-meduim py-5 text-center text-xs text-neutral-900">
                {t(
                  "FleetSelector.noFleetAvailable",
                  {},
                  "Belum ada armada pengganti yang tersedia."
                )}{" "}
                <br />{" "}
                {t(
                  "FleetSelector.addSuitableFleet",
                  {},
                  "Tambahkan armada yang sesuai untuk dapat menampilkan armada pengganti."
                )}
              </div>
            ) : // Case: No matching results after filtering
            filteredFleetOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-900">
                {t("FleetSelector.dataNotFound", {}, "Data Tidak Ditemukan")}
              </div>
            ) : (
              // Case: Display filtered results
              filteredFleetOptions.map((fleet) => (
                <Select.Item
                  key={fleet.id}
                  value={fleet.id}
                  className="py-3 hover:bg-neutral-200"
                >
                  <div className="flex flex-col gap-1 pr-2">
                    <div className="line-clamp-1 flex-shrink-0 break-all text-xs font-semibold">
                      {fleet.licensePlate} - {fleet.driverName}
                    </div>
                    <div className="line-clamp-1 text-xs font-medium">
                      {fleet.vehicleType}
                    </div>
                    {fleet.isRecommended && (
                      <div className="text-xs font-bold text-success-400">
                        {t("FleetSelector.recommendation", {}, "Rekomendasi")}{" "}
                        <span className="font-semibold">
                          ({fleet.recommendationText})
                        </span>
                      </div>
                    )}
                    {fleet.hasOverload && (
                      <span className="text-xxs font-semibold text-error-400">
                        {t(
                          "FleetSelector.potentialOverload",
                          {},
                          "Potensi Overload"
                        )}
                      </span>
                    )}
                  </div>
                </Select.Item>
              ))
            )}
          </div>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default FleetSelector;
