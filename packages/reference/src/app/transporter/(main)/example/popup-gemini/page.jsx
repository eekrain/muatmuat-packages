"use client";

import { useState } from "react";

import { Alert } from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";

// Mock data for demonstration purposes
const recommendedTrucks = [
  {
    id: 1,
    name: "Colt Diesel Engkel",
    units: 2,
    price: 200000,
    pricePerUnit: 250000,
    capacity: "2,5 Ton",
    dimensions: "5,7 m x 2,2 m x 2,3 m",
    imageUrl: "https://picsum.photos/68/68?random=1",
  },
];

const notRecommendedTrucks = [
  {
    id: 2,
    name: "Colt Diesel Double",
    units: 1,
    price: 200000,
    pricePerUnit: 250000,
    capacity: "4 Ton",
    dimensions: "6,0 m x 2,3 m x 2,4 m",
    imageUrl: "https://picsum.photos/68/68?random=2",
  },
];

// Reusable Truck Item Component
const TruckItem = ({ truck }) => (
  <div className="flex w-full items-start gap-2 border-b border-neutral-400 py-4">
    <div className="relative h-[68px] w-[68px] flex-shrink-0">
      <LightboxProvider image={truck.imageUrl} title={truck.name}>
        <LightboxPreview
          image={truck.imageUrl}
          alt={truck.name}
          className="h-full w-full rounded-md object-cover"
        />
      </LightboxProvider>
    </div>
    <div className="flex flex-1 flex-col justify-center gap-3 self-stretch">
      <div className="flex flex-col">
        <h4 className="font-sans text-xs font-bold text-neutral-900">
          {truck.name} ({truck.units} Unit)
        </h4>
        <p className="font-sans text-sm font-semibold text-neutral-900">
          {`Rp${truck.price.toLocaleString("id-ID")}`}
        </p>
      </div>
      <div className="flex flex-col gap-2 text-xxs font-medium leading-[13px] text-neutral-900">
        <div className="flex items-center gap-2">
          <IconComponent
            src="/icons/jenis-truck/truck-price.svg"
            alt="Harga Icon"
            width={16}
            height={16}
            className="text-muat-trans-secondary-900"
          />
          <span>
            Harga per Unit : Rp{truck.pricePerUnit.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <IconComponent
            src="/icons/jenis-truck/scale.svg"
            alt="Kapasitas Icon"
            width={16}
            height={16}
            className="text-muat-trans-secondary-900"
          />
          <span>Estimasi Kapasitas : {truck.capacity}</span>
        </div>
        <div className="flex items-center gap-2">
          <IconComponent
            src="/icons/jenis-truck/dimension.svg"
            alt="Dimensi Icon"
            width={16}
            height={16}
            className="text-muat-trans-secondary-900"
          />
          <span>Estimasi Dimensi (p x l x t) : {truck.dimensions}</span>
        </div>
      </div>
    </div>
  </div>
);

export const PilihJenisTrukModal = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Modal>
      <ModalTrigger>
        <Button variant="muattrans-primary">Pilih Jenis Truk</Button>
      </ModalTrigger>
      <ModalContent className="w-[472px] p-0" type="muatmuat">
        <div className="flex h-[460px] flex-col py-8">
          <div className="flex flex-col gap-4 px-6">
            <h2 className="text-center font-sans text-base font-bold text-neutral-900">
              Pilih Jenis Truk
            </h2>
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Cari Jenis Truk"
              className="border-primary-700"
              leftIcon={
                <IconComponent
                  src="/icons/search.svg"
                  alt="Search Icon"
                  width={16}
                  height={16}
                  className="text-neutral-700"
                />
              }
            />
          </div>

          <div className="mt-4 flex-1 overflow-y-auto px-6">
            {/* Recommended Section */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <h3 className="font-sans text-base font-bold text-neutral-900">
                  Rekomendasi Truk Sesuai Muatan
                </h3>
                <InfoTooltip>
                  <p>Truk yang direkomendasikan berdasarkan muatan Anda.</p>
                </InfoTooltip>
              </div>
              <div className="mt-4 flex flex-col">
                {recommendedTrucks.map((truck) => (
                  <TruckItem key={truck.id} truck={truck} />
                ))}
              </div>
            </div>

            {/* Not Recommended Section */}
            <div className="mt-4 flex flex-col">
              <h3 className="font-sans text-base font-bold text-neutral-900">
                Tidak Direkomendasikan
              </h3>
              <Alert variant="warning" className="mt-4 flex items-center gap-1">
                <IconComponent
                  src="/icons/warning-outline.svg"
                  alt="Warning Icon"
                  width={14}
                  height={14}
                  className="text-warning-900"
                />
                <span className="text-xs font-semibold text-neutral-900">
                  Pilihan truk di bawah ini berisiko kelebihan muatan atau tidak
                  sesuai dengan informasi muatan
                </span>
              </Alert>
              <div className="mt-4 flex flex-col">
                {notRecommendedTrucks.map((truck) => (
                  <TruckItem key={truck.id} truck={truck} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PilihJenisTrukModal;
