"use client";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";

// import { cn } from "@/lib/utils";

const enumStatus = {
  SCHEDULED: "Dijadwalkan",
  WAITING_LOADING: "Menunggu Jam Muat",
  ONDUTY: "Bertugas",
  INACTIVE: "Non Aktif",
  COMPLETED: "Pengiriman Selesai",
};

const dataAgenda = {
  status: enumStatus.ONDUTY,
  startDate: "02 Jan 2025 11:00 WIB",
  endDate: "02 Jan 2025 15:00 WIB",
  invoice: "INV/MTR/120125/0002",
  SOS: {
    reason: "Muatan perlu dipindah",
    active: true,
  },
  items: [
    { name: "Semen", weight: "250 kg" },
    { name: "Paku", weight: "50 kg" },
    { name: "Cat Tembok", weight: "100 kg" },
    { name: "Pipa PVC", weight: "50 kg" },
    { name: "Keramik", weight: "50 kg" },
  ],
  name: "Bayu Sasmita",
  phone: "0821208991231",
  vehicle: "ColDijadwalkant Diesel Engkel - Box",
  licensePlate: "L 9812 AX",
  location: "Kota Surabayaoawdkoa",
  estimatedDistance: "est. 30km (1jam 20menit ke titik muat)",
  route: {
    pickup: {
      city: "Kota Surabaya",
      district: "Kec. Tegalsari",
    },
    delivery: {
      city: "Kab. Malang",
      district: "Kec. Sines",
    },
    estimatedDistance: "Est. 121 km",
  },
};

const getStatusColor = (status, sos) => {
  switch (status) {
    case enumStatus.SCHEDULED:
    case enumStatus.WAITING_LOADING:
      return "text-warning-900";
    case enumStatus.ONDUTY:
      return sos ? "text-error-400" : "text-primary-700";
    case enumStatus.COMPLETED:
    case enumStatus.INACTIVE:
      return "text-neutral-900";
    default:
      return "text-neutral-900";
  }
};

