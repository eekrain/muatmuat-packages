import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

const UpdateOrderFeeSummary = ({ dataRingkasanPembayaran }) => {
  const priceCharge = dataRingkasanPembayaran?.priceCharge;
  const priceChange = dataRingkasanPembayaran?.priceChange;

  // Jika tidak ada data biaya tambahan, jangan render komponen
  if (!priceCharge && !priceChange) {
    return null;
  }

  const waitingFee = priceCharge?.waitingFee;
  const overloadFee = priceCharge?.overloadFee;
  const adminFee = priceCharge?.adminFee || priceChange?.adminFee;
  const taxAmount = priceCharge?.taxAmount || priceChange?.taxAmount;
  const additionalCost = priceChange?.additionalCost;
  const penaltyFee = priceChange?.penaltyFee;

  const priceSummary = [];

  // Biaya Perubahan Rute (jika ada priceChange)
  if (priceChange && (additionalCost > 0 || penaltyFee > 0)) {
    const routeChangeItems = [];
    if (additionalCost > 0) {
      routeChangeItems.push({
        label: "Nominal Selisih Jarak Perubahan Lokasi Bongkar",
        price: additionalCost,
      });
    }
    if (penaltyFee > 0) {
      routeChangeItems.push({
        label: "Biaya Penalti",
        price: penaltyFee,
      });
    }

    priceSummary.push({
      children: [
        {
          title: "Biaya Perubahan Rute",
          items: routeChangeItems,
        },
      ],
    });
  }

  // Biaya Waktu Tunggu dan Overload
  const additionalFeeItems = [];
  if (waitingFee?.totalAmount > 0) {
    additionalFeeItems.push({
      title: "Biaya Waktu Tunggu",
      items: [
        {
          label: `Nominal Waktu Tunggu (${waitingFee.totalDriver} Driver)`,
          price: waitingFee.totalAmount,
        },
      ],
    });
  }

  if (overloadFee?.totalAmount > 0) {
    additionalFeeItems.push({
      title: "Biaya Overload Muatan",
      items: [
        {
          label: `Nominal Overload Muatan (${Number(
            overloadFee.totalWeight
          ).toLocaleString("id-ID")} ${overloadFee.weightUnit})`,
          price: overloadFee.totalAmount,
        },
      ],
    });
  }

  if (additionalFeeItems.length > 0) {
    priceSummary.push({
      children: additionalFeeItems,
    });
  }

  // Biaya Lainnya (Admin dan Pajak)
  if (adminFee > 0 || taxAmount > 0) {
    const otherFeeItems = [];
    if (adminFee > 0) {
      otherFeeItems.push({
        label: "Admin Layanan",
        price: adminFee,
      });
    }
    if (taxAmount > 0) {
      otherFeeItems.push({
        label: "Pajak",
        price: taxAmount,
      });
    }

    priceSummary.push({
      children: [
        {
          title: "Biaya Lainnya",
          items: otherFeeItems,
        },
      ],
    });
  }

  // Jika tidak ada data untuk ditampilkan
  if (priceSummary.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-y-6 bg-neutral-50 px-4 py-5 text-neutral-900">
      <h1 className="text-sm font-semibold leading-[1.1]">
        Detail Tambahan Biaya
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
                <span className="text-sm font-semibold">{child.title}</span>
                {child.items.map((detail, index) => (
                  <div
                    className="flex justify-between gap-x-7 text-xs font-medium"
                    key={index}
                  >
                    <span className="w-[200px] text-neutral-600">
                      {detail.label}
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
