import { Modal, ModalContent } from "@/components/Modal/Modal";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";

const MuatBongkarModal = ({ isOpen, setIsOpen, data, title }) => (
  <Modal closeOnOutsideClick={false} open={isOpen} onOpenChange={setIsOpen}>
    <ModalContent type="muatmuat">
      <div className="flex flex-col gap-y-3 p-6">
        {/* Header */}
        <h2 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
          {title}
        </h2>
        <div className="mr-[-12px] max-h-[388px] overflow-y-auto pr-[7px]">
          <div className="flex w-[600px] flex-col items-start gap-2 rounded-xl border border-neutral-400 px-4 py-5">
            <TimelineContainer>
              {data?.map((item, index) => (
                <NewTimelineItem
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
                  isLast={index === data?.length - 1}
                  activeIndex={10}
                  title={item.fullAddress}
                  className="gap-3"
                  appearance={{
                    titleClassname:
                      "text-xs font-medium leading-[14.4px] mt-[1px]",
                  }}
                />
              ))}
            </TimelineContainer>
          </div>
        </div>
      </div>
    </ModalContent>
  </Modal>
);

export default MuatBongkarModal;
