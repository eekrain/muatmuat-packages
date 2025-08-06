"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Checkbox from "@/components/Form/Checkbox";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { InputSearch } from "@/components/InputSearch/InputSearch";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { CargoSelection } from "@/container/Transporter/Pengaturan/CargoSelection";
import LayoutOverlayButton from "@/container/Transporter/Pengaturan/LayoutOverlayButton";
import { toast } from "@/lib/toast";
import { useGetMasterCargo } from "@/services/Transporter/pengaturan/getMasterCargoData";
import { useSaveTransporterCargoConfig } from "@/services/Transporter/pengaturan/saveCargoConfigData";

export default function AturMuatanDilayaniPage() {
  const router = useRouter();
  const { data: apiData, isLoading, error } = useGetMasterCargo();
  const { trigger: saveCargo, isMutating } = useSaveTransporterCargoConfig();

  const [selectedItems, setSelectedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleItemChange = (id) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategoryChange = (itemIds, shouldSelect) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev };
      itemIds.forEach((id) => {
        newSelected[id] = shouldSelect;
      });
      return newSelected;
    });
  };

  const handleSelectAllForHierarchy = (itemIdsToToggle) => {
    const isEverythingSelected = itemIdsToToggle.every(
      (id) => selectedItems[id]
    );
    setSelectedItems((prev) => {
      const newSelected = { ...prev };
      itemIdsToToggle.forEach((id) => {
        newSelected[id] = !isEverythingSelected;
      });
      return newSelected;
    });
  };

  const processedHierarchies = useMemo(() => {
    if (!apiData?.cargoHierarchy) return [];

    return apiData.cargoHierarchy.map((hierarchy) => {
      const allCargoIdsInHierarchy = hierarchy.categories.flatMap((cat) =>
        cat.cargoNames.map((cn) => cn.cargoNameId)
      );

      const selectedCount = allCargoIdsInHierarchy.filter(
        (id) => selectedItems[id]
      ).length;

      const isAllSelected =
        allCargoIdsInHierarchy.length > 0 &&
        selectedCount === allCargoIdsInHierarchy.length;

      const isIndeterminate = selectedCount > 0 && !isAllSelected;

      const filteredCategories = hierarchy.categories
        .map((category) => ({
          id: category.cargoCategoryId,
          name: category.cargoCategoryName,
          items: category.cargoNames
            .map((cn) => ({ id: cn.cargoNameId, name: cn.name }))
            .filter(
              (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (!showSelectedOnly || selectedItems[item.id])
            ),
        }))
        .filter((category) => category.items.length > 0);

      return {
        id: hierarchy.cargoTypeId,
        cargoTypeName: hierarchy.cargoTypeName,
        filteredCategories,
        selectedCount,
        isAllSelected,
        isIndeterminate,
        onSelectAll: () => handleSelectAllForHierarchy(allCargoIdsInHierarchy),
      };
    });
  }, [apiData, searchTerm, showSelectedOnly, selectedItems]);

  const totalSelectedCount = Object.keys(selectedItems).filter(
    (k) => selectedItems[k]
  ).length;

  const isCheckboxDisabled = totalSelectedCount === 0;

  const handleSave = () => {
    if (totalSelectedCount === 0) {
      toast.error("Pilih minimal 1 Muatan untuk menyimpan");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const confirmSave = async () => {
    const cargoTypeIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

    const payload = {
      cargoTypeIds,
      notes: "Konfigurasi muatan untuk layanan reguler",
      effectiveDate: new Date().toISOString(),
    };

    try {
      await saveCargo(payload);
      setIsConfirmModalOpen(false);
      toast.success("Berhasil menyimpan muatan yang dilayani!");
      router.push("/pengaturan");
    } catch (err) {
      console.error("Failed to save cargo configuration:", err);
      setIsConfirmModalOpen(false);
      toast.error("Ada ganguan server coba lagi nanti");
    }
  };

  const breadcrumbItems = [
    { name: "Pengaturan", href: "/pengaturan" },
    { name: "Atur Muatan Dilayani" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingStatic />
      </div>
    );
  }

  if (error || !apiData) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <DataEmpty
          title="Gagal Memuat Data"
          message="Terjadi kesalahan saat mengambil data muatan."
        />
      </div>
    );
  }

  const showNotFound =
    processedHierarchies.every((h) => h.filteredCategories.length === 0) &&
    searchTerm;

  const simpanButton = (
    <Button
      size="lg"
      className="w-full cursor-pointer md:w-auto"
      onClick={() => alert("Hello")}
      isLoading={isMutating}
    >
      Simpan
    </Button>
  );

  return (
    <>
      <LayoutOverlayButton button={simpanButton}>
        <div className="mb-6">
          <BreadCrumb data={breadcrumbItems} />
        </div>
        <div className="flex flex-row gap-2">
          <PageTitle>Atur Muatan Dilayani</PageTitle>
          <InfoTooltip>
            Atur muatan yang kamu layani sekarang untuk mendapatkan muatan yang
            sesuai
          </InfoTooltip>
        </div>

        <Card className="mt-6 !border-none !p-0">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-row items-center gap-4">
              <InputSearch
                options={[]}
                placeholder="Cari Muatan"
                className="w-[262px]"
                searchValue={searchTerm}
                setSearchValue={setSearchTerm}
                hideDropdown={true}
              />
              <Checkbox
                id="show-selected"
                checked={showSelectedOnly}
                onChange={({ checked }) => setShowSelectedOnly(checked)}
                disabled={isCheckboxDisabled}
              >
                <span
                  className={`text-sm font-normal ${
                    isCheckboxDisabled ? "text-neutral-500" : "text-neutral-900"
                  }`}
                >
                  Tampilkan yang terpilih saja
                </span>
              </Checkbox>
            </div>

            {showNotFound ? (
              <div className="flex justify-center pt-4">
                <DataNotFound type="search" title={"Keyword Tidak Ditemukan"} />
              </div>
            ) : (
              processedHierarchies.map((hierarchy) =>
                hierarchy.filteredCategories.length > 0 ? (
                  <CargoSelection
                    key={hierarchy.id}
                    cargoTypeName={hierarchy.cargoTypeName}
                    selectedCount={hierarchy.selectedCount}
                    isAllSelected={hierarchy.isAllSelected}
                    isIndeterminate={hierarchy.isIndeterminate}
                    onSelectAll={hierarchy.onSelectAll}
                    filteredCategories={hierarchy.filteredCategories}
                    selectedItems={selectedItems}
                    onItemChange={handleItemChange}
                    onCategoryChange={handleCategoryChange}
                  />
                ) : null
              )
            )}
          </CardContent>
        </Card>
      </LayoutOverlayButton>

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
    </>
  );
}
