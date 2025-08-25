import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import Card, { CardContent } from "@/components/Card/Card";
// import { toast } from "@/lib/toast";
import { useTranslation } from "@/hooks/use-translation";
import { TRACKING_STATUS } from "@/utils/Transporter/trackingStatus";

import CardLacakArmada from "./components/CardLacakArmada";
import LacakArmadaHeader from "./components/LacakArmadaHeader";

const LacakArmada = ({ dataOrderDetail, onNavigateToRiwayat }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  // Tentukan tab aktif berdasarkan status order
  const getInitialActiveTab = useCallback(() => {
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
  }, [dataOrderDetail?.orderStatus]);

  const [activeTab, setActiveTab] = useState(() => {
    // Ensure activeTab is never undefined by providing fallback
    try {
      return getInitialActiveTab();
    } catch {
      return "aktif";
    }
  });
  const router = useRouter();

  // Update tab aktif ketika dataOrderDetail berubah
  useEffect(() => {
    if (dataOrderDetail) {
      setActiveTab(getInitialActiveTab());
    }
  }, [dataOrderDetail?.orderStatus, getInitialActiveTab]);

  // LDN-381
  // useEffect(() => {
  //   if (activeTab === "riwayat") {
  //     toast.success("Berhasil membatalkan armada AE 1111 LBA");
  //   }
  // }, [activeTab]);

  // Ambil data armada dari dataOrderDetail.fleets
  const armadaList = useMemo(() => {
    return (
      dataOrderDetail?.fleets?.map((fleet, index) => ({
        id: fleet.id,
        uniqueKey: `${fleet.id}-${fleet.licensePlate}-${index}`, // Add unique key for tracking
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
      })) || []
    );
  }, [dataOrderDetail?.fleets]);
  // Kategorisasi armada berdasarkan status order
  const categorizeArmada = useCallback((armada) => {
    // Status yang masuk kategori "riwayat" (pesanan selesai/dibatalkan)
    const riwayatStatuses = [
      TRACKING_STATUS.COMPLETED,
      TRACKING_STATUS.CANCELLED_BY_TRANSPORTER,
      TRACKING_STATUS.CANCELLED_BY_SHIPPER,
      TRACKING_STATUS.CANCELLED_BY_SYSTEM,
    ];

    return riwayatStatuses.includes(armada.status) ? "riwayat" : "aktif";
  }, []);
  // Filter armada berdasarkan tab aktif
  const armadaByTab = useMemo(() => {
    return (
      armadaList?.filter((armada) => categorizeArmada(armada) === activeTab) ||
      []
    );
  }, [armadaList, categorizeArmada, activeTab]);

  // Filter armada berdasarkan search value
  const filteredArmada = useMemo(() => {
    return (
      armadaByTab?.filter(
        (armada) =>
          (armada?.plateNumber || "")
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          (armada?.driverName || "")
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      ) || []
    );
  }, [armadaByTab, searchValue]);
  // Hitung jumlah armada per kategori
  const aktifCount = useMemo(() => {
    return (
      armadaList?.filter((armada) => categorizeArmada(armada) === "aktif")
        ?.length || 0
    );
  }, [armadaList, categorizeArmada]);

  const riwayatCount = useMemo(() => {
    return (
      armadaList?.filter((armada) => categorizeArmada(armada) === "riwayat")
        ?.length || 0
    );
  }, [armadaList, categorizeArmada]);

  // Hitung jumlah armada dengan SOS alert
  const sosCount = useMemo(() => {
    return armadaList?.filter((armada) => armada?.hasSOSAlert)?.length || 0;
  }, [armadaList]);

  // Cek apakah hanya ada satu data untuk menyembunyikan search
  // kata babang krisna kalo total semua nya lebih dari 1 dimunculin di semua tab
  const shouldShowSearch = armadaList.length > 1;

  // Cek apakah button "Lihat Posisi Armada" harus disembunyikan
  const shouldHidePositionButton = useMemo(() => {
    return dataOrderDetail?.orderStatus?.startsWith(
      "WAITING_CONFIRMATION_SHIPPER"
    );
  }, [dataOrderDetail?.orderStatus]);

  // Cek apakah harus menampilkan DataNotFound (ketika ada search value tapi tidak ada hasil)
  const shouldShowDataNotFound = useMemo(() => {
    return searchValue.length > 0 && (filteredArmada?.length || 0) === 0;
  }, [searchValue, filteredArmada]);

  // Handler functions
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handleDetailStatusClick = useCallback(() => {
    router.push(`/daftar-pesanan/uuid/detail-pesanan/detail-status-armada`);
  }, [router]);
  return (
    <Card className="rounded-xl border-none">
      <CardContent className="flex flex-col gap-y-6 p-6">
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
        />

        {/* Fleet Cards */}
        <div className="flex flex-col gap-4">
          {filteredArmada && filteredArmada.length > 0 ? (
            filteredArmada.map((armada) => (
              <CardLacakArmada
                key={armada.uniqueKey}
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
                setActiveTab={setActiveTab}
                onNavigateToRiwayat={onNavigateToRiwayat}
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
                {t(
                  "LacakArmada.noFleetChanges",
                  {},
                  "Belum ada perubahan armada"
                )}
              </div>
              <div className="mb-3 max-w-full text-center text-xs font-medium text-neutral-600">
                {t(
                  "LacakArmada.fleetChangesDescription",
                  {},
                  "Perubahan armada maupun armada dibatalkan dan armada selesai akan ditampilkan disini"
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default LacakArmada;
