import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";

const TruckImageModal = ({ isOpen, setIsOpen, src }) => (
  <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
    <ModalContent>
      <div className="flex flex-col gap-y-4 px-6 py-9">
        <ImageComponent
          className="h-[306px] bg-neutral-50 object-contain"
          src={src}
          width={544}
          height={306}
          alt="armada"
        />
      </div>
    </ModalContent>
  </Modal>
);

export default TruckImageModal;
