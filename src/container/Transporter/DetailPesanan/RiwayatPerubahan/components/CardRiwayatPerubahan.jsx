import Image from "next/image";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";

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
      <div className="space-y-6">
        <div className="relative">
          <span className="block h-4 w-4 rounded-full bg-muat-trans-primary-400"></span>
          <span className="block h-4 w-4 rounded-full bg-neutral-400"></span>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium">
            <span className="font-semibold">Kamu</span> telah melakukan
            perubahan armada sebagai respons atas perubahan pesanan dari
            shipper.
          </p>
          <Collapsible
            defaultOpen
            className="rounded-lg border border-neutral-400"
          >
            <CollapsibleTrigger className="rounded-t-md bg-neutral-100 px-6 hover:no-underline">
              {({ open }) => (
                <>
                  <h3 className="font-semibold">Detail Perubahan Shipper</h3>

                  <div className="flex items-center gap-2 font-medium text-primary-700">
                    <p>{open ? "Sembunyikan" : "Lihat Detail"}</p>
                    <IconComponent
                      src="/icons/chevron-down.svg"
                      className={`h-5 w-5 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="m-4 rounded-lg border border-neutral-400 px-4">
                <div className="flex items-center gap-2 pt-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
                    <IconComponent
                      src={"/icons/truck-approved.svg"}
                      width={16}
                      height={16}
                    />
                  </span>
                  <div className="space-y-2">
                    <p className="text-xs font-bold">Terima Perubahan</p>
                    <p className="text-xs font-medium text-neutral-600">
                      Tidak ada perubahan armada
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-neutral-400 px-12 py-4">
                  <img
                    src={"/img/depan.png"}
                    alt="Truck"
                    className="h-14 w-14 rounded-md bg-gray-100 object-cover"
                  />
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold text-neutral-900">
                      B 2222 XYZ
                    </p>
                    <div className="flex items-center gap-1">
                      <IconComponent
                        src={"/icons/user16.svg"}
                        width={16}
                        height={16}
                      />
                      <p className="text-xs font-medium text-neutral-900">
                        Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra
                        Perdana Kusuma Wijayanto Saputra
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium">
            <span className="font-semibold">Shipper</span> telah melakukan
            perubahan pesanan.
          </p>
          <Collapsible
            defaultOpen
            className="rounded-lg border border-neutral-400"
          >
            <CollapsibleTrigger className="rounded-t-md bg-neutral-100 px-6 hover:no-underline">
              {({ open }) => (
                <>
                  <h3 className="font-semibold">Detail Perubahan Shipper</h3>

                  <div className="flex items-center gap-2 font-medium text-primary-700">
                    <p>{open ? "Sembunyikan" : "Lihat Detail"}</p>
                    <IconComponent
                      src="/icons/chevron-down.svg"
                      className={`h-5 w-5 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="m-4 rounded-lg border border-neutral-400 px-4">
                <div className="flex items-center gap-2 pt-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
                    <IconComponent
                      src={"/icons/truck-approved.svg"}
                      width={16}
                      height={16}
                    />
                  </span>
                  <div className="space-y-2">
                    <p className="text-xs font-bold">Terima Perubahan</p>
                    <p className="text-xs font-medium text-neutral-600">
                      Tidak ada perubahan armada
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-neutral-400 px-12 py-4">
                  <img
                    src={"/img/depan.png"}
                    alt="Truck"
                    className="h-14 w-14 rounded-md bg-gray-100 object-cover"
                  />
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold text-neutral-900">
                      B 2222 XYZ
                    </p>
                    <div className="flex items-center gap-1">
                      <IconComponent
                        src={"/icons/user16.svg"}
                        width={16}
                        height={16}
                      />
                      <p className="text-xs font-medium text-neutral-900">
                        Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra
                        Perdana Kusuma Wijayanto Saputra
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

export default CardRiwayatPerubahan;
