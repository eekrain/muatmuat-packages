import { Fragment, useState } from "react";

import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import {
  TruckItem,
  WarningBadge,
} from "@/container/SewaArmada/Web/Form/JenisArmada/ArmadaComponent";
import { toast } from "@/lib/toast";
import { useSewaArmadaActions } from "@/store/forms/sewaArmadaStore";

const RecommendedTruckModal = ({ isOpen, setIsOpen, recommendedTrucks }) => {
  const [selectedTruckTypeId, setSelectedTruckTypeId] = useState(null);

  const { setField } = useSewaArmadaActions();

  const handleSelectRecommendedTruck = () => {
    setField("truckTypeId", selectedTruckTypeId);
    setIsOpen(false);
    toast.success("Jenis armada telah berhasil diubah");
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
        {recommendedTrucks?.map((item, key) => {
          const isSelected = selectedTruckTypeId === item.truckTypeId;
          return (
            <Fragment key={key}>
              <TruckItem
                {...item}
                showBottomBorder={false}
                isSelected={isSelected}
                onClick={() => setSelectedTruckTypeId(item.truckTypeId)}
              />
            </Fragment>
          );
        })}
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
