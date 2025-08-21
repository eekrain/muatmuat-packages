import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Card, { CardContent } from "@/components/Card/Card";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { TRACKING_STATUS } from "@/utils/Transporter/trackingStatus";

import CardLacakArmada from "./components/CardLacakArmada";
import LacakArmadaHeader from "./components/LacakArmadaHeader";

const LacakArmada = ({ dataOrderDetail }) => {
  const [searchValue, setSearchValue] = useState("");

  // Tentukan tab aktif berdasarkan status order
  const getInitialActiveTab = () => {
    if (!dataOrderDetail?.orderStatus) return "aktif";

    // Status yang masuk kategori "riwayat" (pesanan selesai/dibatalkan)
    const riwayatStatuses = [
      TRACKING_STATUS.COMPLETED,
      "CANCELLED_BY_TRANSPORTER",
      "CANCELLED_BY_SHIPPER",
      "CANCELLED_BY_SYSTEM",
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
        "CANCELLED_BY_TRANSPORTER",
        "CANCELLED_BY_SHIPPER",
        "CANCELLED_BY_SYSTEM",
      ].includes(status)
    ) {
      return 1; // Step "Dibatalkan" dalam cancelledSteps
    }

    switch (status) {
      case TRACKING_STATUS.COMPLETED:
        return 5; // Selesai (6 step: index 5)
      case "DOCUMENT_DELIVERY":
        return 4; // Proses Pengiriman Dokumen (6 step: index 4)
      case "DOCUMENT_PREPARATION":
        return 3; // Dokumen Sedang Disiapkan (6 step: index 3)
      case TRACKING_STATUS.LOADING:
        return 1; // Proses Muat (6 step: index 1)
      case "HEADING_TO_LOADING":
        return 1; // Proses Muat
      case "HEADING_TO_UNLOADING":
        return 2; // Proses Bongkar (6 step: index 2)
      case TRACKING_STATUS.UNLOADING:
        return 2; // Proses Bongkar (6 step: index 2)
      case "WAITING_CONFIRMATION_SHIPPER":
        return -1; // Tidak ada step yang aktif (semua abu-abu)
      case "SCHEDULED_FLEET":
        return 0; // Armada Dijadwalkan (step 1, index 0)
      default:
        return 0; // Armada Dijadwalkan
    }
  };

  // Data stepper untuk tracking progress armada - selalu 6 steps untuk LOADING
  const stepperData = useShallowMemo(() => {
    // Jika status LOADING, tampilkan 6 step
    if (dataOrderDetail?.orderStatus === "LOADING") {
      return [
        {
          label: "Armada Dijadwalkan",
          status: "SCHEDULED_FLEET",
          icon: "/icons/stepper/stepper-scheduled.svg",
          subtitle: "",
        },
        {
          label: "Proses Muat",
          status: TRACKING_STATUS.LOADING,
          icon: "/icons/stepper/stepper-box.svg",
          subtitle: "",
        },
        {
          label: "Proses Bongkar",
          status: TRACKING_STATUS.UNLOADING,
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
          status: TRACKING_STATUS.COMPLETED,
          icon: "/icons/stepper/stepper-completed.svg",
          subtitle: "",
        },
      ];
    }

    // Jika tidak LOADING, tampilkan 4 step
    return [
      {
        label: "Armada Dijadwalkan",
        status: "SCHEDULED_FLEET",
        icon: "/icons/stepper/stepper-scheduled.svg",
        subtitle: "",
      },
      {
        label: "Proses Muat",
        status: TRACKING_STATUS.LOADING,
        icon: "/icons/stepper/stepper-box.svg",
        subtitle: "",
      },
      {
        label: "Proses Bongkar",
        status: TRACKING_STATUS.UNLOADING,
        icon: "/icons/stepper/stepper-box-opened.svg",
        subtitle: "",
      },
      {
        label: "Selesai",
        status: TRACKING_STATUS.COMPLETED,
        icon: "/icons/stepper/stepper-completed.svg",
        subtitle: "",
      },
    ];
  }, [dataOrderDetail?.orderStatus]);
  // Ambil data armada dari dataOrderDetail.fleet
  const armadaList =
    dataOrderDetail?.fleet?.map((fleet) => ({
      id: fleet.id,
      plateNumber: fleet.plateNumber,
      driverName: fleet.driverName,
      driverAvatar: fleet.driverAvatar,
      vehicleImage: fleet.vehicleImage,
      hasSOSAlert: fleet.hasSOSAlert || false,
      currentStep: getCurrentStepFromStatus(fleet.orderStatus), // Index step yang sedang aktif (0-based)
      status: fleet.orderStatus || "SCHEDULED_FLEET", // Status dari fleet individual
    })) || [];
  // Kategorisasi armada berdasarkan status order
  const categorizeArmada = (armada) => {
    // Status yang masuk kategori "riwayat" (pesanan selesai/dibatalkan)
    const riwayatStatuses = [
      TRACKING_STATUS.COMPLETED,
      "CANCELLED_BY_TRANSPORTER",
      "CANCELLED_BY_SHIPPER",
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

  // Hitung jumlah armada dengan SOS alert
  const sosCount = armadaList.filter((armada) => armada.hasSOSAlert).length;

  // Cek apakah hanya ada satu data untuk menyembunyikan search
  const shouldShowSearch = armadaByTab.length > 1;

  // Cek apakah button "Lihat Posisi Armada" harus disembunyikan
  const shouldHidePositionButton =
    dataOrderDetail?.orderStatus === "WAITING_CONFIRMATION_SHIPPER";

  // Cek apakah harus menampilkan DataNotFound (ketika ada search value tapi tidak ada hasil)
  const shouldShowDataNotFound =
    searchValue.length > 0 && filteredArmada.length === 0;

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
          hidePositionButton={shouldHidePositionButton}
          showDataNotFound={shouldShowDataNotFound}
          sosUnit={sosCount}
          isSOS={sosCount > 1}
        />

        {/* Fleet Cards */}
        <div className="flex flex-col gap-4">
          {filteredArmada.map((armada, index) => (
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
              hasSOSAlert={armada.hasSOSAlert}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default LacakArmada;
