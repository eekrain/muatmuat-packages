"use client";

import IconComponent from "@/components/IconComponent/IconComponent";
import { MapContainer } from "@/components/MapContainer/MapContainer";
import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "@/components/Modal/Modal";

const ModalLihatLokasi = ({
  children,
  coordinates = { latitude: -6.3937, longitude: 106.8286 },
  companyName = "PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional",
  address = "Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452",
  shortAddress = "Jl. Anggrek No. 123, RT 05 RW 09",
}) => {
  return (
    <Modal>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent
        size="large"
        type="muattrans"
        className="h-[421px] w-[90vw] max-w-4xl p-5"
      >
        <div className="flex flex-row-reverse items-start">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div>
                <ModalTitle className="text-left font-semibold text-black">
                  Lihat Lokasi
                </ModalTitle>
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-neutral-600">
                  <IconComponent
                    src="/icons/marker-lokasi-muat.svg"
                    className="h-6 w-6"
                  />
                  {shortAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Content - Full Map */}
          <div className="h-full flex-1">
            <MapContainer
              coordinates={coordinates}
              className="h-[390px] w-full"
              viewOnly={true}
              textLabel={`${companyName} - ${address}`}
              draggableMarker={false}
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalLihatLokasi;
