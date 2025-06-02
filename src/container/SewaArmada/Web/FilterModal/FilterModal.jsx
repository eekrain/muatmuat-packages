"use client";

import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import Input from "@/components/Input/Input";
import { Modal, ModalContent } from "@/components/Modal/Modal";

// Data untuk carrier items
const RECOMMENDED_CARRIERS = [
  {
    id: 1,
    title: "Towing Car",
    image: "/img/recommended1.png",
    isRecommended: true,
  },
  {
    id: 2,
    title: "Enclosed Carrier",
    image: "/img/recommended2.png",
    isRecommended: true,
  },
];

const NOT_RECOMMENDED_CARRIERS = [
  {
    id: 3,
    title: "Trailer Container",
    image: "/img/recommended1.png",
    isRecommended: false,
    isFirst: true,
  },
  {
    id: 4,
    title: "Trailer Reefer",
    image: "/img/recommended2.png",
    isRecommended: false,
  },
  {
    id: 5,
    title: "Flat Bed",
    image: "/img/recommended1.png",
    isRecommended: false,
  },
];

// Warning Badge Component
const WarningBadge = ({ icon, message }) => {
  return (
    <div className="mt-3 flex h-[38px] w-[424px] flex-row items-center justify-center gap-x-1 rounded-lg bg-warning-100 px-2">
      <IconComponent
        src={icon}
        width={14}
        height={14}
        className="icon-warning-900"
      />
      <span className="flex-1 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
        {message}
      </span>
    </div>
  );
};

const ArmadaImage = ({ src }) => {
  return (
    <>
      <div className="relative size-[68px] rounded bg-neutral-50">
        <ImageComponent className="w-full" src={src} width={100} height={100} />
        <div className="absolute right-2 top-2 flex size-[20px] items-center justify-center rounded-full bg-white p-0.5">
          <IconComponent src="/icons/zoom12.svg" width={12} height={12} />
        </div>
      </div>
    </>
  );
};

// Carrier Item Component
const CarrierItem = ({ title, image, onClick }) => {
  const textWidth = "w-[348px]";

  return (
    <div
      className={
        "flex h-[92px] w-[424px] cursor-pointer flex-row items-center justify-end gap-x-2 border-b border-neutral-400 py-3 transition-colors hover:bg-neutral-100"
      }
      onClick={() => onClick && onClick(title)}
    >
      <ArmadaImage src={image} />

      <span
        className={
          "flex w-[348px] flex-1 items-center text-[12px] font-bold leading-[14.4px] text-neutral-900"
        }
      >
        {title}
      </span>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, showInfoIcon = false }) => {
  return (
    <div className="flex h-6 w-[424px] flex-row items-center gap-1">
      <span className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
        {title}
      </span>
      {showInfoIcon && (
        <IconComponent
          src="/icons/info-circle.svg"
          width={24}
          height={24}
          className="icon-gray"
        />
      )}
    </div>
  );
};

// Main Popup Component
const FilterModal = ({ data, isOpen, setIsOpen, onSelectArmada, type }) => {
  const [search, setSearch] = useState("");

  const handleCarrierSelect = (title) => {
    if (onSelectArmada) {
      onSelectArmada(title);
    }
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const modalTitles = {
    carrier: "Pilih Jenis Carrier",
    truck: "Pilih Jenis Truk",
  };
  const modalTitle = modalTitles[type] || modalTitles.carrier;

  const recommendedTitles = {
    carrier: "Rekomendasi Carrier Sesuai Muatan",
    truck: "Rekomendasi Truk Sesuai Muatan",
  };
  const recommendedTitle = recommendedTitles[type] || recommendedTitles.carrier;

  const filteredData = [...data.recommended, ...data.notRecommended].filter(
    (data) => data.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
        <ModalContent>
          <div className="flex flex-col gap-y-4 px-6 py-9">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                {modalTitle}
              </h1>
            </div>

            {/* Search Field */}
            <Input
              placeholder="Cari Jenis Carrier"
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

            <div className="mr-[-15px] max-h-[320px] overflow-y-auto pr-2.5">
              {/* Rekomendasi Section */}
              {search.length < 3 ? (
                <>
                  <div className="mb-6">
                    <SectionHeader
                      title={recommendedTitle}
                      showInfoIcon={true}
                    />

                    {data.recommended.map((carrier) => (
                      <CarrierItem
                        key={carrier.id}
                        title={carrier.title}
                        image={carrier.image}
                        size={carrier.size}
                        onClick={handleCarrierSelect}
                      />
                    ))}
                  </div>

                  {/* Tidak Direkomendasikan Section */}
                  <div>
                    <SectionHeader title="Tidak Direkomendasikan" />

                    <WarningBadge
                      icon="/icons/warning14.svg"
                      message="Pilihan carrier di bawah ini berisiko melebihi batas dimensi atau tidak sesuai dengan informasi muatan"
                    />

                    {data.notRecommended.map((carrier) => (
                      <CarrierItem
                        key={carrier.id}
                        title={carrier.title}
                        image={carrier.image}
                        isFirst={carrier.isFirst}
                        size={carrier.size}
                        onClick={handleCarrierSelect}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  {filteredData.map((carrier) => (
                    <CarrierItem
                      key={carrier.id}
                      title={carrier.title}
                      image={carrier.image}
                      isFirst={carrier.isFirst}
                      size={carrier.size}
                      onClick={handleCarrierSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FilterModal;
