"use client";

import { useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";

const ContactDetailRow = ({ label, name, role, phone, onCopy }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="max-w-[78px] text-sm font-semibold leading-[17px] text-black">
        {label}
      </div>
      <div className="flex flex-col items-start gap-0.5">
        {role !== "Perusahaan" && (
          <div className="flex flex-col items-start gap-1">
            <p className="line-clamp-1 text-sm font-medium leading-[17px] text-black">
              {name || "-"}
            </p>
            <p className="line-clamp-1 text-xs font-medium leading-[14px] text-gray-500">
              {role || "-"}
            </p>
          </div>
        )}
        <div className="flex w-full flex-row items-center justify-between gap-2">
          {phone && phone !== "-" ? (
            <>
              <a
                onClick={() => onCopy(phone)}
                className="cursor-pointer text-sm font-medium leading-none text-blue-600 underline"
              >
                {phone}
              </a>
              <button
                onClick={() => onCopy(phone)}
                className="flex cursor-pointer items-start gap-2.5 rounded-full border border-blue-600 bg-white px-2 py-1"
              >
                <span className="text-xs font-medium leading-[14px] text-blue-600">
                  {t("hubungiModal.buttonCopy", {}, "Salin")}
                </span>
              </button>
            </>
          ) : (
            <div className="text-sm font-medium leading-none text-black">-</div>
          )}
        </div>
      </div>
    </>
  );
};

const ContactModal = ({ isOpen, onClose, contactId, useMockData }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowDetails(false);
      setContactData(null);
      setShowCopySuccess(false);
    }
  }, [isOpen]);

  const handleCopyPhone = (phoneNumber) => {
    navigator.clipboard
      .writeText(phoneNumber)
      .then(() => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000); // Hide message after 2 seconds
      })
      .catch(() =>
        toast.error(
          t("hubungiModal.toastCopyError", {}, "Gagal menyalin nomor telepon")
        )
      );
  };

  const fetchContactDetails = async () => {
    setLoading(true);
    const endpoint = useMockData
      ? `/api/v1/cs/contacts/${contactId}`
      : `/v1/cs/contacts/${contactId}`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      if (result.Data) {
        setContactData(result.Data);
        setShowDetails(true);
      } else {
        toast.error(
          t("hubungiModal.toastFetchError", {}, "Gagal memuat detail kontak.")
        );
        onClose();
      }
    } catch (error) {
      toast.error(
        t("hubungiModal.toastFetchError", {}, "Gagal memuat detail kontak.")
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (showDetails && contactData) {
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
          className="w-[386px] overflow-hidden p-0"
        >
          <ModalHeader />
          <div className="flex flex-col items-center justify-center gap-6 bg-white pb-9">
            <div className="px-6 pt-9 text-center text-sm font-bold leading-[17px] text-black">
              {t(
                "hubungiModal.detailsTitle",
                {},
                "No Telepon/WhatsApp Yang Bisa Dihubungi"
              )}
            </div>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 px-12">
              {contactData.contacts.map((contact, index) => (
                <ContactDetailRow
                  key={index}
                  label={contact.type}
                  name={contact.name}
                  role={contact.role}
                  phone={contact.phone}
                  onCopy={handleCopyPhone}
                />
              ))}
            </div>
            {showCopySuccess && (
              <div className="flex flex-row items-center justify-center gap-1 rounded-md bg-blue-50 px-2 py-1">
                <span className="text-xs font-semibold leading-tight text-blue-600">
                  {t(
                    "hubungiModal.copySuccessMessage",
                    {},
                    "No. Telepon/Whatsapp berhasil disalin"
                  )}
                </span>
              </div>
            )}
          </div>
        </ModalContent>
      </Modal>
    );
  }

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
        className="flex w-[386px] flex-col items-start overflow-hidden rounded-xl p-0 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]"
      >
        <ModalHeader className="w-full" />
        <div className="flex flex-col items-center justify-center gap-6 bg-white px-6 py-9">
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-sm font-bold leading-[17px] text-black">
              {t("hubungiModal.initialTitle", {}, "Anda Ingin Menghubungi Via")}
            </p>
            <p className="text-center text-xs font-semibold leading-[14px] text-gray-500">
              {t(
                "hubungiModal.initialSubtitle",
                {},
                "Anda dapat memilih menghubungi melalui pilihan berikut"
              )}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <button
              onClick={fetchContactDetails}
              disabled={loading}
              className="box-border flex w-[338px] flex-row items-center justify-start gap-3 rounded-md border border-gray-200 bg-white px-6 py-4 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
              ) : (
                <div className="h-6 w-6">
                  <IconComponent
                    src="/icons/ic-contact-phone.svg"
                    className="!text-blue-500"
                    width={20}
                    height={20}
                  />
                </div>
              )}
              <div className="flex flex-col items-start gap-1 text-left">
                <div className="text-sm font-semibold leading-[17px] text-blue-600">
                  {t("hubungiModal.optionPhone", {}, "No. Telepon / WhatsApp")}
                </div>
                <div className="text-xs font-medium leading-[14px] text-gray-500">
                  {t(
                    "hubungiModal.optionPhoneSubtitle",
                    {},
                    "Anda langsung terhubung dengan Whatsapp"
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ContactModal;
