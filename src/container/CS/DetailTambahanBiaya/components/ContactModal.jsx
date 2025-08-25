import IconComponent from "@/components/IconComponent/IconComponent";

const { Modal, ModalContent, ModalHeader } = require("@/components/Modal");

const ContactModal = ({ isOpen, setOpen }) => {
  return (
    <Modal open={isOpen} onOpenChange={setOpen}>
      <ModalContent size="small" type="muattrans">
        <ModalHeader />
        <div className="flex flex-col items-center gap-y-6 px-6 py-9">
          <div className="flex flex-col items-center gap-y-2">
            <h1 className="text-sm font-bold text-[#1B1B1B]">
              Anda Ingin Menghubungi Via
            </h1>
            <span className="text-xs font-semibold text-[#868686]">
              Anda dapat memilih menghubungi melalui pilihan berikut
            </span>
          </div>
          <button className="flex w-[338px] rounded-md border border-[#EBEBEB] pb-3.5 pt-[18px]">
            <div className="mx-auto flex items-center gap-x-4">
              <IconComponent
                src="/icons/call24.svg"
                className="text-primary-700"
                size="medium"
              />
              <div className="flex flex-col items-start gap-y-1">
                <span className="text-sm font-semibold text-primary-700">
                  No. Telepon / WhatsApp
                </span>
                <span className="text-xs font-medium text-[#868686]">
                  Anda langsung terhubung dengan Whatsapp
                </span>
              </div>
            </div>
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ContactModal;
