import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";

/**
 * @param {object} props
 * @param {boolean} props.open - Controlled state for the modal.
 * @param {(open: boolean) => void} props.onOpenChange - Callback for when the modal state changes.
 * @returns {JSX.Element}
 */
export const HubungiMuatransModal = ({ open, onOpenChange }) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalTrigger asChild>
        <Button
          variant="muattrans-primary"
          className="flex h-8 w-[105px] items-center justify-center rounded-full !p-0 text-sm font-semibold text-[#461B02]"
        >
          Hubungi
        </Button>
      </ModalTrigger>
      <ModalContent className="w-[386px]">
        <ModalHeader />

        {/* Body Section */}
        <div className="flex flex-col items-center gap-6 px-6 py-9 text-center">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-sm font-bold leading-tight text-[#1B1B1B]">
              Anda Ingin Menghubungi Via
            </h2>
            <p className="self-stretch text-xs font-semibold leading-[14px] text-[#868686]">
              Anda dapat memilih menghubungi melalui pilihan berikut
            </p>
          </div>

          {/* Contact Button */}
          <button className="flex w-full items-center gap-3 rounded-md border border-[#EBEBEB] px-6 pb-[14px] pt-[18px] text-left">
            <IconComponent
              src="/icons/contact.svg"
              alt="Phone Icon"
              width={24}
              height={24}
              className="text-primary-700"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold leading-tight text-primary-700">
                No. Telepon / WhatsApp
              </span>
              <span className="text-xs font-medium leading-[14px] text-[#868686]">
                Anda langsung terhubung dengan Whatsapp
              </span>
            </div>
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
};
