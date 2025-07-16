import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import {
  TimelineContainer,
  TimelineItem,
  TimelinePICData,
} from "@/components/Timeline";

const locationData = {
  muat: [
    {
      address:
        "Jl. Ngagel No.128, Ngagel, Kec. Wonokromo, Surabaya, Jawa Timur 60246",
      details:
        "Sebelah bakso presiden, gedung warna kuning, pagar warna hitam, ada mobil grandmax",
      picName: "Siti Nurmala",
      picPhone: "0813-9860-0000",
    },
    {
      address:
        "Jl. Ambengan No.51, Pacar Keling, Kec. Genteng, Surabaya, Jawa Timur 60272",
      details: "gedung warna kuning, pagar warna hitam",
      picName: "Sari",
      picPhone: "0812-8874-0230",
    },
    {
      address:
        "Jl. Ambengan No.51, Pacar Keling, Kec. Genteng, Surabaya, Jawa Timur 60272",
      details: "gedung warna kuning, pagar warna hitam",
      picName: "Sari",
      picPhone: "0812-8874-0230",
    },
  ],
  bongkar: [
    {
      address:
        "Jl. Raya Darmo No.23, Keputran, Kec. Tegalsari, Surabaya, Jawa Timur 60265",
      details: "gedung warna putih, sebelah bank BCA, ada pos satpam",
      picName: "Budi Santoso",
      picPhone: "0856-4321-9876",
    },
    {
      address:
        "Jl. Pemuda No.15, Embong Kaliasin, Kec. Genteng, Surabaya, Jawa Timur 60271",
      details: "gedung perkantoran lantai 3, lobby warna abu-abu",
      picName: "Linda Wijaya",
      picPhone: "0878-5544-3322",
    },
  ],
};

export const ModalPerubahanData = () => {
  const [heights, setHeights] = useState([]);

  return (
    <Modal>
      <ModalTrigger>
        <button className="text-[12px] font-medium leading-[14.4px] text-primary-700">
          Lihat Perubahan
        </button>
      </ModalTrigger>

      <ModalContent className="p-6" type="muatmuat">
        <h1 className="mb-4 text-center text-base font-bold leading-[1.2] text-neutral-900">
          Detail Sebelum Perubahan
        </h1>

        <div className="w-[752px] rounded-lg border border-neutral-400 pr-[6px]">
          <div className="flex h-[386px] w-full flex-col overflow-y-auto pl-4 pr-[6px]">
            <div className="box-border flex h-14 w-full flex-row items-center gap-4 border-b border-neutral-400 py-3">
              <div className="flex h-8 w-8 flex-row items-center justify-center rounded-full bg-[#FFC217] p-2">
                <div className="flex h-4 w-4 items-center justify-center">
                  <IconComponent
                    src="/icons/stepper/stepper-point-a-b.svg"
                    className="h-4 w-4"
                  />
                </div>
              </div>

              <h2 className="text-xs font-bold leading-tight text-neutral-900">
                Lokasi Muat & Bongkar
              </h2>
            </div>

            <div className="flex-1 py-3 pl-[48px]">
              <TimelineContainer>
                {locationData.muat.map((location, index) => (
                  <TimelineItem
                    key={index}
                    variant={"number-muat"}
                    totalLength={Infinity}
                    index={index}
                    appearance={
                      index === 0
                        ? {
                            lineClassname: "top-[18px]",
                            bulletClassname: "top-[18px]",
                          }
                        : {}
                    }
                  >
                    <TimelinePICData
                      title={index === 0 ? "Lokasi Muat" : null}
                      address={location.address}
                      details={location.details}
                      picName={location.picName}
                      picPhone={location.picPhone}
                      setHeight={(height) =>
                        setHeights((prev) => [...prev, height])
                      }
                      className={
                        index === locationData.muat.length - 1 ? "pb-6" : ""
                      }
                    />
                  </TimelineItem>
                ))}
                {locationData.bongkar.map((location, index) => (
                  <TimelineItem
                    className={index === 0 ? "-mt-3" : ""}
                    key={index}
                    variant={"number-bongkar"}
                    totalLength={locationData.bongkar.length}
                    index={index}
                    appearance={
                      index === 0
                        ? {
                            lineClassname: "top-[18px]",
                            bulletClassname: "top-[18px]",
                          }
                        : {}
                    }
                  >
                    <TimelinePICData
                      title={index === 0 ? "Lokasi Bongkar" : null}
                      address={location.address}
                      details={location.details}
                      picName={location.picName}
                      picPhone={location.picPhone}
                      setHeight={(height) =>
                        setHeights((prev) => [...prev, height])
                      }
                      className={
                        index === locationData.bongkar.length - 1 ? "pb-0" : ""
                      }
                    />
                  </TimelineItem>
                ))}
              </TimelineContainer>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
