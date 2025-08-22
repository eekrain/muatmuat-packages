"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AlertTriangle, Loader2, SlidersHorizontal, X } from "lucide-react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Button from "@/components/Button/Button";
import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardFleetSOS from "@/components/Card/CardFleetSOS";
import CustomDropdown from "@/components/CustomDropdown";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
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
  const [isDriverHubungiModalOpen, setIsDriverHubungiModalOpen] =
    useState(false);
  const [selectedFleetForContact, setSelectedFleetForContact] = useState(null);
  const [filterValues, setFilterValues] = useState({
    truck: [],
    order: [],
    transporter: [],
  });
  const [tempFilterValues, setTempFilterValues] = useState({
    truck: [],
    order: [],
    transporter: [],
  });
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  // Initialize tempFilterValues with current filterValues on first render
  useEffect(() => {
    setTempFilterValues(filterValues);
  }, []); // Only run once on mount

  // Keep track of draft values that persist between popover opens
  const [draftFilterValues, setDraftFilterValues] = useState({
    truck: [],
    order: [],
    transporter: [],
  });

  // Sync temporary values when popover opens
  useEffect(() => {
    if (isFilterPopoverOpen) {
      // Use draft values if they exist, otherwise use current filter values
      if (
        draftFilterValues.transporter.length > 0 ||
        draftFilterValues.truck.length > 0 ||
        draftFilterValues.order.length > 0
      ) {
        setTempFilterValues(draftFilterValues);
      } else {
        setTempFilterValues(filterValues);
      }
    }
  }, [isFilterPopoverOpen, filterValues, draftFilterValues]);

  // Check if any filter is active
  const isFilterActive = useMemo(() => {
    return Object.values(filterValues).some((value) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    );
  }, [filterValues]);

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

  // Fungsi filter berdasarkan pencarian dan filter values
  const filterFn = (fleet) => {
    // Filter berdasarkan search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const searchMatch =
        (fleet.licensePlate || "").toLowerCase().includes(searchLower) ||
        (fleet?.driver?.fullName || "").toLowerCase().includes(searchLower) ||
        (fleet?.transporter?.companyName || "")
          .toLowerCase()
          .includes(searchLower);
      if (!searchMatch) return false;
    }

    // Filter berdasarkan transporter
    if (filterValues.transporter.length > 0) {
      const transporterMatch = filterValues.transporter.some(
        (transporterId) => {
          // Match berdasarkan transporter ID atau nama perusahaan
          return (
            fleet?.transporter?.id === transporterId ||
            fleet?.transporter?.companyName === transporterId
          );
        }
      );
      if (!transporterMatch) return false;
    }

    // Filter berdasarkan truck (license plate)
    if (filterValues.truck.length > 0) {
      const truckMatch = filterValues.truck.some((truckId) => {
        return fleet?.fleet?.licensePlate === truckId;
      });
      if (!truckMatch) return false;
    }

    // Filter berdasarkan order status
    if (filterValues.order.length > 0) {
      const orderMatch = filterValues.order.some((orderStatus) => {
        return fleet?.sosStatus === orderStatus;
      });
      if (!orderMatch) return false;
    }

    return true;
  };

  const filteredSosData = activeSosItems.filter(filterFn);
  const filteredHistoryData = historySosItems.filter(filterFn);

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

  const handleOpenDriverHubungiModal = (fleet) => {
    setSelectedFleetForContact(fleet);
    setIsDriverHubungiModalOpen(true);
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
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Search
              disabled={
                activeTab === "sos"
                  ? activeSosItems.length === 0
                  : historySosItems.length === 0
              }
              placeholder="Cari No. Polisi / Driver / Transporter"
              onSearch={setSearchTerm}
              autoSearch={true}
              debounceTime={300}
              defaultValue={searchTerm}
              inputClassName="min-w-full"
            />
          </div>
          <Popover
            open={isFilterPopoverOpen}
            onOpenChange={setIsFilterPopoverOpen}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={
                  activeTab === "sos"
                    ? activeSosItems.length === 0
                    : historySosItems.length === 0
                }
                className={`flex h-8 items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                  (
                    activeTab === "sos"
                      ? activeSosItems.length === 0
                      : historySosItems.length === 0
                  )
                    ? "cursor-not-allowed border-neutral-500 bg-neutral-200 text-neutral-500" // Style disabled
                    : isFilterActive
                      ? "border-primary-700 text-primary-700 hover:border-primary-700 hover:bg-gray-50" // Style saat aktif
                      : "border-neutral-600 text-neutral-600 hover:border-primary-700 hover:bg-gray-50" // Style default
                }`}
              >
                <SlidersHorizontal
                  className={`h-4 w-4 ${
                    (
                      activeTab === "sos"
                        ? activeSosItems.length === 0
                        : historySosItems.length === 0
                    )
                      ? "text-neutral-500"
                      : isFilterActive
                        ? "text-primary-700"
                        : "text-neutral-600"
                  }`}
                />
                Filter
                {isFilterActive &&
                  (activeTab === "sos"
                    ? activeSosItems.length > 0
                    : historySosItems.length > 0) && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                      {Object.values(filterValues).reduce(
                        (count, value) =>
                          count +
                          (Array.isArray(value) ? value.length : value ? 1 : 0),
                        0
                      )}
                    </span>
                  )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] rounded-xl border-0 bg-white p-0 shadow-lg"
              side="right"
              align="start"
              alignOffset={-4}
              sideOffset={12}
            >
              {/* Arrow pointing left towards the button */}
              <div
                className="absolute"
                style={{
                  width: 0,
                  height: 0,
                  borderStyle: "solid",
                  borderWidth: "8px 10px 8px 0",
                  borderColor: "transparent white transparent transparent",
                  left: "-9px",
                  top: "12px",
                  filter: "drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.1))",
                }}
              />

              <div className="flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4">
                  <h3 className="text-base font-bold text-black">Filter SOS</h3>
                  <button
                    onClick={() => {
                      setIsFilterPopoverOpen(false);
                    }}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <IconComponent
                      src="/icons/silang.svg"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </button>
                </div>

                {/* Transporter Filter Section */}
                <div className="px-6 pb-4">
                  <label className="mb-3 block text-sm font-medium">
                    Transporter
                  </label>
                  <CustomDropdown
                    className="w-[250px]"
                    options={[
                      { name: "PT ABC Transport", value: "trans123" },
                      { name: "PT XYZ Logistics", value: "trans456" },
                      { name: "PT DEF Cargo", value: "trans789" },
                    ]}
                    placeholder="Semua Transporter"
                    searchPlaceholder="Cari Transporter"
                    isMultipleSelected={true}
                    defaultValue={(() => {
                      const defaultValue = tempFilterValues.transporter
                        .map((id) =>
                          [
                            { name: "PT ABC Transport", value: "trans123" },
                            { name: "PT XYZ Logistics", value: "trans456" },
                            { name: "PT DEF Cargo", value: "trans789" },
                          ].find((opt) => opt.value === id)
                        )
                        .filter(Boolean);
                      console.log("CustomDropdown defaultValue:", defaultValue);
                      console.log(
                        "tempFilterValues.transporter:",
                        tempFilterValues.transporter
                      );
                      return defaultValue;
                    })()}
                    onSelected={(selected) => {
                      const transporterIds = selected.map((item) => item.value);
                      setTempFilterValues((prev) => ({
                        ...prev,
                        transporter: transporterIds,
                      }));
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-300 px-6 py-4">
                  <Button
                    variant="muattrans-primary-secondary"
                    size="small"
                    onClick={() => {
                      // Reset temporary values to empty
                      setTempFilterValues({
                        truck: [],
                        order: [],
                        transporter: [],
                      });
                      // Also clear draft values
                      setDraftFilterValues({
                        truck: [],
                        order: [],
                        transporter: [],
                      });
                      // Reset actual filter values to clear all active filters
                      setFilterValues({
                        truck: [],
                        order: [],
                        transporter: [],
                      });
                      // Clear search term as well
                      setSearchTerm("");
                    }}
                    className="min-w-[112px]"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="muattrans-primary"
                    size="small"
                    onClick={() => {
                      // Apply temporary filters to actual filter values
                      setFilterValues(tempFilterValues);
                      // Save current temp values as draft for next time
                      setDraftFilterValues(tempFilterValues);
                      console.log("Applied filters:", tempFilterValues);
                      setIsFilterPopoverOpen(false);
                    }}
                    className="min-w-[115px]"
                  >
                    Tampilkan
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
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
                {((activeTab === "sos" && !fleet.acknowledgeAt) ||
                  (activeTab === "all" && !fleet.resolvedAt)) && (
                  <CardHeader className="border-t-none rounded-t-md bg-red-500 p-1">
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-white" />
                      <p className="text-center text-xs font-semibold text-white">
                        Laporan belum diproses Transporter
                      </p>
                    </div>
                  </CardHeader>
                )}

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
                        onOpenHubungiModal={handleOpenDriverHubungiModal}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchTerm && dataToDisplay.length === 0 ? (
          <DataNotFound
            title="Keyword Tidak Ditemukan"
            description={`Tidak ada data yang cocok dengan pencarian "${searchTerm}"`}
            type="search"
            className={"h-full"}
          />
        ) : dataToDisplay.length === 0 ? (
          activeTab === "sos" ? (
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
          )
        ) : null}
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
          showInitialChoice={false}
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
      {isDriverHubungiModalOpen && selectedFleetForContact && (
        <HubungiModal
          isOpen={isDriverHubungiModalOpen}
          onClose={() => setIsDriverHubungiModalOpen(false)}
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
