"use client";

import { useState } from "react";

import * as Popover from "@radix-ui/react-popover";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { InputSearch } from "@/components/InputSearch/InputSearch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Tabs/Tabs";
import { cn } from "@/lib/utils";

const armadaData = [
  {
    id: "L 1239 CAM",
    type: "Colt Diesel Engkel - Box",
    schedule: {
      "2025-01-10": {
        status: "bertugas",
        driver: "Ahmad Maulana",
        locations: [
          { type: "muat", name: "Lokasi Muat", detail: "Rest Area KM 50" },
          {
            type: "bongkar",
            name: "Lokasi Bongkar",
            detail: "Kota Suraba...",
          },
        ],
        time: "Est. 121 km",
        duration: "30km | 1 jam...",
      },
      "2025-01-11": {
        status: "bertugas",
        driver: "Ahmad Maulana",
        locations: [
          {
            type: "bongkar",
            name: "Lokasi Bongkar",
            detail: "Kab. Malang, Kec. Singosari",
          },
        ],
      },
      "2025-01-12": { status: "non-aktif", driver: "Ahmad Maulana" },
      "2025-01-13": {
        status: "bertugas",
        driver: "Ahmad Maulana",
        locations: [
          {
            type: "bongkar",
            name: "Lokasi Bongkar",
            detail: "Rest Area KM 50",
          },
        ],
      },
    },
  },
  {
    id: "L 1240 CAM",
    type: "Colt Diesel Engkel - Box",
    schedule: {
      "2025-01-10": {
        status: "selesai",
        driver: "Ahmad Maulana",
        locations: [
          { type: "muat", name: "Lokasi Muat", detail: "Rest Area KM 50" },
          {
            type: "bongkar",
            name: "Lokasi Bongkar",
            detail: "Kota Suraba...",
          },
        ],
        time: "Est. 121 km",
      },
      "2025-01-11": {
        status: "selesai",
        driver: "Ahmad Maulana",
        locations: [
          {
            type: "bongkar",
            name: "Lokasi Bongkar",
            detail: "Kab. Malang, Kec. Singosari",
          },
        ],
      },
      "2025-01-12": {
        status: "menunggu",
        driver: "Ahmad Maulana",
        locations: [
          { type: "muat", name: "Lokasi Muat", detail: "Rest Area KM 50" },
          {
            type: "bongkar",
            name: "Lokasi Bongkar",
            detail: "Kota Surabaya, Kec. Tegalsari",
          },
        ],
        time: "Est. 121 km",
        duration: "Est. 30km (1jam 20menit ke titik Muat)",
      },
    },
  },
  {
    id: "L 1241 CAM",
    type: "Colt Diesel Engkel - Box",
    schedule: {
      "2025-01-10": {
        status: "bertugas",
        driver: "Ahmad Maulana",
        armadaType: "L 9817 AX - Tractor Head 6 x 4",
        locations: [
          { type: "muat", name: "Lokasi Muat", detail: "Rest Area KM 50" },
          {
            type: "bongkar",
            name: "Lokasi Bongkar",
            detail: "Kota Surabaya, Kec. Tegalsari",
          },
        ],
        time: "Est. 121 km",
        duration: "Est. 30km (1jam 20menit ke titik bongkar)",
      },
      "2025-01-11": {},
      "2025-01-12": {
        status: "bertugas",
        driver: "Ahmad Maulana",
        locations: [
          {
            type: "bongkar",
            name: "Lokasi Bongkar",
            detail: "Kab. Malang, Kec. Singosari",
          },
        ],
      },
    },
  },
  {
    id: "L 1234 CAM",
    type: "Colt Diesel Engkel - Box",
    location: "Kota Suraba...",
    time: "Est. 121 km",
    schedule: {
      "2025-01-10": {
        status: "non-aktif",
        driver: "Ahmad Maulana",
        locations: [
          {
            type: "bongkar",
            name: "Lokasi Bongkar",
            detail: "Kab. Malang, Kec. Singosari",
          },
        ],
      },
      "2025-01-11": {},
      "2025-01-12": {},
      "2025-01-13": {},
      "2025-01-14": {
        status: "dijadwalkan",
        driver: "Ahmad Maulana",
        locations: [
          { type: "muat", name: "Lokasi Muat", detail: "Rest Area KM 50" },
          {
            type: "bongkar",
            name: "Pusat Bantuan",
            detail: "Kota Surabaya, Kec. Tegalsari",
          },
        ],
      },
    },
  },
];

