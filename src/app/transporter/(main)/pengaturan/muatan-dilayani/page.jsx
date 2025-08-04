"use client";

import React, { useMemo, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import Checkbox from "@/components/Form/Checkbox";
import { InputSearch } from "@/components/InputSearch/InputSearch";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import PageTitle from "@/components/PageTitle/PageTitle";
import { CargoSelection } from "@/container/Transporter/Driver/Pengaturan/CargoSelection";
import { useGetMasterCargo } from "@/services/Transporter/pengaturan/getMasterCargoData";

export default function AturMuatanDilayaniPage() {
  const { data: apiData, isLoading, error } = useGetMasterCargo();
  const [selectedItems, setSelectedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const { cargoCategories, cargoTypeName } = useMemo(() => {
    if (!apiData?.cargoHierarchy || apiData.cargoHierarchy.length === 0) {
      return { cargoCategories: [], cargoTypeName: "Muatan" };
    }
    const firstType = apiData.cargoHierarchy[0];
    const categories = firstType.categories.map((cat) => ({
      id: cat.cargoCategoryId,
      name: cat.cargoCategoryName,
      items: cat.cargoNames.map((cn) => ({
        id: cn.cargoNameId,
        name: cn.name,
      })),
    }));
    return {
      cargoCategories: categories,
      cargoTypeName: firstType.cargoTypeName,
    };
  }, [apiData]);

  const allCargoIds = useMemo(
    () => cargoCategories.flatMap((cat) => cat.items.map((item) => item.id)),
    [cargoCategories]
  );

  const filteredCategories = useMemo(() => {
    if (!searchTerm && !showSelectedOnly) return cargoCategories;
    return cargoCategories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!showSelectedOnly || selectedItems[item.id])
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [cargoCategories, searchTerm, showSelectedOnly, selectedItems]);

  const selectedCount = Object.keys(selectedItems).filter(
    (k) => selectedItems[k]
  ).length;
  const isAllSelected =
    allCargoIds.length > 0 && selectedCount === allCargoIds.length;
  const isIndeterminate = selectedCount > 0 && !isAllSelected;

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

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems({});
    } else {
      const newSelectedItems = {};
      allCargoIds.forEach((id) => {
        newSelectedItems[id] = true;
      });
      setSelectedItems(newSelectedItems);
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

  return (
    <div className="min-h-screen w-full bg-background p-4 lg:p-8">
      <div className="mb-6">
        <BreadCrumb data={breadcrumbItems} />
      </div>
      <PageTitle>Atur Muatan Dilayani</PageTitle>

      <Card className="mt-6 !border-none !p-0">
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <InputSearch
              placeholder="Cari Muatan"
              className="w-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Checkbox
              id="show-selected"
              checked={showSelectedOnly}
              onCheckedChange={setShowSelectedOnly}
            >
              <span className="text-sm font-normal text-neutral-900">
                Tampilkan yang terpilih saja
              </span>
            </Checkbox>
          </div>
        </CardContent>

        <CardContent className="p-6">
          <CargoSelection
            cargoTypeName={cargoTypeName}
            selectedCount={selectedCount}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onSelectAll={handleSelectAll}
            filteredCategories={filteredCategories}
            selectedItems={selectedItems}
            onItemChange={handleItemChange}
            onCategoryChange={handleCategoryChange}
          />
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button size="lg" className="w-full sm:w-auto">
          Simpan
        </Button>
      </div>
    </div>
  );
}
