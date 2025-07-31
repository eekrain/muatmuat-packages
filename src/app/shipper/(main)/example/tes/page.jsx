"use client";

import Button from "@/components/Button/Button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Drawer/Drawer";
import { cn } from "@/lib/utils";

const MenuDrawer = () => {
  const menuItems = [
    {
      label: "Ringkasan Status Pesanan",
      action: () => alert("Navigating to Status..."),
    },
    {
      label: "Detail Pembayaran",
      action: () => alert("Navigating to Payment..."),
    },
    {
      label: "Ubah Pesanan",
      action: () => alert("Navigating to Edit Order..."),
    },
    {
      label: "Unduh Dokumen Delivery Order (DO)",
      action: () => alert("Downloading DO..."),
    },
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col px-4 pb-4">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className={cn(
                  "w-full py-4 text-left text-sm font-semibold text-neutral-900",
                  index < menuItems.length - 1 && "border-b border-neutral-400"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
