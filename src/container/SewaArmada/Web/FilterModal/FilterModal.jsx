"use client";

import { Fragment, useEffect, useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { InfoTooltip } from "@/components/Tooltip/Tooltip";

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

const ArmadaImage = ({ src, onSelectImage }) => {
  const handleClick = (event) => {
    event.stopPropagation();
    onSelectImage();
  };

  return (
    <>
      <div className="relative size-[68px]">
        <ImageComponent className="w-full" src={src} width={100} height={100} />
        <button
          className="absolute right-2 top-2 flex size-[20px] items-center justify-center rounded-3xl bg-neutral-50"
          onClick={handleClick}
        >
          <IconComponent src="/icons/zoom12.svg" width={12} height={12} />
        </button>
      </div>
    </>
  );
};

// Carrier Item Component
const CarrierItem = ({ title, src, onClick, onSelectImage }) => {
  return (
    <div
      className={
        "flex h-[92px] w-[424px] cursor-pointer flex-row items-center justify-end gap-x-2 border-b border-neutral-400 py-3 transition-colors hover:bg-neutral-100"
      }
      onClick={() => onClick()}
    >
      <ArmadaImage src={src} onSelectImage={() => onSelectImage(src)} />

      <div className="flex w-[348px] items-center">
        <span
          className={"text-[12px] font-bold leading-[14.4px] text-neutral-900"}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

const TruckItem = ({
  title,
  src,
  onClick,
  cost,
  capacity,
  dimension,
  onSelectImage,
}) => {
  const details = [
    {
      iconSrc: "/icons/truck16.svg",
      title: "Harga per Unit : ",
      value: cost,
    },
    {
      iconSrc: "/icons/estimasi-kapasitas16.svg",
      title: "Estimasi Kapasitas : ",
      value: capacity,
    },
    {
      iconSrc: "/icons/kapasitas16.svg",
      title: "Estimasi Dimensi (p x l x t) : ",
      value: dimension,
    },
  ];
  return (
    <div
      className={
        "flex h-[138px] w-[424px] cursor-pointer flex-row items-center border-b border-neutral-400 py-3 text-neutral-900 transition-colors hover:bg-neutral-100"
      }
      onClick={() => onClick()}
    >
      <div className="flex gap-x-2">
        <ArmadaImage src={src} onSelectImage={() => onSelectImage(src)} />

        <div className="flex w-[348px]">
          <div className="flex flex-col gap-y-3">
            <span className={"text-[12px] font-bold leading-[14.4px]"}>
              {title}
            </span>
            <span className={"text-[14px] font-semibold leading-[15.4px]"}>
              Rp200.000
            </span>
            <div className="flex flex-col gap-y-2">
              {details.map((detail, key) => (
                <div className="flex items-center gap-x-2" key={key}>
                  <IconComponent src={detail.iconSrc} />
                  <span className="text-[10px] font-medium leading-[13px]">
                    {`${detail.title}${detail.value}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ recommended, type }) => {
  const recommendedTitles = {
    carrier: "Rekomendasi Carrier Sesuai Muatan",
    truck: "Rekomendasi Truk Sesuai Muatan",
  };
  const recommendedTitle = recommendedTitles[type] || recommendedTitles.carrier;

  const tooltipContents = {
    carrier:
      "Berikut adalah rekomendasi carrier berdasarkan informasi muatan yang kamu isi",
    truck:
      "Berikut adalah rekomendasi truk berdasarkan berat dan dimensi muatan yang kamu isikan dan diurutkan dari yang termurah.",
  };
  const tooltipContent = tooltipContents[type] || tooltipContents.carrier;

  return (
    <div className="flex h-6 w-[424px] items-center gap-x-1">
      <span className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
        {recommended ? recommendedTitle : "Tidak Direkomendasikan"}
      </span>
      {recommended && <InfoTooltip content={tooltipContent} />}
    </div>
  );
};

// Main Popup Component
const FilterModal = ({ data, isOpen, setIsOpen, onSelectArmada, type }) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
  }, [isOpen]);

  const handleArmadaSelect = (title) => {
    if (onSelectArmada) {
      onSelectArmada(title);
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

            {search.length < 3 ? (
              <div className="mr-[-15px] max-h-[320px] overflow-y-auto pr-2.5">
                {/* Rekomendasi Section */}
                <div className="mb-6">
                  <SectionHeader recommended type={type} />

                  {data.recommended.map((item, key) => (
                    <Fragment key={key}>
                      {type === "carrier" ? (
                        <CarrierItem
                          title={item.title}
                          src={item.src}
                          onClick={() => handleArmadaSelect(item)}
                          onSelectImage={handleSelectImage}
                        />
                      ) : (
                        <TruckItem
                          title={item.title}
                          src={item.src}
                          cost={item.cost}
                          capacity={item.capacity}
                          dimension={item.dimension}
                          onClick={() => handleArmadaSelect(item)}
                          onSelectImage={handleSelectImage}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>

                {/* Tidak Direkomendasikan Section */}
                <div>
                  <SectionHeader recommended={false} type={type} />

                  <WarningBadge
                    icon="/icons/warning14.svg"
                    message="Pilihan carrier di bawah ini berisiko melebihi batas dimensi atau tidak sesuai dengan informasi muatan"
                  />

                  {data.notRecommended.map((item, key) => (
                    <Fragment key={key}>
                      {type === "carrier" ? (
                        <CarrierItem
                          title={item.title}
                          src={item.src}
                          onClick={() => handleArmadaSelect(item)}
                          onSelectImage={handleSelectImage}
                        />
                      ) : (
                        <TruckItem
                          title={item.title}
                          src={item.src}
                          cost={item.cost}
                          capacity={item.capacity}
                          dimension={item.dimension}
                          onClick={() => handleArmadaSelect(item)}
                          onSelectImage={handleSelectImage}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>
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
                            title={item.title}
                            src={item.src}
                            onClick={() => handleArmadaSelect(item)}
                            onSelectImage={handleSelectImage}
                          />
                        ) : (
                          <TruckItem
                            title={item.title}
                            src={item.src}
                            cost={item.cost}
                            capacity={item.capacity}
                            dimension={item.dimension}
                            onClick={() => handleArmadaSelect(item)}
                            onSelectImage={handleSelectImage}
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

export default FilterModal;
