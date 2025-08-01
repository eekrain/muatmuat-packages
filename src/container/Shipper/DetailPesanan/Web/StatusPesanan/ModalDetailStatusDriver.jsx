import { useParams } from "next/navigation";
import { useRef, useState } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { useClientHeight } from "@/hooks/use-client-height";
import { useTranslation } from "@/hooks/use-translation";
import { useGetOrderStatusHistory } from "@/services/Shipper/detailpesanan/getOrderStatusHistory";
import { useGetDriverStatusTimeline } from "@/services/Shipper/lacak-armada/getDriverStatusTimeline";

const ModalDetailStatusDriver = () => {
  const { t } = useTranslation();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);

  // Get order status history to get driver data
  const { data: orderStatusHistory } = useGetOrderStatusHistory(params.orderId);

  // Get the first driver from the order status history
  const firstDriver = orderStatusHistory?.driverStatus?.[0];
  const driverId = firstDriver?.driverId;

  const { data: dataDriverStatus, isLoading } = useGetDriverStatusTimeline(
    params.orderId,
    driverId
  );
  const contentRef = useRef(null);
  const contentHeight = useClientHeight({ ref: contentRef, deps: [isOpen] });
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

        <div
          className="flex flex-col rounded-xl border border-neutral-400 pb-5 pt-5"
          style={{
            ...(!contentHeight && { height: "353px" }),
            ...(contentHeight && { maxHeight: "353px" }),
          }}
        >
          <div className="relative pl-4 pr-[7px]">
            <AvatarDriver
              name={
                dataDriverStatus?.dataDriver?.name ||
                firstDriver?.name ||
                "Ardian Eka"
              }
              image={
                dataDriverStatus?.dataDriver?.profileImage ||
                firstDriver?.driverImage ||
                "https://picsum.photos/50"
              }
              licensePlate={
                dataDriverStatus?.dataDriver?.licensePlate ||
                firstDriver?.licensePlate ||
                ""
              }
            />
          </div>

          <div className="my-6 w-full px-4">
            <hr className="border-neutral-400" />
          </div>

          <div
            ref={contentRef}
            className="pr-[4px]"
            style={{
              ...(!contentHeight && { flex: 1 }),
              ...(contentHeight && { maxHeight: contentHeight }),
            }}
          >
            {contentHeight && dataDriverStatus ? (
              <div
                className="overflow-y-auto pl-4 pr-[7px]"
                style={{
                  ...(contentHeight ? { maxHeight: contentHeight } : {}),
                }}
              >
                <DriverTimeline dataDriverStatus={dataDriverStatus} />
              </div>
            ) : null}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalDetailStatusDriver;
