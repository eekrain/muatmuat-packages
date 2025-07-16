import { Modal, ModalContent } from "@/components/Modal/Modal";
import {
  TimelineContainer,
  TimelineContentAddress,
  TimelineItem,
} from "@/components/Timeline";

const MuatBongkarModal = ({ isOpen, setIsOpen, data, title }) => (
  <Modal closeOnOutsideClick={false} open={isOpen} onOpenChange={setIsOpen}>
    <ModalContent>
      <div className="flex flex-col gap-y-3 p-6">
        {/* Header */}
        <h2 className="text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
          {title}
        </h2>
        <div className="mr-[-12px] max-h-[388px] overflow-y-auto pr-[7px]">
          <div className="flex w-[600px] flex-col items-start gap-2 rounded-xl border border-neutral-400 px-4 py-5">
            <TimelineContainer>
              {data?.map((item, index) => (
                <TimelineItem
                  key={index}
                  variant={
                    item.isBullet
                      ? "bullet"
                      : item.isPickup
                        ? "number-muat"
                        : "number-bongkar"
                  }
                  totalLength={data?.length}
                  index={item.index}
                  activeIndex={10}
                >
                  <TimelineContentAddress
                    title={item.fullAddress}
                    className={`text-[12px] font-medium leading-[14.4px] ${
                      index === data?.length - 1 ? "pb-0" : ""
                    }`}
                  />
                </TimelineItem>
              ))}
            </TimelineContainer>
          </div>
        </div>
      </div>
    </ModalContent>
  </Modal>
);

export default MuatBongkarModal;
