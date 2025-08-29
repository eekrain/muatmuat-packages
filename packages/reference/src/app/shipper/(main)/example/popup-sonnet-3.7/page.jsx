"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";

const TruckSelectionModal = () => {
  const [searchValue, setSearchValue] = useState("");

  const recommendedTrucks = [
    {
      id: "truck1",
      name: "Colt Diesel Engkel",
      units: 2,
      totalPrice: 200000,
      unitPrice: 250000,
      capacity: "2,5 Ton",
      dimensions: "5,7 m x 2,2 m x 2,3 m",
      image: "https://picsum.photos/68?random=truck1",
    },
  ];

  const notRecommendedTrucks = [
    {
      id: "truck2",
      name: "Colt Diesel Double",
      units: 1,
      totalPrice: 200000,
      unitPrice: 250000,
      capacity: "2,5 Ton",
      dimensions: "5,7 m x 2,2 m x 2,3 m",
      image: "https://picsum.photos/68?random=truck2",
    },
    {
      id: "truck3",
      name: "Colt Diesel Double",
      totalPrice: 200000,
      capacity: "2,5 Ton",
      dimensions: "5,7 m x 2,2 m x 2,3 m (28,8 m3)",
      image: "https://picsum.photos/68?random=truck3",
    },
    {
      id: "truck4",
      name: "Colt Diesel Double",
      totalPrice: 200000,
      capacity: "2,5 Ton",
      dimensions: "5,7 m x 2,2 m x 2,3 m (28,8 m3)",
      image: "https://picsum.photos/68?random=truck4",
    },
  ];

  return (
    <Modal>
      <ModalTrigger>
        <Button variant="muattrans-primary">Pilih Jenis Truk</Button>
      </ModalTrigger>
      <ModalContent className="max-h-[460px] w-[472px] p-0">
        <div className="flex h-[460px] flex-col">
          {/* Modal Header */}
          <h2 className="mt-8 text-center text-base font-bold leading-[19.2px] text-neutral-900">
            Pilih Jenis Truk
          </h2>

          {/* Search Field */}
          <div className="mx-6 mt-4">
            <div className="flex h-8 items-center gap-2 rounded-md border border-primary-700 px-3">
              <IconComponent
                src="/icons/search16.svg"
                width={16}
                height={16}
                className="text-neutral-700"
              />
              <input
                type="text"
                placeholder="Cari Jenis Truk"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-full flex-1 bg-transparent text-xs text-neutral-600 outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="mt-4 flex-1 overflow-y-auto px-6 pb-8 pr-[22px]">
            <div className="flex flex-col gap-4">
              {/* Recommended Trucks Section */}
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-base font-bold leading-[19.2px] text-neutral-900">
                    Rekomendasi Truk Sesuai Muatan
                  </h3>
                  <IconComponent
                    src="/icons/info16.svg"
                    width={16}
                    height={16}
                    className="text-neutral-900"
                  />
                </div>

                {/* Recommended Truck Items */}
                {recommendedTrucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="flex gap-2 border-b border-neutral-400 py-3"
                  >
                    {/* Truck Image with Lightbox */}
                    <div className="relative h-[68px] w-[68px]">
                      <LightboxProvider
                        image={truck.image}
                        title={`${truck.name} (${truck.units} Unit)`}
                      >
                        <LightboxPreview
                          image={truck.image}
                          alt={truck.name}
                          className="h-full w-full rounded-md object-cover"
                        />
                      </LightboxProvider>
                    </div>

                    {/* Truck Details */}
                    <div className="flex flex-1 flex-col justify-center gap-3 py-1">
                      <h4 className="text-xs font-bold leading-[14.4px] text-neutral-900">
                        {truck.name} ({truck.units} Unit)
                      </h4>
                      <p className="text-sm font-semibold leading-[15.4px] text-neutral-900">
                        Rp{truck.totalPrice.toLocaleString("id-ID")}
                      </p>

                      <div className="flex flex-col gap-2">
                        {/* Price per unit */}
                        <div className="flex items-center gap-2">
                          <IconComponent
                            src="/icons/price.svg"
                            width={16}
                            height={16}
                            className="text-[#461B02]"
                          />
                          <p className="text-xxs font-medium leading-[13px] text-neutral-900">
                            Harga per Unit : Rp
                            {truck.unitPrice.toLocaleString("id-ID")}
                          </p>
                        </div>

                        {/* Capacity */}
                        <div className="flex items-center gap-2">
                          <IconComponent
                            src="/icons/weight.svg"
                            width={16}
                            height={16}
                            className="text-[#461B02]"
                          />
                          <p className="text-xxs font-medium leading-[13px] text-neutral-900">
                            Estimasi Kapasitas : {truck.capacity}
                          </p>
                        </div>

                        {/* Dimensions */}
                        <div className="flex items-center gap-2">
                          <IconComponent
                            src="/icons/dimension.svg"
                            width={16}
                            height={16}
                            className="text-[#461B02]"
                          />
                          <p className="text-xxs font-medium leading-[13px] text-neutral-900">
                            Estimasi Dimensi (p x l x t) : {truck.dimensions}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Not Recommended Section */}
              <div>
                <h3 className="text-base font-bold leading-[19.2px] text-neutral-900">
                  Tidak Direkomendasikan
                </h3>

                {/* Warning Badge */}
                <div className="my-3 flex items-center gap-1 rounded-lg bg-warning-100 p-2">
                  <IconComponent
                    src="/icons/warning14.svg"
                    width={14}
                    height={14}
                    className="text-warning-900"
                  />
                  <p className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                    Pilihan truk di bawah ini berisiko kelebihan muatan atau
                    tidak sesuai dengan informasi muatan
                  </p>
                </div>

                {/* Not Recommended Truck Items */}
                {notRecommendedTrucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="flex gap-2 border-b border-neutral-400 py-3"
                  >
                    {/* Truck Image with Lightbox */}
                    <div className="relative h-[68px] w-[68px]">
                      <LightboxProvider
                        image={truck.image}
                        title={
                          truck.units
                            ? `${truck.name} (${truck.units} Unit)`
                            : truck.name
                        }
                      >
                        <LightboxPreview
                          image={truck.image}
                          alt={truck.name}
                          className="h-full w-full rounded-md object-cover"
                        />
                        <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black bg-opacity-60">
                          <IconComponent
                            src="/icons/expand.svg"
                            width={12}
                            height={12}
                            className="text-white"
                          />
                        </div>
                      </LightboxProvider>
                    </div>

                    {/* Truck Details */}
                    <div className="flex flex-1 flex-col justify-center gap-3 py-1">
                      <h4 className="text-xs font-bold leading-[14.4px] text-neutral-900">
                        {truck.name} {truck.units && `(${truck.units} Unit)`}
                      </h4>
                      <p className="text-sm font-semibold leading-[15.4px] text-neutral-900">
                        Rp{truck.totalPrice.toLocaleString("id-ID")}
                      </p>

                      <div className="flex flex-col gap-2">
                        {/* Price per unit - only show if units specified */}
                        {truck.unitPrice && (
                          <div className="flex items-center gap-2">
                            <IconComponent
                              src="/icons/price.svg"
                              width={16}
                              height={16}
                              className="text-neutral-700"
                            />
                            <p className="text-xxs font-medium leading-[13px] text-neutral-900">
                              Harga per Unit : Rp
                              {truck.unitPrice.toLocaleString("id-ID")}
                            </p>
                          </div>
                        )}

                        {/* Capacity */}
                        <div className="flex items-center gap-2">
                          <IconComponent
                            src="/icons/weight.svg"
                            width={16}
                            height={16}
                            className="text-neutral-700"
                          />
                          <p className="text-xxs font-medium leading-[13px] text-neutral-900">
                            Estimasi Kapasitas : {truck.capacity}
                          </p>
                        </div>

                        {/* Dimensions */}
                        <div className="flex items-center gap-2">
                          <IconComponent
                            src="/icons/dimension.svg"
                            width={16}
                            height={16}
                            className="text-neutral-700"
                          />
                          <p className="text-xxs font-medium leading-[13px] text-neutral-900">
                            Estimasi Dimensi (p x l x t) : {truck.dimensions}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default TruckSelectionModal;
