"use client";

import { useState } from "react";

import { TagBubble } from "@/components/Badge/TagBubble";
import { ButtonMini } from "@/components/Button/ButtonMini";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent } from "@/components/Modal";
import { ModalTrigger } from "@/components/Modal/Modal";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";

import { formatDate } from "@/lib/utils/dateFormat";

/**
 * A reusable component to render labeled sections consistently.
 */
const SectionRow = ({ label, children }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
    <p className="w-full text-xs font-medium text-neutral-600 md:w-[178px] md:flex-shrink-0">
      {label}
    </p>
    <div className="flex-1">{children}</div>
  </div>
);

const RingkasanPesanan = ({ dataRingkasanPesanan }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!dataRingkasanPesanan) {
    return null;
  }

  return (
    <div className="w-full max-w-[846px] rounded-xl bg-white p-8 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      <div className="flex flex-col gap-6">
        {dataRingkasanPesanan.isHalalLogistics && (
          <div className="flex h-10 w-full items-center gap-3 rounded-xl bg-[#F7EAFD] px-4">
            <img
              src="/icons/halal.svg"
              width={18}
              height={24}
              alt="Halal Indonesia"
            />
            <span className="mt-0.5 text-center text-xs font-semibold text-[#652672]">
              Menggunakan Layanan Halal Logistik
            </span>
          </div>
        )}

        <h1 className="text-lg font-semibold leading-tight text-neutral-900">
          Ringkasan Pesanan
        </h1>

        {/* --- Always Visible Sections --- */}
        <SectionRow label="Informasi Armada">
          <div className="flex items-center gap-4">
            <LightboxProvider
              image={dataRingkasanPesanan?.vehicle?.image}
              title={dataRingkasanPesanan?.vehicle?.name}
            >
              <LightboxPreview
                image={dataRingkasanPesanan?.vehicle?.image}
                alt={dataRingkasanPesanan?.vehicle?.name}
                className="size-[68px] rounded-xl object-cover"
              />
            </LightboxProvider>
            <div>
              <h3 className="text-xs font-bold text-neutral-900">
                {dataRingkasanPesanan?.vehicle?.name}
              </h3>
              <p className="mt-2 text-xs font-medium text-neutral-900">
                Kebutuhan : {dataRingkasanPesanan?.vehicle?.truckCount} Unit
              </p>
            </div>
          </div>
        </SectionRow>

        <SectionRow label="Waktu Muat">
          <p className="text-xs font-medium text-neutral-900">
            {formatDate(dataRingkasanPesanan?.loadTimeStart)} s/d{" "}
            {formatDate(dataRingkasanPesanan?.loadTimeEnd)}
          </p>
        </SectionRow>

        <SectionRow label="Rute">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-neutral-900">
              Estimasi {dataRingkasanPesanan?.estimatedDistance} km
            </p>
            <TimelineContainer>
              <NewTimelineItem
                variant="bullet"
                index={0}
                activeIndex={0}
                title={dataRingkasanPesanan?.route?.muat?.[0]?.fullAddress}
                isLast={false}
                appearance={{ titleClassname: "text-xs font-medium md:mt-0.5" }}
                buttonDetail={
                  dataRingkasanPesanan?.route?.muat?.length > 1 ? (
                    <ButtonMini className="mt-1">
                      Lihat Lokasi Muat Lainnya
                    </ButtonMini>
                  ) : null
                }
              />
              <NewTimelineItem
                variant="bullet"
                index={1}
                activeIndex={0}
                title={dataRingkasanPesanan?.route?.bongkar?.[0]?.fullAddress}
                isLast={true}
                appearance={{ titleClassname: "text-xs font-medium md:mt-0.5" }}
                buttonDetail={
                  dataRingkasanPesanan?.route?.bongkar?.length > 1 ? (
                    <ButtonMini className="mt-1">
                      Lihat Lokasi Bongkar Lainnya
                    </ButtonMini>
                  ) : null
                }
              />
            </TimelineContainer>
          </div>
        </SectionRow>

        <SectionRow label="Informasi Muatan">
          <div className="flex flex-col gap-2">
            {dataRingkasanPesanan?.cargos?.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <IconComponent
                  src="/icons/muatan16.svg"
                  className="size-4"
                  alt="Muatan Icon"
                />
                <p className="text-xs font-medium text-neutral-900">
                  {item.name} ({item.weight} {item.weightUnit})
                </p>
              </div>
            ))}
            <Modal closeOnOutsideClick>
              {/* 25. 18 - Web - LB - 0085 */}
              {dataRingkasanPesanan?.cargos?.length >= 4 ? (
                <ModalTrigger>
                  <button className="text-start text-xs font-medium leading-[14.4px] text-primary-700">
                    Lihat Informasi Muatan Lainnya
                  </button>
                </ModalTrigger>
              ) : null}
              <ModalContent>
                <div className="flex flex-col gap-y-3 p-6">
                  {/* Header */}
                  <h2 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
                    Informasi Muatan
                  </h2>
                  <div className="flex w-[600px] flex-col items-start gap-2 rounded-xl border border-neutral-400 px-4 py-5">
                    {dataRingkasanPesanan.cargos.map((item, index) => (
                      <div
                        key={index}
                        className="flex w-full flex-row items-center gap-2"
                      >
                        <IconComponent src="/icons/muatan16.svg" />
                        <span className="capsize text-xs font-medium leading-[14.4px] text-neutral-900">
                          {item.name} ({item.weight} {item.weightUnit})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ModalContent>
            </Modal>
          </div>
        </SectionRow>

        {/* Wrapper for collapsible content and its button */}
        <div>
          {/* --- Collapsible Section --- */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-6">
                <SectionRow label="Lampiran/Foto Muatan">
                  <LightboxProvider
                    images={dataRingkasanPesanan?.cargoPhotos}
                    title="Lampiran/Foto Muatan"
                  >
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {dataRingkasanPesanan?.cargoPhotos?.map((src, index) => (
                        <LightboxPreview
                          key={index}
                          image={src}
                          index={index}
                          alt={`Foto Muatan ${index + 1}`}
                          className="size-[124px] rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  </LightboxProvider>
                </SectionRow>

                <SectionRow label="Deskripsi Muatan">
                  <p className="text-xs font-medium leading-[14.4px] text-neutral-900">
                    {dataRingkasanPesanan?.cargoDescription}
                  </p>
                </SectionRow>

                <SectionRow label="No. Delivery Order">
                  <div className="flex flex-wrap gap-2">
                    {dataRingkasanPesanan?.numberDeliveryOrder?.map(
                      (order, index) => (
                        <TagBubble key={index}>{order}</TagBubble>
                      )
                    )}
                  </div>
                </SectionRow>
              </div>
            </div>
          </div>

          {/* --- Collapse Toggle Button --- */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex w-full items-center justify-center gap-2 ${
              isExpanded ? "mt-6" : ""
            }`}
          >
            <span className="text-xs font-semibold text-primary-700">
              {isExpanded ? "Sembunyikan" : "Lihat Selengkapnya"}
            </span>
            <IconComponent
              src="/icons/chevron-up.svg"
              alt="Toggle visibility"
              className={`size-5 text-primary-700 transition-transform duration-300 ${
                !isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RingkasanPesanan;
