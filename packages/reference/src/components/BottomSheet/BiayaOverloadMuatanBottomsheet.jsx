import React, { Fragment } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";

import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

/**
 * A bottom sheet component to display overload charge details.
 * It is triggered by a child button and dynamically calculates the total amount.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The trigger element for the bottom sheet.
 * @param {Array<object>} [props.drivers] - An array of driver objects containing overload details.
 * @param {string} props.drivers[].driverName - The name of the driver.
 * @param {number} props.drivers[].amount - The overload charge amount as a number.
 * @param {string} props.drivers[].overloadWeight - A string describing the overload weight.
 */
const BiayaOverloadMuatanBottomsheet = ({
  children,
  drivers = [
    {
      driverName: "Noel Gallagher",
      amount: 50000,
      overloadWeight: "1.250 kg",
    },
    {
      driverName: "Oliver Sykes",
      amount: 50000,
      overloadWeight: "1.250 kg",
    },
  ],
}) => {
  const totalAmount = drivers.reduce((acc, driver) => acc + driver.amount, 0);

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <button className="w-fit text-xs font-semibold leading-[1.1] text-primary-700">
          Lihat Detail Overload Muatan
        </button>
      </BottomSheetTrigger>
      <BottomSheetContent className="p-0">
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Biaya Overload Muatan</BottomSheetTitle>
        </BottomSheetHeader>

        <div className="flex flex-col items-center gap-4 px-4 pb-6 font-medium">
          {/* Body and Footer */}
          <div className="flex w-full flex-col self-stretch">
            {drivers.map((driver, idx) => (
              <Fragment key={idx}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-900">
                      Driver : {driver.driverName}
                    </span>
                    <span className="text-right text-xs font-semibold text-neutral-900">
                      {idrFormat(driver.amount)}
                    </span>
                  </div>
                  <span className="text-xs font-medium leading-[1.5] text-neutral-900">
                    <b className="font-semibold">Nominal Overload Muatan</b>
                    <br />({driver.overloadWeight})
                  </span>
                </div>
                <hr
                  className={cn(
                    "my-4 border-neutral-400",
                    idx === drivers.length - 1 && "my-6"
                  )}
                />
              </Fragment>
            ))}

            <div className="flex items-center justify-between text-base font-semibold text-neutral-900">
              <span>Total</span>
              <span>{idrFormat(totalAmount)}</span>
            </div>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default BiayaOverloadMuatanBottomsheet;
