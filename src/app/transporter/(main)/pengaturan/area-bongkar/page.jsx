"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ChevronDown, Info } from "lucide-react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import Checkbox from "@/components/Form/Checkbox";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import Input from "@/components/Form/Input";
import PageTitle from "@/components/PageTitle/PageTitle";
import { SelectedProvinces } from "@/components/SelectedProvinces";
import LayoutOverlayButton from "@/container/Transporter/Pengaturan/LayoutOverlayButton";
import { useGetAreaMuatManage } from "@/services/Transporter/pengaturan/getDataAreaMuat";

export default function Page() {
  const router = useRouter();
  const [searchCity, setSearchCity] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [expandedProvinces, setExpandedProvinces] = useState({});

  // Local state to manage checkbox selections
  const [localProvinces, setLocalProvinces] = useState([]);

  // Fetch area muat management data
  const { provinces, isLoading, totalProvinces, totalSelectedCities } =
    useGetAreaMuatManage({
      search: searchCity,
      showSelected: showSelectedOnly,
    });

  // Initialize local state when provinces data changes
  useEffect(() => {
    if (provinces && provinces.length > 0) {
      // Keep original selections from the API data
      const resetProvinces = provinces.map((province) => ({
        ...province,
        allSelected: province.allSelected || false,
        cities: province.cities.map((city) => ({
          ...city,
          isSelected: city.isSelected || false,
        })),
      }));
      setLocalProvinces(resetProvinces);
    }
  }, [provinces]);

  const BREADCRUMB = [
    { name: "Pengaturan", href: "/pengaturan" },
    { name: "Atur Area Bongkar" },
  ];

  // Handle remove province
  const handleRemoveProvince = (provinceId) => {
    console.log("Remove province:", provinceId);
  };

  // Handle select all for a province
  const handleSelectAllProvince = (provinceId, checked) => {
    setLocalProvinces((prevProvinces) =>
      prevProvinces.map((province) => {
        if (province.id === provinceId) {
          // Update all cities in the province
          const updatedCities = province.cities.map((city) => ({
            ...city,
            isSelected: checked,
          }));

          return {
            ...province,
            allSelected: checked,
            cities: updatedCities,
          };
        }
        return province;
      })
    );
  };

  // Handle individual city selection
  const handleCitySelect = (provinceId, cityId, checked) => {
    setLocalProvinces((prevProvinces) =>
      prevProvinces.map((province) => {
        if (province.id === provinceId) {
          const updatedCities = province.cities.map((city) =>
            city.cityId === cityId ? { ...city, isSelected: checked } : city
          );

          // Check if all cities are selected
          const allSelected = updatedCities.every((city) => city.isSelected);

          return {
            ...province,
            allSelected,
            cities: updatedCities,
          };
        }
        return province;
      })
    );
  };

  // Handle expand/collapse province
  const handleToggleExpand = (provinceId) => {
    setExpandedProvinces((prev) => ({
      ...prev,
      [provinceId]: !prev[provinceId],
    }));
  };

  const simpanButton = (
    <Button
      size="lg"
      className="w-full cursor-pointer md:w-auto"
      onClick={() => alert("Hello")}
    >
      Simpan
    </Button>
  );

  // Use localProvinces instead of provinces for rendering
  const displayProvinces =
    localProvinces.length > 0 ? localProvinces : provinces;

  // Filter provinces based on showSelectedOnly
  const filteredProvinces = showSelectedOnly
    ? displayProvinces
        .filter((province) => {
          // Only show provinces that have at least one selected city
          return province.cities.some((city) => city.isSelected);
        })
        .map((province) => {
          // For provinces with selected cities, only show the selected cities
          const selectedCities = province.cities.filter(
            (city) => city.isSelected
          );
          return {
            ...province,
            cities: selectedCities,
            selectedCityCount: selectedCities.length,
          };
        })
    : displayProvinces;

  return (
    <>
      <LayoutOverlayButton button={simpanButton}>
        <div className="mx-auto py-6">
          <BreadCrumb data={BREADCRUMB} />
          <div className="mt-4 flex items-center gap-2">
            <PageTitle withBack={true} onClick={() => router.back()}>
              Atur Area Bongkar
            </PageTitle>
            <InfoTooltip
              className="w-80"
              side="right"
              trigger={
                <button className="-mt-4 flex text-neutral-600 hover:text-neutral-800">
                  <Info size={18} />
                </button>
              }
            >
              Tentukan area kerja kamu agar pekerjaanmu menjadi lebih efektif
              dan efisien, muatrans hanya menawarkan permintaan jasa angkut
              dengan lokasi bongkar didalam area kerjamu
            </InfoTooltip>
          </div>

          <Card className="mt-6 !border-none">
            <CardContent className="p-6">
              {/* Selected Provinces Pills */}
              <SelectedProvinces
                className="mb-6"
                provinces={displayProvinces.filter((province) =>
                  province.cities.some((city) => city.isSelected)
                )}
                onRemove={handleRemoveProvince}
                onAdd={() => console.log("Add province")}
              />

              {/* Search and Filter */}
              <div className="mb-6 flex items-center">
                <div className="me-4">
                  <Input
                    placeholder="Cari Kota/Kabupaten"
                    icon={{ left: "/icons/search.svg" }}
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-[262px] text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={showSelectedOnly}
                    onChange={(e) => setShowSelectedOnly(e.checked)}
                    label=""
                    className="!gap-0"
                  />
                  <span className="text-sm font-normal leading-[16.8px] text-neutral-900">
                    Tampilkan yang terpilih saja
                  </span>
                </div>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <span className="text-sm font-normal leading-[16.8px] text-neutral-600">
                    Loading...
                  </span>
                </div>
              ) : (
                /* Province Sections */
                <div className="flex flex-col gap-y-[18px]">
                  {filteredProvinces.map((province) => {
                    const isExpanded =
                      showSelectedOnly ||
                      expandedProvinces[province.id] ||
                      province.expanded;
                    const visibleCities = isExpanded
                      ? province.cities
                      : province.cities.slice(
                          0,
                          province.pagination?.defaultShow || 12
                        );

                    // Calculate actual selected count from visible cities
                    const actualSelectedCount = showSelectedOnly
                      ? visibleCities.length
                      : visibleCities.filter((city) => city.isSelected).length;

                    return (
                      <div
                        key={province.id}
                        className="rounded-lg border border-neutral-200 p-6"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-base font-bold leading-[19.2px] text-neutral-900">
                            {province.province}{" "}
                            <span className="text-sm font-normal leading-[16.8px] text-neutral-600">
                              ({actualSelectedCount} Terpilih)
                            </span>
                          </h3>
                        </div>

                        {/* Select All Checkbox */}
                        <div className="mb-4 flex items-center gap-3">
                          <Checkbox
                            checked={
                              visibleCities.length > 0 &&
                              visibleCities.every((city) => city.isSelected)
                            }
                            onChange={(e) =>
                              handleSelectAllProvince(province.id, e.checked)
                            }
                            label=""
                            className="!gap-0"
                          />
                          <span className="text-sm font-medium leading-[16.8px] text-neutral-900">
                            Pilih Semua Kota/Kabupaten
                          </span>
                        </div>

                        {/* Cities Grid */}
                        <div className="ms-5 space-y-4">
                          {Array.from(
                            { length: Math.ceil(visibleCities.length / 4) },
                            (_, rowIndex) => {
                              const startIndex = rowIndex * 4;
                              const rowCities = visibleCities.slice(
                                startIndex,
                                startIndex + 4
                              );

                              return (
                                <div key={rowIndex}>
                                  <div className="grid grid-cols-4 gap-4">
                                    {rowCities.map((city) => (
                                      <div
                                        key={city.cityId}
                                        className="flex items-center gap-3"
                                      >
                                        <Checkbox
                                          checked={city.isSelected}
                                          onChange={(e) =>
                                            handleCitySelect(
                                              province.id,
                                              city.cityId,
                                              e.checked
                                            )
                                          }
                                          label=""
                                          className="!gap-0"
                                        />
                                        <span className="text-sm font-normal leading-[16.8px] text-neutral-900">
                                          {city.cityName}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  {/* Add border line after every row except the last one */}
                                  {rowIndex <
                                    Math.ceil(visibleCities.length / 4) - 1 && (
                                    <div className="mt-4 border-b border-neutral-200"></div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>

                        {/* Show More Link */}
                        {!showSelectedOnly && province.pagination?.hasMore && (
                          <div className="mt-4 text-center">
                            <button
                              onClick={() => handleToggleExpand(province.id)}
                              className="inline-flex items-center gap-1 text-sm font-medium leading-[16.8px] text-blue-600 hover:text-blue-800"
                            >
                              {isExpanded
                                ? "Lihat Lebih Sedikit"
                                : "Lihat Selengkapnya"}
                              <ChevronDown
                                size={16}
                                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="fixed bottom-6 right-6">
            <Button
              variant="muattrans-primary"
              className="h-12 rounded-full px-8 shadow-lg"
              onClick={() => console.log("Save area bongkar")}
            >
              Simpan
            </Button>
          </div>
        </div>
      </LayoutOverlayButton>
    </>
  );
}
