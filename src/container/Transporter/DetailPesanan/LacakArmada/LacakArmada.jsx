import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Card, { CardContent } from "@/components/Card/Card";
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
      TRACKING_STATUS.CANCELLED_BY_TRANSPORTER,
      TRACKING_STATUS.CANCELLED_BY_SHIPPER,
      TRACKING_STATUS.CANCELLED_BY_SYSTEM,
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

  // Ambil data armada dari dataOrderDetail.fleets
  const armadaList =
    dataOrderDetail?.fleets?.map((fleet) => ({
      id: fleet.id,
      plateNumber: fleet.licensePlate,
      driverName: fleet.driver?.name,
      driverAvatar: fleet.driver?.profileImage,
      vehicleImage: fleet.vehicleImage,
      hasSOSAlert: fleet.hasSOSAlert || false,
      status: fleet.currentStatus || "SCHEDULED_FLEET", // Status dari fleet individual
      milestones: fleet.milestones || [], // Milestones dari fleet
      replacementFleet: fleet.replacementFleet || null, // Data armada pengganti
      replacementDriver: fleet.replacementDriver || null, // Data driver pengganti
      fleetChangeStatus: fleet.fleetChangeStatus || null, // Status perubahan armada
    })) || [];
  // Kategorisasi armada berdasarkan status order
  const categorizeArmada = (armada) => {
    // Status yang masuk kategori "riwayat" (pesanan selesai/dibatalkan)
    const riwayatStatuses = [
      TRACKING_STATUS.COMPLETED,
      TRACKING_STATUS.CANCELLED_BY_TRANSPORTER,
      TRACKING_STATUS.CANCELLED_BY_SHIPPER,
      TRACKING_STATUS.CANCELLED_BY_SYSTEM,
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
  const shouldHidePositionButton = dataOrderDetail?.orderStatus?.startsWith(
    "WAITING_CONFIRMATION_SHIPPER"
  );

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
          {filteredArmada.length > 0 ? (
            filteredArmada.map((armada, index) => (
              <CardLacakArmada
                key={armada.id || armada.plateNumber}
                plateNumber={armada.plateNumber}
                driverName={armada.driverName}
                vehicleImageUrl={armada.vehicleImage}
                status={armada.status}
                vehicleId={armada.id}
                driverId={armada.id}
                order={dataOrderDetail}
                hasSOSAlert={armada.hasSOSAlert}
                milestones={armada.milestones}
                replacementFleet={armada.replacementFleet}
                replacementDriver={armada.replacementDriver}
                fleetChangeStatus={armada.fleetChangeStatus}
              />
            ))
          ) : (
            <div className="flex w-full flex-col items-center justify-center bg-white px-4">
              <Image
                src="/img/daftarprodukicon.png"
                width={95}
                height={95}
                alt="Empty cart"
              />
              <div className="mt-2 font-semibold text-neutral-600">
                Belum ada riwayat perubahan
              </div>
              <div className="mb-3 max-w-full text-center text-xs font-medium text-neutral-600">
                Riwayat perubahan armada maupun pembatalan armada akan
                ditampilkan disini
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default LacakArmada;
