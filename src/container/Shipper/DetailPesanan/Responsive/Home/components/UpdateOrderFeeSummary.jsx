import { Fragment } from "react";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

const UpdateOrderFeeSummary = ({ dataRingkasanPembayaran }) => {
  const { t } = useTranslation();
  const priceSummary = useShallowMemo(() => {
    const { priceChange } = dataRingkasanPembayaran || {};

    if (!priceChange) {
      return [];
    }

    return [
      {
        children: [
          {
            title: "Biaya Perubahan Rute",
            items: [
              {
                label: "Nominal Selisih Jarak Perubahan Lokasi Bongkar",
                price: priceChange.additionalCost || 0,
              },
            ],
          },
          {
            title: "Biaya Administrasi",
            items: [
              {
                label: "Admin Ubah Pesanan",
                price: priceChange.penaltyFee || 0,
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
                price: priceChange.adminFee || 0,
              },
              {
                label: "Pajak",
                price: priceChange.taxAmount || 0,
              },
            ],
          },
        ],
      },
    ];
  }, [dataRingkasanPembayaran]);

  return (
    <div className="flex flex-col gap-y-6 bg-neutral-50 px-4 py-5 text-neutral-900">
      <h1 className="text-sm font-semibold leading-[1.1]">
        {t("UpdateOrderFeeSummary.title", {}, "Detail Tambahan Biaya")}
      </h1>
      {priceSummary.map((item, key) => (
        <div
          className={cn(
            "flex flex-col gap-y-6",
            priceSummary.length - 1 === key
              ? ""
              : "border-b border-b-neutral-400 pb-6"
          )}
          key={key}
        >
          <div
            className={cn("flex flex-col", key === 0 ? "gap-y-4" : "gap-y-6")}
          >
            {item.children.map((child, key) => (
              <Fragment key={key}>
                <span className="text-sm font-semibold">
                  {t(child.title, {}, child.title)}
                </span>
                {child.items.map((detail, index) => (
                  <div
                    className="flex justify-between gap-x-7 text-xs font-medium"
                    key={index}
                  >
                    <span className="w-[200px] text-neutral-600">
                      {t(detail.label, {}, detail.label)}
                    </span>
                    <span>{idrFormat(detail.price)}</span>
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpdateOrderFeeSummary;
