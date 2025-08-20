"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";

const BadgeSOSPopover = ({
  sosData = {
    licensePlate: "L 1111 LBA",
    truckIcon: null,
    reportTime: "10 Jan 2025 12:00 WIB",
    images: [],
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    driverName: "Fernando Torres",
    driverPhone: "0823-3123-1290",
    lastLocation: "Kab. Batu",
    orderNumber: "MT25A002A",
    pickupLocation: "Kota Surabaya, Kec. Tegalsari",
    dropoffLocation: "Kab. Pasuruan, Kec. Klojen",
  },
  onProcessLoad = () => {},
  onViewDetail = () => {},
  onViewHistory = () => {},
  onConfirm = () => {},
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="h-6 w-10 content-center gap-1 rounded-md bg-error-400 text-center text-xs font-semibold text-error-50">
        SOS
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="link" className="h-auto p-0 text-xs font-medium">
            Lihat SOS
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[305px] place-content-center border-none bg-transparent p-0 shadow-none"
          align="start"
          side="right"
          sideOffset={222}
          alignOffset={-24}
        >
          <img src="/img/mock-popover-sos.png" alt="" className="-ml-2.5" />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BadgeSOSPopover;
