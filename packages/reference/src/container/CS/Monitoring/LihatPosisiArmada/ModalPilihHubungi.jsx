"use client";

import { useState } from "react";

import { useGetOrderSosContact } from "@/services/CS/monitoring/lacak-armada/getOrderSosContact";
import { saveLogContactAttempt } from "@/services/CS/monitoring/lacak-armada/saveLogContactAttempt";

import Button from "@/components/Button/Button";
import { Modal } from "@/components/Modal";
import {
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";

/**
 * Represents a single contact option button within the modal.
 * @param {{
 * label: string;
 * imageSrc: string;
 * altText: string;
 * }} props
 */
const ContactOption = ({ label, image, onClick }) => (
  <button
    onClick={onClick}
    className="group flex w-full items-center rounded-md border border-neutral-400 bg-neutral-50 text-left transition-colors hover:border-muat-trans-primary-400"
  >
    <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-l-md bg-neutral-100 group-hover:bg-muat-trans-primary-400">
      <img
        src={image}
        alt="icon contact"
        className="h-10 w-10 rounded-full object-cover"
      />
    </div>
    <div className="px-4">
      <p className="text-xs font-bold leading-tight text-black">{label}</p>
    </div>
  </button>
);

const Content = ({ sosData, orderId }) => {
  const { data } = useGetOrderSosContact(sosData?.vehicleId);
  const [contacts, setContacts] = useState(null);

  const handleContactClick = (data, entityType) => {
    setContacts(data);
    saveLogContactAttempt({
      orderId,
      vehicleId: sosData?.vehicleId,
      entityId: data?.entityId,
      entityType,
      contactMethod: "PHONE_CALL",
      reason: data?.category,
    }).catch((error) => {
      console.error("Failed to log contact attempt:", error);
    });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6 px-6 py-9">
        <h2 className="text-center text-sm font-bold text-[#1B1B1B]">
          Hubungi
        </h2>
        <div className="flex w-full flex-col gap-4">
          {data?.transporter && (
            <ContactOption
              label="Hubungi Transporter"
              image="/img/modal-hubungi-sos/transporter.png"
              altText="Hubungi Transporter Icon"
              onClick={() =>
                handleContactClick(data?.transporter, "TRANSPORTER")
              }
            />
          )}
          {data?.driver && (
            <ContactOption
              label="Hubungi Driver"
              image="/img/modal-hubungi-sos/driver.png"
              altText="Hubungi Driver Icon"
              onClick={() => handleContactClick(data?.driver, "DRIVER")}
            />
          )}
        </div>
      </div>
      <HubungiModal
        contacts={contacts?.phoneCall}
        isOpen={Boolean(contacts)}
        onClose={() => setContacts(null)}
      />
    </>
  );
};

export const ModalPilihHubungi = ({ sosData, orderId }) => {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="muattrans-primary" className="w-full">
          Hubungi Transporter/Driver
        </Button>
      </ModalTrigger>
      <ModalContent className="w-[438px]" type="muatmuat">
        <ModalHeader />
        <Content sosData={sosData} orderId={orderId} />
      </ModalContent>
    </Modal>
  );
};
