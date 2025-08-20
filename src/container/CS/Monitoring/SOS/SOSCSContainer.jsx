"use client";

import { useCallback, useMemo, useState } from "react";

import { AlertTriangle, Loader2, X } from "lucide-react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardFleet from "@/components/Card/CardFleet";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
import { DriverSelectionModal } from "@/container/Transporter/Driver/DriverSelectionModal";
import { useGetHistoryDataSOS } from "@/services/CS/monitoring/sos/getHistoryDataSOS";
import { useGetListSOSData } from "@/services/CS/monitoring/sos/getListSOSData";
import { useGetTransporterContactSOS } from "@/services/CS/monitoring/sos/getTransporterContactSOS";
import { acknowledgeSos } from "@/services/Transporter/monitoring/getSosList";

const SOSCSContainer = ({ onClose, onExpand }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [activeTab, setActiveTab] = useState("sos"); // 'sos' | 'all'
  const [isHubungiModalOpen, setIsHubungiModalOpen] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  // Fetch active SOS data using getListSOSData API
  const {
    data: sosData,
    isLoading: sosLoading,
    error: sosError,
    mutate: refetchSosList,
  } = useGetListSOSData({
    // status: "OPEN,IN_PROGRESS,ACKNOWLEDGED",
    // limit: 50,
  });

  // Fetch history SOS data using getHistoryDataSOS API
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useGetHistoryDataSOS({
    limit: 50,
  });

  // Get transporter contacts when modal is opened
  const { data: contactData, isLoading: contactLoading } =
    useGetTransporterContactSOS(selectedTransporter?.transporterId, {
      enabled: !!selectedTransporter?.transporterId,
    });

  // Process active SOS items from API data
  const activeSosItems = useMemo(() => {
    // Try different data access patterns
    let sosArray = [];

    if (sosData?.sos) {
      sosArray = sosData.sos;
    } else if (sosData?.Data?.sos) {
      sosArray = sosData.Data.sos;
    } else if (sosData?.data?.Data?.sos) {
      sosArray = sosData.data.Data.sos;
    } else if (sosData?.raw?.Data?.sos) {
      sosArray = sosData.raw.Data.sos;
    } else {
      return [];
    }

    return sosArray.filter((item) =>
      ["OPEN", "IN_PROGRESS", "ACKNOWLEDGED"].includes(item.sosStatus)
    );
  }, [sosData]);

  // Process history SOS items from API data
  const historySosItems = useMemo(() => {
    // Try different data access patterns
    let historyArray = [];

    if (historyData?.history) {
      historyArray = historyData.history;
    } else if (historyData?.Data?.history) {
      historyArray = historyData.Data.history;
    } else if (historyData?.raw?.Data?.history) {
      historyArray = historyData.raw.Data.history;
    } else {
      return [];
    }

    return historyArray.filter((item) => item.sosStatus === "RESOLVED");
  }, [historyData]);

  // Combine both data sources for display
  const allFleetsWithSos = useMemo(() => {
    const activeItems = activeSosItems.map((item) => ({
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

    const historyItems = historySosItems.map((item) => ({
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
        sosStatus: "RESOLVED",
        sosId: item.id,
      },
    }));

    return [...activeItems, ...historyItems];
  }, [activeSosItems, historySosItems]);

  // Fungsi filter berdasarkan pencarian
  const filterFn = (fleet) =>
    (fleet.licensePlate || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (fleet?.driver?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const filteredSosData = activeSosItems.filter(filterFn);
  const filteredHistoryData = historySosItems.filter(filterFn);

  const dataToDisplay =
    activeTab === "sos" ? filteredSosData : filteredHistoryData;
  const totalActiveSos = activeSosItems.length;

  // Group fleets by transporter
  const groupedFleets = useMemo(() => {
    const filtered = dataToDisplay.filter(filterFn);

    if (filtered.length === 0) {
      return [];
    }

    const groups = filtered.reduce((acc, fleet) => {
      const key = fleet.transporter?.id || fleet.id;
      if (!acc[key]) {
        acc[key] = {
          transporter: fleet.transporter,
          fleets: [],
        };
      }
      acc[key].fleets.push(fleet);
      return acc;
    }, {});

    return Object.values(groups);
  }, [dataToDisplay, searchTerm]);

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

  const handleOpenHubungiModal = (transporter) => {
    setSelectedTransporter({
      transporterId: transporter.transporterId || transporter.id,
      companyName: transporter.companyName,
      phoneNumber: transporter.phoneNumber,
    });
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
            {dataToDisplay.map((fleet) => (
              <Card
                key={fleet.fleetId}
                className="border-neutral-400 p-0 !shadow-none"
              >
                <CardHeader className="border-neutral-400 bg-[#FFE9ED] !p-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <AvatarDriver
                        image={
                          fleet.driver?.profileImage ||
                          "https://picsum.photos/200/300"
                        }
                        withIcon={false}
                        appearance={{
                          photoClassName: "h-8 w-8 border border-neutral-400",
                        }}
                      />
                      <div>
                        <h3 className="text-base font-bold">
                          {fleet.driver?.name || "Driver Tidak Ditemukan"}
                        </h3>
                        <div className="flex items-center gap-1 pt-2 text-xs text-neutral-700">
                          <ImageComponent
                            src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                            width={16}
                            height={16}
                          />
                          <span>{fleet.licensePlate || "N/A"}</span>
                          <li className="flex items-center gap-1 pl-[26px]">
                            <IconComponent
                              src="/icons/ellipse-7.svg"
                              height={3}
                              width={2}
                              alt="list-bullet"
                            />
                            <button
                              onClick={() =>
                                handleOpenHubungiModal({
                                  transporterId: fleet.transporter?.id,
                                  companyName:
                                    fleet.transporter?.companyName || "N/A",
                                  phoneNumber:
                                    fleet.driver?.phoneNumber || "N/A",
                                })
                              }
                              className="flex items-center gap-1 text-sm font-medium text-primary-700"
                            >
                              <IconComponent
                                src="/icons/call-blue.svg"
                                width={16}
                                height={16}
                              />
                              <span>Hubungi</span>
                            </button>
                          </li>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="border-neutral-400 !p-0 !pt-3">
                  <div className="space-y-3 px-4 pb-4">
                    <div
                      key={fleet.fleetId}
                      onClick={() => handleFleetCardClick(fleet)}
                      className="cursor-pointer"
                    >
                      <CardFleet
                        key={fleet.fleetId}
                        fleet={fleet}
                        isExpanded={expandedId === fleet.fleetId}
                        onToggleExpand={toggleExpanded}
                        onOpenDriverModal={handleOpenDriverModal}
                        isSOS={fleet?.detailSOS?.sosStatus === "NEW"}
                        onAcknowledge={handleAcknowledge}
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
      {isHubungiModalOpen && selectedTransporter && (
        <HubungiModal
          isOpen={isHubungiModalOpen}
          onClose={() => setIsHubungiModalOpen(false)}
          transporterData={selectedTransporter}
        />
      )}
    </div>
  );
};

export default SOSCSContainer;
