import { useState } from "react";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";
import { Modal, ModalContent } from "./Modal";

export const ModalOpsiPembayaran = ({
  paymentMethods = [],
  selectedPaymentMethodId = null,
  onSelectedPaymentMethodId = () => {},
  onProceedPayment = () => {},
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set([0])); // Initialize with first category expanded
  const { t } = useTranslation();
  const toggleSection = (categoryKey) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
      }
      return newSet;
    });
  };

  const handleSelectPaymentMethod = (methodId) => {
    onSelectedPaymentMethodId(methodId);
    setIsOpen(false);
  };

  const selectedOpsiPembayaran = useShallowMemo(
    () =>
      selectedPaymentMethodId
        ? paymentMethods
            .flatMap((method) => method.methods || [])
            .find((item) => item.id === selectedPaymentMethodId)
        : null,
    [selectedPaymentMethodId, paymentMethods]
  );

  return (
    <>
      <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick>
        <div className={cn("w-full", className)}>
          {selectedOpsiPembayaran ? (
            <div className="flex flex-col gap-y-4">
              <button
                className="flex h-8 w-full items-center justify-between rounded-md border border-neutral-600 px-3"
                type="button"
                onClick={() => setIsOpen(true)}
              >
                <div className="flex items-center gap-x-2">
                  <img
                    src={selectedOpsiPembayaran.icon}
                    width={16}
                    height={16}
                    className="size-[16px] bg-white object-contain"
                    alt={selectedOpsiPembayaran.name}
                  />
                  <span className="text-xs font-medium leading-[14.4px] text-neutral-900">
                    {selectedOpsiPembayaran.name}
                  </span>
                </div>
                <IconComponent src="/icons/chevron-right.svg" />
              </button>
              <Button variant="muatparts-primary" onClick={onProceedPayment}>
                {t(
                  "ModalOpsiPembayaran.continuePayment",
                  {},
                  "Lanjut Pembayaran"
                )}
              </Button>
            </div>
          ) : (
            <Button
              variant="muatparts-primary"
              className="w-full"
              onClick={() => setIsOpen(true)}
            >
              {t(
                "ModalOpsiPembayaran.selectPaymentOption",
                {},
                "Pilih Opsi Pembayaran"
              )}
            </Button>
          )}
        </div>
        <ModalContent type="muatmuat">
          <div className="flex flex-col gap-y-4 px-6 py-8">
            <div className="flex w-[424px] justify-center">
              <h1 className="text-base font-bold leading-[19.2px] text-neutral-900">
                {t("ModalOpsiPembayaran.paymentOptions", {}, "Opsi Pembayaran")}
              </h1>
            </div>
            {/* Content Container */}
            <div className="mr-[-16px] flex max-h-[321px] flex-col overflow-y-auto pr-[11px]">
              {/* Section Title */}
              <h2 className="text-base font-bold leading-[19.2px] text-neutral-900">
                {t("ModalOpsiPembayaran.allMethods", {}, "Semua Metode")}
              </h2>

              {/* Payment Options List */}
              {paymentMethods.map((paymentMethod, categoryKey) => {
                const isExpanded = expandedCategories.has(categoryKey);

                return (
                  <div key={categoryKey}>
                    <div
                      className="flex h-12 w-full cursor-pointer items-center justify-between border-b border-neutral-400 px-0 py-3"
                      onClick={() => toggleSection(categoryKey)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={paymentMethod.icon}
                          width={24}
                          height={24}
                          className="size-[24px] bg-white object-contain"
                          alt={paymentMethod.category}
                        />
                        <span className="text-xs font-bold leading-[14.4px] text-neutral-900">
                          {paymentMethod.category}
                        </span>
                      </div>
                      <IconComponent
                        src="/icons/chevron-down.svg"
                        className={cn(
                          "rotate-180 transition-transform duration-300",
                          !isExpanded && "rotate-0"
                        )}
                      />
                    </div>

                    {/* Payment Method Options */}
                    <div
                      className={`w-full overflow-hidden transition-all duration-300 ${
                        isExpanded
                          ? "max-h-[calc(100vh_-_124px)] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex flex-col pl-8">
                        {paymentMethod.methods.map((method, key) => (
                          <button
                            key={key}
                            className="flex h-12 w-[392px] cursor-pointer items-center justify-between border-b border-neutral-400 px-0 py-3 hover:bg-neutral-50"
                            onClick={() => handleSelectPaymentMethod(method.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded border">
                                <img
                                  src={method.icon}
                                  width={20}
                                  height={20}
                                  className="size-[20px] object-cover"
                                  alt={method.name}
                                />
                              </div>
                              <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                                {method.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
