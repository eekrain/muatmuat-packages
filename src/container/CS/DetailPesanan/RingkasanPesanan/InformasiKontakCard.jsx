import React from "react";

import IconComponent from "@/components/IconComponent/IconComponent";

import { HubungiMuatransModal } from "./ModalHubungi";

/**
 * @param {{
 * logo: string;
 * companyName: string;
 * details: { text: string; icon?: string }[];
 * onContact: () => void;
 * }} props
 */
const ContactDetail = ({ logo, companyName, details }) => (
  <div className="flex w-full items-center gap-2">
    <div className="shrink-0">
      <img
        src={logo}
        alt={`${companyName} logo`}
        className="h-10 w-10 rounded-full border border-[#9D9D9D] object-contain"
      />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-col justify-center gap-3">
        <h3 className="truncate text-xs font-bold text-black">{companyName}</h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {details.map((detail, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-1">
                {detail.icon && (
                  <IconComponent
                    src={detail.icon}
                    alt=""
                    width={16}
                    height={16}
                    className="shrink-0 text-[#461B02]"
                  />
                )}
                <span className="truncate text-xs font-medium text-black">
                  {detail.text}
                </span>
              </div>
              {index < details.length - 1 && (
                <span
                  className="hidden h-0.5 w-0.5 rounded-full bg-[#7B7B7B] sm:inline-block"
                  aria-hidden="true"
                ></span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
    <div className="shrink-0">
      <HubungiMuatransModal />
    </div>
  </div>
);

export const InformasiKontakCard = () => {
  const shipperDetails = [
    { text: "0812-4321-6666", icon: "/icons/phone-call-16.svg" },
    { text: "Kec. Tegalsari, Kota Surabaya", icon: "/icons/location-16.svg" },
  ];

  const transporterDetails = [
    { text: "1 Unit", icon: "/icons/truck-16.svg" },
    { text: "0246-5844-60", icon: "/icons/phone-call-16.svg" },
    { text: "Kec. Tegalsari, Kota Surabaya", icon: "/icons/location-16.svg" },
  ];

  return (
    <div className="mt-6 flex w-full flex-col gap-5 rounded-xl border border-[#C4C4C4] bg-white px-4 py-5">
      {/* Shipper Section */}
      <div className="flex w-full flex-col gap-3 self-stretch">
        <h2 className="text-xs font-bold text-black">Informasi Shipper</h2>
        <ContactDetail
          logo="https://picsum.photos/200/200?random=1"
          companyName="PT. Airmas International (AIRI)"
          details={shipperDetails}
          onContact={() => alert("Menghubungi Shipper...")}
        />
      </div>

      <hr className="w-full self-stretch border-t border-[#C4C4C4]" />

      {/* Transporter Section */}
      <div className="flex w-full flex-col gap-3 self-stretch">
        <h2 className="text-xs font-bold text-black">Informasi Transporter</h2>
        <ContactDetail
          logo="https://picsum.photos/200/200?random=2"
          companyName="PT. Siba Surya"
          details={transporterDetails}
        />
      </div>
    </div>
  );
};
