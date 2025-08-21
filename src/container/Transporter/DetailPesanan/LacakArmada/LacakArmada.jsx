import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Card, { CardContent } from "@/components/Card/Card";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { ORDER_STATUS } from "@/utils/Transporter/orderStatus";

import CardLacakArmada from "./components/CardLacakArmada";
import LacakArmadaHeader from "./components/LacakArmadaHeader";

const LacakArmada = ({ dataOrderDetail }) => {
  const [searchValue, setSearchValue] = useState("");

  // Tentukan tab aktif berdasarkan status order
  const getInitialActiveTab = () => {
    if (!dataOrderDetail?.orderStatus) return "aktif";

    // Status yang masuk kategori "riwayat" (pesanan selesai/dibatalkan)
    const riwayatStatuses = [
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED_BY_TRANSPORTER,
      ORDER_STATUS.CANCELLED_BY_SHIPPER,
      ORDER_STATUS.CANCELLED_BY_SYSTEM,
    ];

    return riwayatStatuses.includes(dataOrderDetail.orderStatus)
      ? "riwayat"
      : "aktif";
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab);
  const router = useRouter();

  // Update tab aktif ketika dataOrderDetail berubah
  useEffect(() => {
    setActiveTab(getInitialActiveTab());
  }, [dataOrderDetail?.orderStatus]);

  // Fungsi untuk menentukan current step berdasarkan status
  const getCurrentStepFromStatus = (status) => {
    // Status pembatalan menggunakan cancelledSteps (index 1 untuk "Dibatalkan")
    if (
      [
        ORDER_STATUS.CANCELLED_BY_TRANSPORTER,
        ORDER_STATUS.CANCELLED_BY_SHIPPER,
        ORDER_STATUS.CANCELLED_BY_SYSTEM,
      ].includes(status)
    ) {
      return 1; // Step "Dibatalkan" dalam cancelledSteps
    }

    switch (status) {
      case ORDER_STATUS.COMPLETED:
        return 5; // Selesai
      case ORDER_STATUS.DOCUMENT_DELIVERY:
        return 4; // Proses Pengiriman Dokumen
      case ORDER_STATUS.DOCUMENT_PREPARATION:
        return 3; // Dokumen Sedang Disiapkan
      case ORDER_STATUS.LOADING:
        return 2; // Proses Muat
      case ORDER_STATUS.HEADING_TO_LOADING:
        return 1; // Proses Muat
      case ORDER_STATUS.HEADING_TO_UNLOADING:
        return 1; // Proses Muat
      case ORDER_STATUS.UNLOADING:
        return 1; // Proses Bongkar
      default:
        return 0; // Armada Dijadwalkan
    }
  };

  // Data stepper untuk tracking progress armada - sesuai desain Figma
  const stepperData = useShallowMemo(() => {
    return [
      {
        label: "Armada Dijadwalkan",
        status: ORDER_STATUS.SCHEDULED_FLEET,
        icon: "/icons/stepper/stepper-scheduled.svg",
        subtitle: "",
      },
      {
        label: "Proses Muat",
        status: ORDER_STATUS.LOADING,
        icon: "/icons/stepper/stepper-box.svg",
        subtitle: "",
      },
      {
        label: "Proses Bongkar",
        status: ORDER_STATUS.UNLOADING,
        icon: "/icons/stepper/stepper-box-opened.svg",
        subtitle: "",
      },
      {
        label: "Dokumen Sedang Disiapkan",
        status: ORDER_STATUS.DOCUMENT_PREPARATION,
        icon: "/icons/stepper/stepper-document-preparing.svg",
        subtitle: "",
      },
      {
        label: "Proses Pengiriman Dokumen",
        status: ORDER_STATUS.DOCUMENT_DELIVERY,
        icon: "/icons/stepper/stepper-document-delivery.svg",
        subtitle: "",
      },
      {
        label: "Selesai",
        status: ORDER_STATUS.COMPLETED,
        icon: "/icons/stepper/stepper-completed.svg",
        subtitle: "",
      },
    ];
  }, []);
  // Ambil data armada dari dataOrderDetail.fleet
  const armadaList =
    dataOrderDetail?.fleet?.map((fleet) => ({
      id: fleet.id,
      plateNumber: fleet.plateNumber,
      driverName: fleet.driverName,
      driverAvatar: fleet.driverAvatar,
      vehicleImage: fleet.vehicleImage,
      currentStep: getCurrentStepFromStatus(dataOrderDetail?.orderStatus), // Index step yang sedang aktif (0-based)
      status: dataOrderDetail?.orderStatus || ORDER_STATUS.SCHEDULED_FLEET, // Status dari order detail
    })) || [];
  // Kategorisasi armada berdasarkan status order
  const categorizeArmada = (armada) => {
    // Status yang masuk kategori "riwayat" (pesanan selesai/dibatalkan)
    const riwayatStatuses = [
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED_BY_TRANSPORTER,
      ORDER_STATUS.CANCELLED_BY_SHIPPER,
      ORDER_STATUS.CANCELLED_BY_SYSTEM,
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
          {filteredArmada.length > 0 ? (
            filteredArmada.map((armada, index) => (
              <CardLacakArmada
                key={armada.id || armada.plateNumber}
                plateNumber={armada.plateNumber}
                driverName={armada.driverName}
                vehicleImageUrl={armada.vehicleImage}
                status={armada.status}
                stepperData={stepperData}
                vehicleId={armada.id}
                driverId={armada.id}
                order={dataOrderDetail}
              />
            ))
          ) : (
            <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-[60px]">
              <Image
                src="/img/daftarprodukicon.png"
                width={95}
                height={95}
                alt="Empty cart"
              />
              <div className="mt-2 font-semibold text-neutral-600">
                Belum ada perubahan armada
              </div>
              <div className="mb-3 text-center text-xs font-medium text-neutral-600">
                Perubahan armada maupun armada dibatalkan dan armada selesai
                akan ditampilkan disini
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default LacakArmada;
