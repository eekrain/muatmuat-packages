import Link from "next/link";
import React from "react";

import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";

const formatCurrency = (amount) => {
  return `Rp${new Intl.NumberFormat("id-ID").format(amount)}`;
};

const IncomeCards = ({ data }) => {
  if (!data) return null;

  const cardItems = [
    {
      title: "Sudah Dicairkan",
      tooltip: "Pendapatan yang sudah berhasil dicairkan ke rekening kamu",
      side: "right",
      value: data.disbursed,
      href: "/laporan/pendapatan?status=disbursed",
    },
    {
      title: "Belum Dicairkan",
      tooltip: "Jumlah pendapatan yang belum dicairkan ke rekening kamu",
      side: "left",
      value: data.pending,
      href: "/laporan/pendapatan?status=pending",
    },
    {
      title: "Potensi Pendapatan",
      tooltip:
        "Estimasi penghasilan yang bisa kamu terima nantinya jika semua transaksi telah selesai",
      side: "top",
      value: data.potentialEarnings,
      href: "/dashboard/real-time/potensi-pendapatan",
    },
    {
      title: "Total Klaim",
      tooltip: "Total penghasilan kamu yang sedang diproses klaim",
      side: "left",
      value: data.totalClaims,
      href: "#",
    },
  ];

  return (
    <div className="flex w-full gap-6">
      {/* Card Utama */}
      <Link
        href="/laporan/pendapatan"
        className="relative flex w-[410px] flex-col justify-center rounded-lg bg-primary-50 p-6"
      >
        <InfoTooltip
          side="bottom"
          className={"mr-4 mt-1"}
          appearance={{
            iconClassName: "absolute right-2 top-2 ml-2 text-neutral-600",
          }}
        >
          <p className="w-[312px] text-sm">
            Total Pendapatan Keseluruhan adalah akumulasi dari semua sumber
            pendapatan kamu, termasuk yang sudah dicairkan, belum dicairkan,
            potensi pendapatan, dan total klaim.
          </p>
        </InfoTooltip>
        <div className="mt-2 flex items-center gap-2">
          <IconComponent src={"/icons/wallet.svg"} width={42} height={42} />
          <div>
            <h3 className="text-base font-medium text-neutral-900">
              Total Pendapatan Keseluruhan
            </h3>
            <p className="text-[24px] font-bold text-neutral-900">
              {formatCurrency(data.totalEarnings)}
            </p>
          </div>
        </div>
      </Link>
      <div className="grid flex-1 grid-cols-2 gap-4">
        {cardItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="w-full rounded-lg bg-[#F8F8FB] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-medium text-neutral-900">
                {item.title}
              </h4>
              <InfoTooltip side={item.side}>
                <p className="w-[312px] text-sm">{item.tooltip}</p>
              </InfoTooltip>
            </div>
            <p className="mt-2 text-base font-bold">
              {formatCurrency(item.value)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IncomeCards;
