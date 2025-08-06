"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import { toast } from "@/lib/toast";

const ProvinceSelectionModal = ({
  isOpen,
  onClose,
  onSave,
  title = "Pilih Provinsi",
  provinces = [],
  isLoading = false,
  onSearch,
  initialSelectedProvinces = [],
  saveContext = null, // Parameter untuk membedakan context save
}) => {
  const [searchProvince, setSearchProvince] = useState("");
  const [selectedProvinces, setSelectedProvinces] = useState(
    initialSelectedProvinces
  );
  const [filteredProvinces, setFilteredProvinces] = useState(provinces);

  useEffect(() => {
    setFilteredProvinces(
      provinces.filter((province) =>
        province.provinceName
          .toLowerCase()
          .includes(searchProvince.toLowerCase())
      )
    );
  }, [searchProvince, provinces]);

  // Handle search with debounce effect
  useEffect(() => {
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(searchProvince);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchProvince, onSearch]);

  // Group provinces by sortOrder (alphabetical grouping)
  const groupedProvinces = filteredProvinces.reduce((acc, province) => {
    const group = province.sortOrder;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(province);
    return acc;
  }, {});

  // Get filtered provinces for "select all" functionality
  const hasFilteredProvinces = filteredProvinces.length > 0;

  // Check if all filtered provinces are selected
  const isAllSelected =
    hasFilteredProvinces &&
    filteredProvinces.every((province) =>
      selectedProvinces.includes(province.provinceId)
    );

  // Handle select all provinces (only for filtered results)
  const handleSelectAll = (checked) => {
    if (checked) {
      // Add all filtered provinces to selection
      const filteredIds = filteredProvinces.map(
        (province) => province.provinceId
      );
      setSelectedProvinces((prev) => {
        const newSelection = [...prev];
        filteredIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    } else {
      // Remove all filtered provinces from selection
      const filteredIds = filteredProvinces.map(
        (province) => province.provinceId
      );
      setSelectedProvinces((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      );
    }
  };

  // Handle individual province selection
  const handleProvinceSelect = (provinceId, checked) => {
    if (checked) {
      setSelectedProvinces((prev) => [...prev, provinceId]);
    } else {
      setSelectedProvinces((prev) => prev.filter((id) => id !== provinceId));
    }
  };

  // Handle save provinces
  const handleSaveProvinces = () => {
    if (selectedProvinces.length === 0) {
      toast.error("Belum ada provinsi terpilih!");
      return;
    }

    // Get selected province data
    const selectedProvincesData = provinces.filter((province) =>
      selectedProvinces.includes(province.provinceId)
    );

    onSave(selectedProvincesData, selectedProvinces, saveContext);
    handleClose();
  };

  // Handle close modal
  const handleClose = () => {
    setSearchProvince("");
    setSelectedProvinces(initialSelectedProvinces);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="max-h-[90vh] w-[708px]">
        <div className="flex flex-col px-6 py-4">
          <h2 className="mb-4 text-center text-lg font-bold leading-[21.6px]">
            {title}
          </h2>

          {/* Main Content with Border */}
          <div className="mb-4 h-[400px] overflow-y-auto rounded-lg border border-neutral-300">
            <div className="sticky top-0 z-10 rounded-t-lg bg-white p-4">
              {/* Search Input */}
              <div className="mb-4">
                <Input
                  placeholder="Cari Provinsi"
                  icon={{ left: "/icons/search.svg" }}
                  value={searchProvince}
                  onChange={(e) => setSearchProvince(e.target.value)}
                />
              </div>

              {/* Select All Checkbox */}
              <div className="flex items-center gap-3">
                <Checkbox
                  className="!gap-0"
                  label=""
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.checked)}
                />
                <span className="text-sm leading-[17.6px]">Pilih Semua</span>
              </div>
              <hr className="mt-4 border-b border-neutral-400" />
            </div>

            <div className="min-h-[200px] px-4">
              {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <span className="text-sm text-neutral-600">Loading...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-y-[18px]">
                  {Object.keys(groupedProvinces).length > 0 ? (
                    Object.keys(groupedProvinces).map((group, groupIndex) => (
                      <div className="flex flex-col gap-y-3" key={group}>
                        <span className="ms-7 text-lg font-bold leading-[21.6px]">
                          {group}
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                          {groupedProvinces[group].map((province) => {
                            const isChecked = selectedProvinces.includes(
                              province.provinceId
                            );
                            return (
                              <div
                                key={province.provinceId}
                                className="flex items-center gap-3"
                              >
                                <Checkbox
                                  className="!gap-0"
                                  label=""
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleProvinceSelect(
                                      province.provinceId,
                                      e.checked
                                    )
                                  }
                                />
                                <span className="text-base font-normal leading-[19.2px] text-neutral-900">
                                  {province.provinceName}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {/* Border line per group, not per province */}
                        {groupIndex <
                          Object.keys(groupedProvinces).length - 1 && (
                          <div className="mt-4 border-b border-neutral-400"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex h-[200px] items-center justify-center">
                      <VoucherSearchEmpty />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex gap-3 px-40">
            <Button
              variant="muattrans-primary-secondary"
              className="h-[44px] w-[120px] text-base"
              onClick={handleClose}
            >
              Batal
            </Button>
            <Button
              variant="muattrans-primary"
              className="h-[44px] w-[120px] text-base"
              onClick={handleSaveProvinces}
            >
              Simpan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ProvinceSelectionModal;
