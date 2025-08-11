"use client";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { idrFormat } from "@/lib/utils/formatters";

import OrderConfirmationBottomSheet from "../InformasiPesanan/OrderConfirmationBottomSheet";

const AdditionalFeeBottomsheet = ({
  isOrderConfirmationBottomsheetOpen,
  setOrderConfirmationBottomsheetOpen,
  calculatedPrice,
}) => {
  const priceSummary = useShallowMemo(() => {
    if (!calculatedPrice || calculatedPrice?.totalPrice <= 0) {
      return [];
    }
    return [
      {
        children: [
          {
            title: "Biaya Perubahan Rute",
            items: [
              {
                label: "Selisih Jarak Perubahan Lokasi Bongkar",
                price:
                  calculatedPrice.costDifference > 0
                    ? calculatedPrice.costDifference
                    : 0,
              },
            ],
          },
          {
            title: "Biaya Administrasi",
            items: [
              {
                label: "Admin Ubah Pesanan",
                price: calculatedPrice.penaltyFee,
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            title: "Biaya Lainnya",
            items: [
              {
                label: "Admin Layanan",
                price: calculatedPrice.adminFee,
              },
              {
                label: "Pajak",
                price: calculatedPrice.taxAmount,
              },
            ],
          },
        ],
      },
    ];
  }, [calculatedPrice]);

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <Button
          variant="muatparts-primary-secondary"
          className="h-10 w-full"
          onClick={() => {}}
          type="button"
        >
          Lihat Detail Biaya
        </Button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Detail Tambahan Biaya</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex w-full flex-col gap-y-4 overflow-y-auto bg-white px-4 text-neutral-900">
          {priceSummary.map((item, key) => (
            <div
              className="flex flex-col gap-y-6 border-b border-b-neutral-400 pb-6"
              key={key}
            >
              {item.children.map((section, key) => (
                <div className="flex flex-col gap-y-4" key={key}>
                  <h1 className="text-sm font-semibold">{section.title}</h1>
                  {section.items.map((item, key) => (
                    <div
                      className="flex justify-between gap-x-7 text-xs font-medium"
                      key={key}
                    >
                      <span className="text-neutral-600">{item.label}</span>
                      <span className="w-[100px] text-right">
                        {idrFormat(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          {calculatedPrice?.totalPrice > 0 ? (
            <div className="flex items-center justify-between text-sm leading-[1.1]">
              <span className="font-semibold">Total Tambahan Biaya</span>
              <span className="font-bold">
                {idrFormat(calculatedPrice?.totalPrice)}
              </span>
            </div>
          ) : null}
        </div>
        <BottomSheetFooter>
          <OrderConfirmationBottomSheet
            isOpen={isOrderConfirmationBottomsheetOpen}
            setOpen={setOrderConfirmationBottomsheetOpen}
            onValidateInformasiPesanan={() =>
              setOrderConfirmationBottomsheetOpen(true)
            }
            onCreateOrder={() => {}}
          />
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default AdditionalFeeBottomsheet;
