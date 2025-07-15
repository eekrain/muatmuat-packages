import { useRef, useState } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { useClientHeight } from "@/hooks/use-client-height";
import { useGetDriverStatusTimeline } from "@/services/Shipper/lacak-armada/getDriverStatusTimeline";

const ModalDetailStatusDriver = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: dataDriverStatus, isLoading } = useGetDriverStatusTimeline({
    orderId: "123",
    driverId: "456",
  });

  const contentRef = useRef(null);
  const contentHeight = useClientHeight({ ref: contentRef, deps: [isOpen] });

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick>
      <ModalTrigger>
        <Button variant="muatparts-primary-secondary">
          Detail Status Driver
        </Button>
      </ModalTrigger>
      <ModalContent className="w-[800px] p-6" type="muatmuat">
        <h2 className="mb-3 text-center text-[16px] font-bold leading-[19.2px] text-black">
          Detail Status Driver
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
              name={"Ardian Eka"}
              image={"https://picsum.photos/50"}
              licensePlate={"B 1234 CD"}
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
                className="overflow-y-auto pl-4 pr-[8px]"
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
