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
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

// Main Popup Component
const SelectArmadaModal = ({
  carrierData,
  truckData,
  isOpen,
  setIsOpen,
  type,
}) => {
  const [search, setSearch] = useState("");

  // Mendapatkan nilai-nilai yang dibutuhkan dari zustand store
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const carrierId = useSewaArmadaStore((state) => state.formValues.carrierId);
  const distance = useSewaArmadaStore((state) => state.formValues.distance);
  const distanceUnit = useSewaArmadaStore(
    (state) => state.formValues.distanceUnit
  );
  const truckCount = useSewaArmadaStore((state) => state.formValues.truckCount);
  const additionalServices = useSewaArmadaStore(
    (state) => state.formValues.additionalServices
  );
  const isBusinessEntity = useSewaArmadaStore(
    (state) => state.formValues.isBusinessEntity
  );
  // const useAsuransi = useSewaArmadaStore(
  //   (state) => state.formValues.useAsuransi
  // );

  const { setField } = useSewaArmadaActions();

  useEffect(() => {
    setSearch("");
  }, [isOpen]);

  const handleArmadaSelect = async (item) => {
    setField(type, item);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const modalTitles = {
    carrierId: "Pilih Jenis Carrier",
    truckTypeId: "Pilih Jenis Truk",
  };
  const modalTitle = modalTitles[type] || modalTitles.carrierId;

  // Get current data based on type
  const currentData = useShallowMemo(() => {
    const emptyData = { recommended: [], notRecommended: [] };
    if (type === "carrierId") {
      // Transform API carrier data to match component structure
      if (carrierData) {
        return {
          recommended: carrierData.recommendedCarriers || [],
          notRecommended: carrierData.nonRecommendedCarriers || [],
        };
      }
      return emptyData;
    } else if (type === "truckTypeId") {
      if (truckData) {
        // Transform API truck data
        return {
          recommended: truckData.recommendedTrucks || [],
          notRecommended: truckData.nonRecommendedTrucks || [],
        };
      }
      return emptyData;
    } else {
      // Fallback to dummy data
      return emptyData;
    }
  }, [type, carrierData, truckData]);

  // Filter based on search
  const filteredData = [
    ...(currentData.recommended || []),
    ...(currentData.notRecommended || []),
  ].filter((item) => item?.name?.toLowerCase().includes(search.toLowerCase()));

  const isTruckOptionsEmpty =
    type === "truckTypeId" &&
    [...(currentData.recommended || []), ...(currentData.notRecommended || [])]
      .length === 0;

  return (
    <>
      <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
        <ModalContent type="muatmuat">
          <div className="flex h-[460px] flex-col gap-y-4 px-6 py-8">
            {/* Header */}
            <div className="flex w-[424px] justify-center">
              <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                {modalTitle}
              </h1>
            </div>

            {isTruckOptionsEmpty ? (
              <WarningBadge
                className="bg-warning-100"
                message="Untuk sementara kami belum menyediakan truk yang sesuai dengan informasi berat dan dimensi muatan yang kamu isikan."
              />
            ) : null}

            {/* Search Field */}
            <Input
              disabled={isTruckOptionsEmpty}
              placeholder={`Cari Jenis ${type === "carrierId" ? "Carrier" : "Truk"}`}
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

            {isTruckOptionsEmpty ? (
              <div className="flex h-[267px] items-center justify-center">
                <DataNotFound
                  className="gap-y-3"
                  textClass="text-[#868686]"
                  title="Tidak ada rekomendasi truk"
                  width={96}
                  height={77}
                />
              </div>
            ) : null}

            {search.length < 3 ? (
              <div className="mr-[-15px] flex h-[320px] flex-col gap-y-4 overflow-y-auto pr-2.5">
                {/* Rekomendasi Section */}
                {currentData.recommended?.length > 0 ? (
                  <div>
                    <SectionHeader recommended type={type} />

                    {currentData.recommended.map((item, key) => (
                      <Fragment key={key}>
                        {type === "carrierId" ? (
                          <CarrierItem
                            {...item}
                            onClick={() => handleArmadaSelect(item.carrierId)}
                          />
                        ) : null}
                        {type === "truckTypeId" ? (
                          <TruckItem
                            {...item}
                            onClick={() => handleArmadaSelect(item.truckTypeId)}
                          />
                        ) : null}
                      </Fragment>
                    ))}
                  </div>
                ) : null}

                {/* Tidak Direkomendasikan Section */}
                {currentData.notRecommended?.length > 0 && (
                  <div>
                    <SectionHeader recommended={false} type={type} />

                    <WarningBadge
                      className="mt-3"
                      message={
                        type === "carrierId"
                          ? "Pilihan carrier di bawah ini berisiko melebihi batas dimensi atau tidak sesuai dengan informasi muatan"
                          : "Pilihan truk di bawah ini berisiko kelebihan muatan atau tidak sesuai dengan informasi muatan"
                      }
                    />

                    {currentData.notRecommended.map((item, key) => (
                      <Fragment key={key}>
                        {type === "carrierId" ? (
                          <CarrierItem
                            {...item}
                            onClick={() => handleArmadaSelect(item.carrierId)}
                          />
                        ) : null}
                        {type === "truckTypeId" ? (
                          <TruckItem
                            {...item}
                            onClick={() => handleArmadaSelect(item.truckTypeId)}
                          />
                        ) : null}
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
                        {type === "carrierId" ? (
                          <CarrierItem
                            {...item}
                            onClick={() => handleArmadaSelect(item.carrierId)}
                          />
                        ) : null}
                        {type === "truckTypeId" ? (
                          <TruckItem
                            {...item}
                            onClick={() => handleArmadaSelect(item.truckTypeId)}
                          />
                        ) : null}
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
