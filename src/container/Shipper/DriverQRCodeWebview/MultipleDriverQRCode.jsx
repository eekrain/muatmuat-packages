"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import { ModalQRCodeDriver } from "@/components/Modal/ModalQRCodeDriver";
import { getStatusScanMetadata } from "@/lib/normalizers/detailpesanan/getStatusScanMetadata";

// Driver Item Component
const DriverItem = ({ driver, showSeparator = true, orderId }) => {
  const statusScan = getStatusScanMetadata(driver.statusScan);
  return (
    <div>
      <BadgeStatusPesanan
        className="w-fit"
        variant={statusScan.hasScan ? "success" : "error"}
      >
        {statusScan.statusText}
      </BadgeStatusPesanan>

      <div className="mt-3 flex flex-col justify-between gap-y-2 md:flex-row md:items-center">
        <AvatarDriver
          name={driver.name}
          image={driver.image}
          licensePlate={`No. Polisi : ${driver.plateNumber}`}
          appearance={{
            containerClassName: "gap-1",
            nameClassName: "text-xs font-bold",
            licensePlateClassName: "text-[10px]",
          }}
          withIcon={false}
        />

        <ModalQRCodeDriver
          title="QR Code Lokasi Muat"
          orderId={orderId}
          driverId={driver.driverId}
          showShareButton={false}
        >
          <Button variant="muatparts-primary" className="w-full md:w-auto">
            Tampilkan QR Code
          </Button>
        </ModalQRCodeDriver>
      </div>

      {showSeparator && (
        <div className="my-[14px] border-b border-neutral-400"></div>
      )}
    </div>
  );
};

// Sample data
const drivers = [
  {
    id: 1,
    name: "Hendra",
    plateNumber: "AE 666 LBA",
    statusScan: "BELUM_SCAN_MUAT",
    image: "https://picsum.photos/50?img=1",
  },
  {
    id: 2,
    name: "Ardian Eka",
    plateNumber: "AB 5142 NBA",
    statusScan: "BELUM_SCAN_BONGKAR",
    image: "https://picsum.photos/50?img=2",
  },
  {
    id: 3,
    name: "John Doe",
    plateNumber: "B 1234 CD",
    statusScan: "SUDAH_SCAN_MUAT",
    image: "https://picsum.photos/50?img=3",
  },
];
// Main Driver List Component
const MultipleDriverQRCode = () => {
  const { orderId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 pt-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-400 bg-white p-6 shadow-sm">
        <h1 className="mb-3 text-center text-base font-bold md:mb-6">
          Semua Driver
        </h1>

        <div className="rounded-xl border border-neutral-400">
          {/* Search Input */}
          <Input
            placeholder="Cari Nama Driver/Plat Nomor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={{ left: "/icons/search.svg" }}
            className="w-[262px] pl-3 pt-3"
          />

          {/* Driver List */}
          <div className="px-3 py-3 md:px-[21px]">
            <div className="rounded-xl border border-neutral-400 px-4 py-5">
              {filteredDrivers.map((driver, index) => (
                <DriverItem
                  key={driver.id}
                  driver={driver}
                  showSeparator={index !== filteredDrivers.length - 1}
                  orderId={orderId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleDriverQRCode;
