import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal";

import { useTranslation } from "@/hooks/use-translation";

// Accept the new handler functions as props
export default function ModalInitialChoice({
  isOpen,
  onClose,
  onContactTransporter, // New prop
  onContactDriver, // New prop
}) {
  const { t } = useTranslation();

  // The internal handlers are no longer needed,
  // but you can keep them for clarity or just call the props directly.
  const handleContactTransporter = () => {
    if (onContactTransporter) {
      onContactTransporter(); // Call the function passed via props
    }
  };

  const handleContactDriver = () => {
    if (onContactDriver) {
      onContactDriver(); // Call the function passed via props
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      withCloseButton={true}
      closeOnOutsideClick={true}
    >
      <ModalContent
        type="muattrans"
        size="medium"
        className="flex flex-col items-center overflow-hidden rounded-xl p-0 shadow-lg"
      >
        <ModalHeader className="w-full" />
        <div className="flex w-full flex-col items-center gap-6 bg-white px-6 pb-9 pt-9">
          <h3 className="text-sm font-bold text-[#1B1B1B]">
            {t("HubungiModal.title", {}, "Hubungi")}
          </h3>
          <div className="flex w-full flex-col items-stretch gap-4">
            <button
              onClick={handleContactTransporter} // This now calls the prop
              className="group flex h-[72px] w-[w-390px] items-center gap-4 overflow-hidden rounded-lg border border-neutral-400 bg-white shadow-sm transition-colors hover:border-muat-trans-primary-400"
            >
              <div className="flex h-full w-[72px] flex-shrink-0 items-center justify-center bg-neutral-100 transition-colors group-hover:bg-muat-trans-primary-400">
                <IconComponent
                  src="/icons/transporter-call.svg"
                  alt="Hubungi Transporter"
                  width={40}
                  height={40}
                />
              </div>
              <span className="text-xs font-bold text-neutral-900">
                {t(
                  "HubungiModal.contactTransporter",
                  {},
                  "Hubungi Transporter"
                )}
              </span>
            </button>

            <button
              onClick={handleContactDriver} // This now calls the prop
              className="group flex h-[72px] w-[390px] items-center gap-4 overflow-hidden rounded-lg border border-neutral-400 bg-white shadow-sm transition-colors hover:border-muat-trans-primary-400"
            >
              <div className="flex h-full w-[72px] flex-shrink-0 items-center justify-center bg-neutral-100 transition-colors group-hover:bg-muat-trans-primary-400">
                <IconComponent
                  src="/icons/driver-call.svg"
                  alt="Hubungi Driver"
                  width={40}
                  height={40}
                />
              </div>
              <span className="text-xs font-bold text-neutral-900">
                {t("HubungiModal.contactDriver", {}, "Hubungi Driver")}
              </span>
            </button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
