import Link from "next/link";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";

import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

const OrderInfo = ({ className, title, value }) => {
  return (
    <div className={cn("flex items-center gap-x-2 text-xs", className)}>
      <span className="font-medium text-neutral-600">{title}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

const OrderWithAdditionalCost = ({ activeTab }) => {
  const info = [
    {
      title: "Telah Dihubungi Oleh :",
      value: "CS Daffa Toldo",
      className: "min-w-[250px] max-w-[250px]",
    },
    {
      title: "Jumlah Dihubungi :",
      value: 2,
      className: "min-w-[157px] max-w-[157px]",
    },
    {
      title: "Terakhir Dihubungi :",
      value: "02 Jan 2025 18:00 WIB",
      className: "min-w-[253px] max-w-[253px]",
    },
  ];
  return (
    <>
      <div className="flex h-[52px] items-center gap-x-2 bg-neutral-100 px-4">
        {info.map((item, key) => (
          <OrderInfo key={key} {...item} />
        ))}
      </div>
      <div className="flex gap-x-6 p-4 pb-5">
        <div className="mt-1 flex gap-x-6">
          <div className="flex min-w-[92px] max-w-[92px] flex-col gap-y-3">
            <Button variant="link">MT25A002A</Button>
            <BadgeStatusPesanan className="w-fit" variant="success">
              Instan
            </BadgeStatusPesanan>
          </div>
          <div className="flex min-w-[280px] max-w-[280px] flex-col gap-y-2">
            <span className="text-xs font-bold">Prima Arifandi</span>
            <span className="text-xxs font-medium leading-[1.3]">
              0812-3456-7890
            </span>
          </div>
          <div className="flex min-w-[230px] max-w-[230px] flex-col gap-y-3">
            <span className="text-xs font-bold">{idrFormat(900000)}</span>
            {activeTab === "active" ? (
              <div className="flex flex-col gap-y-2 text-xxs font-medium leading-[1.3]">
                <span>Tanggal Tagihan : 02 Jan 2025 18:00 WIB</span>
                <span>Lama Belum Dibayarkan : 2 Hari</span>
              </div>
            ) : null}
            {activeTab === "completed" ? (
              <div className="flex flex-col gap-y-2 text-xxs font-medium leading-[1.3]">
                <span>Tanggal Tagihan : 02 Jan 2025 18:00 WIB</span>
                <span>Tanggal Pembayaran : 04 Jan 2025 18:00 WIB</span>
                <span>Opsi Pembayaran : Kartu Kredit</span>
              </div>
            ) : null}
          </div>
          <div className="w-[415px]">
            <MuatBongkarStepperWithModal
              appearance={{
                titleClassName: "line-clamp-1",
              }}
              pickupLocations={[
                {
                  fullAddress:
                    // "Jalan Dinoyo No. 111, Kec. Tegalsari, Kota Surabaya",
                    "Kota Surabaya, Kec. Tegalsari Tegalsari Tegalsari",
                },
              ]}
              dropoffLocations={[
                {
                  fullAddress:
                    // "Jl. Terusan Kawi No.16 Bareng, Kec. Klojen, Kab. Pasuruan",
                    "Kota Pasuruan, Kec. Klojen",
                },
                {
                  fullAddress:
                    // "Jalan Raden Intan Kav. 14, Kec. Blimbing, Malang",
                    "Kota Pasuruan, Kec. Klojen",
                },
              ]}
            />
          </div>
        </div>
        {/* ID masih dummy */}
        <Link
          href={`/laporan/tambahan-biaya/2f8d1b39-ae1c-45c0-a1be-326431d64255/detail-tambahan-biaya`}
        >
          <Button className="px-6" variant="muattrans-primary">
            Detail
          </Button>
        </Link>
      </div>
    </>
  );
};
export default OrderWithAdditionalCost;