const dates = [
  { day: "Jumat", date: 10, fullDate: "2025-01-10" },
  { day: "Sabtu", date: 11, fullDate: "2025-01-11" },
  { day: "Minggu", date: 12, fullDate: "2025-01-12", isCurrent: true },
  { day: "Senin", date: 13, fullDate: "2025-01-13" },
  { day: "Selasa", date: 14, fullDate: "2025-01-14" },
];

const ScheduleCard = ({ schedule }) => {
  if (!schedule || !schedule.status) {
    return <div className="h-full min-h-[148px] border-r border-neutral-200" />;
  }

  const { status, driver, locations, time, duration, armadaType } = schedule;

  const statusConfig = {
    bertugas: {
      bgColor: "bg-info-100",
      textColor: "text-info-700",
      title: "Bertugas",
      icon: "check-circle-bold",
    },
    selesai: {
      bgColor: "bg-white",
      textColor: "text-neutral-900",
      title: "Pengiriman Selesai",
      icon: "check-circle-bold",
    },
    menunggu: {
      bgColor: "bg-warning-100",
      textColor: "text-neutral-900",
      title: "Menunggu Jam Muat",
      icon: "check-circle-bold",
    },
    "non-aktif": {
      bgColor: "bg-white",
      textColor: "text-neutral-500",
      title: "Non Aktif",
      icon: "info-circle-bold",
    },
    dijadwalkan: {
      bgColor: "bg-warning-100",
      textColor: "text-neutral-900",
      title: "Dijadwalkan",
      icon: "check-circle-bold",
    },
  };

  const config = statusConfig[status];

  const renderLocations = () => (
    <div className="mt-2 space-y-2">
      {locations?.map((loc, index) => (
        <div key={index} className="flex items-start gap-1">
          <IconComponent
            src={
              loc.type === "muat"
                ? "/icons/marker-lokasi-muat.svg"
                : "/icons/marker-lokasi-bongkar.svg"
            }
            className="mt-0.5 h-3 w-3 flex-shrink-0"
          />
          <div className="text-xs">
            <span className="font-semibold text-neutral-900">{loc.name}</span>
            <p className="font-medium text-neutral-600">{loc.detail}</p>
            <PengirimanSelesaiPopover>
              <button>
                <IconComponent
                  loader={false}
                  src={"/icons/info16.svg"}
                  className={cn("h-4 w-4")}
                />{" "}
              </button>
            </PengirimanSelesaiPopover>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[148px] flex-col justify-between border-r border-neutral-200 p-2",
        config.bgColor
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {config.icon && (
              <IconComponent
                src={`/icons/${config.icon}.svg`}
                className={cn("h-4 w-4", config.textColor)}
              />
            )}
            <p className={cn("text-xs font-semibold", config.textColor)}>
              {config.title}
            </p>
          </div>
          {status !== "non-aktif" && status !== "selesai" && (
            <button className="text-info-700 text-[10px] font-bold underline">
              Ubah
            </button>
          )}
        </div>
        <p className="mt-1 text-xs font-bold text-neutral-900">{driver}</p>
        {armadaType && (
          <p className="text-xs font-medium text-neutral-600">{armadaType}</p>
        )}
        {duration && (
          <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-neutral-500">
            <IconComponent
              src="/icons/sand-clock.svg"
              className="h-2.5 w-2.5"
            />
            {duration}
          </p>
        )}
        {renderLocations()}
      </div>
      {time && (
        <p className="text-info-700 mt-2 text-right text-[10px] font-semibold">
          {time}
        </p>
      )}
      {status === "dijadwalkan" && (
        <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-700">
          <IconComponent src="/icons/tambah-muatan.svg" className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

const AgendaArmadaDriverPage = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex-grow bg-[#FBFBFB] p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">
          Agenda Armada-Driver
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-neutral-600">
            Terakhir di update: 13 Jan 2025, 21:55
          </p>
          <Button
            variant="muattrans-primary-secondary"
            className="h-9 gap-1.5 py-2 pl-3 pr-4"
          >
            <IconComponent src="/icons/refresh.svg" className="h-5 w-5" />
            <span className="text-sm font-bold">Refresh</span>
          </Button>
        </div>
      </header>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <InputSearch
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Cari No. Polisi atau Nama Driver"
            className="w-[300px]"
          />
          <Button
            variant="muattrans-primary-secondary"
            className="h-10 w-10 p-0"
          >
            <IconComponent src="/icons/filter-3.svg" className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <IconComponent
              src="/icons/chevron-left-20.svg"
              className="h-5 w-5 cursor-pointer text-neutral-900"
            />
            <span className="text-xl font-bold text-neutral-900">
              Januari 2025
            </span>
            <IconComponent
              src="/icons/chevron-right-20.svg"
              className="h-5 w-5 cursor-pointer text-neutral-900"
            />
          </div>
          <button className="text-sm font-bold text-primary-700 underline">
            Ubah Periode
          </button>
        </div>
        <Button
          variant="muattrans-primary-secondary"
          className="h-9 px-4 py-2 text-sm font-bold"
        >
          Kembali Ke Hari Ini
        </Button>
      </div>

      <main className="mt-4">
        <Tabs defaultValue="armada">
          <div className="flex items-center justify-between">
            <TabsList className="w-auto gap-1 rounded-lg bg-neutral-200 p-1">
              <TabsTrigger value="armada" className="px-10">
                Armada
              </TabsTrigger>
              <TabsTrigger value="driver" className="px-10">
                Driver
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-3">
              <button>
                <IconComponent
                  src="/icons/chevron-left-20.svg"
                  className="h-5 w-5 text-neutral-900"
                />
              </button>
              <button>
                <IconComponent
                  src="/icons/chevron-right-20.svg"
                  className="h-5 w-5 text-neutral-900"
                />
              </button>
            </div>
          </div>
          <TabsContent value="armada">
            <div className="mt-2 grid grid-cols-[minmax(0,0.5fr)_minmax(0,2.5fr)] rounded-lg border border-neutral-200 bg-white">
              {/* Fixed Header */}
              <div className="border-r border-neutral-200 bg-neutral-50 px-3 py-4">
                <p className="text-center text-sm font-semibold text-neutral-900">
                  Armada
                </p>
              </div>

              {/* Scrollable Header */}
              <div className="overflow-x-auto">
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${dates.length}, minmax(180px, 1fr))`,
                  }}
                >
                  {dates.map((d) => (
                    <div
                      key={d.date}
                      className={cn(
                        "border-r border-neutral-200 bg-neutral-50 p-2 text-center",
                        d.isCurrent && "bg-info-100"
                      )}
                    >
                      <p className="text-sm font-semibold text-neutral-900">
                        {d.day}, {d.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed Column Content */}
              <div className="border-r border-neutral-200">
                {armadaData.map((armada) => (
                  <div
                    key={armada.id}
                    className="flex min-h-[148px] flex-col justify-center border-t border-neutral-200 p-2"
                  >
                    <p className="text-sm font-bold text-neutral-900">
                      {armada.id}
                    </p>
                    <p className="text-xs text-neutral-600">{armada.type}</p>
                    {armada.location && armada.time && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start gap-1">
                          <IconComponent
                            src={"/icons/marker-lokasi-bongkar.svg"}
                            className="mt-0.5 h-3 w-3 flex-shrink-0"
                          />
                          <p className="text-xs font-medium text-neutral-600">
                            {armada.location}
                          </p>
                        </div>
                        <p className="text-info-700 text-right text-[10px] font-semibold">
                          {armada.time}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Scrollable Grid Content */}
              <div className="overflow-x-auto">
                {armadaData.map((armada, rowIndex) => (
                  <div
                    key={armada.id}
                    className="grid border-t border-neutral-200"
                    style={{
                      gridTemplateColumns: `repeat(${dates.length}, minmax(180px, 1fr))`,
                    }}
                  >
                    {dates.map((d, colIndex) => (
                      <ScheduleCard
                        key={`${armada.id}-${d.date}`}
                        schedule={armada.schedule[d.fullDate]}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="driver">
            <div className="mt-4 flex h-48 items-center justify-center rounded-lg border border-neutral-200 bg-white">
              <p className="text-neutral-500">Driver view would be here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AgendaArmadaDriverPage;

const PengirimanSelesaiPopover = ({ children }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="right"
          align="start"
          sideOffset={8}
          className={cn(
            "z-50 w-[387px] rounded-xl bg-white p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div>
              <h2 className="text-base font-bold leading-tight text-neutral-900">
                Pengiriman Selesai
              </h2>
              <div className="mt-1 flex items-center gap-2 text-xs font-medium text-neutral-600">
                <IconComponent
                  src="/icons/calendar16.svg"
                  className="h-4 w-4"
                  alt="Calendar Icon"
                />
                <span>Selesai Pada: 02 Jan 2025 11:00 WIB</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-neutral-200" />

            {/* Shipment Details */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-neutral-900">
                INV/MTR/120125/0002
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                <IconComponent
                  src="/icons/box-segel.svg"
                  className="h-4 w-4"
                  alt="Cargo Icon"
                />
                <p>
                  Besi Baja (1.000 kg), Batu Bata (1.000 kg), Karet Mentah (500
                  kg)
                  <button className="ml-1 font-semibold text-primary-700 hover:underline">
                    +5 lainnya
                  </button>
                </p>
              </div>
              <p className="text-sm font-semibold text-neutral-900">
                Bayu Sasmita
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                <IconComponent
                  src="/icons/phone.svg"
                  className="h-4 w-4"
                  alt="Phone Icon"
                />
                <span>082120899123</span>
              </div>
              <p className="text-sm font-semibold text-neutral-900">
                Colt Diesel Engkel - Box
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                <IconComponent
                  src="/icons/license-plate.svg"
                  className="h-4 w-4"
                  alt="License Plate Icon"
                />
                <span>L 9812 AX</span>
              </div>
            </div>

            {/* Route Section */}
            <div className="rounded-lg border border-neutral-200 p-4">
              <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                Rute Perjalanan
              </h3>
              <div className="flex items-start">
                {/* Origin */}
                <div className="flex flex-col items-center gap-1">
                  <IconComponent
                    src="/icons/location-muat-icon.svg"
                    className="h-5 w-5"
                    alt="Lokasi Muat"
                  />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-neutral-900">
                      Lokasi Muat
                    </p>
                    <p className="text-xs text-neutral-600">
                      Kota Surabaya, Kec. T...
                    </p>
                  </div>
                </div>

                {/* Dashed Line & Distance */}
                <div className="relative mx-3 flex-1 px-2 pt-2">
                  <div className="w-full border-t-2 border-dashed border-neutral-300" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <span className="whitespace-nowrap rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-semibold text-neutral-700">
                      Est. 121 km
                    </span>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex flex-col items-center gap-1">
                  <IconComponent
                    src="/icons/location-bongkar-icon.svg"
                    className="h-5 w-5"
                    alt="Lokasi Bongkar"
                  />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-neutral-900">
                      Lokasi Bongkar
                    </p>
                    <p className="text-xs text-neutral-600">
                      Kab. Malang, Kec. Sin...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="primary"
              className="w-full bg-primary-400 text-sm font-bold text-neutral-900 hover:bg-primary-500"
              onClick={() => {
                /* Handle detail navigation */
              }}
            >
              Detail
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
