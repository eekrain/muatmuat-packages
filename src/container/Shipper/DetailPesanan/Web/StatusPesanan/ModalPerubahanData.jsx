import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { TimelineContainer, TimelinePICData } from "@/components/Timeline";

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

export const ModalPerubahanData = ({ open, onOpenChange }) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent className="p-6" type="muatmuat">
        <h1 className="mb-4 text-center text-base font-bold leading-[1.2] text-neutral-900">
          Detail Sebelum Perubahan
        </h1>

        <div className="w-[752px] rounded-lg border border-neutral-400 pr-[6px]">
          <div className="flex h-[386px] w-full flex-col overflow-y-auto pl-4 pr-[6px]">
            {/* Waktu Muat Lama */}
            <div className="box-border flex h-14 w-full flex-row items-center gap-4 border-b border-neutral-400 py-3">
              <div className="flex h-8 w-8 flex-row items-center justify-center rounded-full bg-[#FFC217] p-2">
                <div className="flex h-4 w-4 items-center justify-center">
                  <IconComponent
                    src="/icons/calendar16.svg"
                    className="h-4 w-4"
                  />
                </div>
              </div>

              <h2 className="text-xs font-bold leading-tight text-neutral-900">
                Waktu Muat
              </h2>
            </div>

            <div className="flex items-center border-b border-neutral-400 py-3 pl-12">
              <div className="flex flex-col gap-y-3">
                <span className="text-xs font-medium text-neutral-600">
                  Waktu Muat
                </span>
                <span className="text-xs font-medium text-neutral-900">
                  06 Jun 2024 12:00 WIB s/d 06 Jun 2024 16:00 WIB
                </span>
              </div>
            </div>

            {/* Lokasi Muat & Bongkar Lama */}
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

            <div className="flex-1 pb-3 pl-[48px] pt-8">
              <TimelineContainer>
                {locationData.muat.map((location, index) => (
                  <TimelinePICData
                    key={index}
                    data={location}
                    variant={"number-muat"}
                    isLast={false}
                    index={index}
                    title={index === 0 ? "Lokasi Muat" : null}
                    className={
                      index === locationData.muat.length - 1 ? "pb-9" : ""
                    }
                  />
                ))}
                {locationData.bongkar.map((location, index) => (
                  <TimelinePICData
                    key={index}
                    data={location}
                    variant={"number-bongkar"}
                    isLast={index === locationData.bongkar.length - 1}
                    index={index}
                    title={index === 0 ? "Lokasi Bongkar" : null}
                    className={
                      index === locationData.bongkar.length - 1 ? "pb-0" : ""
                    }
                  />
                ))}
              </TimelineContainer>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
