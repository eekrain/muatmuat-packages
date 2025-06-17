import React, { useState } from "react";

import Card, { CardContent } from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import { LocationTypeEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

// Data untuk lokasi muat dan bongkar
const locationData = {
  muat: [
    {
      id: 1,
      title: "Lokasi Muat 1",
      address:
        "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
      note: "Rumah dengan pagar hitam",
      picName: "Abe Maulana",
      phone: "0812-3193-1031",
    },
    {
      id: 2,
      title: "Lokasi Muat 2",
      address:
        "Jl. Ambengan No.51, Pacar Keling, Kec. Genteng, Surabaya, Jawa Timur 60272",
      note: "Gedung sebelah alfamidi",
      picName: "Hardi",
      phone: "0812-5509-99",
    },
  ],
  bongkar: [
    {
      id: 1,
      title: "Lokasi Bongkar 1",
      address:
        "Jalan Perusahaan Raya No.46, Banjararum, Singosari, Malang, Jawa Timur, 65153, Indonesia",
      note: "Gedung Smoore",
      picName: "Julio",
      phone: "0818-3110-01",
    },
    {
      id: 2,
      title: "Lokasi Bongkar 2",
      address:
        "Jalan Raya Karanglo no. 69, Karanglo, Singosari, Malang, Jawa Timur, 65153, Indonesia",
      note: "Gedung Depo Bangunan",
      picName: "Anton",
      phone: "0818-3210-02",
    },
  ],
};

// Component untuk detail item individual
const PICDetailItem = ({ icon, text, className = "", iconClassName }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <IconComponent src={icon} className={iconClassName} />
    <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
      {text}
    </span>
  </div>
);

// Component untuk kartu lokasi individual
const PICLocationCard = ({ locations, title }) => (
  <div className={"flex w-full flex-row gap-8"}>
    <div className="flex h-8 min-w-[178px] items-center">
      <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
        {title}
      </span>
    </div>

    <Card className="rounded-xl border !border-neutral-400 bg-white !shadow-none">
      <CardContent className="h-full !px-4 !py-5">
        <div className="flex h-full flex-col gap-5">
          {locations.map((location, index) => (
            <React.Fragment
              key={`${location.fullAddress}-${location.sequence}`}
            >
              <div className="flex flex-col gap-y-3">
                {/* Header lokasi */}
                <span className="text-[12px] font-bold leading-[14.4px] text-neutral-900">
                  {location.locationType === LocationTypeEnum.PICKUP
                    ? "Lokasi Muat"
                    : "Lokasi Bongkar"}{" "}
                  {location.sequence}
                </span>

                {/* Detail items */}
                <PICDetailItem
                  icon="/icons/location16.svg"
                  iconClassName="icon-muat-trans-secondary-900"
                  text={location.fullAddress}
                />
                <PICDetailItem
                  icon="/icons/topik-amandemen16.svg"
                  iconClassName="icon-fill-muat-trans-secondary-900"
                  text={location.detailAddress}
                />
                <PICDetailItem
                  icon="/icons/profile16.svg"
                  iconClassName="icon-fill-muat-trans-secondary-900"
                  text={location.picName}
                />
                <PICDetailItem
                  icon="/icons/call16.svg"
                  iconClassName="icon-fill-muat-trans-secondary-900"
                  text={location.picPhoneNumber}
                />
              </div>

              {/* Separator (kecuali untuk item terakhir) */}
              {index < locations.length - 1 && (
                <div className="w-full border-t border-neutral-400"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Main component
const DetailPIC = ({ dataDetailPIC }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="shadow-muat flex flex-col items-center rounded-xl bg-neutral-50 p-8">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[18px] font-semibold leading-[21.6px] text-neutral-900">
          Detail PIC
        </h1>
        <button
          onClick={toggleExpanded}
          className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-neutral-100"
        >
          <IconComponent
            src="/icons/chevron-down.svg"
            width={24}
            height={24}
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Main Content Area - FIXED VERSION */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-y-6 pt-6">
          {/* Detail PIC Lokasi Muat Section */}
          <PICLocationCard
            locations={dataDetailPIC.muat}
            title="Detail PIC Lokasi Muat"
          />

          {/* Detail PIC Lokasi Bongkar Section */}
          <PICLocationCard
            locations={dataDetailPIC.bongkar}
            title="Detail PIC Lokasi Bongkar"
          />
        </div>
      </div>
    </div>
  );
};

export default DetailPIC;
