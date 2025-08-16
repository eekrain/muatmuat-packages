import Image from "next/image";
import { useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  StepperContainer,
  StepperItemResponsive,
  VerticalStepperContainer,
  VerticalStepperItem,
} from "@/components/Stepper/Stepper";
import useDevice from "@/hooks/use-device";

function CardRiwayatPerubahan({ shipmentData }) {
  const steps1 = [
    { label: "Armada Dijadwalkan", icon: "/icons/info-pra-tender.svg" },
    // { label: "Selesai", icon: "/icons/check16.svg" },
    {
      label: "Dibatalkan",
      status: "CANCELED",
      icon: "/icons/silang-white.svg",
    },
  ];

  const steps = [
    {
      label: "Kamu telah melakukan perubahan",
      icon: "📦",
      subtitle: "Perubahan berhasil disimpan",
    },
    {
      label: "Shipper telah melakukan pengambilan",
      icon: "🚚",
      subtitle: "Paket sudah diambil kurir",
    },
    {
      label: "Pesanan sedang diproses",
      icon: "📋",
      status: "CANCELED",
      subtitle: "Dibatalkan karena stok habis",
    },
    {
      label: "Pesanan berhasil dibuat",
      icon: "✨",
      subtitle: "Order #12345 telah dibuat",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const emptyFleetData = false;

  if (emptyFleetData) {
    return (
      <div
        className={
          "flex w-full flex-col items-center justify-center bg-white px-4"
        }
      >
        <Image
          src="/img/daftarprodukicon.png"
          width={95}
          height={95}
          alt="Empty cart"
        />
        <div className="mt-2 font-semibold text-neutral-600">
          Belum ada riwayat perubahan
        </div>
        <div className="mb-3 max-w-full text-center text-xs font-medium text-neutral-600">
          Riwayat perubahan armada maupun pembatalan armada akan ditampilkan
          disini
        </div>
      </div>
    );
  }

  return (
    <div className="border-netral-400 w-full rounded-xl border px-4 py-5">
      {/* <div className="mt-4 flex items-start justify-between">
        <VerticalStepperContainer totalStep={steps.length} activeIndex={activeIndex}>
          <VerticalStepperItem step={steps[0]}>
            <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
              Semua perubahan telah berhasil diterapkan ke sistem dan disimpan dengan aman.
            </p>
          </VerticalStepperItem>

          <VerticalStepperItem step={steps[1]}>
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              Paket sedang dalam perjalanan ke alamat tujuan. Estimasi waktu tiba 2-3 jam.
            </p>
          </VerticalStepperItem>
        </VerticalStepperContainer>
      </div> */}
    </div>
  );
}

export default CardRiwayatPerubahan;
