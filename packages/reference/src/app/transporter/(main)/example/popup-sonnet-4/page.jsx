"use client";

import { useState } from "react";

import { Alert } from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";

const PilihJenisTrukModal = () => {
  const [searchValue, setSearchValue] = useState("");

  // Mock data for truck types
  const recommendedTrucks = [
    {
      id: 1,
      name: "Colt Diesel Engkel (2 Unit)",
      price: "Rp200.000",
      image: "https://picsum.photos/68/68?random=truck1",
      details: [
        { icon: "/icons/truck.svg", text: "Harga per Unit : Rp250.000" },
        { icon: "/icons/weight.svg", text: "Estimasi Kapasitas : 2,5 Ton" },
        {
          icon: "/icons/dimensions.svg",
          text: "Estimasi Dimensi (p x l x t) : 5,7 m x 2,2 m x 2,3 m",
        },
      ],
    },
  ];

  const notRecommendedTrucks = [
    {
      id: 2,
      name: "Colt Diesel Double (1 Unit)",
      price: "Rp200.000",
      image: "https://picsum.photos/68/68?random=truck2",
      details: [
        { icon: "/icons/truck.svg", text: "Harga per Unit : Rp250.000" },
        { icon: "/icons/weight.svg", text: "Estimasi Kapasitas : 2,5 Ton" },
        {
          icon: "/icons/dimensions.svg",
          text: "Estimasi Dimensi (p x l x t) : 5,7 m x 2,2 m x 2,3 m",
        },
      ],
    },
    {
      id: 3,
      name: "Colt Diesel Double",
      price: "Rp200.000",
      image: "https://picsum.photos/68/68?random=truck3",
      details: [
        { icon: "/icons/weight.svg", text: "Estimasi Kapasitas : 2,5 Ton" },
        {
          icon: "/icons/dimensions.svg",
          text: "Estimasi Dimensi (PxLxT) : 5,7 m x 2,2 m x 2,3 m (28,8 m3)",
        },
      ],
    },
    {
      id: 4,
      name: "Colt Diesel Double",
      price: "Rp200.000",
      image: "https://picsum.photos/68/68?random=truck4",
      details: [
        { icon: "/icons/weight.svg", text: "Estimasi Kapasitas : 2,5 Ton" },
        {
          icon: "/icons/dimensions.svg",
          text: "Estimasi Dimensi (PxLxT) : 5,7 m x 2,2 m x 2,3 m (28,8 m3)",
        },
      ],
    },
  ];

  const TruckItem = ({ truck, isRecommended = true }) => (
    <div className="flex flex-row items-start gap-2 border-b border-neutral-400 pb-3 pt-3">
      {/* Truck Image with Lightbox */}
      <div className="relative h-[68px] w-[68px] flex-shrink-0">
        <LightboxProvider image={truck.image} title={truck.name}>
          <LightboxPreview
            image={truck.image}
            alt={truck.name}
            className="h-full w-full rounded object-cover"
          />
        </LightboxProvider>

        {/* Expand Icon Overlay */}
        <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black bg-opacity-60 p-1">
          <IconComponent
            src="/icons/expand.svg"
            width={12}
            height={12}
            className="text-white"
          />
        </div>
      </div>

      {/* Truck Details */}
      <div className="flex flex-1 flex-col justify-center gap-3 py-1">
        {/* Name and Price */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold leading-[14.4px] text-neutral-900">
            {truck.name}
          </h3>
          <p className="text-sm font-semibold leading-[15.4px] text-neutral-900">
            {truck.price}
          </p>
        </div>

        {/* Details List */}
        <div className="flex flex-col gap-2">
          {truck.details.map((detail, index) => (
            <div key={index} className="flex items-center gap-2">
              <IconComponent
                src={detail.icon}
                width={16}
                height={16}
                className="flex-shrink-0 text-[#461B02]"
              />
              <span className="text-xxs font-medium leading-[13px] text-neutral-900">
                {detail.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <Button variant="muattrans-primary">Pilih Jenis Truk</Button>
      </ModalTrigger>
      <ModalContent className="w-[472px]">
        {/* Fixed height container with proper scrolling setup */}
        <div className="flex h-[460px] flex-col p-6 pb-8 pt-8">
          {/* Fixed Header Section - Won't scroll */}
          <div className="flex flex-col gap-4">
            {/* Modal Title */}
            <h2 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
              Pilih Jenis Truk
            </h2>

            {/* Search Field */}
            <div className="flex h-8 w-full items-center gap-2 rounded-md border border-primary-700 bg-white px-3">
              <IconComponent
                src="/icons/search.svg"
                width={16}
                height={16}
                className="flex-shrink-0 text-neutral-700"
              />
              <input
                type="text"
                placeholder="Cari Jenis Truk"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 text-xs font-medium text-neutral-600 placeholder-neutral-600 outline-none"
              />
              <IconComponent
                src="/icons/cursor-click.svg"
                width={16}
                height={16}
                className="flex-shrink-0 text-neutral-900"
              />
            </div>
          </div>

          {/* Scrollable Content Section */}
          <div className="mt-4 flex-1 overflow-y-auto pr-1">
            <div className="flex flex-col gap-4">
              {/* Recommended Section */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center gap-1">
                  <h3 className="text-base font-bold leading-[19.2px] text-neutral-900">
                    Rekomendasi Jenis Truk
                  </h3>
                  <IconComponent
                    src="/icons/info.svg"
                    width={24}
                    height={24}
                    className="text-neutral-700"
                  />
                </div>

                <div className="flex flex-col">
                  {recommendedTrucks.map((truck) => (
                    <TruckItem
                      key={truck.id}
                      truck={truck}
                      isRecommended={true}
                    />
                  ))}
                </div>
              </div>

              {/* Not Recommended Section */}
              <div className="flex flex-col">
                <h3 className="mb-3 text-base font-bold leading-[19.2px] text-neutral-900">
                  Tidak Direkomendasikan
                </h3>

                {/* Warning Alert */}
                <div className="mb-3">
                  <Alert variant="warning" className="w-full">
                    <div className="flex items-center gap-1">
                      <IconComponent
                        src="/icons/warning.svg"
                        width={14}
                        height={14}
                        className="flex-shrink-0 text-warning-900"
                      />
                      <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                        Pilihan truk di bawah ini berisiko kelebihan muatan atau
                        tidak sesuai dengan informasi muatan
                      </span>
                    </div>
                  </Alert>
                </div>

                <div className="flex flex-col">
                  {notRecommendedTrucks.map((truck) => (
                    <TruckItem
                      key={truck.id}
                      truck={truck}
                      isRecommended={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PilihJenisTrukModal;
