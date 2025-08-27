import { useState } from "react";

import { differenceInHours, differenceInMinutes } from "date-fns";

import { Alert } from "@/components/Alert/Alert";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

const formatDuration = (startDate, endDate) => {
  const hours = differenceInHours(endDate, startDate);
  const minutes = differenceInMinutes(endDate, startDate) % 60;
  return `${hours} Jam ${minutes} Menit`;
};

export const ModalDetailWaktuTunggu = ({
  open,
  onOpenChange,
  drivers = [],
}) => {
  // Use an array of booleans to track expanded state for each driver
  const [expandedDrivers, setExpandedDrivers] = useState(
    drivers.map(() => false)
  );

  const toggleDriver = (idx) => {
    setExpandedDrivers((prev) =>
      prev.map((val, i) => (i === idx ? !val : val))
    );
  };

  // Calculate total from all drivers' data
  const totalAmount = drivers.reduce((driverAcc, driver) => {
    return (
      driverAcc +
      driver.data.reduce((dataAcc, item) => {
        return dataAcc + (item.totalPrice || 0);
      }, 0)
    );
  }, 0);

  return (
    // Conditionally render the modal as controlled or uncontrolled component
    <Modal {...(open && onOpenChange ? { open, onOpenChange } : {})}>
      {!open && !onOpenChange ? (
        <ModalTrigger asChild>
          <button
            type="button"
            className="w-fit text-xs font-medium leading-[14.4px] text-primary-700"
          >
            Lihat Detail Waktu Tunggu
          </button>
        </ModalTrigger>
      ) : null}

      <ModalContent
        className="flex max-h-[440px] w-[578px] flex-col gap-y-3 p-6"
        type="muatmuat"
      >
        {/* Header */}
        <h2 className="text-center text-base font-bold text-neutral-900">
          Detail Waktu Tunggu
        </h2>

        <Alert variant="secondary" className="h-[30px] text-xs font-semibold">
          Free untuk 12 jam awal dan dikenakan biaya waktu tunggu lebih dari 12
          jam
        </Alert>

        <div className="flex max-h-[291px] flex-col gap-y-6">
          {/* Driver Section */}
          <div className="mr-[-16px] flex flex-col overflow-y-auto pr-[8px]">
            {drivers.map((driver, idx) => (
              <div
                className={cn(
                  "w-full border-b border-neutral-400 pb-6",
                  idx !== drivers.length - 1 && "mb-6"
                )}
                key={idx}
              >
                {/* Driver Header */}
                <button
                  type="button"
                  className={
                    "flex w-full cursor-pointer items-center justify-between"
                  }
                  onClick={() => toggleDriver(idx)}
                >
                  <div className="flex flex-col items-start gap-2">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {`Driver : ${driver.name}`}
                    </h3>
                    {/* {driver.durasiTotal && !expandedDrivers[idx] && (
                    <span className="capsize text-xs font-medium text-neutral-600">
                      Durasi Total: {driver.durasiTotal}
                    </span>
                  )} */}
                  </div>
                  <IconComponent
                    className={cn(
                      "text-neutral-700 transition-transform duration-200",
                      expandedDrivers[idx] && "rotate-180"
                    )}
                    src="/icons/chevron-down.svg"
                  />
                </button>

                {/* Expandable Content */}
                <div
                  className={cn(
                    "flex flex-col gap-y-3 overflow-hidden transition-all duration-300 ease-in-out",
                    expandedDrivers[idx]
                      ? "mt-3 max-h-96 opacity-100"
                      : "mt-0 max-h-0 opacity-0",
                    "text-xs font-medium leading-[1.2]"
                  )}
                >
                  {/* Loading Location Details */}
                  {driver.data.map((item, dataIdx) => (
                    <div
                      key={dataIdx}
                      className="flex flex-col gap-y-2 text-xs font-medium"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-900">{`${item.detail} : ${formatDuration(item.startDate, item.endDate)}`}</span>
                        <span className="text-neutral-900">
                          {idrFormat(item.totalPrice)}
                        </span>
                      </div>
                      <div className="text-neutral-600">
                        {formatDate(item.startDate)} s/d{" "}
                        {formatDate(item.endDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-base font-bold text-neutral-900">
            <span className="">Total</span>
            <span className="">{idrFormat(totalAmount)}</span>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
