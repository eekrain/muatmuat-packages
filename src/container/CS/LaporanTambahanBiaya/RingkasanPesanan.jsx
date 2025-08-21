import React, { useState } from "react";

import { ChevronDown } from "lucide-react";

// Assuming this is the correct import path
import Card from "@/components/Card/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import { HalalLogistik } from "@/components/HalalLogistik/HalalLogistik";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent } from "@/components/Modal";
// Assuming lucide-react for icons
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";

// Mock data to populate the component, making it easier to manage
const orderSummaryData = {
  isHalal: true,
  fleetInfo: {
    image: "https://picsum.photos/64/64?random=1", // Using placeholder as per guidelines
    type: "Colt Diesel Engkel - Box",
    needs: "3 Unit",
  },
  loadTime: "03 Okt 2024 18:00 WIB",
  route: {
    estimatedDistance: "178 km",
    locations: [
      {
        type: "muat",
        address:
          "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
      },
      {
        type: "bongkar",
        address:
          "Jalan Perusahaan Raya No.46, Banjararum, Singosari, Malang, Jawa Timur, 65153, Indonesia",
      },
    ],
  },
  loadInfo: {
    totalWeight: "1.000 kg",
    items: [
      {
        name: "Besi Baja",
        details: "(1.000 kg) (1x2x5 m)",
      },
    ],
  },
};

const SectionRow = ({ label, children }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
    <p className="w-full text-xs font-medium text-neutral-600 md:w-[178px] md:flex-shrink-0">
      {label}
    </p>
    <div className="flex-1">{children}</div>
  </div>
);

const RingkasanPesanan = () => {
  const [isPicExpanded, setIsPicExpanded] = useState(false);
  const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false);

  return (
    <Card className="border-0">
      <div className="p-6">
        {/* Halal Logistics Banner */}
        {orderSummaryData.isHalal && (
          <HalalLogistik text="Memerlukan pengiriman dengan sertifikasi halal logistik" />
        )}
        {/* Order Summary Section */}
        <div className="mt-6 flex flex-col gap-6">
          <h2 className="text-base font-bold text-neutral-900">
            Ringkasan Pesanan
          </h2>

          {/* Key-Value List Layout */}
          <SectionRow label="Informasi Armada">
            <div className="flex items-center gap-4">
              <LightboxProvider
                image={orderSummaryData.fleetInfo.image}
                title={orderSummaryData.fleetInfo.type}
              >
                <LightboxPreview
                  image={orderSummaryData.fleetInfo.image}
                  alt={orderSummaryData.fleetInfo.type}
                  className="size-[68px] rounded-xl object-cover"
                />
              </LightboxProvider>
              <div>
                <h3 className="text-xs font-bold text-neutral-900">
                  {orderSummaryData.fleetInfo.type}
                </h3>
                <p className="mt-2 text-xs font-medium text-neutral-900">
                  Kebutuhan : {orderSummaryData.fleetInfo.needs} Unit
                </p>
              </div>
            </div>
          </SectionRow>

          <SectionRow label="Waktu Muat">
            <p className="text-xs font-medium text-neutral-900">
              {orderSummaryData.loadTime}
            </p>
          </SectionRow>

          <SectionRow label="Rute">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium text-neutral-900">
                Estimasi {orderSummaryData.route.estimatedDistance} km
              </p>
              <TimelineContainer>
                {orderSummaryData.route.locations.map((loc, index) => (
                  <NewTimelineItem
                    key={index}
                    variant={
                      loc.type === "muat" ? "number-muat" : "number-bongkar"
                    }
                    index={index}
                    totalLength={orderSummaryData.route.locations.length}
                    activeIndex={-1} // Set to -1 to show all as default state
                  >
                    {/* <TimelineContentAddress title={loc.address} /> */}
                    <p>{loc.address}</p>
                  </NewTimelineItem>
                ))}
              </TimelineContainer>
            </div>
          </SectionRow>

          <SectionRow label="Informasi Muatan">
            <div className="flex flex-col gap-2">
              {orderSummaryData.loadInfo.items.map((item, index) => (
                <div key={index} className="mt-1 flex items-start gap-2">
                  <IconComponent
                    src="/icons/box.svg" // Example icon
                    alt="Cargo icon"
                    className="mt-0.5 h-4 w-4 text-neutral-600"
                  />
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold text-neutral-900">
                      {item.name}
                    </span>{" "}
                    {item.details}
                  </p>
                </div>
              ))}
              <Modal closeOnOutsideClick>
                <ModalContent>
                  <div className="flex flex-col gap-y-3 p-6">
                    {/* Header */}
                    <h2 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
                      Informasi Muatan
                    </h2>
                    <div className="flex w-[600px] flex-col items-start gap-2 rounded-xl border border-neutral-400 px-4 py-5">
                      {orderSummaryData.loadInfo.items.map((item, index) => (
                        <div
                          key={index}
                          className="mt-1 flex items-start gap-2"
                        >
                          <IconComponent
                            src="/icons/box.svg" // Example icon
                            alt="Cargo icon"
                            className="mt-0.5 h-4 w-4 text-neutral-600"
                          />
                          <p className="text-sm text-neutral-600">
                            <span className="font-semibold text-neutral-900">
                              {item.name}
                            </span>{" "}
                            {item.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ModalContent>
              </Modal>
            </div>
          </SectionRow>
        </div>
      </div>

      {/* Collapsible PIC Section */}
      <Collapsible open={isPicExpanded} onOpenChange={setIsPicExpanded}>
        <div className="border-t border-neutral-200">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-base font-bold text-neutral-900">
            <span>Detail PIC</span>
            <ChevronDown
              className={`h-5 w-5 text-neutral-500 transition-transform duration-300 ${
                isPicExpanded ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="border-t border-neutral-200 bg-neutral-50 p-6">
            {/* Content for PIC details goes here */}
            <p className="text-sm text-neutral-500">
              Informasi PIC akan ditampilkan di sini.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* "Lihat Selengkapnya" button - for cargo list expansion */}
      <div className="border-t border-neutral-200 p-4 text-center">
        <button
          onClick={() => setIsLoadMoreVisible(!isLoadMoreVisible)}
          className="flex w-full items-center justify-center gap-1 text-sm font-bold text-primary-700"
        >
          <span>
            {isLoadMoreVisible ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
          </span>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              isLoadMoreVisible ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </Card>
  );
};

export default RingkasanPesanan;
