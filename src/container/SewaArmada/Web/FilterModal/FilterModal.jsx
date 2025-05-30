"use client";

import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
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
        classname="icon-warning-900"
      />
      <span className="flex-1 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
        {message}
      </span>
    </div>
  );
};

// Carrier Item Component
const CarrierItem = ({ title, image, isRecommended, onClick }) => {
  const imageSize = "w-[68px] h-[68px]";
  const containerHeight = "h-[92px]";
  const textWidth = "w-[348px]";

  return (
    <div
      className={`flex w-[424px] flex-row items-center justify-end gap-2 py-3 ${containerHeight} cursor-pointer border-b border-neutral-400 transition-colors hover:bg-neutral-100`}
      onClick={() => onClick && onClick(title)}
    >
      <div className={`${imageSize} relative rounded bg-neutral-50`}>
        <img
          src={image}
          alt={title}
          className="h-full w-full rounded object-cover"
        />
        <div className="absolute right-2 top-2 flex size-[20px] items-center justify-center rounded-full bg-white p-0.5">
          <IconComponent src="/icons/zoom12.svg" width={12} height={12} />
        </div>

        {/* Expand Icon Overlay */}
        {/* {isRecommended ? (
          <div className="absolute right-2 top-2 flex size-[20px] items-center justify-center rounded-full bg-white p-0.5">
            <IconComponent src="/icons/zoom12.svg" width={12} height={12} />
          </div>
        ) : isFirst ? (
          <div className="absolute right-2 top-2 flex size-[20px] items-center justify-center rounded-full bg-black/60 p-0.5">
            <IconComponent src="/icons/zoom12.svg" width={12} height={12} />
          </div>
        ) : null} */}
      </div>

      <span
        className={`flex flex-1 items-center text-[12px] font-bold leading-[14.4px] text-neutral-900 ${textWidth}`}
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
          classname="icon-gray"
        />
      )}
    </div>
  );
};

// Main Popup Component
const FilterModal = ({ isOpen, setIsOpen, onSelectArmada, type }) => {
  const [search, setSearch] = useState("");

  const handleCarrierSelect = (title) => {
    if (onSelectArmada) {
      console.log("title", title);
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

  const filteredData = [
    ...RECOMMENDED_CARRIERS,
    ...NOT_RECOMMENDED_CARRIERS,
  ].filter((data) => data.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
      <ModalContent>
        <div className="px-6 py-9">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
              {modalTitle}
            </h1>
          </div>

          {/* Search Field */}
          <div className="mb-4">
            <Input
              placeholder="Cari Jenis Carrier"
              icon={{
                left: "/icons/search16.svg",
                right: search ? (
                  <IconComponent
                    src="/icons/silang.svg"
                    height={16}
                    width={16}
                    onclick={() => setSearch("")}
                  />
                ) : null,
              }}
              width={{ width: "424px" }}
              value={search}
              changeEvent={handleSearchChange}
            />
          </div>

          <div className="mr-[-15px] max-h-[320px] overflow-y-auto pr-2.5">
            {/* Rekomendasi Section */}
            {search.length < 3 ? (
              <>
                <div className="mb-6">
                  <SectionHeader title={recommendedTitle} showInfoIcon={true} />

                  <div className="mt-4">
                    {RECOMMENDED_CARRIERS.map((carrier) => (
                      <CarrierItem
                        key={carrier.id}
                        title={carrier.title}
                        image={carrier.image}
                        isRecommended={carrier.isRecommended}
                        size={carrier.size}
                        onClick={handleCarrierSelect}
                      />
                    ))}
                  </div>
                </div>

                {/* Tidak Direkomendasikan Section */}
                <div>
                  <SectionHeader title="Tidak Direkomendasikan" />

                  <WarningBadge
                    icon="/icons/warning14.svg"
                    message="Pilihan carrier di bawah ini berisiko melebihi batas dimensi atau tidak sesuai dengan informasi muatan"
                  />

                  <div className="mt-4">
                    {NOT_RECOMMENDED_CARRIERS.map((carrier) => (
                      <CarrierItem
                        key={carrier.id}
                        title={carrier.title}
                        image={carrier.image}
                        isRecommended={carrier.isRecommended}
                        isFirst={carrier.isFirst}
                        size={carrier.size}
                        onClick={handleCarrierSelect}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4">
                {filteredData.map((carrier) => (
                  <CarrierItem
                    key={carrier.id}
                    title={carrier.title}
                    image={carrier.image}
                    isRecommended={carrier.isRecommended}
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
  );
};

export default FilterModal;
