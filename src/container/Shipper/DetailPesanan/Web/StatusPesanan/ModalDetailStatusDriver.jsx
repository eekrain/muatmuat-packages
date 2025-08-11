import { useParams } from "next/navigation";
import { useState } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { useTranslation } from "@/hooks/use-translation";
import { useGetDriverStatusTimeline } from "@/services/Shipper/lacak-armada/getDriverStatusTimeline";

const ModalDetailStatusDriver = ({ driver }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick>
      <ModalTrigger>
        <Button variant="muatparts-primary-secondary">
          {t(
            "ModalDetailStatusDriver.buttonDetailStatusDriver",
            {},
            "Detail Status Driver"
          )}
        </Button>
      </ModalTrigger>
      <ModalContent className="w-[800px] p-6" type="muatmuat">
        <h2 className="mb-3 text-center text-base font-bold leading-[19.2px] text-black">
          {t(
            "ModalDetailStatusDriver.titleDetailStatusDriver",
            {},
            "Detail Status Driver"
          )}
        </h2>
        {isOpen && <Content driver={driver} t={t} />}
      </ModalContent>
    </Modal>
  );
};

const Content = ({ driver, t }) => {
  const params = useParams();
  // Get order status history to get driver data
  const { data: dataTimeline, isLoading } = useGetDriverStatusTimeline(
    params.orderId,
    driver.driverId
  );

  return (
    <div className="flex max-h-[353px] flex-col rounded-xl border border-neutral-400 pb-5 pt-5">
      <div className="relative pl-4 pr-[7px]">
        <AvatarDriver
          name={dataTimeline?.dataDriver?.name || driver?.name || "Ardian Eka"}
          image={
            dataTimeline?.dataDriver?.profileImage ||
            driver?.driverImage ||
            "https://picsum.photos/50"
          }
          licensePlate={
            dataTimeline?.dataDriver?.licensePlate || driver?.licensePlate || ""
          }
        />
      </div>

      <div className="my-6 w-full px-4">
        <hr className="border-neutral-400" />
      </div>

      <div className="mr-[4px] overflow-y-auto pb-[2px] pl-4 pr-[7px]">
        {!!dataTimeline && <DriverTimeline dataTimeline={dataTimeline} />}
      </div>
    </div>
  );
};

export default ModalDetailStatusDriver;
