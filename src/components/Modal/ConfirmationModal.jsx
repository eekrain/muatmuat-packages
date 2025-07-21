import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";

const ConfirmationModal = ({
  isOpen,
  setIsOpen,
  title = { text: "", className: "" }, // Added default value here
  description = { text: "", className: "" },
  cancel = { text: "", onClick: () => setIsOpen(false) }, // Added default for cancel
  confirm = { text: "", onClick: () => setIsOpen(false) }, // Added default for confirm
}) => {
  const { text: titleText = "", className: titleClassName = "" } = title;
  const { text: descriptionText = "", className: descriptionClassName = "" } =
    description;
  const { text: cancelText = "", onClick: onCancel = () => setIsOpen(false) } =
    cancel;
  const {
    text: confirmText = "",
    onClick: onConfirm = () => setIsOpen(false),
  } = confirm;
  return (
    <Modal closeOnOutsideClick={false} open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent className="w-modal-small">
        <ModalHeader size="small" />
        <div className="flex flex-col items-center gap-y-6 px-6 py-9">
          {titleText ? (
            <h1
              className={cn(
                "leading-[19.2px] text-base font-bold text-neutral-900",
                titleClassName
              )}
            >
              {titleText}
            </h1>
          ) : null}
          {descriptionText ? (
            <p
              className={cn(
                "leading-[15.4px] text-center text-sm font-medium text-neutral-900",
                descriptionClassName
              )}
            >
              {descriptionText}
            </p>
          ) : null}
          <div className="flex items-center gap-x-2">
            <Button
              variant="muatparts-primary-secondary"
              className="h-8"
              onClick={onCancel}
              type="button"
            >
              {cancelText}
            </Button>
            <Button
              variant="muatparts-primary"
              className="h-8"
              onClick={onConfirm}
              type="button"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
