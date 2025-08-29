import Image from "next/image";
import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";

import { resPaymentInstruction } from "@/container/Shipper/DetailPesanan/Web/PaymentInstruction/resPaymentInstruction";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";

const CaraPembayaranScreen = ({ dataRingkasanPembayaran }) => {
  const { t } = useTranslation();
  const [expandedCategories, setExpandedCategories] = useState(new Set([0])); // Initialize with first category expanded
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
  const paymentMethodInformations = useShallowMemo(
    () => [
      {
        title: "Opsi Pembayaran",
        content: (
          <div className="flex h-6 items-center gap-x-3">
            {dataRingkasanPembayaran?.paymentLogo ? (
              <Image
                src={dataRingkasanPembayaran?.paymentLogo}
                width={24}
                height={24}
                alt="Payment Method Logo"
              />
            ) : null}
            <span className="text-sm font-medium leading-[1.1] text-neutral-900">
              {dataRingkasanPembayaran?.paymentMethod}
            </span>
          </div>
        ),
      },
      {
        title: "Nomor Virtual Account",
        content: (
          <div className="flex items-center gap-x-2">
            <div className="text-sm font-medium leading-[1.1] text-primary-700">
              {dataRingkasanPembayaran?.vaNumber}
            </div>
            <IconComponent
              className="text-primary-700"
              onClick={() => {}}
              src={"/icons/salin.svg"}
              width={16}
              height={16}
            />
          </div>
        ),
      },
      {
        title: "Total Tagihan",
        content: (
          <span className="text-sm font-medium leading-[1.1] text-neutral-900">
            {idrFormat(dataRingkasanPembayaran?.totalPrice)}
          </span>
        ),
      },
    ],
    [dataRingkasanPembayaran]
  );

  return (
    <FormResponsiveLayout
      title={{
        label: "Cara Pembayaran",
      }}
    >
      <div className="flex flex-col gap-y-2 bg-neutral-200">
        <div className="flex flex-col gap-y-6 bg-neutral-50 px-4 py-5">
          {paymentMethodInformations.map((item, key) => (
            <div className="flex flex-col gap-y-4" key={key}>
              <div className="text-xs font-medium leading-[1.1] text-neutral-600">
                {item.title}
              </div>
              {item.content}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-y-6 bg-neutral-50 px-4 py-5">
          <h4 className="text-xs font-medium leading-[1.1] text-neutral-900">
            Cara Pembayaran
          </h4>
          {resPaymentInstruction.Data.map((instruction, index) => {
            const isExpanded = expandedCategories.has(index);
            return (
              <div
                className={cn(
                  "flex cursor-pointer flex-col",
                  resPaymentInstruction.Data.length - 1 === index
                    ? ""
                    : "border-b border-b-neutral-400 pb-4"
                )}
                onClick={() => toggleSection(index)}
                key={index}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium leading-[1.1] text-neutral-900">
                    {t(instruction.category)}
                  </span>
                  <IconComponent
                    src="/icons/chevron-down.svg"
                    className={cn(
                      "rotate-180 transition-transform duration-300",
                      !isExpanded && "rotate-0"
                    )}
                  />
                </div>
                <div
                  className={`w-full overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "mt-4 max-h-[calc(100vh_-_124px)] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="text-xs font-normal text-[#1B1B1B]">
                    {t(instruction.guide)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FormResponsiveLayout>
  );
};

export default CaraPembayaranScreen;
