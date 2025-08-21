"use client";

import { useCallback, useMemo, useState } from "react";

import { AlertTriangle, Loader2, X } from "lucide-react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardFleetSOS from "@/components/Card/CardFleetSOS";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
import { DriverSelectionModal } from "@/container/Transporter/Driver/DriverSelectionModal";
import { useGetHistoryDataSOS } from "@/services/CS/monitoring/sos/getHistoryDataSOS";
import { useGetListSOSData } from "@/services/CS/monitoring/sos/getListSOSData";
import { acknowledgeSos } from "@/services/Transporter/monitoring/getSosList";

const SOSCSContainer = ({ onClose, onExpand }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [activeTab, setActiveTab] = useState("sos"); // 'sos' | 'all'
  const [isHubungiModalOpen, setIsHubungiModalOpen] = useState(false);
  const [selectedFleetForContact, setSelectedFleetForContact] = useState(null);

  // Fetch active SOS data using getListSOSData API
  const {
    data: sosData,
    isLoading: sosLoading,
    error: sosError,
    mutate: refetchSosList,
  } = useGetListSOSData({
    limit: 50,
  });

  // Fetch history SOS data using getHistoryDataSOS API
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useGetHistoryDataSOS({
    limit: 50,
  });

  // Process active SOS items from API data - using direct data access like getArmadaData.js
  const activeSosItems = useMemo(() => {
    if (!sosData?.Data?.sos) return [];
    return sosData.Data.sos;
  }, [sosData]);

  // Process history SOS items from API data - using direct data access like getArmadaData.js
  const historySosItems = useMemo(() => {
    if (!historyData?.Data?.history) return [];
    return historyData.Data.history;
  }, [historyData]);

  // Combine both data sources for display - langsung pakai data mentah
  const allFleetsWithSos = useMemo(() => {
    return [...activeSosItems, ...historySosItems];
  }, [activeSosItems, historySosItems]);

  // Fungsi filter berdasarkan pencarian
  const filterFn = (fleet) =>
    (fleet.licensePlate || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (fleet?.driver?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const filteredSosData = activeSosItems;
  const filteredHistoryData = historySosItems;

  const dataToDisplay =
    activeTab === "sos" ? filteredSosData : filteredHistoryData;
  const totalActiveSos = activeSosItems.length;

  // Transform raw API data to expected UI format
  const transformedData = useMemo(() => {
    return dataToDisplay.map((item) => ({
      ...item,
      fleetId: item.id,
      licensePlate: item.fleet?.licensePlate,
      driver: {
        ...item.driver,
        name: item.driver?.fullName,
        profileImage: item.driver?.profileImage,
        phoneNumber: item.driver?.phoneNumber,
      },
      transporter: item.transporter,
      hasSOSAlert: true,
      detailSOS: {
        sosStatus: item.sosStatus === "OPEN" ? "NEW" : item.sosStatus,
        sosId: item.id,
      },
    }));
  }, [dataToDisplay]);

  const toggleExpanded = (id) => {
    setExpandedId((prev) => {
      const newId = prev === id ? null : id;
      if (newId && onExpand) onExpand(newId);
      return newId;
    });
  };

  const handleOpenDriverModal = (fleet) => {
    setSelectedFleet(fleet);
    setShowDriverModal(true);
  };

  const handleDriverSelectionSuccess = () => {
    refetchSosList();
    setShowDriverModal(false);
    setSelectedFleet(null);
  };

  const handleOpenHubungiModal = (fleet) => {
    setSelectedFleetForContact(fleet);
    setIsHubungiModalOpen(true);
  };

  const handleFleetCardClick = (fleet) => {
    // Handle fleet card click if needed
    console.log("Fleet clicked:", fleet);
  };

  // Handle acknowledge using the API
  const handleAcknowledge = useCallback(
    async (fleet) => {
      try {
        const sosId = fleet?.detailSOS?.sosId;
        if (!sosId) return;
        await acknowledgeSos(sosId);
        // Refresh list agar status jadi ACKNOWLEDGED -> tombol mengerti hilang
        await refetchSosList();
      } catch (e) {
        console.error(e);
        // opsional: tampilkan toast error
      }
    },
    [refetchSosList]
  );

  const isLoading = sosLoading || historyLoading;
  const error = sosError || historyError;

  return (
    <div className="flex h-[calc(100vh-92px-96px)] flex-col rounded-xl bg-white pt-4">
      <button
        className="absolute right-2 top-2 z-10 text-primary-700 hover:text-primary-800"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="px-4">
        {/* Struktur flex sudah tidak diperlukan */}
        <div className="pb-3">
          <h2 className="text-[14px] font-bold text-gray-900">
            SOS{" "}
            {totalActiveSos > 0 ? (
              <span className="font-semibold">({totalActiveSos} Armada)</span>
            ) : (
              <span className="font-semibold">(Belum Ada Laporan)</span>
            )}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 px-4">
        <Search
          placeholder="Cari No. Polisi / Nama Driver"
          onSearch={setSearchTerm}
          autoSearch={true}
          debounceTime={300}
          defaultValue={searchTerm}
          inputClassName="min-w-full"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pb-3">
        <button
          className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
            activeTab === "sos"
              ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
              : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
          }`}
          onClick={() => setActiveTab("sos")}
        >
          SOS ({activeSosItems.length})
          {activeSosItems.length > 0 && (
            <NotificationDot
              size="sm"
              color="red"
              position="absolute"
              positionClasses="top-0 right-0"
            />
          )}
        </button>

        <button
          className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
            activeTab === "all"
              ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
              : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Riwayat ({historySosItems.length})
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-[12px] pb-3">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading SOS…</span>
          </div>
        ) : error ? (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <p className="text-sm text-red-600">Failed to load SOS list</p>
              <p className="mt-1 text-xs text-gray-500">
                Please try again later
              </p>
            </div>
          </div>
        ) : dataToDisplay.length > 0 ? (
          <div className="space-y-3">
            {transformedData.map((fleet, index) => (
              <Card
                key={`${activeTab}-${fleet.fleetId || index}`}
                className="border-neutral-400 p-0 !shadow-none"
              >
                <CardHeader className="border-t-none rounded-t-md bg-red-500 p-1">
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-white" />
                    <p className="text-center text-xs font-semibold text-white">
                      Laporan belum diproses Transporter
                    </p>
                  </div>
                </CardHeader>

                <CardHeader className="border-neutral-400 bg-[#FFE9ED] !p-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-1">
                      <AvatarDriver
                        image={
                          fleet.transporter?.logoUrl ||
                          "https://picsum.photos/200/300"
                        }
                        withIcon={false}
                        appearance={{
                          photoClassName: "h-8 w-8 border border-neutral-400",
                        }}
                      />
                      <div>
                        <h3 className="text-base font-bold">
                          {fleet.transporter?.companyName ||
                            "Driver Tidak Ditemukan"}
                        </h3>
                        <div className="flex items-center gap-1 pt-2 text-xs text-neutral-700">
                          <button
                            onClick={() => handleOpenHubungiModal(fleet)}
                            className="flex items-center gap-1 text-sm font-medium text-primary-700"
                          >
                            <IconComponent
                              src="/icons/call-blue.svg"
                              width={16}
                              height={16}
                            />
                            <span>Hubungi</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Countdown Display */}
                    <div className="rounded-lg border border-red-500 bg-white px-3 py-1">
                      <span className="text-sm font-medium text-red-500">
                        {fleet.countdownMinutes !== undefined &&
                        fleet.countdownMinutes !== null
                          ? fleet.countdownMinutes < 0
                            ? `- ${Math.abs(fleet.countdownMinutes)}:${String(Math.floor((Math.abs(fleet.countdownMinutes) % 1) * 60)).padStart(2, "0")}`
                            : `${Math.floor(fleet.countdownMinutes)}:${String(Math.floor((fleet.countdownMinutes % 1) * 60)).padStart(2, "0")}`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="border-neutral-400 !p-0 !pt-3">
                  <div className="space-y-3 px-4 pb-4">
                    <div
                      key={`content-${fleet.fleetId || index}`}
                      onClick={() => handleFleetCardClick(fleet)}
                      className="cursor-pointer"
                    >
                      <CardFleetSOS
                        key={`card-${fleet.fleetId || index}`}
                        fleet={fleet}
                        isExpanded={expandedId === fleet.fleetId}
                        onToggleExpand={toggleExpanded}
                        onOpenDriverModal={handleOpenDriverModal}
                        isSOS={fleet?.detailSOS?.sosStatus === "NEW"}
                        onAcknowledge={handleAcknowledge}
                        onOpenHubungiModal={handleOpenHubungiModal}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchTerm ? (
          <DataNotFound
            title="Data tidak ditemukan"
            description={`Tidak ada data yang cocok dengan pencarian "${searchTerm}"`}
            type="search"
            className={"h-full"}
          />
        ) : activeTab === "sos" ? (
          <DataNotFound
            title="Belum Ada Laporan SOS"
            description="Saat ini tidak ada laporan SOS yang perlu ditangani."
            type="data"
            className={"h-full"}
          />
        ) : (
          <DataNotFound
            title="Belum Ada Riwayat Laporan"
            description="Belum ada riwayat laporan yang tercatat."
            type="data"
            className={"h-full"}
          />
        )}
      </div>

      {/* Modal */}
      {showDriverModal && selectedFleet && (
        <DriverSelectionModal
          onClose={() => setShowDriverModal(false)}
          onSuccess={handleDriverSelectionSuccess}
          vehicleId={selectedFleet.fleetId}
          vehiclePlate={selectedFleet.licensePlate}
          currentDriverId={selectedFleet.driver?.id || null}
          title="Pasangkan Driver"
        />
      )}
      {isHubungiModalOpen && selectedFleetForContact && (
        <HubungiModal
          isOpen={isHubungiModalOpen}
          onClose={() => setIsHubungiModalOpen(false)}
          showInitialChoice={true}
          transporterContacts={[
            // PIC contacts
            ...(selectedFleetForContact?.transporter?.id
              ? [
                  {
                    label: "PIC 1",
                    name: "Alexander",
                    role: "Staf Admin Operasional",
                    phone: "0821-2345-6869",
                  },
                  {
                    label: "PIC 2",
                    name: "Alexander krisna indra candra",
                    role: "Staf Admin Operasional",
                    phone: "0821-2345-8686",
                  },
                  {
                    label: "No. Telepon Perusahaan",
                    name: "",
                    role: "",
                    phone: "021-5550-1234",
                  },
                  {
                    label: "No. Darurat",
                    name: "Candra Ariansyah",
                    role: "Koordinator Staf Admin Operasional",
                    phone: "0812-9876-5432",
                  },
                ]
              : []),
          ]}
          driverContacts={[
            {
              label: "Driver",
              name: selectedFleetForContact?.driver?.fullName || "N/A",
              role: "",
              phone: selectedFleetForContact?.driver?.phoneNumber || "-",
            },
          ]}
        />
      )}
    </div>
  );
};

export default SOSCSContainer;
