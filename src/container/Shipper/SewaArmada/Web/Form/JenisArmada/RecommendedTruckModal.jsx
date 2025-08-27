import { Fragment, useState } from "react";

import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";

import {
  TruckItem,
  WarningBadge,
} from "@/container/Shipper/SewaArmada/Web/Form/JenisArmada/ArmadaComponent";

import { OrderTypeEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";

import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

const RecommendedTruckModal = ({ isOpen, setIsOpen, recommendedTrucks }) => {
  const [selectedTruckTypeId, setSelectedTruckTypeId] = useState(null);

  const orderType = useSewaArmadaStore((state) => state.orderType);
  const { setField } = useSewaArmadaActions();

  const handleSelectRecommendedTruck = () => {
    const selectedTruck = recommendedTrucks.find(
      (item) => item.truckTypeId === selectedTruckTypeId
    );
    setField(
      "truckCount",
      orderType === OrderTypeEnum.INSTANT ? 1 : selectedTruck.unit
    );
    setField("minTruckCount", selectedTruck.unit);
    setField("truckTypeId", selectedTruckTypeId);
    setIsOpen(false);
    toast.success("Jenis armada telah berhasil diubah");
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
      <ModalContent type="muatmuat">
        <div className="flex flex-col items-center gap-y-4 px-6 py-9">
          <h1 className="text-base font-bold leading-[19.2px] text-neutral-900">
            Rekomendasi Kami
          </h1>
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
        </div>
      </ModalContent>
    </Modal>
  );
};

export default RecommendedTruckModal;
