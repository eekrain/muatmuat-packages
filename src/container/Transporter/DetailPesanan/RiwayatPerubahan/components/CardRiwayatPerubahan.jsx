import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";

function TimelineItem({ isLast, children }) {
  const itemRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!isLast && itemRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        setHeight(itemRef.current.offsetHeight);
      });
      resizeObserver.observe(itemRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [isLast]);

  return (
    <div ref={itemRef} className="relative flex items-start gap-3">
      {/* garis vertikal */}
      {!isLast && (
        <div
          className="absolute left-[7px] top-4 border-l-2 border-dashed border-neutral-400"
          style={{ height: height + 5 }}
        />
      )}

      {children}
    </div>
  );
}

function CardRiwayatPerubahan({ dataOrderDetail }) {
  const steps1 = [
    { label: "Armada Dijadwalkan", icon: "/icons/info-pra-tender.svg" },
    // { label: "Selesai", icon: "/icons/check16.svg" },
    {
      label: "Dibatalkan",
      status: "CANCELED",
      icon: "/icons/silang-white.svg",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const pickupLocations = dataOrderDetail?.locations?.filter(
    (location) => location.type === "PICKUP"
  );
  const dropoffLocations = dataOrderDetail?.locations?.filter(
    (location) => location.type === "DROPOFF"
  );

  const pickupLocations1 = dataOrderDetail?.locations?.filter(
    (location) => location.type === "PICKUP1"
  );
  const dropoffLocations1 = dataOrderDetail?.locations?.filter(
    (location) => location.type === "DROPOFF1"
  );

  const emptyFleetData = false;
  const terimaPerubahan = false;
  const tolakPerubahan = false;

  const steps = [
    { label: "Armada Dijadwalkan", icon: "/icons/info-pra-tender.svg" },
    // { label: "Selesai", icon: "/icons/check16.svg" },
    {
      label: "Dibatalkan",
      status: "CANCELED",
      icon: "/icons/silang-white.svg",
    },
  ];

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
      <div className="relative space-y-6">
        <TimelineItem>
          <div className="flex flex-shrink-0 items-center gap-3">
            <span className="block h-4 w-4 rounded-full bg-muat-trans-primary-400"></span>
            <p className="text-xs font-medium text-neutral-600">
              12 Agu 2025 10:00 WIB
            </p>
          </div>
          <div className="w-full">
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
                {tolakPerubahan && (
                  <div className="m-4 rounded-lg border border-neutral-400 px-4">
                    <div className="flex items-center gap-2 pt-4">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
                        <IconComponent
                          src={"/icons/truck-reject.svg"}
                          width={16}
                          height={16}
                        />
                      </span>
                      <div className="space-y-2">
                        <p className="text-xs font-bold">
                          Tolak Perubahan dan Batalkan Armada
                        </p>
                        <p className="text-xs font-medium text-neutral-600">
                          Armada dibatalkan dan ada penyesuaian pendapatan
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid w-full grid-cols-2 gap-3 border-t border-neutral-400 px-12 py-4">
                      <div className="flex max-w-[398px] gap-4">
                        <img
                          src={"/img/depan.png"}
                          alt="Truck"
                          className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 object-cover"
                        />
                        <div className="flex flex-col gap-3">
                          <p className="text-sm font-bold text-neutral-900">
                            AE 1111 LBA
                          </p>
                          <div className="flex items-center gap-1">
                            <IconComponent
                              src={"/icons/user16.svg"}
                              width={16}
                              height={16}
                              className={"flex-shrink-0"}
                            />
                            <p className="text-xs font-medium text-neutral-900">
                              Noel Gallagher
                            </p>
                          </div>
                          <BadgeStatus variant="primary" className={"w-max"}>
                            Armada Dijadwalkan
                          </BadgeStatus>
                        </div>
                      </div>
                      <StepperContainer
                        totalStep={steps.length}
                        activeIndex={activeIndex}
                      >
                        {steps.map((step, index) => (
                          <StepperItem key={index} step={step} index={index} />
                        ))}
                      </StepperContainer>
                    </div>
                  </div>
                )}
                {terimaPerubahan ? (
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
                        <p className="text-xs font-bold">
                          Terima Perubahan & Ubah Armada
                        </p>
                        <p className="text-xs font-medium text-neutral-600">
                          Terdapat perubahan armada
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3 border-t border-neutral-400 px-12 py-4">
                      <div>
                        <p className="mb-4 text-xs font-medium text-neutral-600">
                          Armada Sebelumnya dan Status Saat Perubahan
                        </p>
                        <div className="flex max-w-[398px] gap-4">
                          <img
                            src={"/img/depan.png"}
                            alt="Truck"
                            className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 object-cover"
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
                                className={"flex-shrink-0"}
                              />
                              <p className="text-xs font-medium text-neutral-900">
                                Muhammad Rizky Ramadhani Pratama Setiawan
                                Nugroho Putra Perdana Kusuma Wijayanto Saputra
                              </p>
                            </div>
                            <BadgeStatus variant="primary" className={"w-max"}>
                              Armada Dijadwalkan
                            </BadgeStatus>
                          </div>
                        </div>
                      </div>
                      <IconComponent
                        src={"/icons/arrow-right.svg"}
                        width={16}
                        height={16}
                      />
                      <div>
                        <p className="mb-4 text-xs font-medium text-neutral-600">
                          Armada Pengganti
                        </p>
                        <div className="flex max-w-[398px] gap-4">
                          <img
                            src={"/img/depan.png"}
                            alt="Truck"
                            className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 object-cover"
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
                                className={"flex-shrink-0"}
                              />
                              <p className="text-xs font-medium text-neutral-900">
                                Yoel Kurniawan
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="m-4 rounded-lg border border-neutral-400 px-4">
                    <div className="flex items-center gap-2 pt-4">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
                        <IconComponent
                          src={"/icons/truck-approved.svg"}
                          width={24}
                          height={24}
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
                            Muhammad Rizky Ramadhani Pratama Setiawan Nugroho
                            Putra Perdana Kusuma Wijayanto Saputra
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </TimelineItem>
        <TimelineItem isLast>
          <div className="flex flex-shrink-0 items-center gap-3">
            <span className="block h-4 w-4 rounded-full bg-neutral-400"></span>
            <p className="text-xs font-medium text-neutral-600">
              12 Agu 2025 08:00 WIB
            </p>
          </div>
          <div className="w-full">
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
                        src={"/icons/rute.svg"}
                        width={16}
                        height={16}
                      />
                    </span>
                    <p className="text-xs font-bold">
                      Perubahan Rute Muat & Bongkar
                    </p>
                  </div>
                  <div className="relative mt-4 grid grid-cols-2 gap-6 pb-4">
                    <div className="absolute bottom-2 left-0 right-0 flex h-8 items-center justify-end rounded-lg bg-success-50 px-2 py-1">
                      <span className="block w-max rounded bg-neutral-900 px-2 py-[2px] text-[8px] font-semibold text-white">
                        Rute diubah
                      </span>
                    </div>
                    <div className="z-20 flex-shrink-0 border-r border-neutral-400 px-12">
                      <p className="text-xs font-medium text-neutral-900">
                        <span className="font-bold text-success-400">
                          Rute Awal :
                        </span>{" "}
                        Estimasi 178 km
                      </p>
                      <div className="relative mt-4 flex flex-col gap-3">
                        {pickupLocations.length > 0 && (
                          <div className="relative flex flex-col gap-3">
                            <div className="ml-7 text-xs font-medium text-neutral-600">
                              Lokasi Muat
                            </div>
                            <div className="relative flex flex-col gap-3">
                              {pickupLocations.map((pickup, index) => (
                                <div
                                  key={index}
                                  className="relative flex items-center gap-3"
                                >
                                  {/* Dashed line after each location except the last in this section */}
                                  {index < pickupLocations.length - 1 && (
                                    <div className="absolute left-[7px] top-4 z-0 h-[calc(100%+12px)] w-0 border-l-2 border-dashed border-neutral-400" />
                                  )}
                                  {/* Dashed line connecting to dropoff section */}
                                  {index === pickupLocations.length - 1 &&
                                    dropoffLocations.length > 0 && (
                                      <div className="absolute left-[7px] top-4 z-0 h-[calc(100%+32px)] w-0 border-l-2 border-dashed border-neutral-400" />
                                    )}
                                  <div className="relative z-[1] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#FFC217]">
                                    <span className="text-[10px] font-bold leading-[12px] text-[#461B02]">
                                      {pickup.sequence || index + 1}
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium leading-[120%] text-neutral-900">
                                    {pickup.fullAddress}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {dropoffLocations.length > 0 && (
                          <div className="relative flex flex-col gap-3">
                            <div className="ml-7 text-xs font-medium text-neutral-600">
                              Lokasi Bongkar
                            </div>
                            <div className="relative flex flex-col gap-3">
                              {dropoffLocations.map((dropoff, index) => (
                                <div
                                  key={index}
                                  className="relative flex items-center gap-3"
                                >
                                  {/* Dashed line after each location except the last */}
                                  {index < dropoffLocations.length - 1 && (
                                    <div className="absolute left-[7px] top-4 z-0 h-[calc(100%+12px)] w-0 border-l-2 border-dashed border-neutral-400" />
                                  )}
                                  <div className="relative z-[1] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#461B02]">
                                    <span className="text-[10px] font-bold leading-[12px] text-white">
                                      {dropoff.sequence || index + 1}
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium leading-[120%] text-neutral-900">
                                    {dropoff.fullAddress}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <p className="text-xs font-medium text-neutral-900">
                        <span className="font-bold text-muat-trans-primary-900">
                          Rute Awal :
                        </span>{" "}
                        Estimasi 182 km
                      </p>
                      <div className="relative mt-4 flex flex-col gap-3">
                        {pickupLocations1.length > 0 && (
                          <div className="relative flex flex-col gap-3">
                            <div className="ml-7 text-xs font-medium text-neutral-600">
                              Lokasi Muat
                            </div>
                            <div className="relative flex flex-col gap-3">
                              {pickupLocations1.map((pickup, index) => (
                                <div
                                  key={index}
                                  className="relative flex items-center gap-3"
                                >
                                  {/* Dashed line after each location except the last in this section */}
                                  {index < pickupLocations1.length - 1 && (
                                    <div className="absolute left-[7px] top-4 z-0 h-[calc(100%+12px)] w-0 border-l-2 border-dashed border-neutral-400" />
                                  )}
                                  {/* Dashed line connecting to dropoff section */}
                                  {index === pickupLocations1.length - 1 &&
                                    dropoffLocations1.length > 0 && (
                                      <div className="absolute left-[7px] top-4 z-0 h-[calc(100%+32px)] w-0 border-l-2 border-dashed border-neutral-400" />
                                    )}
                                  <div className="relative z-[1] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#FFC217]">
                                    <span className="text-[10px] font-bold leading-[12px] text-[#461B02]">
                                      {pickup.sequence || index + 1}
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium leading-[120%] text-neutral-900">
                                    {pickup.fullAddress}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {dropoffLocations1.length > 0 && (
                          <div className="relative flex flex-col gap-3">
                            <div className="ml-7 text-xs font-medium text-neutral-600">
                              Lokasi Bongkar
                            </div>
                            <div className="relative flex flex-col gap-3">
                              {dropoffLocations1.map((dropoff, index) => (
                                <div
                                  key={index}
                                  className="relative flex items-center gap-3"
                                >
                                  {/* Dashed line after each location except the last */}
                                  {index < dropoffLocations1.length - 1 && (
                                    <div className="absolute left-[7px] top-4 z-0 h-[calc(100%+12px)] w-0 border-l-2 border-dashed border-neutral-400" />
                                  )}
                                  <div className="relative z-[1] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#461B02]">
                                    <span className="text-[10px] font-bold leading-[12px] text-white">
                                      {dropoff.sequence || index + 1}
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium leading-[120%] text-neutral-900">
                                    {dropoff.fullAddress}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="m-4 grid grid-cols-2 rounded-lg border border-neutral-400 px-16 py-4 text-neutral-900">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">Penyesuaian Pendapatan</p>
                    <InfoTooltip
                      side="right"
                      appearance={{
                        iconClassName: "text-neutral-700 mr-1 size-3.5",
                      }}
                    >
                      <p className="max-w-[312px]">tes</p>
                    </InfoTooltip>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium line-through">
                      Rp24.500.000
                    </p>
                    <IconComponent
                      src="/icons/arrow-right.svg"
                      width={16}
                      height={16}
                      className={"flex-shrink-0"}
                    />
                    <p className="text-sm font-bold">Rp25.400.000</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </TimelineItem>
      </div>
    </div>
  );
}

export default CardRiwayatPerubahan;
