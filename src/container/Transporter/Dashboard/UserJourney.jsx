"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardMenu from "@/components/Card/CardMenu";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

// Updated menuItems to match the keys in the new API response (`journeyStatus.steps`)
const menuItems = [
  {
    id: 1,
    statusKey: "addFleet",
    icon: "/icons/dashboard/truck.svg",
    title: "Tambahkan Armada",
    description:
      "Kamu harus menambahkan armada yang akan digunakan untuk menerima pesanan.",
    buttonText: "Tambah Armada",
    path: "/manajemen-armada",
  },
  {
    id: 2,
    statusKey: "addDriver",
    icon: "/icons/dashboard/driver.svg",
    title: "Tambahkan Driver",
    description:
      "Kamu harus menambahkan driver terlebih dahulu untuk dapat digunakan menerima pesanan.",
    buttonText: "Tambah Driver",
    path: "/manajemen-driver",
  },
  {
    id: 3,
    statusKey: "pairFleetDriver",
    icon: "/icons/dashboard/pair-driver-fleet.svg",
    title: "Pasangkan Armada dan Driver",
    description:
      "Pasangkan armada dengan driver yang sesuai agar siap menerima pesanan pengiriman.",
    buttonText: "Mulai Pasangkan",
    path: "/manajemen-armada",
  },
  {
    id: 4,
    statusKey: "configureServiceArea",
    icon: "/icons/dashboard/maps-box.svg",
    title: "Atur Area Muat & Bongkar dan Muatan yang Dilayani",
    description:
      "Atur area muat & bongkar dan jenis muatan agar kami dapat mencarikan pesanan yang sesuai untukmu.",
    buttonText: "Atur Area & Muatan",
    path: "/pengaturan",
  },
];

const UserJourney = ({ title = "Dashboard Analytics", journeyStatus }) => {
  const router = useRouter();
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    confirmText: "Mengerti",
    confirmClassname: "",
    modalContentClassname: "",
    onConfirm: () => {},
  });

  const closeModal = () =>
    setModal({
      isOpen: false,
      message: "",
      confirmText: "Mengerti",
      confirmClassname: "",
      modalContentClassname: "",
      onConfirm: () => {},
    });

  const handleMenuClick = (item) => {
    // Logic updated to use the new statusKey and data structure
    if (item.statusKey === "pairFleetDriver") {
      const isFleetAdded = journeyStatus?.steps?.addFleet?.isCompleted;
      const isDriverAdded = journeyStatus?.steps?.addDriver?.isCompleted;

      if (!isFleetAdded && !isDriverAdded) {
        setModal({
          isOpen: true,
          message:
            "Kamu harus menambahkan Armada dan Driver sebelum memulai proses pemasangan.",
          confirmText: "Mengerti",
          confirmClassname: "hidden",
          modalContentClassname: "h-[169px]",
          onConfirm: () => {},
        });
        return;
      }

      if (!isDriverAdded) {
        setModal({
          isOpen: true,
          message:
            "Kamu harus menambahkan Driver sebelum memulai proses pemasangan.",
          confirmText: "Tambah Driver",
          confirmClassname: "",
          modalContentClassname: "",
          onConfirm: () => router.push("/manajemen-driver"),
        });
        return;
      }

      if (!isFleetAdded) {
        setModal({
          isOpen: true,
          message:
            "Kamu harus menambahkan Armada sebelum memulai proses pemasangan.",
          confirmText: "Tambah Armada",
          confirmClassname: "",
          modalContentClassname: "",
          onConfirm: () => router.push("/manajemen-armada"),
        });
        return;
      }
    }
    router.push(item.path);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={modal.isOpen}
        setIsOpen={(isOpen) => setModal((prev) => ({ ...prev, isOpen }))}
        description={{ text: modal.message }}
        confirm={{
          text: modal.confirmText,
          onClick: () => {
            modal.onConfirm();
            closeModal();
          },
          classname: modal.confirmClassname,
        }}
        cancel={{ text: "Tutup", classname: "hidden" }}
        className={modal.modalContentClassname}
      />

      <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
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
                  onClick={() => handleMenuClick(item)}
                  // Status logic updated to check the nested `isCompleted` property
                  status={
                    journeyStatus?.steps?.[item.statusKey]?.isCompleted
                      ? "completed"
                      : "incompleted"
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserJourney;
