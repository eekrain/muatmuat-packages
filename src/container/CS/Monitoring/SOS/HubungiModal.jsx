import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal } from "@/components/Modal/Modal";

export const HubungiModal = ({
  isOpen,
  onClose,
  transporter,
  contacts,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState("company");

  if (!isOpen || !transporter) return null;

  const { companyName, phoneNumber } = transporter;
  const contactData = contacts?.Data;

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, "_blank");
    }
  };

  const handleWhatsApp = (phoneNumber) => {
    if (phoneNumber) {
      const whatsappNumber = phoneNumber.startsWith("0")
        ? `62${phoneNumber.slice(1)}`
        : phoneNumber;
      window.open(`https://wa.me/${whatsappNumber}`, "_blank");
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1-");
    return formatted;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Hubungi ${companyName}`}
      size="md"
    >
      <div className="space-y-4">
        {/* Company Info */}
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <span className="text-lg font-bold text-primary-700">
              {companyName?.charAt(0) || "T"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{companyName}</h3>
            <p className="text-sm text-gray-600">Informasi Kontak Perusahaan</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "company"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("company")}
          >
            Perusahaan
          </button>
          <button
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "emergency"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("emergency")}
          >
            Darurat
          </button>
          <button
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "pics"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pics")}
          >
            PIC ({contactData?.pics?.length || 0})
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-700"></div>
            <span className="ml-2 text-gray-600">Loading kontak...</span>
          </div>
        )}

        {/* Company Tab */}
        {activeTab === "company" && contactData?.company && (
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3">
              <h4 className="mb-2 font-medium text-gray-900">Kontak Utama</h4>
              <div className="space-y-2">
                {contactData.company.phoneNumber && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        src="/icons/call-blue.svg"
                        width={16}
                        height={16}
                      />
                      <span className="text-sm text-gray-600">
                        {formatPhoneNumber(contactData.company.phoneNumber)}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleCall(contactData.company.phoneNumber)
                      }
                      className="rounded-md bg-primary-100 px-3 py-1 text-sm text-primary-700 transition-colors hover:bg-primary-200"
                    >
                      Panggil
                    </button>
                  </div>
                )}
                {contactData.company.whatsappBusinessNumber && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        src="/icons/whatsapp.svg"
                        width={16}
                        height={16}
                      />
                      <span className="text-sm text-gray-600">
                        {formatPhoneNumber(
                          contactData.company.whatsappBusinessNumber
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleWhatsApp(
                          contactData.company.whatsappBusinessNumber
                        )
                      }
                      className="rounded-md bg-green-100 px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-200"
                    >
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Emergency Tab */}
        {activeTab === "emergency" && contactData?.emergency && (
          <div className="space-y-3">
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <h4 className="mb-2 font-medium text-red-900">Kontak Darurat</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconComponent src="/icons/user.svg" width={16} height={16} />
                  <span className="text-sm text-gray-600">
                    {contactData.emergency.contactName} -{" "}
                    {contactData.emergency.position}
                  </span>
                </div>
                {contactData.emergency.phoneNumber && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        src="/icons/call-blue.svg"
                        width={16}
                        height={16}
                      />
                      <span className="text-sm text-gray-600">
                        {formatPhoneNumber(contactData.emergency.phoneNumber)}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleCall(contactData.emergency.phoneNumber)
                      }
                      className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-200"
                    >
                      Panggil
                    </button>
                  </div>
                )}
                {contactData.emergency.whatsappNumber && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        src="/icons/whatsapp.svg"
                        width={16}
                        height={16}
                      />
                      <span className="text-sm text-gray-600">
                        {formatPhoneNumber(
                          contactData.emergency.whatsappNumber
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleWhatsApp(contactData.emergency.whatsappNumber)
                      }
                      className="rounded-md bg-green-100 px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-200"
                    >
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PICS Tab */}
        {activeTab === "pics" && contactData?.pics && (
          <div className="space-y-3">
            {contactData.pics
              .filter((pic) => pic.isActive)
              .map((pic) => (
                <div
                  key={pic.id}
                  className="rounded-lg border border-gray-200 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{pic.picName}</h4>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                      {pic.picType}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">{pic.position}</p>
                  <div className="space-y-2">
                    {pic.phoneNumber && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent
                            src="/icons/call-blue.svg"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm text-gray-600">
                            {formatPhoneNumber(pic.phoneNumber)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCall(pic.phoneNumber)}
                          className="rounded-md bg-primary-100 px-3 py-1 text-sm text-primary-700 transition-colors hover:bg-primary-200"
                        >
                          Panggil
                        </button>
                      </div>
                    )}
                    {pic.whatsappNumber && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent
                            src="/icons/whatsapp.svg"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm text-gray-600">
                            {formatPhoneNumber(pic.whatsappNumber)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleWhatsApp(pic.whatsappNumber)}
                          className="rounded-md bg-green-100 px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-200"
                        >
                          WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {contactData.pics.filter((pic) => pic.isActive).length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Tidak ada PIC aktif yang tersedia
              </div>
            )}
          </div>
        )}

        {/* Fallback for no contact data */}
        {!isLoading && !contactData && (
          <div className="py-8 text-center">
            <p className="mb-2 text-gray-500">Kontak tidak tersedia</p>
            <p className="text-sm text-gray-400">
              Gunakan nomor driver: {formatPhoneNumber(phoneNumber)}
            </p>
            <button
              onClick={() => handleCall(phoneNumber)}
              className="mt-3 rounded-md bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
            >
              Panggil Driver
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
