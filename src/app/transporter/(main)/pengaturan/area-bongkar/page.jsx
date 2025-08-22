"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
import { useDebounce } from "@/hooks/use-debounce";
import {
  deleteProvinsiAreaBongkar,
  saveAreaBongkar,
  updateAreaBongkarSelection,
  useGetAreaBongkarManage,
  useGetMasterKotaKabupaten,
  useGetMasterProvinsi,
} from "@/services/Transporter/pengaturan/getDataAreaBongkar";
import { useSearchAreaBongkar } from "@/services/Transporter/pengaturan/searchAreaBongkar";

export default function Page() {
  const router = useRouter();
  const [searchCity, setSearchCity] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [expandedProvinces, setExpandedProvinces] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Local state to manage checkbox selections
  const [localProvinces, setLocalProvinces] = useState([]);

  // Debounce search city to prevent excessive API calls
  const debouncedSearchCity = useDebounce(searchCity, 500);

  // Stabilize search parameters to prevent unnecessary API calls
  const searchParams = useMemo(() => {
    if (!searchKeyword || searchKeyword.trim().length === 0) return null;
    return {
      q: searchKeyword,
      page: 1,
      limit: 10,
    };
  }, [searchKeyword]);

  // Search area bongkar functionality - only fetch when keyword is not empty
  const {
    unloadingAreas: searchResults,
    found: searchFound,
    isLoading: isSearchLoading,
    keyword: searchResponseKeyword,
    pagination: searchPagination,
  } = useSearchAreaBongkar(searchParams);

  // Fetch area bongkar management data
  const { provinces, isLoading } = useGetAreaBongkarManage(
    {
      search: debouncedSearchCity,
      showSelected: showSelectedOnly,
    },
    { enabled: true } // Always enabled for main data
  );

  // Fetch master provinsi data for reference (only when needed for province selection popup)
  const { provinsi: masterProvinsi, isLoading: isLoadingMasterProvinsi } =
    useGetMasterProvinsi(
      {
        search: "", // Can be used for province search in popup
        page: 1,
        limit: 50,
        excludeSelected: false,
      },
      { enabled: false } // Disabled by default, enable when province selection modal is needed
    );

  // Get selected province IDs for fetching kota/kabupaten
  // Use stable reference to prevent unnecessary recalculations
  const selectedProvinceIds = useMemo(() => {
    if (!provinces || provinces.length === 0) return "";

    const ids =
      provinces
        .filter((province) => province.cities?.some((city) => city.isSelected))
        .map((province) => province.id)
        .join(",") || "";

    return ids;
  }, [provinces]);

  // Determine if master kota/kabupaten should be fetched
  // Only when provinces exist and we need to filter or search cities
  const shouldFetchMasterKotaKabupaten = useMemo(() => {
    return (
      selectedProvinceIds.length > 0 &&
      (debouncedSearchCity.length > 0 || showSelectedOnly)
    );
  }, [selectedProvinceIds, debouncedSearchCity, showSelectedOnly]);

  // Fetch master kota/kabupaten data based on selected provinces
  // Only enabled when there are selected provinces and search/filter is needed
  const {
    cities: masterKotaKabupaten,
    isLoading: isLoadingMasterKotaKabupaten,
  } = useGetMasterKotaKabupaten(
    {
      provinceIds: selectedProvinceIds,
      search: debouncedSearchCity,
      selectedOnly: showSelectedOnly,
      page: 1,
      limit: 50,
    },
    {
      enabled: shouldFetchMasterKotaKabupaten,
    }
  );

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

  // Log master data for demonstration
  useEffect(() => {
    if (masterProvinsi && masterProvinsi.length > 0) {
      // Master Provinsi data loaded
    }
  }, [masterProvinsi]);

  useEffect(() => {
    if (masterKotaKabupaten && masterKotaKabupaten.length > 0) {
      // Master Kota/Kabupaten data loaded
    }
  }, [masterKotaKabupaten]);

  const BREADCRUMB = [
    { name: "Pengaturan", href: "/pengaturan" },
    { name: "Atur Area Bongkar" },
  ];

  // Handle remove province
  const handleRemoveProvince = async (provinceId) => {
    try {
      setIsDeleting(true);

      // Find province name for confirmation
      const province = localProvinces.find((p) => p.id === provinceId);
      const provinceName = province?.province || "provinsi ini";

      // TODO: Replace with proper confirmation modal instead of browser confirm
      // For now, proceed with deletion

      const result = await deleteProvinsiAreaBongkar(provinceId);

      if (result.deleted) {
        // TODO: Replace with toast notification instead of alert
        console.log("Delete result:", result);

        // Remove province from local state
        setLocalProvinces((prevProvinces) =>
          prevProvinces.filter((province) => province.id !== provinceId)
        );
      } else {
        // TODO: Replace with toast notification instead of alert
        console.error("Failed to delete province");
      }
    } catch (error) {
      console.error("Delete province error:", error);

      // Parse error message if it's a JSON string
      try {
        const errorData = JSON.parse(error.message);
        console.error(
          "Delete province error:",
          errorData.Message?.Text || "Terjadi kesalahan saat menghapus provinsi"
        );
      } catch {
        console.error("Delete province error:", error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle select all for a province
  const handleSelectAllProvince = async (provinceId, checked) => {
    try {
      // Update local state first for immediate UI feedback
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

      // Sync with backend
      const province = localProvinces.find((p) => p.id === provinceId);
      if (province) {
        const updatedCities = province.cities.map((city) => ({
          kotaId: city.cityId,
          kotaName: city.cityName,
          isSelected: checked,
        }));

        await updateAreaBongkarSelection(provinceId, { cities: updatedCities });
      }
    } catch (error) {
      // Error updating province selection
      // Revert local state on error
      setLocalProvinces((prevProvinces) =>
        prevProvinces.map((province) => {
          if (province.id === provinceId) {
            const revertedCities = province.cities.map((city) => ({
              ...city,
              isSelected: !checked,
            }));

            return {
              ...province,
              allSelected: !checked,
              cities: revertedCities,
            };
          }
          return province;
        })
      );

      // Parse and show error message
      try {
        const errorData = JSON.parse(error.message);
        alert(
          errorData.Message?.Text || "Terjadi kesalahan saat mengupdate pilihan"
        );
      } catch {
        alert("Terjadi kesalahan saat mengupdate pilihan");
      }
    }
  };

  // Handle individual city selection
  const handleCitySelect = async (provinceId, cityId, checked) => {
    try {
      // Update local state first for immediate UI feedback
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

      // Sync with backend
      const province = localProvinces.find((p) => p.id === provinceId);
      if (province) {
        const updatedCities = province.cities.map((city) => ({
          kotaId: city.cityId,
          kotaName: city.cityName,
          isSelected: city.cityId === cityId ? checked : city.isSelected,
        }));

        await updateAreaBongkarSelection(provinceId, { cities: updatedCities });
      }
    } catch (error) {
      // Error updating city selection
      // Revert local state on error
      setLocalProvinces((prevProvinces) =>
        prevProvinces.map((province) => {
          if (province.id === provinceId) {
            const revertedCities = province.cities.map((city) =>
              city.cityId === cityId ? { ...city, isSelected: !checked } : city
            );

            const allSelected = revertedCities.every((city) => city.isSelected);

            return {
              ...province,
              allSelected,
              cities: revertedCities,
            };
          }
          return province;
        })
      );

      // Parse and show error message
      try {
        const errorData = JSON.parse(error.message);
        console.error(
          "Update city selection error:",
          errorData.Message?.Text || "Terjadi kesalahan saat mengupdate pilihan"
        );
      } catch {
        console.error("Update city selection error:", error);
      }
    }
  };

  // Handle expand/collapse province
  const handleToggleExpand = (provinceId) => {
    setExpandedProvinces((prev) => ({
      ...prev,
      [provinceId]: !prev[provinceId],
    }));
  };

  // Handle save area bongkar
  const handleSaveAreaBongkar = async () => {
    try {
      setIsSaving(true);

      // Transform local provinces data to API format
      const selectedProvinces = localProvinces.filter((province) =>
        province.cities.some((city) => city.isSelected)
      );

      if (selectedProvinces.length === 0) {
        // TODO: Replace with toast notification instead of alert
        console.error("No provinces selected");
        return;
      }

      // Validate each province has at least one selected city
      for (const province of selectedProvinces) {
        const selectedCities = province.cities.filter(
          (city) => city.isSelected
        );
        if (selectedCities.length === 0) {
          // TODO: Replace with toast notification instead of alert
          console.error(`No cities selected for province ${province.province}`);
          return;
        }
      }

      const unloadingAreas = selectedProvinces.map((province) => ({
        provinceId: province.id,
        provinceName: province.province,
        cities: province.cities
          .filter((city) => city.isSelected)
          .map((city) => ({
            cityId: city.cityId,
            cityName: city.cityName,
          })),
      }));

      const result = await saveAreaBongkar({ unloadingAreas });

      if (result.saved) {
        // TODO: Replace with toast notification instead of alert
        console.log("Save result:", result);
      } else {
        // TODO: Replace with toast notification instead of alert
        console.error("Failed to save area bongkar");
      }
    } catch (error) {
      console.error("Save error:", error);

      // Parse error message if it's a JSON string
      try {
        const errorData = JSON.parse(error.message);
        console.error(
          "Save error:",
          errorData.Message?.Text || "Terjadi kesalahan saat menyimpan"
        );
      } catch {
        console.error("Save error:", error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const simpanButton = (
    <Button
      size="lg"
      className="w-full cursor-pointer md:w-auto"
      onClick={handleSaveAreaBongkar}
      disabled={isSaving}
    >
      {isSaving ? "Menyimpan..." : "Simpan"}
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
                onAdd={() => {
                  console.log("Open province selection modal");
                  // alert(
                  //   "Fitur modal pemilihan provinsi akan segera diimplementasikan"
                  // );
                }}
                isDeleting={isDeleting}
              />

              {/* Search and Filter */}
              <div className="mb-6 flex items-center">
                <div className="me-4">
                  <Input
                    placeholder="Cari Provinsi/Area"
                    icon={{ left: "/icons/search.svg" }}
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    className="w-[262px] text-sm"
                  />
                </div>
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

              {/* Search Results */}
              {showSearchResults && searchKeyword && (
                <div className="mb-6">
                  <h4 className="mb-4 text-sm font-medium text-neutral-900">
                    Hasil Pencarian &quot;{searchKeyword}&quot;{" "}
                    {searchFound && `(${searchResults?.length || 0} ditemukan)`}
                  </h4>
                  {isSearchLoading ? (
                    <div className="flex h-[100px] items-center justify-center rounded-lg border border-neutral-200">
                      <span className="text-sm text-neutral-600">
                        Mencari...
                      </span>
                    </div>
                  ) : searchFound && searchResults?.length > 0 ? (
                    <div className="space-y-3 rounded-lg border border-neutral-200 p-4">
                      {searchResults.map((result) => (
                        <div
                          key={result.provinceId}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <span
                              className="text-sm font-medium text-neutral-900"
                              dangerouslySetInnerHTML={{
                                __html: result.highlightedName,
                              }}
                            />
                            <p className="text-xs text-neutral-600">
                              {result.displayText}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Province added to selection
                              // TODO: Implement add province logic
                              console.log(
                                `Add province ${result.provinceName} - feature coming soon`
                              );
                            }}
                          >
                            Tambah
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-[100px] items-center justify-center rounded-lg border border-neutral-200">
                      <span className="text-sm text-neutral-600">
                        Tidak ada hasil untuk &quot;{searchKeyword}&quot;
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isLoading || isLoadingMasterKotaKabupaten ? (
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

                    // Calculate actual selected count from ALL cities in province
                    const actualSelectedCount = province.cities.filter(
                      (city) => city.isSelected
                    ).length;

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
                              province.cities.length > 0 &&
                              province.cities.every((city) => city.isSelected)
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
                                ? "Sembunyikan"
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
              onClick={handleSaveAreaBongkar}
              disabled={isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </LayoutOverlayButton>
    </>
  );
}
