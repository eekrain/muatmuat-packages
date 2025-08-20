"use client";

import { useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { toast } from "@/lib/toast";

const generalContacts = [
  // for dev purpose change to [] for production
  {
    label: "PIC 1",
    name: "Alexander",
    role: "Staf Admin Operasional",
    phone: "0821-2345-6869",
  },
  {
    label: "PIC 2",
    name: "Alexander krisna indra candra",
    role: "Staf Admin Operasional",
    phone: "0821-2345-8686",
  },
  {
    label: "PIC 3",
    name: "",
    role: "",
    phone: "",
  },
  {
    label: "No. Telepon Perusahaan",
    name: "",
    role: "",
    phone: "021-5550-1234",
  },
  {
    label: "No. Darurat",
    name: "Candra Ariansyah",
    role: "Koordinator Staf Admin Operasional",
    phone: "0812-9876-5432",
  },
];
/**
 * HubungiModal Component - A reusable modal for displaying contact information
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {boolean} [props.showInitialChoice=true] - If true, shows the Transporter/Driver selection. If false, shows the contact options screen directly.
 * @param {Array} [props.contacts] - Array of contact objects to display when `showInitialChoice` is false.
 * @param {Array} [props.transporterContacts] - Array of transporter contact objects.
 * @param {Array} [props.driverContacts] - Array of driver contact objects.
 */
const HubungiModal = ({
  isOpen,
  onClose,
  showInitialChoice = false,
  contacts = generalContacts, //for dev purpose change to [] for production
  transporterContacts = [],
  driverContacts = [],
}) => {
  const [modalView, setModalView] = useState("initial"); // 'initial', 'options', 'details'
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [selectedContactType, setSelectedContactType] = useState(null); // 'transporter' or 'driver'
  const [dataToDisplay, setDataToDisplay] = useState([]);

  // Effect to reset state and handle different initial views
  useEffect(() => {
    if (isOpen) {
      setShowCopySuccess(false);
      setSelectedContactType(null);

      if (!showInitialChoice) {
        // If initial choice is disabled, go directly to the options view
        setModalView("options");
      } else {
        // Otherwise, start at the initial selection view
        setModalView("initial");
      }
    }
  }, [isOpen, showInitialChoice]);

  if (!isOpen) return null;

  const handleCopyPhone = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "-") {
      navigator.clipboard
        .writeText(phoneNumber)
        .then(() => {
          setShowCopySuccess(true);
          setTimeout(() => setShowCopySuccess(false), 3000);
        })
        .catch(() => {
          toast.error("Gagal menyalin nomor telepon");
        });
    }
  };

  const handleContactTransporter = () => {
    setSelectedContactType("transporter");
    setModalView("options");
  };

  const handleContactDriver = () => {
    setSelectedContactType("driver");
    setModalView("options");
  };

  const handleShowDetails = () => {
    let data = [];
    if (showInitialChoice) {
      // If user started from the initial choice screen
      if (selectedContactType === "transporter") {
        data = transporterContacts;
      } else if (selectedContactType === "driver") {
        data = driverContacts;
      }
    } else {
      // If the initial choice screen was skipped
      data = contacts;
    }
    setDataToDisplay(data);
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

          <div className="flex flex-col items-center justify-center gap-6 bg-white pb-9">
            {/* --- Modal Title --- */}
            <div className="w-full px-[50px] pt-9 text-center text-sm font-bold leading-[17px] text-black">
              No Telepon/WhatsApp Yang Bisa Dihubungi
            </div>

            {/* --- Contacts List --- */}
            <div className="flex max-w-[386px] flex-col gap-6 px-[50px]">
              {dataToDisplay.map((contact, index) => (
                <div key={index} className="flex flex-row items-start gap-x-4">
                  {/* Label Column */}
                  <div className="w-[100px] flex-shrink-0 text-sm font-semibold leading-[17px] text-black">
                    {contact.label || "-"}
                  </div>

                  {/* Details Column */}
                  <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                    {/* Name */}
                    <div className="w-full truncate text-sm font-medium leading-[17px] text-black">
                      {contact.name || "-"}
                    </div>

                    {/* Role */}
                    <div className="w-full truncate text-xs font-medium leading-[14px] text-gray-500">
                      {contact.role || "-"}
                    </div>

                    {/* Phone & Copy Button */}
                    <div className="flex w-full flex-row items-center justify-between gap-2 pt-1">
                      <div
                        className={`text-sm font-medium leading-none ${
                          contact.phone
                            ? "cursor-pointer text-blue-600 underline"
                            : "text-blue-600"
                        }`}
                      >
                        {contact.phone || "-"}
                      </div>

                      {contact.phone && contact.phone !== "-" && (
                        <button
                          onClick={() => handleCopyPhone(contact.phone)}
                          className="flex flex-shrink-0 cursor-pointer items-start gap-2.5 rounded-full border border-blue-600 bg-white px-2 py-1 transition-colors hover:bg-blue-50"
                        >
                          <span className="text-xs font-medium leading-[14px] text-blue-600">
                            Salin
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Copy Success Notification --- */}
            {showCopySuccess && (
              <div className="flex flex-row items-center justify-center gap-1 rounded-md bg-blue-50 px-2 py-1">
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
          <div className="flex flex-col items-center justify-center gap-6 bg-white px-6 py-9">
            <div className="flex flex-col items-center gap-2">
              <p className="text-center text-sm font-bold leading-[17px] text-black">
                Anda Ingin Menghubungi Via
              </p>
              <p className="text-center text-xs font-semibold leading-[14px] text-gray-500">
                Anda dapat memilih menghubungi melalui pilihan berikut
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <button
                onClick={handleShowDetails}
                className="box-border flex w-full flex-row items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-6 py-4 transition-colors hover:bg-gray-50"
              >
                <div className="h-6 w-6">
                  <IconComponent
                    src="/icons/call16.svg"
                    className="text-blue-500"
                    width={20}
                    height={20}
                    alt="Phone Icon"
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
  if (modalView === "initial") {
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
            <h3 className="text-sm font-bold text-[#1B1B1B]">Hubungi</h3>
            <div className="flex w-full flex-col items-stretch gap-4">
              <button
                onClick={handleContactTransporter}
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
                  Hubungi Transporter
                </span>
              </button>

              <button
                onClick={handleContactDriver}
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
                  Hubungi Driver
                </span>
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  return null;
};

export default HubungiModal;
