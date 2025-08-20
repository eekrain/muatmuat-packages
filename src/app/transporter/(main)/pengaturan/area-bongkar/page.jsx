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

  // Search area bongkar functionality
  const {
    unloadingAreas: searchResults,
    found: searchFound,
    isLoading: isSearchLoading,
    keyword: searchResponseKeyword,
    pagination: searchPagination,
  } = useSearchAreaBongkar({
    keyword: searchKeyword,
    page: 1,
    limit: 10,
  });

  // Fetch area bongkar management data
  const { provinces, isLoading } = useGetAreaBongkarManage({
    search: searchCity,
    showSelected: showSelectedOnly,
  });

  // Fetch master provinsi data for reference (can be used for province selection popup)
  const { provinsi: masterProvinsi, isLoading: isLoadingMasterProvinsi } =
    useGetMasterProvinsi({
      search: "", // Can be used for province search in popup
      page: 1,
      limit: 50,
      excludeSelected: false,
    });

  // Get selected province IDs for fetching kota/kabupaten
  const selectedProvinceIds =
    provinces
      ?.filter((province) => province.cities?.some((city) => city.isSelected))
      ?.map((province) => province.id)
      ?.join(",") || "";

  // Fetch master kota/kabupaten data based on selected provinces
  const {
    cities: masterKotaKabupaten,
    isLoading: isLoadingMasterKotaKabupaten,
  } = useGetMasterKotaKabupaten({
    provinceIds: selectedProvinceIds,
    search: searchCity,
    selectedOnly: showSelectedOnly,
    page: 1,
    limit: 50,
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

      // Show confirmation dialog
      const confirmDelete = confirm(
        `Apakah kamu yakin ingin menghapus provinsi ${provinceName} dari area bongkar?`
      );
      if (!confirmDelete) {
        return;
      }

      const result = await deleteProvinsiAreaBongkar(provinceId);

      if (result.deleted) {
        alert(
          `Berhasil menghapus ${result.deletedProvinsiName || provinceName} dari area bongkar. Sisa ${result.remainingProvinsi} provinsi.`
        );

        // Remove province from local state
        setLocalProvinces((prevProvinces) =>
          prevProvinces.filter((province) => province.id !== provinceId)
        );

        console.log("Delete result:", result);
      } else {
        alert("Gagal menghapus provinsi dari area bongkar");
      }
    } catch (error) {
      console.error("Delete province error:", error);

      // Parse error message if it's a JSON string
      try {
        const errorData = JSON.parse(error.message);
        alert(
          errorData.Message?.Text || "Terjadi kesalahan saat menghapus provinsi"
        );
      } catch {
        alert("Terjadi kesalahan saat menghapus provinsi");
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
        alert(
          errorData.Message?.Text || "Terjadi kesalahan saat mengupdate pilihan"
        );
      } catch {
        alert("Terjadi kesalahan saat mengupdate pilihan");
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
        alert("Pilih minimal 1 provinsi");
        return;
      }

      // Validate each province has at least one selected city
      for (const province of selectedProvinces) {
        const selectedCities = province.cities.filter(
          (city) => city.isSelected
        );
        if (selectedCities.length === 0) {
          alert(
            `Pilih minimal 1 kota/kabupaten untuk provinsi ${province.province}`
          );
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
        alert(
          `Berhasil menyimpan area bongkar: ${result.totalProvinces} provinsi, ${result.totalKota} kota/kabupaten`
        );
        console.log("Save result:", result);
      } else {
        alert("Gagal menyimpan area bongkar");
      }
    } catch (error) {
      console.error("Save error:", error);

      // Parse error message if it's a JSON string
      try {
        const errorData = JSON.parse(error.message);
        alert(errorData.Message?.Text || "Terjadi kesalahan saat menyimpan");
      } catch {
        alert("Terjadi kesalahan saat menyimpan area bongkar");
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
                  alert(
                    "Fitur modal pemilihan provinsi akan segera diimplementasikan"
                  );
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
                              alert(
                                `Fitur menambah ${result.provinceName} akan segera tersedia`
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
