import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

const { Modal, ModalTrigger, ModalContent } = require("./Modal");

export const ModalDetailOverloadMuatan = ({
  drivers = [
    {
      driverName: "Noel Gallagher",
      amount: 100000,
      overloadWeight: "1.000 kg",
    },
    {
      driverName: "Liam Gallagher",
      amount: 200000,
      overloadWeight: "2.000 kg",
    },
  ],
}) => {
  const { t } = useTranslation();
  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <button
          type="button"
          className="text-left text-xs font-medium leading-[14.4px] text-primary-700"
        >
          {t(
            "ModalDetailOverloadMuatan.viewDetailButton",
            {},
            "Lihat Detail Overload Muatan"
          )}
        </button>
      </ModalTrigger>
      <ModalContent className="w-[578px]" type="muatmuat">
        <div className="w-[578px] p-6 text-xs font-medium leading-[1.2]">
          {/* Header */}
          <h2 className="text-center text-base font-bold text-neutral-900">
            {t(
              "ModalDetailOverloadMuatan.modalTitle",
              {},
              "Detail Overload Muatan"
            )}
          </h2>

          <div className="flex flex-col">
            {drivers.map((driver, idx) => (
              <div
                className={cn(
                  "w-full border-b border-neutral-400 pb-6",
                  idx !== drivers.length - 1 && "mb-6"
                )}
                key={idx}
              >
                <div className="flex items-baseline justify-between">
                  <span className="h-2.5 text-sm font-semibold text-neutral-900">
                    {t(
                      "ModalDetailOverloadMuatan.driverLabel",
                      { driverName: driver.driverName },
                      `Driver : ${driver.driverName}`
                    )}
                  </span>
                  <span className="h-2.5 text-right text-neutral-900">
                    {idrFormat(driver.amount)}
                  </span>
                </div>
                <span className="mt-3 block h-2 text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t(
                    "ModalDetailOverloadMuatan.overloadAmount",
                    { weight: driver.overloadWeight },
                    `Nominal Overload Muatan (${driver.overloadWeight})`
                  )}
                </span>
              </div>
            ))}

            <div className="text-neutral-90 flex items-center justify-between pt-6 text-base font-bold">
              <span className="">
                {t("ModalDetailOverloadMuatan.total", {}, "Total")}
              </span>
              <span className="">
                {drivers
                  .reduce(
                    (acc, d) =>
                      acc +
                      (Number(d.amount.toString().replace(/[^\d]/g, "")) || 0),
                    0
                  )
                  .toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
              </span>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
