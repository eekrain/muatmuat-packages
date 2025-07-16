import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";

const ModalIncomingDriverWaitingTimeFee = () => {
  const dummyData = [
    {
      name: "Noel Gallagher",
      licensePlate: "AE 666 LBA",
    },
    {
      name: "Noel Gallagher",
      licensePlate: "AE 666 LBA",
    },
  ];
  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <button className="text-[12px] font-medium leading-[14.4px] text-primary-700">
          Lihat Driver
        </button>
      </ModalTrigger>
      <ModalContent>
        <div className="px-6 py-8">
          <div className="flex w-[530px] flex-col items-center">
            <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Informasi
            </h1>
            <div className="mt-6 flex w-full flex-col gap-y-3">
              {dummyData.map((item, key) => (
                <div
                  className={cn(
                    "flex flex-col",
                    dummyData.length - 1 === key
                      ? ""
                      : "border-b border-b-neutral-400 pb-3"
                  )}
                  key={key}
                >
                  <div className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                    {`Driver : ${item.name}`}
                  </div>
                  <div className="mt-2 flex items-center gap-x-1">
                    <IconComponent
                      className="text-muat-trans-secondary-900"
                      src="/icons/transporter12.svg"
                    />
                    <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                      {item.licensePlate}
                    </span>
                  </div>
                  <div className="mt-3 text-[12px] font-medium leading-[14.4px] text-neutral-600">
                    {"Biaya Waktu Tunggu di Lokasi Muat 1 Berlaku Mulai "}
                    <span className="text-neutral-900">
                      06 Jun 2024 17:01 WIB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalIncomingDriverWaitingTimeFee;
