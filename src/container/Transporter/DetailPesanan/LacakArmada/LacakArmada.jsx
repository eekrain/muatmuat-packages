import { useRouter } from "next/navigation";
import { useState } from "react";

import Card, { CardContent } from "@/components/Card/Card";
import { useShallowMemo } from "@/hooks/use-shallow-memo";

import CardLacakArmada from "./components/CardLacakArmada";
import LacakArmadaHeader from "./components/LacakArmadaHeader";

const LacakArmada = ({ dataOrderDetail }) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("aktif");
  const router = useRouter();
  // Data stepper untuk tracking progress armada - sesuai desain Figma
  const stepperData = useShallowMemo(() => {
    return [
      {
        label: "Armada Dijadwalkan",
        status: "SCHEDULED",
        icon: "/icons/stepper/stepper-scheduled.svg",
        subtitle: "",
      },
      {
        label: "Proses Muat",
        status: "LOADING",
        icon: "/icons/stepper/stepper-box.svg",
        subtitle: "",
      },
      {
        label: "Proses Bongkar",
        status: "UNLOADING",
        icon: "/icons/stepper/stepper-box-opened.svg",
        subtitle: "",
      },
      {
        label: "Dokumen Sedang Disiapkan",
        status: "DOCUMENT_PREPARATION",
        icon: "/icons/stepper/stepper-document-preparing.svg",
        subtitle: "",
      },
      {
        label: "Proses Pengiriman Dokumen",
        status: "DOCUMENT_DELIVERY",
        icon: "/icons/stepper/stepper-document-delivery.svg",
        subtitle: "",
      },
      {
        label: "Selesai",
        status: "COMPLETED",
        icon: "/icons/stepper/stepper-completed.svg",
        subtitle: "",
      },
    ];
  }, []);
  // Ambil data armada dari dataOrderDetail
  const armadaList = [
    {
      plateNumber: "AE 1111 LBA",
      driverName: "Noel Galagher",
      driverAvatar: "/img/avatar.png",
      currentStep: 5, // Index step yang sedang aktif (0-based) - Selesai
      status: "COMPLETED",
    },
    {
      plateNumber: "AE 2222 LBA",
      driverName:
        "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto",
      driverAvatar: "/img/avatar.png",
      currentStep: 1, // Index step yang sedang aktif (0-based) - Proses Muat
      status: "LOADING",
    },
    {
      plateNumber: "AE 333 LBA",
      driverName: "Driver Name",
      driverAvatar: "/img/avatar.png",
      currentStep: 2, // Index step yang sedang aktif (0-based) - Proses Bongkar
      status: "UNLOADING",
    },
  ];
  // Kategorisasi armada berdasarkan status order
  const categorizeArmada = (armada) => {
    // Status yang masuk kategori "riwayat" (pesanan selesai/dibatalkan)
    const riwayatStatuses = [
      "COMPLETED",
      "CANCELLED_TRANSPORTER",
      "CANCELLED_SHIPPER",
      "CANCELLED_BY_SYSTEM",
    ];

    return riwayatStatuses.includes(armada.status) ? "riwayat" : "aktif";
  };
  // Filter armada berdasarkan tab aktif
  const armadaByTab = armadaList.filter(
    (armada) => categorizeArmada(armada) === activeTab
  );
  // Filter armada berdasarkan search value
  const filteredArmada = armadaByTab.filter(
    (armada) =>
      armada.plateNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      armada.driverName.toLowerCase().includes(searchValue.toLowerCase())
  );
  // Hitung jumlah armada per kategori
  const aktifCount = armadaList.filter(
    (armada) => categorizeArmada(armada) === "aktif"
  ).length;
  const riwayatCount = armadaList.filter(
    (armada) => categorizeArmada(armada) === "riwayat"
  ).length;
  // Cek apakah hanya ada satu data untuk menyembunyikan search
  const shouldShowSearch = armadaByTab.length > 1;

  // Handler functions
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleDetailStatusClick = () => {
    router.push(`/daftar-pesanan/uuid/detail-pesanan/detail-status-armada`);
  };
  console.log(filteredArmada, "armadalist");
  return (
    <Card className="rounded-xl border-none">
      <CardContent className="flex flex-col gap-4 p-6">
        <LacakArmadaHeader
          activeCount={aktifCount}
          historyCount={riwayatCount}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showSearch={shouldShowSearch}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onDetailStatusClick={handleDetailStatusClick}
        />

        {/* Fleet Cards */}
        <div className="flex flex-col gap-4">
          {filteredArmada.map((armada, index) => (
            <CardLacakArmada
              key={index}
              plateNumber={armada.plateNumber}
              driverName={armada.driverName}
              vehicleImageUrl={armada.vehicleImageUrl}
              status={armada.status}
              stepperData={stepperData}
              vehicleId={armada.vehicleId}
              driverId={armada.driverId}
              order={dataOrderDetail}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default LacakArmada;
