"use client";

import { useState } from "react";

import Card, { CardContent } from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import {
  TimelineContainer,
  TimelineContentAddress,
  TimelineItem,
} from "@/components/Timeline";

const RingkasanPesanan = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Data mock untuk demo
  const orderData = {
    armada: {
      name: "Box - Colt Diesel Engkel",
      image: "/img/recommended1.png",
      requirement: "Kebutuhan : 1 Unit",
    },
    waktuMuat: "3 Okt 2024 18:00 WIB s/d 4 Okt 2024 08:00 WIB",
    route: {
      estimasi: "Estimasi 178 km",
      muat: {
        location:
          "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
        hasOthers: true,
      },
      bongkar: {
        location:
          "Jalan Perusahaan Raya No.46, Banjararum, Singosari, Malang, Jawa Timur, 65153, Indonesia",
        hasOthers: true,
      },
    },
    muatan: [
      { name: "Perlengkapan Rumah Tangga", weight: "1.800 kg" },
      { name: "Peralatan dan Kebutuhan Kantor", weight: "2 kg" },
    ],
    photos: [
      "/img/muatan1.png",
      "/img/muatan2.png",
      "/img/muatan3.png",
      "/img/muatan4.png",
    ],
    description:
      "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih",
    deliveryOrders: ["DO-20241023-001", "DO-20241023-002"],
  };

  return (
    // Main Content Card
    <Card className="w-full rounded-xl border-none">
      <CardContent className="flex flex-col gap-6 p-8">
        {/* Header Notification Halal */}
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
            <div className="relative size-[68px] rounded-xl border border-neutral-400 bg-neutral-50">
              <ImageComponent
                src={orderData.armada.image}
                width={68}
                height={68}
                alt="Armada"
                className="rounded-xl object-cover"
              />
              <button className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-3xl bg-neutral-50">
                <IconComponent
                  src="/icons/fullscreen12.svg"
                  width={12}
                  height={12}
                />
              </button>
            </div>

            {/* Armada Info */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[12px] font-bold leading-[14.4px] text-neutral-900">
                {orderData.armada.name}
              </h3>
              <p className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {orderData.armada.requirement}
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
              {orderData.waktuMuat}
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
              {orderData.route.estimasi}
            </p>

            {/* Timeline */}
            <TimelineContainer>
              <TimelineItem
                variant="bullet"
                totalLength={2}
                index={0}
                activeIndex={0}
                className="pb-6"
              >
                <div>
                  <TimelineContentAddress
                    title={orderData.route.muat.location}
                    className="text-[12px] font-medium leading-[14.4px] text-neutral-900"
                  />
                  {orderData.route.muat.hasOthers && (
                    <button className="text-[12px] font-medium leading-[14.4px] text-primary-700">
                      Lihat Lokasi Muat Lainnya
                    </button>
                  )}
                </div>
              </TimelineItem>

              <TimelineItem
                variant="bullet"
                totalLength={2}
                index={1}
                activeIndex={0}
              >
                <div>
                  <TimelineContentAddress
                    title={orderData.route.bongkar.location}
                    className="text-[12px] font-medium leading-[14.4px] text-neutral-900"
                  />
                  {orderData.route.bongkar.hasOthers && (
                    <button className="text-[12px] font-medium leading-[14.4px] text-primary-700">
                      Lihat Lokasi Bongkar Lainnya
                    </button>
                  )}
                </div>
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
              {orderData.muatan.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <IconComponent
                    src="/icons/package.svg"
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                  <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                    {item.name} ({item.weight})
                  </span>
                </div>
              ))}
              <button className="self-start text-[12px] font-medium leading-[14.4px] text-primary-700">
                Lihat Informasi Muatan Lainnya
              </button>
            </div>
          </div>
        </div>

        {/* Lampiran/Foto Muatan */}
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="w-full text-[12px] font-medium leading-[14.4px] text-neutral-600 md:w-[178px]">
            Lampiran/Foto Muatan
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {orderData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <div className="relative size-[124px] overflow-hidden rounded-xl border border-neutral-400">
                    <ImageComponent
                      src={photo}
                      width={124}
                      height={124}
                      alt={`Foto muatan ${index + 1}`}
                      className="size-full object-cover"
                    />
                    <button className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-3xl bg-neutral-50">
                      <IconComponent
                        src="/icons/fullscreen12.svg"
                        width={12}
                        height={12}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deskripsi Muatan */}
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="w-full text-[12px] font-medium leading-[14.4px] text-neutral-600 md:w-[178px]">
            Deskripsi Muatan
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
              {orderData.description}
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
              {orderData.deliveryOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center rounded-2xl border border-primary-700 bg-neutral-50 px-3 py-1.5"
                >
                  <span className="text-[10px] font-semibold leading-[13px] text-primary-700">
                    {order}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Collapse Button */}
        <div className="flex w-full items-center justify-center gap-2">
          <IconComponent
            src="/icons/chevron-up20.svg"
            width={20}
            height={20}
            className="icon-blue"
          />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[12px] font-semibold leading-[14.4px] text-primary-700"
          >
            Sembunyikan
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RingkasanPesanan;
