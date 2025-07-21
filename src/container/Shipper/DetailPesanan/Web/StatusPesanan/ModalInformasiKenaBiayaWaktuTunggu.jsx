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
        <button className="leading-[14.4px] text-xs font-medium text-primary-700">
          Lihat Driver
        </button>
      </ModalTrigger>
      <ModalContent type="muatmuat">
        <div className="px-6 py-8">
          <div className="flex w-[530px] flex-col items-center">
            <h1 className="leading-[19.2px] text-base font-bold text-neutral-900">
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
                  <div className="leading-[16.8px] text-sm font-semibold text-neutral-900">
                    {`Driver : ${item.name}`}
                  </div>
                  <div className="mt-2 flex items-center gap-x-1">
                    <IconComponent
                      className="text-muat-trans-secondary-900"
                      src="/icons/transporter12.svg"
                    />
                    <span className="leading-[14.4px] text-xs font-medium text-neutral-600">
                      {item.licensePlate}
                    </span>
                  </div>
                  <div className="leading-[14.4px] mt-3 text-xs font-medium text-neutral-600">
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
