"use client";

import { Fragment, useEffect, useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import {
  CarrierItem,
  SectionHeader,
  TruckItem,
  WarningBadge,
} from "@/container/SewaArmada/Web/Form/JenisArmada/ArmadaComponent";

// Main Popup Component
const SelectArmadaModal = ({
  carrierData,
  truckData,
  isOpen,
  setIsOpen,
  onSelectArmada,
  type,
  isLoadingCarrier,
  errorCarrier,
  isLoadingTruck,
  errorTruck,
}) => {
  const [search, setSearch] = useState("");
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [isTruckImageModalOpen, setIsTruckImageModalOpen] = useState(false);

  useEffect(() => {
    setSearch("");
  }, [isOpen]);

  const handleArmadaSelect = (item) => {
    if (onSelectArmada) {
      onSelectArmada(item);
    }
    setIsOpen(false);
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSelectImage = (src) => {
    setIsTruckImageModalOpen(true);
    setSelectedImageSrc(src);
    setIsOpen(false);
  };

  const modalTitles = {
    carrier: "Pilih Jenis Carrier",
    truck: "Pilih Jenis Truk",
  };
  const modalTitle = modalTitles[type] || modalTitles.carrier;

  // Get current data based on type
  const getCurrentData = () => {
    if (type === "carrier") {
      // Loading or error state for carrier data
      if (isLoadingCarrier) {
        return { recommended: [], notRecommended: [] };
      }

      if (errorCarrier) {
        return { recommended: [], notRecommended: [] };
      }

      // Transform API carrier data to match component structure
      if (carrierData) {
        return {
          recommended: carrierData.recommendedCarriers || [],
          notRecommended: carrierData.nonRecommendedCarriers || [],
        };
      }

      return { recommended: [], notRecommended: [] };
    } else {
      // For truck, use API data if available
      if (isLoadingTruck) {
        return { recommended: [], notRecommended: [] };
      }

      if (errorTruck) {
        return { recommended: [], notRecommended: [] };
      }

      if (truckData && truckData.recommendedTrucks) {
        // Transform API truck data
        return {
          recommended:
            truckData.recommendedTrucks?.map((truck) => ({
              ...truck,
              // id: truck.truckTypeId,
              // title: truck.name,
              // description: truck.description,
              // src: truck.image,
              // price: truck.price,
              // maxWeight: truck.maxWeight,
              // weightUnit: truck.weightUnit,
              // dimensions: truck.dimensions,
              isRecommended: true,
            })) || [],
          notRecommended:
            truckData.nonRecommendedTrucks?.map((truck) => ({
              ...truck,
              // id: truck.truckTypeId,
              // title: truck.name,
              // description: truck.description,
              // src: truck.image,
              // price: truck.price,
              // maxWeight: truck.maxWeight,
              // weightUnit: truck.weightUnit,
              // dimensions: truck.dimensions,
              isRecommended: false,
            })) || [],
        };
      }

      // Fallback to dummy data
      return truckData;
    }
  };

  const currentData = getCurrentData();

  // Filter based on search
  const filteredData = [
    ...(currentData.recommended || []),
    ...(currentData.notRecommended || []),
  ].filter((item) => item?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
        <ModalContent>
          <div className="flex flex-col gap-y-4 px-6 py-9">
            {/* Header */}
            <div className="flex w-[424px] justify-center">
              <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                {modalTitle}
              </h1>
            </div>

            {/* Search Field */}
            <Input
              placeholder={`Cari Jenis ${type === "carrier" ? "Carrier" : "Truk"}`}
              icon={{
                left: "/icons/search16.svg",
                right: search ? (
                  <IconComponent
                    src="/icons/silang.svg"
                    height={16}
                    width={16}
                    onClick={() => setSearch("")}
                  />
                ) : null,
              }}
              width={{ width: "424px" }}
              value={search}
              onChange={handleSearchChange}
            />

            {search.length < 3 ? (
              <div className="mr-[-15px] max-h-[320px] overflow-y-auto pr-2.5">
                {/* Rekomendasi Section */}
                <div className="mb-6">
                  <SectionHeader recommended type={type} />

                  {currentData.recommended?.length > 0 ? (
                    currentData.recommended.map((item, key) => (
                      <Fragment key={key}>
                        {type === "carrier" ? (
                          <CarrierItem
                            {...item}
                            onClick={() => handleArmadaSelect(item)}
                          />
                        ) : (
                          <TruckItem
                            {...item}
                            onClick={() => handleArmadaSelect(item)}
                          />
                        )}
                      </Fragment>
                    ))
                  ) : (
                    <div className="flex h-[92px] items-center justify-center">
                      <p className="text-[12px] text-neutral-600">
                        Tidak ada {type === "carrier" ? "carrier" : "truk"} yang
                        direkomendasikan
                      </p>
                    </div>
                  )}
                </div>

                {/* Tidak Direkomendasikan Section */}
                {currentData.notRecommended?.length > 0 && (
                  <div>
                    <SectionHeader recommended={false} type={type} />

                    <WarningBadge
                      icon="/icons/warning14.svg"
                      message={`Pilihan ${type === "carrier" ? "carrier" : "truk"} di bawah ini berisiko melebihi batas dimensi atau tidak sesuai dengan informasi muatan`}
                    />

                    {currentData.notRecommended.map((item, key) => (
                      <Fragment key={key}>
                        {type === "carrier" ? (
                          <CarrierItem
                            {...item}
                            onClick={() => handleArmadaSelect(item)}
                          />
                        ) : (
                          <TruckItem
                            {...item}
                            onClick={() => handleArmadaSelect(item)}
                          />
                        )}
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <span className="text-[16px] font-bold leading-[19.2px]">
                  Hasil Pencarian
                </span>
                {filteredData.length === 0 ? (
                  <div className="flex h-[302px] items-center justify-center">
                    <DataNotFound
                      className="gap-y-5"
                      textClass="text-[#868686] leading-[19.2px]"
                      title="Keyword Tidak Ditemukan"
                      width={71}
                      height={61}
                    />
                  </div>
                ) : (
                  <div className="mt-4">
                    {filteredData.map((item, key) => (
                      <Fragment key={key}>
                        {type === "carrier" ? (
                          <CarrierItem
                            {...item}
                            onClick={() => handleArmadaSelect(item)}
                          />
                        ) : (
                          <TruckItem
                            {...item}
                            onClick={() => handleArmadaSelect(item)}
                          />
                        )}
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SelectArmadaModal;
