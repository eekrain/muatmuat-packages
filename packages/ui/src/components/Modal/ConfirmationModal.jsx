import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

import { cn } from "@/lib/utils";

/**
 * ConfirmationModal component displays a modal dialog with confirmation and cancel actions.
 *
 * @param {Object} props - Component props.
 * @param {"small"|"big"} [props.size="small"] - The size of the modal dialog.
 * @param {"muattrans"|"muatparts"} [props.variant="muattrans"] - The visual style variant of the modal.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {Function} props.setIsOpen - Function to control the open state of the modal.
 * @param {{ text: string, className: string }} [props.title={ text: "", className: "" }] - Title configuration object. `text` is the title content, `className` is additional CSS classes for the title.
 * @param {{ text: string, className: string }} [props.description={ text: "", className: "" }] - Description configuration object. `text` is the description content, `className` is additional CSS classes for the description.
 * @param {{ classname: string, text: string, onClick: Function }} [props.cancel={ classname: "", text: "", onClick: () => {} }] - Cancel button configuration. `classname` for additional CSS, `text` for button label, `onClick` for click handler.
 * @param {{ classname: string, text: string, onClick: Function }} [props.confirm={ classname: "", text: "", onClick: () => {} }] - Confirm button configuration. `classname` for additional CSS, `text` for button label, `onClick` for click handler.
 * @returns {JSX.Element} The rendered confirmation modal component.
 */
const ConfirmationModal = ({
  size = "small",
  variant = "muattrans",
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
  const secondaryButtonVariant = {
    muatparts: "muatparts-primary-secondary",
    muattrans: "muattrans-primary-secondary",
  };
  const primaryButtonVariant = {
    muatparts: "muatparts-primary",
    muattrans: "muattrans-primary",
  };
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
            {withCancel && (
              <Button
                variant={
                  secondaryButtonVariant[variant] ||
                  secondaryButtonVariant.muattrans
                }
                // 25. 18 - Web - LB - 0275
                className={cn("h-8", cancelClassname)}
                onClick={onCancel}
                type="button"
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant={
                primaryButtonVariant[variant] || primaryButtonVariant.muattrans
              }
              // 25. 18 - Web - LB - 0275
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
