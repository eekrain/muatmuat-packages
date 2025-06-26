"use client";

import { useState } from "react";

import { TagBubble } from "@/components/Badge/TagBubble";
import Card, { CardContent } from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import {
  TimelineContainer,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";
import { formatDate } from "@/lib/utils/dateFormat";

import MuatBongkarModal from "./MuatBongkarModal";

const RingkasanPesanan = ({ dataRingkasanPesanan }) => {
  const [isLokasiMuatBongkarModalOpen, setIsLokasiMuatBongkarModalOpen] =
    useState(false);
  const [modalData, setModalData] = useState(null);
  const [isPickup, setIsPickup] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    // Main Content Card
    <>
      <Card className="w-full rounded-xl border-none">
        <CardContent className="p-8">
          <div className="flex flex-col gap-y-6">
            {/* Header Notification Halal */}
            {dataRingkasanPesanan.isHalalLogistics && (
              <div className="flex h-10 w-full items-center rounded-xl bg-[#F7EAFD] px-4">
                <div className="flex items-center gap-3">
                  <ImageComponent
                    src="/icons/halal.svg"
                    width={18}
                    height={24}
                    alt="Halal Indonesia"
                  />
                  <span className="text-center text-[12px] font-semibold leading-[14.4px] text-[#652672]">
                    Menggunakan Layanan Halal Logistik
                  </span>
                </div>
              </div>
            )}

            {/* Page Title */}
            <h1 className="mb-6 text-lg font-bold leading-[21.6px] text-neutral-900">
              Ringkasan Pesanan
            </h1>
            {/* Informasi Armada */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="w-full text-[12px] font-medium leading-[14.4px] text-neutral-600 md:w-[178px]">
                Informasi Armada
              </div>
              <div className="flex flex-1 items-center gap-4">
                {/* Armada Image */}
                <LightboxProvider
                  image={dataRingkasanPesanan?.vehicle?.image}
                  title={dataRingkasanPesanan?.vehicle?.name}
                >
                  <LightboxPreview
                    image={dataRingkasanPesanan?.vehicle?.image}
                    alt="Jenis Carrier"
                    className="size-[68px]"
                    withZoom={true}
                  />
                </LightboxProvider>

                {/* Armada Info */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[12px] font-bold leading-[14.4px] text-neutral-900">
                    {dataRingkasanPesanan?.vehicle?.name}
                  </h3>
                  <p className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                    Kebutuhan : {dataRingkasanPesanan?.vehicle.truckCount} Unit
                  </p>
                </div>
              </div>
            </div>

            {/* Waktu Muat */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="w-full text-[12px] font-medium leading-[14.4px] text-neutral-600 md:w-[178px]">
                Waktu Muat
              </div>
              <div className="flex-1">
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  {formatDate(dataRingkasanPesanan?.loadTimeStart)} s/d{" "}
                  {dataRingkasanPesanan?.loadTimeEnd
                    ? `s/d ${formatDate(dataRingkasanPesanan?.loadTimeEnd)}`
                    : null}
                </span>
              </div>
            </div>

            {/* Rute */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="w-full text-[12px] font-medium leading-[14.4px] text-neutral-600 md:w-[178px]">
                Rute
              </div>
              <div className="flex-1">
                <p className="mb-3 text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  Estimasi {dataRingkasanPesanan?.estimatedDistance} km
                </p>

                {/* Timeline */}
                <TimelineContainer>
                  <TimelineItem
                    variant="bullet"
                    totalLength={2}
                    index={0}
                    activeIndex={0}
                  >
                    <TimelineContentWithButtonDate
                      title={
                        dataRingkasanPesanan?.route?.muat?.[0]?.fullAddress ||
                        ""
                      }
                      withButton={
                        dataRingkasanPesanan?.route?.muat &&
                        dataRingkasanPesanan?.route?.muat.length > 1
                          ? {
                              label: "Lihat Lokasi Muat Lainnya",
                              onClick: () => {
                                setModalData(
                                  dataRingkasanPesanan?.route?.muat.map(
                                    (item, index) => ({
                                      ...item,
                                      index,
                                      isPickup: true,
                                    })
                                  )
                                );
                                setIsPickup(true);
                                setIsLokasiMuatBongkarModalOpen(true);
                              },
                            }
                          : undefined
                      }
                    />
                  </TimelineItem>

                  <TimelineItem
                    variant="bullet"
                    totalLength={2}
                    index={1}
                    activeIndex={0}
                  >
                    <TimelineContentWithButtonDate
                      title={
                        dataRingkasanPesanan?.route?.bongkar?.[0]
                          ?.fullAddress || ""
                      }
                      withButton={
                        dataRingkasanPesanan?.route?.bongkar &&
                        dataRingkasanPesanan?.route?.bongkar.length > 1
                          ? {
                              label: "Lihat Lokasi Bongkar Lainnya",
                              onClick: () => {
                                setModalData(
                                  dataRingkasanPesanan?.route?.bongkar.map(
                                    (item, index) => ({
                                      ...item,
                                      index,
                                      isPickup: false,
                                    })
                                  )
                                );
                                setIsPickup(false);
                                setIsLokasiMuatBongkarModalOpen(true);
                              },
                            }
                          : undefined
                      }
                    />
                  </TimelineItem>
                </TimelineContainer>
              </div>
            </div>

            {/* Informasi Muatan */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="w-full text-[12px] font-medium leading-[14.4px] text-neutral-600 md:w-[178px]">
                Informasi Muatan
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-2">
                  {dataRingkasanPesanan.cargos
                    .slice(0, 2)
                    .map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <IconComponent
                          src="/icons/package.svg"
                          width={16}
                          height={16}
                          className="flex-shrink-0"
                        />
                        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                          {item.name} ({item.weight} {item.weightUnit})
                        </span>
                      </div>
                    ))}
                  <Modal closeOnOutsideClick={false}>
                    <ModalTrigger>
                      <button className="text-[12px] font-medium leading-[14.4px] text-primary-700">
                        Lihat Informasi Muatan Lainnya
                      </button>
                    </ModalTrigger>
                    <ModalContent>
                      <div className="flex flex-col gap-y-3 p-6">
                        {/* Header */}
                        <h2 className="text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
                          Informasi Muatan
                        </h2>
                        <div className="flex w-[600px] flex-col items-start gap-2 rounded-xl border border-neutral-400 px-4 py-5">
                          {dataRingkasanPesanan.cargos.map((item, index) => (
                            <div
                              key={index}
                              className="flex w-full flex-row items-center gap-2"
                            >
                              <IconComponent src="/icons/muatan16.svg" />
                              <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                                {item.name} ({item.weight} {item.weightUnit})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ModalContent>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {/* SECTION YG DI OPEN/CLOSE - FINAL VERSION */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded
                ? "mt-6 max-h-[1000px] opacity-100"
                : "mt-0 max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-y-6">
              {/* Lampiran/Foto Muatan */}
              <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                <div className="w-full text-[12px] font-medium leading-[14.4px] text-neutral-600 md:w-[178px]">
                  Lampiran/Foto Muatan
                </div>
                <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
                  <LightboxProvider
                    images={dataRingkasanPesanan.cargoPhotos}
                    title="Lampiran/Foto Muatan"
                  >
                    {dataRingkasanPesanan.cargoPhotos.map((image, index) => (
                      <LightboxPreview
                        key={image}
                        image={image}
                        alt={`Foto muatan ${index + 1}`}
                        className="size-[124px]"
                        withZoom={true}
                      />
                    ))}
                  </LightboxProvider>
                </div>
              </div>

              {/* Deskripsi Muatan */}

              <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                <div className="w-full text-[12px] font-medium leading-[14.4px] text-neutral-600 md:w-[178px]">
                  Deskripsi Muatan
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                    {dataRingkasanPesanan.cargoDescription}
                  </p>
                </div>
              </div>

              {/* No. Delivery Order */}
              <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                <div className="w-full text-[12px] font-medium leading-[14.4px] text-neutral-600 md:w-[178px]">
                  No. Delivery Order
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {dataRingkasanPesanan.numberDeliveryOrder.map(
                      (orderNumber) => (
                        <TagBubble key={orderNumber}>{orderNumber}</TagBubble>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collapse Button */}
          <button
            className="mt-6 flex w-full items-center justify-center gap-2"
            onClick={() => setIsExpanded((prevState) => !prevState)}
          >
            <IconComponent
              src="/icons/chevron-up20.svg"
              width={20}
              height={20}
              className={`icon-blue transition-transform duration-300 ${!isExpanded ? "rotate-180" : ""}`}
            />
            <span className="text-[12px] font-semibold leading-[14.4px] text-primary-700">
              {isExpanded ? "Sembunyikan" : "Lihat Selengkapnya"}
            </span>
          </button>
        </CardContent>
      </Card>

      {/* Modal Lokasi Muat dan Bongkar */}
      <MuatBongkarModal
        isOpen={isLokasiMuatBongkarModalOpen}
        setIsOpen={setIsLokasiMuatBongkarModalOpen}
        data={modalData}
        title={isPickup ? "Lokasi Muat" : "Lokasi Bongkar"}
      />
    </>
  );
};

export default RingkasanPesanan;
