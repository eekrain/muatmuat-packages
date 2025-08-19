import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { useGetOrderContacts } from "@/services/CS/monitoring/detail-pesanan-cs/getOrderContactsCS";

const ContactRow = ({ contact, onCopy, isLoading = false }) => {
  const { label, name, role, phone, address, hasWhatsApp } = contact;
  const isCopyable = phone && phone !== "-" && !isLoading;

  const containerClasses = name ? "items-start" : "items-center";

  if (isLoading) {
    return (
      <div
        className={`flex justify-between gap-4 self-stretch ${containerClasses}`}
      >
        <div className="h-4 w-[110px] animate-pulse rounded bg-gray-200"></div>
        <div className="flex w-[182px] flex-col gap-0.5">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full justify-center gap-[26px] ${containerClasses}`}
    >
      <p className="w-[78px] shrink-0 text-sm font-semibold text-neutral-900">
        {label}
      </p>
      <div className="flex w-[182px] flex-col items-start gap-0.5">
        {name && (
          <p className="line-clamp-1 text-sm font-medium text-neutral-900">
            {name}
          </p>
        )}
        {role && <p className="truncate text-xs text-[#868686]">{role}</p>}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <a
              href={
                isCopyable ? `tel:${phone.replace(/[-\s]/g, "")}` : undefined
              }
              className={`text-sm font-medium ${
                isCopyable
                  ? "text-primary-700 underline underline-offset-2"
                  : "text-neutral-900"
              }`}
            >
              {phone}
            </a>
          </div>
          {isCopyable && (
            <button
              onClick={() => onCopy(phone)}
              className="rounded-full border border-primary-700 bg-white px-2 py-0.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
            >
              Salin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * @param {object} props
 * @param {"shipper" | "transporter"} [props.mode="shipper"] - Mode to filter contacts
 * @param {React.ReactNode} props.children - Trigger element
 */
export const ModalDetailKontak = ({ mode = "shipper", children }) => {
  const [showToast, setShowToast] = useState(false);
  const params = useParams();
  const { data, error, isLoading } = useGetOrderContacts(params.orderId);

  // Transform API data into contact format based on mode
  const contactData = useMemo(() => {
    if (!data) return [];

    const contacts = [];
    const { shipperContact, transporterContacts } = data;

    if (mode === "shipper") {
      // Add PIC contacts from shipper grouped by location type
      if (shipperContact?.picList?.length > 0) {
        shipperContact.picList.forEach((pic, i) => {
          contacts.push({
            label: `PIC ${i + 1}`,
            name: pic.picName || "-",
            phone: pic.picPhoneNumber || "-",
            role: pic.picRole || "-",
            address: pic.locationAddress,
            hasWhatsApp: pic.isWhatsAppAvailable,
            type: "shipper",
          });
          i++;
        });
      }

      if (shipperContact?.companyPhoneNumber) {
        contacts.push({
          label: "No. Telepon Perusahaan",
          phone: shipperContact.companyPhoneNumber || "-",
        });
      }
      // Add shipper main contact if available
      if (shipperContact?.isContactAvailable && shipperContact?.phoneNumber) {
        contacts.push({
          label: "No. Darurat",
          name: shipperContact.fullName || "-",
          phone: shipperContact.phoneNumber || "-",
          role: "-",
          type: "shipper",
        });
      }
    } else if (mode === "transporter") {
      // Add transporter contacts only
      if (transporterContacts?.length > 0) {
        transporterContacts.forEach((transporter, transporterIndex) => {
          const transporterLabel =
            transporterContacts.length > 1
              ? `${transporter.companyName || "Transporter"} ${transporterIndex + 1}`
              : transporter.companyName || "Transporter";

          // Add main transporter contact
          if (
            transporter.mainContact?.isContactAvailable &&
            transporter.mainContact?.phoneNumber
          ) {
            contacts.push({
              label: `Kontak ${transporterLabel}`,
              name: transporter.mainContact.fullName || "-",
              phone: transporter.mainContact.phoneNumber || "-",
              type: "transporter",
            });
          }

          // Add transporter PIC contacts
          if (transporter.picList?.length > 0) {
            transporter.picList.forEach((pic, picIndex) => {
              contacts.push({
                label:
                  `PIC ${transporterLabel} ${pic.locationType || ""} ${transporter.picList.length > 1 ? picIndex + 1 : ""}`.trim(),
                name: pic.picName || "-",
                role: pic.picRole,
                phone: pic.picPhoneNumber || "-",
                address: pic.locationAddress,
                hasWhatsApp: pic.isWhatsAppAvailable,
                type: "transporter",
              });
            });
          }

          // Add driver contacts
          if (transporter.driverContacts?.length > 0) {
            transporter.driverContacts.forEach((driver, driverIndex) => {
              contacts.push({
                label:
                  `Driver ${transporter.driverContacts.length > 1 ? driverIndex + 1 : ""}`.trim(),
                name: driver.name || "-",
                role: driver.fleetInfo?.licensePlate
                  ? `Plat: ${driver.fleetInfo.licensePlate}`
                  : "-",
                phone: driver.phoneNumber || "-",
                hasWhatsApp: driver.isWhatsAppVerified,
                type: "transporter",
              });
            });
          }
        });
      }
    }

    return contacts;
  }, [data, mode]);

  const handleCopy = async (text) => {
    if (text && text !== "-") {
      const cleanedText = text.replace(/[-\s]/g, "");
      navigator.clipboard.writeText(cleanedText);
      setShowToast(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          setShowToast(false);
          resolve();
        }, 3000);
      });
    }
  };

  return (
    <Modal>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent className="w-[386px] overflow-hidden rounded-xl p-0">
        <ModalHeader />
        <div className="flex flex-col items-center gap-6 bg-white px-6 pb-9 pt-9">
          <h2 className="text-center text-sm font-bold text-neutral-900">
            No Telepon/WhatsApp Yang Bisa Dihubungi
          </h2>
          <div className="flex flex-col items-start gap-4 self-stretch">
            {isLoading ? (
              // Loading state with skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <ContactRow key={index} contact={{}} isLoading={true} />
              ))
            ) : error ? (
              // Error state
              <div className="flex w-full items-center justify-center py-4">
                <p className="text-sm text-red-500">
                  Gagal memuat informasi kontak. Silakan coba lagi.
                </p>
              </div>
            ) : contactData.length > 0 ? (
              // Success state with contacts
              contactData.map((contact, index) => (
                <ContactRow key={index} contact={contact} onCopy={handleCopy} />
              ))
            ) : (
              // Empty state
              <div className="flex w-full items-center justify-center py-4">
                <p className="text-sm text-gray-500">
                  {mode === "shipper"
                    ? "Tidak ada informasi kontak shipper tersedia"
                    : "Tidak ada informasi kontak transporter tersedia"}
                </p>
              </div>
            )}
          </div>
          {showToast && (
            <div className="mx-auto mt-2 w-[286px] self-stretch rounded-md bg-primary-50 px-2 py-2 text-center text-xs font-semibold text-primary-700">
              No. Telepon/WhatsApp berhasil disalin
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};
