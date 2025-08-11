import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";

const ConfirmationModal = ({
  size = "small",
  variant = "primary",
  isOpen,
  setIsOpen,
  title = { text: "", className: "" },
  withCancel = true,
  description = { text: "", className: "" },
  cancel = { classname: "", text: "", onClick: () => setIsOpen(false) },
  confirm = { classname: "", text: "", onClick: () => setIsOpen(false) },
  className = "",
}) => {
  const { text: titleText = "", className: titleClassName = "" } = title;
  const { text: descriptionText = "", className: descriptionClassName = "" } =
    description;
  const {
    classname: cancelClassname = "",
    text: cancelText = "",
    onClick: onCancel = () => setIsOpen(false),
  } = cancel;
  const {
    classname: confirmClassname = "",
    text: confirmText = "",
    onClick: onConfirm = () => setIsOpen(false),
  } = confirm;
  const modalClassnames = {
    small: "w-modal-small",
    big: "w-modal-big",
  };
  const modalClassname = modalClassnames[size] || modalClassnames.small;
  return (
    <Modal closeOnOutsideClick={false} open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent className={cn(modalClassname, className)} type="muattrans">
        <ModalHeader size={size} />
        <div className="flex flex-col items-center gap-y-6 px-6 py-9">
          {titleText ? (
            <h1
              className={cn(
                "text-base font-bold leading-[19.2px] text-neutral-900",
                titleClassName
              )}
            >
              {titleText}
            </h1>
          ) : null}
          {descriptionText ? (
            <p
              className={cn(
                "text-center text-sm font-medium leading-[15.4px] text-neutral-900",
                descriptionClassName
              )}
            >
              {descriptionText}
            </p>
          ) : null}
          <div className="flex items-center gap-x-2">
            <Button
              variant="muattrans-primary-secondary"
              className={cn("h-8", cancelClassname)}
              onClick={onCancel}
              type="button"
            >
              {cancelText}
            </Button>
            {withCancel && (
              <Button
                variant="muattrans-primary-secondary"
                // 25. 18 - Web - LB - 0275
                className={cn("h-8", cancelClassname)}
                onClick={onCancel}
                type="button"
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant="muattrans-primary"
              className={cn("h-8", confirmClassname)}
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
