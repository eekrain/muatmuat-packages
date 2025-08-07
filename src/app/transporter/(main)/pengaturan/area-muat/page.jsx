"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isEqual } from "lodash";
import { ChevronDown, Info } from "lucide-react";

import { Alert } from "@/components/Alert/Alert";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Checkbox from "@/components/Form/Checkbox";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import ProvinceSelectionModal from "@/components/Modal/ProvinceSelectionModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { SelectedProvinces } from "@/components/SelectedProvinces";
import LayoutOverlayButton from "@/container/Transporter/Pengaturan/LayoutOverlayButton";
import { toast } from "@/lib/toast";
import {
  useGetAreaMuatManage,
  useGetMasterProvinces,
} from "@/services/Transporter/pengaturan/getDataAreaMuat";
import { useSaveAreaMuat } from "@/services/Transporter/pengaturan/saveAreaMuatData";

export default function Page() {
  const router = useRouter();
  const transporterId = "transporter-123"; // Using a placeholder ID
  const [searchCity, setSearchCity] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [expandedProvinces, setExpandedProvinces] = useState({});
  const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // --- NEW: State for the leave confirmation modal ---
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialProvinces, setInitialProvinces] = useState([]);

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { trigger: saveAreaMuat, isMutating } = useSaveAreaMuat();
  const [localProvinces, setLocalProvinces] = useState([]);

  const { provinces, isLoading } = useGetAreaMuatManage({
    search: searchCity,
    showSelected: showSelectedOnly,
  });

  const {
    provinces: masterProvinces,
    isLoading: isLoadingMasterProvinces,
    searchProvinces,
  } = useGetMasterProvinces();

  useEffect(() => {
    if (provinces && provinces.length > 0) {
      const resetProvinces = provinces.map((province) => ({
        ...province,
        allSelected: province.allSelected || false,
        cities: province.cities.map((city) => ({
          ...city,
          isSelected: city.isSelected || false,
        })),
      }));
      setLocalProvinces(resetProvinces);
      // --- NEW: Store the initial state for later comparison ---
      setInitialProvinces(JSON.parse(JSON.stringify(resetProvinces)));
    }
  }, [provinces]);

  // --- NEW: Effect to check for unsaved changes ---
  useEffect(() => {
    // Use lodash's isEqual for a reliable deep comparison
    if (initialProvinces.length > 0) {
      const areStatesEqual = isEqual(initialProvinces, localProvinces);
      setHasUnsavedChanges(!areStatesEqual);
    }
  }, [localProvinces, initialProvinces]);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: "", type: "success" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // --- NEW: Handler for navigating away from the page ---
  const handleLeavePage = () => {
    if (hasUnsavedChanges) {
      setIsLeaveModalOpen(true);
    } else {
      router.back();
    }
  };

  const BREADCRUMB = [
    { name: "Pengaturan", href: "/pengaturan" },
    { name: "Atur Area Muat" },
  ];

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
    setIsProvinceModalOpen(false);
  };

  const handleSelectAllProvince = (provinceId, checked) => {
    setLocalProvinces((prevProvinces) =>
      prevProvinces.map((province) => {
        if (province.id === provinceId) {
          const updatedCities = province.cities.map((city) => ({
            ...city,
            isSelected: checked,
          }));
          return { ...province, allSelected: checked, cities: updatedCities };
        }
        return province;
      })
    );
  };

  const handleCitySelect = (provinceId, cityId, checked) => {
    setLocalProvinces((prevProvinces) =>
      prevProvinces.map((province) => {
        if (province.id === provinceId) {
          const updatedCities = province.cities.map((city) =>
            city.cityId === cityId ? { ...city, isSelected: checked } : city
          );
          const allSelected = updatedCities.every((city) => city.isSelected);
          return { ...province, allSelected, cities: updatedCities };
        }
        return province;
      })
    );
  };

  const handleToggleExpand = (provinceId) => {
    setExpandedProvinces((prev) => ({
      ...prev,
      [provinceId]: !prev[provinceId],
    }));
  };

  const handleSave = () => {
    const isAnyCitySelected = localProvinces.some((p) =>
      p.cities.some((c) => c.isSelected)
    );

    if (!isAnyCitySelected) {
      toast.error("Pilih minimal 1 Area Muat untuk menyimpan");
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const confirmSave = async () => {
    const payload = {
      transporterID: transporterId,
      confirmation: true,
      replaceExisting: true,
      areas: localProvinces
        .filter((province) => province.cities.some((city) => city.isSelected))
        .map((province) => ({
          areaName: province.province,
          city: province.cities
            .filter((city) => city.isSelected)
            .map((city) => city.cityName)
            .join(", "),
          province: province.province,
          isActive: true,
        })),
    };

    console.log("Saving Area Muat with payload:", payload);

    try {
      const result = await saveAreaMuat(payload);
      setIsConfirmModalOpen(false);
      // --- NEW: Reset unsaved changes tracking on successful save ---
      setHasUnsavedChanges(false);
      toast.success("Berhasil menyimpan Area Muat!");
      if (result?.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch (error) {
      setIsConfirmModalOpen(false);
      const apiErrors = error?.response?.data?.Data?.errors;
      if (apiErrors && apiErrors.length > 0) {
        apiErrors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("Gagal menyimpan data. Silakan coba lagi.");
      }
      console.error("Save failed:", error);
    }
  };

  const displayProvinces =
    localProvinces.length > 0 ? localProvinces : provinces;

  const searchFilteredProvinces = displayProvinces
    .map((province) => ({
      ...province,
      cities: province.cities.filter((city) =>
        city.cityName.toLowerCase().includes(searchCity.toLowerCase())
      ),
    }))
    .filter((province) => province.cities.length > 0);

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

  const simpanButton = (
    <Button
      size="lg"
      className="w-full md:w-auto"
      onClick={handleSave}
      isLoading={isMutating}
    >
      Simpan
    </Button>
  );

  return (
    <>
      <LayoutOverlayButton button={simpanButton}>
        <div className="mx-auto py-6">
          <BreadCrumb data={BREADCRUMB} />
          <div className="mt-4 flex items-center gap-2">
            {/* --- UPDATED: PageTitle now uses the leave handler --- */}
            <PageTitle withBack={true} onClick={handleLeavePage}>
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
              <SelectedProvinces
                className="mb-6"
                provinces={localProvinces.filter((province) =>
                  province.cities.some((city) => city.isSelected)
                )}
                onRemove={handleRemoveProvince}
                onAdd={handleAddProvince}
              />

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
                <div className="flex flex-col gap-y-[18px]">
                  {finalProvinces.map((province) => {
                    const isCollapsible =
                      province.cities.length > 16 && !showSelectedOnly;
                    const isExpanded = !!expandedProvinces[province.id];
                    const visibleCities =
                      isCollapsible && !isExpanded
                        ? province.cities.slice(0, 16)
                        : province.cities;

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
                                  {rowIndex <
                                    Math.ceil(visibleCities.length / 4) - 1 && (
                                    <div className="mt-4 border-b border-neutral-200"></div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>

                        {isCollapsible && (
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
                                className={`transform transition-transform duration-200 ${
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

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title={{
          text: "Apakah kamu yakin menyimpan data ini?",
          className: "text-sm font-medium text-center",
        }}
        confirm={{
          text: "Simpan",
          onClick: confirmSave,
          isLoading: isMutating,
        }}
        cancel={{
          text: "Batal",
          onClick: () => setIsConfirmModalOpen(false),
        }}
      />

      {/* --- NEW: Leave Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={isLeaveModalOpen}
        setIsOpen={setIsLeaveModalOpen}
        title={{
          text: "Area muat tidak akan tersimpan kalau kamu meninggalkan halaman ini",
          className: "text-sm font-medium text-center",
        }}
        cancel={{
          text: "Ya",
          variant: "destructive", // Use a destructive variant for a better UX
          onClick: () => router.back(), // Proceed to leave the page
        }}
        confirm={{
          text: "Batal",
          onClick: () => setIsLeaveModalOpen(false), // Stay on the page
        }}
      />

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
