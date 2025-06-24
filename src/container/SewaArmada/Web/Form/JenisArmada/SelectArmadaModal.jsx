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
import { useSWRMutateHook } from "@/hooks/use-swr";
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

  // Setup SWR mutation hook untuk API calculate-price
  const {
    trigger: calculatePrice,
    isMutating: isCalculatingPrice,
    data: priceData,
    error: priceError,
  } = useSWRMutateHook("v1/orders/calculate-price");
  console.log("priceddata", priceData);
  useEffect(() => {
    setSearch("");
  }, [isOpen]);

  const handleArmadaSelect = async (item) => {
    setField(type, item);
    // Jika user memilih jenis truk, kita perlu menghitung harga
    // Nanti dibuat function biar bisa diakses di tempat2 yg perlu calculate harga
    if (type === "truckTypeId" && carrierId) {
      try {
        // Prepare request payload berdasarkan dokumentasi API
        const requestPayload = {
          calculationType: "FULL_ORDER_PRICING",
          truckData: {
            carrierId,
            truckTypeId: item,
            distance: distance || 0,
            distanceUnit: distanceUnit || "km",
            orderType,
            truckCount: 1, //sementara
          },
          // Blm ada asuransi
          // insuranceData: useAsuransi
          //   ? {
          //       // Nilai default untuk insurance jika tidak ada data spesifik
          //       insuranceOptionId: null,
          //       coverageAmount: 0,
          //     }
          //   : null,
          additionalServices,
          // Blm bisa akses voucher karena state nya cuma ada di SummaryPanel.jsx
          // voucherData: {
          //   voucherId: null,
          //   applyDiscount: false,
          // },
          businessEntity: {
            isBusinessEntity,
          },
        };
        console.log("babi", requestPayload);
        // Panggil API calculate-price
        const priceResult = await calculatePrice(requestPayload);

        // Jika berhasil, simpan hasil perhitungan ke store
        if (priceResult?.data?.price) {
          // Update price data di store
          setField("calculatedPrice", priceResult.data.price);
        }
      } catch (error) {
        console.error("Error calculating price:", error);
        // Opsional: Set error message di store
        // setError("price", "Gagal menghitung harga. Silahkan coba lagi.");
      }
    }

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

  return (
    <>
      <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
        <ModalContent type="muatmuat">
          <div className="flex flex-col gap-y-4 px-6 py-9">
            {/* Header */}
            <div className="flex w-[424px] justify-center">
              <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                {modalTitle}
              </h1>
            </div>

            {/* Search Field */}
            <Input
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

            {search.length < 3 ? (
              <div className="mr-[-15px] max-h-[320px] overflow-y-auto pr-2.5">
                {/* Rekomendasi Section */}
                <div className="mb-6">
                  <SectionHeader recommended type={type} />

                  {currentData.recommended?.length > 0 ? (
                    currentData.recommended.map((item, key) => (
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
                            isLoading={isCalculatingPrice}
                          />
                        ) : null}
                      </Fragment>
                    ))
                  ) : (
                    <div className="flex h-[92px] items-center justify-center">
                      <p className="text-[12px] text-neutral-600">
                        Tidak ada {type === "carrierId" ? "carrier" : "truk"}{" "}
                        yang direkomendasikan
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
                            isLoading={isCalculatingPrice}
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
                            isLoading={isCalculatingPrice}
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
