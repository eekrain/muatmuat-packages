import { useEffect, useState } from "react";

import { Alert } from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

export const ModalDetailWaktuTunggu = ({
  open,
  onOpenChange,
  drivers = [],
  grandTotal = 0,
}) => {
  console.log("drivers", drivers);

  // Initialize expanded state
  const [expandedDrivers, setExpandedDrivers] = useState([]);

  // Sync expandedDrivers state when drivers array changes
  useEffect(() => {
    setExpandedDrivers(drivers.map(() => false));
  }, [drivers]);

  console.log("expandedDrivers", expandedDrivers);

  const toggleDriver = (idx) => {
    console.log("Toggling driver at index:", idx);
    console.log("Current expandedDrivers:", expandedDrivers);
    console.log("Drivers length:", drivers.length);

    setExpandedDrivers((prev) => {
      const newState = prev.map((val, i) => (i === idx ? !val : val));
      console.log("New expandedDrivers state:", newState);
      return newState;
    });
  };

  return (
    // Conditionally render the modal as controlled or uncontrolled component
    <Modal {...(open && onOpenChange ? { open, onOpenChange } : {})}>
      {!open && !onOpenChange ? (
        <ModalTrigger asChild>
          <Button variant="link" className="text-xs font-semibold">
            Lihat Detail Waktu Tunggu
          </Button>
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
                      {`Driver : ${driver.name} (${driver.license_plate}, ${driver.transporter_name})`}
                    </h3>
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
                  {driver.waiting_locations?.map((item, dataIdx) => (
                    <div
                      key={dataIdx}
                      className="flex flex-col gap-y-2 text-xs font-medium"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-900">{`${item.location_type} : ${item.duration}`}</span>
                        <span className="text-neutral-900">
                          {idrFormat(item.cost)}
                        </span>
                      </div>
                      <div className="text-neutral-600">
                        {`${formatDate(item.start_time)} s/d ${formatDate(item.end_time)}`}
                      </div>
                    </div>
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
