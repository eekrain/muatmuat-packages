"use client";

import { useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { toast } from "@/lib/toast";

/**
 * HubungiModal Component - A reusable modal for displaying contact information
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.transporterData - Transporter data object
 * @param {string} props.transporterData.companyName - Company name
 * @param {Array} props.transporterData.contacts - Array of contact objects
 * @param {string} props.transporterData.contacts[].name - Contact person name
 * @param {string} props.transporterData.contacts[].role - Contact person role
 * @param {string} props.transporterData.contacts[].phone - Contact person phone number
 * @param {string} [props.transporterData.contacts[].type] - Contact type (optional)
 */
const HubungiModal = ({
  isOpen,
  onClose,
  transporterData: _transporterData,
}) => {
  const [modalView, setModalView] = useState("initial"); // 'initial', 'options', 'details'
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Reset to initial view whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setModalView("initial");
      setShowCopySuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyPhone = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "-") {
      navigator.clipboard
        .writeText(phoneNumber)
        .then(() => {
          setShowCopySuccess(true);
          // toast.success("No. Telepon/Whatsapp berhasil disalin");
        })
        .catch(() => {
          toast.error("Gagal menyalin nomor telepon");
        });
    }
  };

  const handleContactTransporter = () => {
    setModalView("options");
  };

  const handleContactDriver = () => {
    // NOTE: Placeholder for driver contact functionality
    toast.info("Fitur Hubungi Driver akan segera hadir!");
    // onClose();
  };

  const handleShowTransporterDetails = () => {
    setModalView("details");
  };

  // View 3: Contact Details
  if (modalView === "details") {
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
          className="overflow-hidden p-0"
        >
          <ModalHeader />
          {/* Frame 40280 - Contact List */}
          <div className="flex flex-col items-center justify-center gap-6 bg-white pb-9">
            {/* Title */}
            <div className="px-6 pt-9 text-center text-sm font-bold leading-[17px] text-black">
              No Telepon/WhatsApp Yang Bisa Dihubungi
            </div>

            {/* Frame 40385 - Contact List Header */}
            <div className="grid grid-cols-[100px_1fr] gap-y-2 px-12">
              <div className="text-sm font-semibold leading-[17px] text-black">
                PIC 1
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center text-sm font-medium leading-[17px] text-black">
                    Alexander
                  </div>
                  <div className="text-xs font-medium leading-[14px] text-gray-500">
                    Manajer Keuangan
                  </div>
                </div>
                <div className="flex w-full flex-row items-center justify-between gap-2">
                  <div className="cursor-pointer text-sm font-medium leading-none text-blue-600 underline">
                    0821-2345-6869
                  </div>
                  <button
                    onClick={() => handleCopyPhone("0821-2345-6869")}
                    className="flex cursor-pointer items-start gap-2.5 rounded-full border border-blue-600 bg-white px-2 py-1"
                  >
                    <span className="text-xs font-medium leading-[14px] text-blue-600">
                      Salin
                    </span>
                  </button>
                </div>
              </div>
              <div className="text-sm font-semibold leading-[17px] text-black">
                PIC 2
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center text-sm font-medium leading-[17px] text-black">
                    Alexander krisna indra candra
                  </div>
                  <div className="text-xs font-medium leading-[14px] text-gray-500">
                    Staf Admin Operasional
                  </div>
                </div>
                <div className="flex w-full flex-row items-center justify-between gap-2">
                  <div className="cursor-pointer text-sm font-medium leading-none text-blue-600 underline">
                    0821-2345-8686
                  </div>
                  <button
                    onClick={() => handleCopyPhone("0821-2345-8686")}
                    className="flex cursor-pointer items-start gap-2.5 rounded-full border border-blue-600 bg-white px-2 py-1"
                  >
                    <span className="text-xs font-medium leading-[14px] text-blue-600">
                      Salin
                    </span>
                  </button>
                </div>
              </div>
              <div className="text-sm font-semibold leading-[17px] text-black">
                PIC 3
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center text-sm font-medium leading-[17px] text-black">
                    -
                  </div>
                  <div className="text-xs font-medium leading-[14px] text-gray-500">
                    -
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between gap-2">
                  <div className="text-sm font-medium leading-none text-blue-600">
                    -
                  </div>
                </div>
              </div>
              <div className="text-sm font-semibold leading-[17px] text-black">
                No. Telepon Perusahaan
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center text-sm font-medium leading-[17px] text-black">
                    -
                  </div>
                  <div className="text-xs font-medium leading-[14px] text-gray-500">
                    -
                  </div>
                </div>
                <div className="flex w-full flex-row items-center justify-between gap-2">
                  <div className="cursor-pointer text-sm font-medium leading-none text-blue-600 underline">
                    021-5550-1234
                  </div>
                  <button
                    onClick={() => handleCopyPhone("021-5550-1234")}
                    className="flex cursor-pointer items-start gap-2.5 rounded-full border border-blue-600 bg-white px-2 py-1"
                  >
                    <span className="text-xs font-medium leading-[14px] text-blue-600">
                      Salin
                    </span>
                  </button>
                </div>
              </div>
              <div className="text-sm font-semibold leading-[17px] text-black">
                No. Darurat
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center text-sm font-medium leading-[17px] text-black">
                    Candra Ariansyah
                  </div>
                  <div className="text-xs font-medium leading-[14px] text-gray-500">
                    Koordinator Staf Admin Operasional
                  </div>
                </div>
                <div className="flex w-full flex-row items-center justify-between gap-2">
                  <div className="cursor-pointer text-sm font-medium leading-none text-blue-600 underline">
                    0812-9876-5432
                  </div>
                  <button
                    onClick={() => handleCopyPhone("0812-9876-5432")}
                    className="flex cursor-pointer items-start gap-2.5 rounded-full border border-blue-600 bg-white px-2 py-1"
                  >
                    <span className="text-xs font-medium leading-[14px] text-blue-600">
                      Salin
                    </span>
                  </button>
                </div>
              </div>
            </div>
            {/* Badges - Secondary */}
            {showCopySuccess && (
              <div className="flex flex-row items-center justify-center gap-1 rounded-md bg-blue-50 px-2 pb-1">
                <span className="text-xs font-semibold leading-tight text-blue-600">
                  No. Telepon/Whatsapp berhasil disalin
                </span>
              </div>
            )}
          </div>
        </ModalContent>
      </Modal>
    );
  }

  // View 2: Contact Method Options
  if (modalView === "options") {
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
          className="flex flex-col items-start overflow-hidden rounded-xl p-0 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]"
        >
          <ModalHeader className="w-full" />
          {/* Content Frame */}
          <div className="flex flex-col items-center justify-center gap-6 bg-white px-6 py-9">
            {/* Text Content */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-center text-sm font-bold leading-[17px] text-black">
                Anda Ingin Menghubungi Via
              </p>
              <p className="text-center text-xs font-semibold leading-[14px] text-gray-500">
                Anda dapat memilih menghubungi melalui pilihan berikut
              </p>
            </div>

            {/* Action Options */}
            <div className="flex flex-col items-start gap-4">
              <button
                onClick={handleShowTransporterDetails}
                className="box-border flex flex-row items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-6 py-4 transition-colors hover:bg-gray-50"
              >
                <div className="h-6 w-6">
                  <IconComponent
                    src="/icons/call16.svg"
                    className="text-blue-500"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="text-sm font-semibold leading-[17px] text-blue-600">
                    No. Telepon / WhatsApp
                  </div>
                  <div className="text-xs font-medium leading-[14px] text-gray-500">
                    Anda langsung terhubung dengan Whatsapp
                  </div>
                </div>
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  // View 1: Initial Choice (Transporter or Driver)
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
          <h3 className="text-[14px] font-bold text-[#1B1B1B]">Hubungi</h3>
          <div className="flex w-full flex-col items-stretch gap-4">
            {/* Hubungi Transporter Button */}
            <button
              onClick={handleContactTransporter}
              className="group flex h-[72px] w-[392px] items-center gap-4 overflow-hidden rounded-lg border border-neutral-400 bg-white shadow-sm transition-colors hover:border-muat-trans-primary-400"
            >
              <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center bg-neutral-100 transition-colors group-hover:bg-muat-trans-primary-400">
                <IconComponent
                  src="/icons/transporter-call.svg"
                  alt="Hubungi Transporter"
                  width={40}
                  height={40}
                  className="text-primary-700"
                />
              </div>
              <span className="text-xs font-bold text-neutral-900">
                Hubungi Transporter
              </span>
            </button>

            {/* Hubungi Driver Button */}
            <button
              onClick={handleContactTransporter}
              className="group flex h-[72px] w-[392px] items-center gap-4 overflow-hidden rounded-lg border border-neutral-400 bg-white shadow-sm transition-colors hover:border-muat-trans-primary-400"
            >
              <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center bg-neutral-100 transition-colors group-hover:bg-muat-trans-primary-400">
                <IconComponent
                  src="/icons/driver-call.svg"
                  alt="Hubungi Driver"
                  width={40}
                  height={40}
                  className="text-primary-700"
                />
              </div>
              <span className="text-xs font-bold text-neutral-900">
                Hubungi Driver
              </span>
            </button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default HubungiModal;
