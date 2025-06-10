import { useState } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

import FilterModal from "../../FilterModal/FilterModal";
import { SelectedTruck } from "./SelectedTruck";

const carrierData = {
  recommended: [
    {
      id: 1,
      title: "Towing Car",
      src: "/img/recommended1.png",
    },
  ],
  notRecommended: [
    {
      id: 2,
      title: "Flat Bed",
      src: "/img/recommended1.png",
    },
    {
      id: 3,
      title: "Trailer Container",
      src: "/img/recommended1.png",
    },
    {
      id: 4,
      title: "Trailer Reefer",
      src: "/img/recommended2.png",
    },
  ],
};

const truckData = {
  recommended: [
    {
      id: 1,
      title: "Colt Diesel Engkel",
      src: "/img/recommended1.png",
      cost: 200000,
      capacity: "2,5 Ton",
      dimension: "5,7 m x 2,2 m x 2,3 m",
    },
  ],
  notRecommended: [
    {
      id: 2,
      title: "Flat Bed",
      src: "/img/recommended1.png",
      cost: 200000,
      capacity: "2,5 Ton",
      dimension: "5,7 m x 2,2 m x 2,3 m",
    },
    {
      id: 3,
      title: "Trailer Container",
      src: "/img/recommended1.png",
      cost: 200000,
      capacity: "2,5 Ton",
      dimension: "5,7 m x 2,2 m x 2,3 m",
    },
    {
      id: 4,
      title: "Trailer Reefer",
      src: "/img/recommended2.png",
      cost: 200000,
      capacity: "2,5 Ton",
      dimension: "5,7 m x 2,2 m x 2,3 m",
    },
  ],
};

const armadaData = {
  carrier: carrierData,
  truck: truckData,
};

export const JenisArmada = () => {
  const [isTruckImageModalOpen, setIsTruckImageModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [type, setType] = useState(""); // carrier or truck
  const [isArmadaPopupOpen, setIsArmadaPopupOpen] = useState(false);
  const jenisCarrier = useSewaArmadaStore(
    (state) => state.formValues.jenisCarrier
  );
  const jenisTruk = useSewaArmadaStore((state) => state.formValues.jenisTruk);
  const { setField } = useSewaArmadaActions();

  const handleSelectArmada = (value) => {
    if (type === "carrier") {
      setField("jenisCarrier", value);
    }
    if (type === "truck") {
      setField("jenisTruk", value);
    }
  };

  const handleSelectImage = (src) => {
    setSelectedImageSrc(src);
    setIsTruckImageModalOpen(true);
  };

  return (
    <>
      <FormContainer>
        <FormLabel required>Jenis Armada*</FormLabel>

        <div className="flex flex-1 flex-col gap-y-3.5">
          <div className="flex items-center gap-x-3.5">
            <button
              className="flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 px-3"
              onClick={() => {
                setIsArmadaPopupOpen(true);
                setType("carrier");
              }}
            >
              <IconComponent
                src="/icons/carrier16.svg"
                width={16}
                height={16}
              />
              <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {jenisCarrier?.title || "Pilih Jenis Carrier"}
              </span>
              <IconComponent
                src="/icons/chevron-right.svg"
                width={16}
                height={16}
                className="ml-auto"
              />
            </button>
            <button
              className={cn(
                "flex h-8 w-full cursor-not-allowed items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-200 px-3",
                jenisCarrier && "cursor-pointer bg-neutral-50"
              )}
              disabled={!jenisCarrier}
              onClick={() => {
                setIsArmadaPopupOpen(true);
                setType("truck");
              }}
            >
              <IconComponent src="/icons/truck16.svg" width={16} height={16} />
              <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {jenisTruk?.title || "Pilih Jenis Truck"}
              </span>
              <IconComponent
                src="/icons/chevron-right.svg"
                width={16}
                height={16}
                className="ml-auto"
              />
            </button>
          </div>
          {jenisTruk ? (
            <SelectedTruck {...jenisTruk} onSelectImage={handleSelectImage} />
          ) : null}
        </div>
      </FormContainer>

      <FilterModal
        data={armadaData[type] || armadaData.carrier}
        isOpen={isArmadaPopupOpen}
        setIsOpen={setIsArmadaPopupOpen}
        onSelectArmada={handleSelectArmada}
        type={type}
      />
    </>
  );
};
