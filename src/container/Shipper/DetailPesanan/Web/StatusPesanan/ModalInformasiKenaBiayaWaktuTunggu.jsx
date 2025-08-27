import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";

import { cn } from "@/lib/utils";

/**
 * @typedef {Object} Driver
 * @property {string} name
 * @property {string} licensePlate
 */

/**
 * @param {Object} param
 * @param {Driver[]} param.data
 * @returns
 */
export const ModalInformasiKenaBiayaWaktuTunggu = ({ data = [] }) => {
  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <button className="text-xs font-medium leading-[14.4px] text-primary-700">
          Lihat Driver
        </button>
      </ModalTrigger>
      <ModalContent type="muatmuat">
        <div className="px-6 py-8">
          <div className="flex w-[530px] flex-col items-center">
            <h1 className="text-base font-bold leading-[19.2px] text-neutral-900">
              Informasi
            </h1>
            <div className="mt-6 flex w-full flex-col gap-y-3">
              {data.map((item, key) => (
                <div
                  className={cn(
                    "flex flex-col",
                    data.length - 1 === key
                      ? ""
                      : "border-b border-b-neutral-400 pb-3"
                  )}
                  key={key}
                >
                  <div className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                    {`Driver : ${item.name}`}
                  </div>
                  <div className="mt-2 flex items-center gap-x-1">
                    <IconComponent
                      className="text-muat-trans-secondary-900"
                      src="/icons/transporter12.svg"
                    />
                    <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                      {item.licensePlate}
                    </span>
                  </div>
                  <div className="mt-3 text-xs font-medium leading-[14.4px] text-neutral-600">
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
