"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardMenu from "@/components/Card/CardMenu";

const menuItems = [
  {
    id: 1,
    icon: "/icons/dashboard/truck.svg",
    title: "Tambahkan Armada",
    description:
      "Kamu harus menambahkan armada yang akan digunakan untuk menerima pesanan.",
    buttonText: "Tambah Armada",
    onClick: () => console.log("Navigating to Tambah Armada..."),
  },
  {
    id: 2,
    icon: "/icons/dashboard/driver.svg",
    title: "Tambahkan Driver",
    description:
      "Kamu harus menambahkan driver terlebih dahulu untuk dapat digunakan menerima pesanan.",
    buttonText: "Tambah Driver",
    onClick: () => console.log("Navigating to Tambah Driver..."),
  },
  {
    id: 3,
    icon: "/icons/dashboard/pair-driver-fleet.svg",
    title: "Pasangkan Armada dan Driver",
    description:
      "Pasangkan armada dengan driver yang sesuai agar siap menerima pesanan pengiriman.",
    buttonText: "Mulai Pasangkan",
    onClick: () => console.log("Navigating to Pasangkan Armada..."),
  },
  {
    id: 4,
    icon: "/icons/dashboard/maps-box.svg",
    title: "Atur Area Muat & Bongkar dan Muatan yang Dilayani",
    description:
      "Atur area muat & bongkar dan jenis muatan agar kami dapat mencarikan pesanan yang sesuai untukmu.",
    buttonText: "Atur Area & Muatan",
    onClick: () => console.log("Navigating to Atur Area & Muatan..."),
  },
];

const UserJourney = () => {
  return (
    <div className="py-6">
      <Card className="h-[409px] w-[1232px] !border-none !p-0 !py-0 px-0 shadow-muat">
        <CardHeader className="!border-none !px-6 !py-5">
          <h1 className="text-lg font-bold text-neutral-900">
            Langkah Mudah Untuk Mulai Mendapatkan Pesanan
          </h1>
          <p className="text-xs text-neutral-600">
            Ayo lengkapi informasi armada dan driver kamu untuk mulai menerima
            pesanan di muatrans
          </p>
        </CardHeader>
        <CardContent className="!px-6 !py-0">
          <div className="flex flex-col gap-6">
            {menuItems.map((item) => (
              <CardMenu
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
                buttonText={item.buttonText}
                onClick={item.onClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserJourney;
