import { Fragment } from "react";

import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat, thousandSeparator } from "@/lib/utils/formatters";

export const ModalDetailOverloadMuatan = ({ drivers = [], grandTotal = 0 }) => {
  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <Button variant="link" className="text-xs font-semibold">
          Lihat Detail Overload Muatan
        </Button>
      </ModalTrigger>
      <ModalContent
        className="flex max-h-[440px] w-[578px] flex-col gap-y-3 p-6"
        type="muatmuat"
      >
        {/* Header */}
        <h2 className="text-center text-base font-bold text-neutral-900">
          Detail Overload Muatan
        </h2>

        <div className="flex flex-col gap-y-6">
          <div className="mr-[-16px] flex max-h-[291px] flex-col gap-y-6 overflow-y-auto pr-[8px]">
            {drivers.map((driver, key) => (
              <div
                className="flex w-full flex-col gap-y-3 border-b border-neutral-400 pb-6"
                key={key}
              >
                <h1 className="text-sm font-semibold">
                  {`Driver : ${driver.name} (${driver.license_plate}, ${driver.transporter_name})`}
                </h1>
                <div className="flex flex-col gap-y-2 text-xs font-medium">
                  {driver.overload_locations.map((location, key) => (
                    <Fragment key={key}>
                      <div className="flex items-center justify-between">
                        <span>{location.location_type}</span>
                        <span>{idrFormat(location.cost)}</span>
                      </div>
                      <span className="text-neutral-600">
                        {`Nominal Overload Muatan (${thousandSeparator(location.overload_weight)} ${location.weight_unit})`}
                      </span>
                      <span className="text-neutral-600">
                        {`Tanggal Muat: ${formatDate(location.loading_date)}`}
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-base font-bold text-neutral-900">
            <span className="">Total</span>
            <span className="">{idrFormat(grandTotal)}</span>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
