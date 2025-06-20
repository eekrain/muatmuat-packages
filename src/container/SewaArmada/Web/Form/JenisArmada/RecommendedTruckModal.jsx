import { useState } from "react";

import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { WarningBadge } from "@/container/SewaArmada/Web/Form/JenisArmada/ArmadaComponent";

const RecommendedTruckModal = ({ isOpen, setIsOpen, recommendedTrucks }) => {
  // const [selected]
  const [selectedTruck, setSelectedTruck] = useState(null);

  const handleSelectRecommendedTruck = () => {
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
      <ModalContent
        className="flex flex-col items-center gap-y-4 px-6 py-9"
        type="muatmuat"
      >
        <div className="flex w-[424px] justify-center">
          <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
            Rekomendasi Kami
          </h1>
        </div>
        <WarningBadge message="Pastikan lokasi muat dan bongkar dapat dijangkau truk rekomendasi kami untuk kelancaran proses" />
        {/* {recommendedTrucks?.map((item, key) => {
          const isSelected = (selectedTruck.truckTypeId = item.truckTypeId);
          return (
            <div
              className={
                "flex h-[138px] w-[424px] cursor-pointer flex-row items-center border-b border-neutral-400 py-3 text-neutral-900 transition-colors hover:bg-neutral-100"
              }
              key={key}
              onClick={() => setSelectedTruck(selectedTruck)}
            >
              <div className="flex gap-x-2">
                <ArmadaImage
                  src={src}
                  onSelectImage={() => onSelectImage(src)}
                />

                <div className="flex w-[348px]">
                  <div className="flex flex-col gap-y-3">
                    <div className="flex flex-col">
                      <span
                        className={"text-[12px] font-bold leading-[14.4px]"}
                      >
                        {title}
                      </span>
                    </div>
                    <span
                      className={"text-[14px] font-semibold leading-[15.4px]"}
                    >
                      {formattedPrice}
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
        })} */}
        <Button
          className="w-[112px]"
          variant="muatparts-primary"
          onClick={handleSelectRecommendedTruck}
        >
          Terapkan
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default RecommendedTruckModal;
