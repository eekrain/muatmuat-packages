"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ChevronDown, Info } from "lucide-react";

import { Alert } from "@/components/Alert/Alert";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card, { CardContent } from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Checkbox from "@/components/Form/Checkbox";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ProvinceSelectionModal from "@/components/Modal/ProvinceSelectionModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { SelectedProvinces } from "@/components/SelectedProvinces";
import LayoutOverlayButton from "@/container/Transporter/Pengaturan/LayoutOverlayButton";
import {
  useGetAreaMuatManage,
  useGetMasterProvinces,
} from "@/services/Transporter/pengaturan/getDataAreaMuat";

export default function Page() {
  const router = useRouter();
  const [searchCity, setSearchCity] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [expandedProvinces, setExpandedProvinces] = useState({});
  const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Local state to manage checkbox selections
  const [localProvinces, setLocalProvinces] = useState([]);

  // Fetch area muat management data
  const { provinces, isLoading } = useGetAreaMuatManage({
    search: searchCity,
    showSelected: showSelectedOnly,
  });

  const {
    provinces: masterProvinces,
    isLoading: isLoadingMasterProvinces,
    searchProvinces,
  } = useGetMasterProvinces();

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

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: "", type: "success" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const BREADCRUMB = [
    { name: "Pengaturan", href: "/pengaturan" },
    { name: "Atur Area Muat" },
  ];

  // Handle remove province
  const handleRemoveProvince = (province) => {
    const selectedProvinces = localProvinces.filter((p) =>
      p.cities.some((c) => c.isSelected)
    );

    if (selectedProvinces.length <= 1) {
      setAlert({
        show: true,
        message:
          "Kamu tidak bisa menghapus provinsi terakhir. Minimal harus ada satu provinsi terpilih",
        type: "error",
      });
      return;
    }

    setLocalProvinces((prevProvinces) =>
      prevProvinces.map((p) => {
        if (p.id === province.id) {
          return {
            ...p,
            cities: p.cities.map((c) => ({ ...c, isSelected: false })),
            allSelected: false,
          };
        }
        return p;
      })
    );

    setAlert({
      show: true,
      message: `Berhasil menghapus provinsi ${province.province}`,
      type: "success",
    });
  };

  const handleAddProvince = () => {
    setIsProvinceModalOpen(true);
  };

  const handleSaveProvinces = (_selectedProvinces) => {
    // Logic to handle saved provinces from modal
    // console.log("Saved provinces:", selectedProvinces);
    setIsProvinceModalOpen(false);
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

  // Use localProvinces instead of provinces for rendering
  const displayProvinces =
    localProvinces.length > 0 ? localProvinces : provinces;

  // Filter provinces based on searchCity first, then apply showSelectedOnly filter
  const searchFilteredProvinces = displayProvinces
    .map((province) => {
      const cities = province.cities.filter((city) =>
        city.cityName.toLowerCase().includes(searchCity.toLowerCase())
      );

      return {
        ...province,
        cities,
      };
    })
    .filter((province) => province.cities.length > 0);

  // Only apply showSelectedOnly filter when there's no search term
  const finalProvinces = searchCity
    ? searchFilteredProvinces
    : showSelectedOnly
      ? searchFilteredProvinces.filter((province) =>
          province.cities.some((city) => city.isSelected)
        )
      : searchFilteredProvinces;

  const hasSelectedCities = displayProvinces
    .flatMap((p) => p.cities)
    .some((c) => c.isSelected);

  const alertIcons = {
    success: "/icons/success-circle.svg",
    error: "/icons/danger-circle.svg",
  };

  return (
    <>
      <LayoutOverlayButton>
        <div className="mx-auto py-6">
          <BreadCrumb data={BREADCRUMB} />
          <div className="mt-4 flex items-center gap-2">
            <PageTitle withBack={true} onClick={() => router.back()}>
              Atur Area Muat
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
              dengan lokasi pick up didalam area kerjamu
            </InfoTooltip>
          </div>

          <Card className="mt-6 !border-none">
            <CardContent className="p-6">
              {/* Selected Provinces Pills */}
              <SelectedProvinces
                className="mb-6"
                provinces={localProvinces.filter((province) =>
                  province.cities.some((city) => city.isSelected)
                )}
                onRemove={handleRemoveProvince}
                onAdd={handleAddProvince}
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
                    clear={() => setSearchCity("")}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={showSelectedOnly}
                    onChange={(e) => setShowSelectedOnly(e.checked)}
                    label=""
                    className="!gap-0"
                    disabled={
                      !hasSelectedCities || searchFilteredProvinces.length === 0
                    }
                  >
                    <span
                      className={`ms-2 text-sm font-normal leading-[16.8px] ${
                        !hasSelectedCities ||
                        searchFilteredProvinces.length === 0
                          ? "text-neutral-500"
                          : "text-neutral-900"
                      }`}
                    >
                      Tampilkan yang terpilih saja
                    </span>
                  </Checkbox>
                </div>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <span className="text-sm font-normal leading-[16.8px] text-neutral-600">
                    Loading...
                  </span>
                </div>
              ) : finalProvinces.length === 0 ? (
                <DataNotFound
                  title={
                    searchCity
                      ? "Keyword tidak ditemukan"
                      : "Belum ada area muat terpilih"
                  }
                  image={
                    searchCity
                      ? "/icons/data-not-found.svg"
                      : "/img/empty-state/area-muat.png"
                  }
                />
              ) : (
                /* Province Sections */
                <div className="flex flex-col gap-y-[18px]">
                  {finalProvinces.map((province) => {
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
                        {!showSelectedOnly &&
                          province.pagination?.hasMore &&
                          province.cities.length > 16 && (
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
                                  className={`transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
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
        </div>
      </LayoutOverlayButton>

      {alert.show && (
        <Alert
          variant={alert.type === "success" ? "secondary" : "error"}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="flex items-center">
            <IconComponent src={alertIcons[alert.type]} className="mr-2" />
            {alert.message}
            <button
              onClick={() => setAlert({ ...alert, show: false })}
              className="ml-4"
            >
              <IconComponent src="/icons/close-circle.svg" />
            </button>
          </div>
        </Alert>
      )}

      <ProvinceSelectionModal
        isOpen={isProvinceModalOpen}
        onClose={() => setIsProvinceModalOpen(false)}
        onSave={handleSaveProvinces}
        title="Tambah Provinsi"
        provinces={masterProvinces}
        isLoading={isLoadingMasterProvinces}
        onSearch={searchProvinces}
        saveContext="area-muat"
      />
    </>
  );
}
