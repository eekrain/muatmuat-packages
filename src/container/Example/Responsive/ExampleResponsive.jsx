import Link from "next/link";
import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import ToogleButton from "@/components/ToogleButton/ToogleButton";

const RESPONSIVE_LINKS = [
  {
    href: "/example",
    label: "Layout Default",
  },
  {
    label: "Layout Searchbar",
    href: "/example/mobile-searchbar",
  },
  {
    label: "Layout Form",
    href: "/example/mobile-form",
  },
  {
    label: "Layout Form with Menu",
    href: "/example/mobile-form-with-menu",
  },
];

const ExampleResponsive = ({ searchValue = "" }) => {
  const [courierStatus, setCourierStatus] = useState({
    ambilLangsung: false,
    kurirToko: false,
    gojekInstant: true,
    grabInstant: true,
    jtRegular: false,
    jneRegular: false,
    sicepat: false,
    anteraja: false,
    posIndonesia: false,
    jtCargo: false,
    jneTrucking: false,
    wahana: false,
  });
  const toggleCourier = (courierName) => {
    setCourierStatus((prev) => ({
      ...prev,
      [courierName]: !prev[courierName],
    }));
  };
  return (
    <div className="flex flex-col gap-y-3 p-4">
      <div className="itmes-center flex flex-wrap gap-2">
        <Button
          color="primary"
          type="muattrans"
          onClick={() => setOpenControlled(true)}
        >
          Primary
        </Button>
        <Button color="primary_secondary" type="muattrans">
          Primary Secondary
        </Button>
        <Button color="error" type="muattrans">
          Error
        </Button>
        <Button color="error_secondary" type="muattrans">
          Error Seconary
        </Button>
        <Button color="warning" type="muattrans">
          Warning
        </Button>
      </div>
      <div>
        <ToogleButton
          onClick={() => toggleCourier("ambilLangsung")}
          value={courierStatus.ambilLangsung}
        />
      </div>
      <div>
        <BottomSheet>
          <BottomSheetTrigger>Open Bottom Sheet</BottomSheetTrigger>
          <BottomSheetContent>
            <BottomSheetHeader title="Bagikan Produk"></BottomSheetHeader>
            <div className="divide-y px-4">
              <button className="w-full px-6 py-4 text-left">
                Ringkasan Status Pesanan
              </button>
              <button className="w-full px-6 py-4 text-left">
                Detail Pengiriman Dokumen
              </button>
              <button className="w-full px-6 py-4 text-left">
                Detail Pembayaran
              </button>
              <button className="w-full px-6 py-4 text-left">
                Ubah Pesanan
              </button>
              <button className="w-full px-6 py-4 text-left">
                Unduh Dokumen Delivery Order (DO)
              </button>
            </div>
          </BottomSheetContent>
        </BottomSheet>
      </div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Search Value</h1>
        {searchValue}
      </div>

      <div>
        <h1 className="text-2xl font-bold">Links</h1>
        {RESPONSIVE_LINKS.map((link) => (
          <div className="flex gap-3" key={link.href}>
            <Link href={link.href} className="block text-blue-500 underline">
              {link.label}
            </Link>

            <span className="text-neutral-500">{link.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleResponsive;