const PopoverAgenda = () => {
  // Show only first 3 items, rest go to popover
  const visibleItems = dataAgenda.items.slice(0, 3);
  const hiddenItems = dataAgenda.items.slice(3);
  const statusColor = getStatusColor(dataAgenda.status, dataAgenda.SOS.active);
  return (
    <div className="bg-whitefont-sans w-[397px] max-w-[397px] rounded-lg border border-neutral-200 text-xs shadow-md">
      <div className="p-3">
        <div className="space-y-3">
          <p className={`text-xs font-semibold ${statusColor}`}>
            {dataAgenda.status}{" "}
            <span className="inline-fle ml-1 h-5 w-10 items-center justify-center rounded-md bg-error-400 px-2 py-0.5 text-xs font-semibold text-white">
              SOS
            </span>
          </p>
          {dataAgenda.status !== enumStatus.INACTIVE && (
            <>
              <div className="space-y-2">
                {dataAgenda.SOS.active &&
                  dataAgenda.status === enumStatus.ONDUTY && (
                    <div className="flex items-center gap-2 rounded-md bg-error-50 px-2 py-1 text-xxs font-semibold text-error-400">
                      <IconComponent
                        src="/icons/warning-red.svg"
                        alt="Warning Icon"
                        width={12}
                        height={12}
                      />
                      <span className="font-medium">
                        <span className="text-neutral-600">Alasan :</span>{" "}
                        <span className="text-neutral-900">
                          {dataAgenda.SOS.reason}
                        </span>
                      </span>
                    </div>
                  )}

                <div className="flex items-center gap-2 rounded-md bg-neutral-200 px-2 py-1 text-xxs font-semibold text-neutral-900">
                  <IconComponent
                    src="/icons/calendar16.svg"
                    alt="Calendar Icon"
                    width={12}
                    height={12}
                  />
                  <span className="font-medium text-neutral-900">
                    <span className="text-neutral-600">Waktu Muat :</span>{" "}
                    {dataAgenda.startDate}{" "}
                    <span className="text-neutral-600">s/d</span>{" "}
                    {dataAgenda.endDate}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-neutral-900">
                  {dataAgenda.invoice}
                </p>
                <div className="flex items-center text-xxs font-medium text-neutral-900">
                  <IconComponent
                    src="/icons/box16.svg"
                    alt="Box Icon"
                    width={12}
                    height={12}
                    className="mr-2"
                  />
                  <p>
                    {visibleItems.map((item, idx) => (
                      <span key={idx}>
                        {item.name}{" "}
                        <span className="text-neutral-600">
                          ({item.weight})
                        </span>
                        {idx < visibleItems.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    {hiddenItems.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="ml-1 font-medium text-primary-700">
                            +{hiddenItems.length}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-3">
                          <div className="space-y-2">
                            <p className="font-bold">Barang Lainnya</p>
                            <ul className="list-inside list-disc space-y-1 text-neutral-700">
                              {hiddenItems.map((item, index) => (
                                <li key={index}>
                                  {item.name}{" "}
                                  <span className="text-neutral-500">
                                    ({item.weight})
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <p className="font-semibold text-neutral-900">{dataAgenda.name}</p>
            <div className="flex items-center text-xxs font-medium text-neutral-900">
              <IconComponent
                src="/icons/verify-whatsapp.svg"
                alt="Box Icon"
                width={12}
                height={12}
                className="mr-2"
              />
              <p className="text-xxs font-medium text-neutral-900">
                {dataAgenda.phone}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-neutral-900">
              {dataAgenda.vehicle}
            </p>
            <div className="flex items-center gap-2 text-nowrap text-xxs font-medium text-neutral-900">
              <IconComponent
                src="/icons/driver-plat.svg"
                alt="Truck Icon"
                width={16}
                height={16}
              />
              <span>{dataAgenda.licensePlate}</span>
              <span className="text-neutral-600">•</span>
              <IconComponent
                src="/icons/location.svg"
                alt="Truck Icon"
                width={16}
                height={16}
              />
              <span className="line-clamp-1">{dataAgenda.location}</span>
              <span className="text-nowrap text-neutral-600">
                {dataAgenda.estimatedDistance}
              </span>
            </div>
          </div>
          {dataAgenda.status !== enumStatus.INACTIVE && (
            <div className="space-y-1">
              <p className="font-semibold text-neutral-900">Rute Perjalanan</p>
              <div className="flex items-center justify-between text-xxs">
                <div className="flex min-w-[127.5px] items-center gap-2">
                  <div className="size-3 rounded-full border-4 border-muat-trans-primary-400 bg-[#461B02]" />
                  <div>
                    <p className="font-medium text-neutral-600">Lokasi Muat</p>
                    <p className="line-clamp-1 font-semibold text-neutral-900">
                      {dataAgenda.route.pickup.city},{" "}
                      {dataAgenda.route.pickup.district}
                    </p>
                  </div>
                </div>

                <div className="relative flex min-w-[116px] flex-1 items-center text-nowrap px-2 text-[8px]">
                  <div className="w-full border-t border-dashed border-neutral-400"></div>
                  <p className="absolute left-1/2 -translate-x-1/2 rounded-md border border-neutral-400 bg-white px-2 font-semibold text-neutral-900">
                    {dataAgenda.route.estimatedDistance}
                  </p>
                </div>

                <div className="flex min-w-[127.5px] items-center gap-2">
                  <div className="size-3 rounded-full border-4 border-[#461B02] bg-white" />

                  <div>
                    <p className="text-xs font-medium text-neutral-500">
                      Lokasi Bongkar
                    </p>
                    <p className="line-clamp-1 font-semibold text-neutral-900">
                      {dataAgenda.route.delivery.city},{" "}
                      {dataAgenda.route.delivery.district}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-400"></div>

      <div className="flex justify-end gap-2 p-3">
        {dataAgenda.status !== enumStatus.COMPLETED && (
          <Button
            variant="muattrans-primary-secondary"
            className="h-8 w-[140px] text-nowrap"
          >
            Lacak Armada
          </Button>
        )}
        {dataAgenda.status !== enumStatus.INACTIVE && (
          <Button variant="muattrans-primary" className="h-8 w-28">
            Detail
          </Button>
        )}
      </div>
    </div>
  );
};

export default PopoverAgenda;
