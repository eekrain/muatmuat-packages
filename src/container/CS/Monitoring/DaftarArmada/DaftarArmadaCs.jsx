"use client";

import { useEffect, useMemo, useState } from "react";

import { AlertTriangle, Loader2, SlidersHorizontal, X } from "lucide-react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Button from "@/components/Button/Button";
import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardFleet from "@/components/Card/CardFleet";
import CustomDropdown from "@/components/CustomDropdown";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
import Search from "@/components/Search/Search";
import { DriverSelectionModal } from "@/container/Transporter/Driver/DriverSelectionModal";
import ModalResponseChange from "@/container/Transporter/Monitoring/DaftarArmada/components/ModalResponseChange";
import SosPopupNotification from "@/container/Transporter/Monitoring/DaftarArmada/components/SosPopupNotification";
import { useGetFleetList } from "@/services/CS/monitoring/getCsFleetList";
import { useGetListSOSData } from "@/services/CS/monitoring/sos/getListSOSData";
import { acknowledgeSos } from "@/services/Transporter/monitoring/getSosList";
import useSosWebSocket from "@/services/Transporter/monitoring/useSosWebSocket";

const generalContacts = [
  {
    label: "PIC 1",
    name: "Alexander Agak Beda hwgdagwiudgaiwudguiawwgduiagwdiugawidguiawgduiagwduiauohuahdiohwodho",
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
    label: "PIC 3",
    name: "",
    role: "",
    phone: "",
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
];
const generalContacts2 = [
  {
    label: "PIC 1",
    name: "Alexander Test",
    role: "Staf Admin Operasional",
    phone: "08123456789",
  },
];

const DaftarArmadaCs = ({
  onClose,
  onExpand,
  selectedFleetId,
  onFleetSelect,
  onFleetClick,
  onOpenRiwayatSOS,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'ready' | 'sos'
  const [showSosNotification, setShowSosNotification] = useState(false);
  const [showResponseChangeModal, setShowResponseChangeModal] = useState(false);
  const [selectedFleetForResponse, setSelectedFleetForResponse] =
    useState(null);
  const [isHubungiModalOpen, setIsHubungiModalOpen] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  // State management for filters
  const [filterValues, setFilterValues] = useState({
    transporter: [],
    truck: [],
    order: [],
  });
  const [tempFilterValues, setTempFilterValues] = useState({
    transporter: [],
    truck: [],
    order: [],
  });
  const [draftFilterValues, setDraftFilterValues] = useState({
    transporter: [],
    truck: [],
    order: [],
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

  const {
    data: fleetData,
    isLoading,
    error,
    mutate: refetchFleets,
  } = useGetFleetList({
    search: searchTerm,
    has_fleet_status: activeTab === "ready" ? "READY_FOR_ORDER" : undefined,
    truckStatus: filterValues.truck,
    transporterIds: filterValues.transporter,
    orderStatus: filterValues.order,
  });

  const { data: allFleetData } = useGetFleetList({
    search: searchTerm,
    transporterIds: filterValues.transporter,
    truckStatus: filterValues.truck,
    orderStatus: filterValues.order,
  });

  // --- FIX STARTS HERE ---
  // Declare transporters from API data first
  const transporters = fleetData?.transporters || [];
  const allTransporters = allFleetData?.transporters || [];

  // Now you can safely use allTransporters
  const transporterOptions = useMemo(() => {
    return (allTransporters || []).map((transporter) => ({
      name: transporter.companyName,
      value: transporter.id,
    }));
  }, [allTransporters]);
  // --- FIX ENDS HERE ---

  const totalFleets = useMemo(() => {
    return allTransporters.reduce(
      (total, t) => total + (t.fleets?.length || 0),
      0
    );
  }, [allTransporters]);

  const readyCount = useMemo(() => {
    return allTransporters.reduce((total, transporter) => {
      const readyFleets =
        transporter.fleets?.filter(
          (fleet) => fleet.status === "READY_FOR_ORDER"
        ) || [];
      return total + readyFleets.length;
    }, 0);
  }, [allTransporters]);

  const sosCount = useMemo(() => {
    return allTransporters.reduce((total, transporter) => {
      const sosFleets =
        transporter.fleets?.filter((fleet) => fleet.hasSOSAlert) || [];
      return total + sosFleets.length;
    }, 0);
  }, [allTransporters]);

  const filterCounts = allFleetData?.filterOptions || {};

  // Bring countdown data from SOSCSContainer: fetch active SOS list and build lookup
  const { data: sosData } = useGetListSOSData({ limit: 50 });
  const activeSosItems = useMemo(() => {
    if (!sosData?.Data?.sos) return [];
    return sosData.Data.sos;
  }, [sosData]);
  const sosCountdownByPlate = useMemo(() => {
    const map = new Map();
    activeSosItems.forEach((item) => {
      const plate = item?.fleet?.licensePlate || item?.licensePlate;
      const minutes =
        item?.countdownMinutes ?? item?.detailSOS?.countdownMinutes ?? null;
      if (plate && minutes !== null && minutes !== undefined) {
        map.set(plate, minutes);
      }
    });
    return map;
  }, [activeSosItems]);

  const { latestSosAlert, acknowledgeSosAlert } = useSosWebSocket();

  const processedTransporters = useMemo(() => {
    return transporters
      .map((transporter) => {
        const uniqueFleets = new Map();
        (transporter.fleets || []).forEach((fleet) =>
          uniqueFleets.set(fleet.fleetId, fleet)
        );
        const deDupedFleets = Array.from(uniqueFleets.values());

        const filteredFleets = deDupedFleets.filter((fleet) => {
          const searchMatch =
            fleet.licensePlate
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            fleet.driver?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            transporter.companyName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());

          if (!searchMatch) return false;

          if (activeTab === "sos") {
            return fleet.hasSOSAlert;
          }
          if (activeTab === "ready") {
            return fleet.status === "READY_FOR_ORDER";
          }
          return true;
        });

        return {
          ...transporter,
          fleets: filteredFleets,
        };
      })
      .filter((transporter) => transporter.fleets.length > 0);
  }, [transporters, searchTerm, activeTab]);

  const handleAcknowledge = async (fleet) => {
    try {
      const sosId = fleet?.detailSOS?.sosId;
      if (!sosId) return;
      await acknowledgeSos(sosId);
      await refetchFleets();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (latestSosAlert) setShowSosNotification(true);
  }, [latestSosAlert]);

  useEffect(() => {
    if (sosCount === 0 && activeTab === "sos") {
      setActiveTab("all");
    }
  }, [sosCount, activeTab]);

  useEffect(() => {
    if (selectedFleetId) setExpandedId(selectedFleetId);
  }, [selectedFleetId]);

  const toggleExpanded = (id) => {
    const newId = expandedId === id ? null : id;
    setExpandedId(newId);
    if (newId && onExpand) onExpand(newId);
  };

  const handleOpenDriverModal = (fleet) => {
    setSelectedFleet(fleet);
    setShowDriverModal(true);
  };

  const handleOpenResponseChangeModal = (fleet) => {
    setSelectedFleetForResponse(fleet);
    setShowResponseChangeModal(true);
  };

  const handleRespondToChange = () => {
    setShowResponseChangeModal(false);
    setSelectedFleetForResponse(null);
  };

  const handleDriverSelectionSuccess = () => {
    refetchFleets();
    setShowDriverModal(false);
    setSelectedFleet(null);
  };

  const handleFleetCardClick = (fleet) => {
    if (onFleetClick) onFleetClick(fleet);
    if (onFleetSelect) onFleetSelect(fleet.fleetId);
  };

  const handleOpenHubungiModal = (transporter) => {
    setSelectedTransporter(transporter);
    setIsHubungiModalOpen(true);
  };

  const truckStatusOptions = useMemo(() => {
    return (filterCounts.truckStatus || []).map((item) => ({
      name: `${item.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} (${item.count})`,
      value: item.status,
    }));
  }, [filterCounts.truckStatus]);

  const orderStatusOptions = useMemo(() => {
    return (filterCounts.orderStatus || []).map((item) => ({
      name: `${item.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} (${item.count})`,
      value: item.status,
    }));
  }, [filterCounts.orderStatus]);

  return (
    <div className="flex h-[calc(100vh-92px-96px)] flex-col rounded-xl bg-white pt-4">
      {/* Header */}
      <button
        className="absolute right-2 top-2 z-10 text-primary-700 hover:text-primary-800"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="px-4">
        <div className="pb-3">
          <h2 className="text-[14px] font-bold text-gray-900">
            Daftar Armada{" "}
            <span className="font-semibold">({totalFleets} Armada)</span>
          </h2>
        </div>
      </div>

      {/* Search & filter */}
      <div className="mb-4 flex flex-col gap-4 px-4">
        <div className="flex gap-3">
          <Search
            placeholder="Cari Transporter / No. Polisi / Driver"
            onSearch={setSearchTerm}
            autoSearch
            debounceTime={300}
            defaultValue={searchTerm}
            className="w-full"
          />
          <Popover
            open={isFilterPopoverOpen}
            onOpenChange={setIsFilterPopoverOpen}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={totalFleets === 0}
                className={`flex h-8 items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                  totalFleets === 0
                    ? "cursor-not-allowed border-neutral-500 bg-neutral-200 text-neutral-500" // Style disabled
                    : isFilterActive
                      ? "border-primary-700 text-primary-700 hover:border-primary-700 hover:bg-gray-50" // Style saat aktif
                      : "border-neutral-600 text-neutral-600 hover:border-primary-700 hover:bg-gray-50" // Style default
                }`}
              >
                <SlidersHorizontal
                  className={`h-4 w-4 ${
                    totalFleets === 0
                      ? "text-neutral-500"
                      : isFilterActive
                        ? "text-primary-700"
                        : "text-neutral-600"
                  }`}
                />
                Filter
                {isFilterActive && totalFleets > 0 && (
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
                <div className="flex items-center justify-between px-6 py-4">
                  <h3 className="text-base font-bold text-black">
                    Filter Armada
                  </h3>
                  <button
                    onClick={() => setIsFilterPopoverOpen(false)}
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
                    options={transporterOptions}
                    placeholder="Semua Transporter"
                    searchPlaceholder="Cari Transporter"
                    isMultipleSelected={true}
                    defaultValue={tempFilterValues.transporter
                      .map((id) =>
                        transporterOptions.find((opt) => opt.value === id)
                      )
                      .filter(Boolean)}
                    onSelected={(selected) => {
                      const transporterIds = selected.map((item) => item.value);
                      setTempFilterValues((prev) => ({
                        ...prev,
                        transporter: transporterIds,
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-gray-300 px-6 py-4">
                  <Button
                    variant="muattrans-primary-secondary"
                    size="small"
                    onClick={() => {
                      const initialFilters = {
                        transporter: [],
                        truck: [],
                        order: [],
                      };
                      setTempFilterValues(initialFilters);
                      setDraftFilterValues(initialFilters);
                      setFilterValues(initialFilters);
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
                      setFilterValues(tempFilterValues);
                      setDraftFilterValues(tempFilterValues);
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

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        {sosCount > 0 && (
          <button
            className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "sos"
                ? "border-primary-700 bg-primary-50 text-primary-700"
                : "border-neutral-200 bg-neutral-200 text-black"
            }`}
            onClick={() => setActiveTab("sos")}
          >
            SOS ({sosCount})
            <NotificationDot
              size="sm"
              color="red"
              position="absolute"
              positionClasses="top-0 right-0"
            />
          </button>
        )}
        {readyCount > 0 && (
          <button
            className={`relative rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "ready"
                ? "border-primary-700 bg-primary-50 text-primary-700"
                : "border-neutral-200 bg-neutral-200 text-black"
            }`}
            onClick={() => setActiveTab("ready")}
          >
            Siap Menerima Order ({readyCount})
          </button>
        )}
        <button
          className={`rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
            activeTab === "all"
              ? "border-primary-700 bg-primary-50 text-primary-700"
              : "border-neutral-200 bg-neutral-200 text-black"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Semua ({totalFleets})
        </button>
      </div>

      {/* Fleet List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Memuat data armada...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            Gagal memuat data armada.
          </div>
        ) : processedTransporters.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            {searchTerm ||
            activeTab === "ready" ||
            activeTab === "sos" ||
            isFilterActive ? (
              <DataNotFound
                type="search"
                title="Data Armada Tidak Ditemukan"
                message="Coba ubah kata kunci atau filter pencarian Anda."
              />
            ) : (
              <DataNotFound type="data">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-center text-base font-semibold leading-tight text-neutral-600">
                    Belum ada armada
                  </p>
                  <p className="text-center text-xs font-medium leading-tight text-neutral-600">
                    Hubungi Transporter untuk menambahkan armada
                  </p>
                </div>
              </DataNotFound>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {processedTransporters.map((transporter) => (
              <Card
                key={transporter.id}
                className={`${activeTab === "sos" ? "border-red-500" : "border-neutral-400"} p-0 !shadow-none`}
              >
                {activeTab === "sos" && (
                  <CardHeader className="border-t-none rounded-t-md bg-red-500 p-1">
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-white" />
                      <p className="text-center text-xs font-semibold text-white">
                        Laporan belum diproses Transporter
                      </p>
                    </div>
                  </CardHeader>
                )}
                <CardHeader
                  className={`!p-0 ${
                    activeTab === "sos"
                      ? "border-red-500 bg-[#FFE9ED]"
                      : "border-neutral-400"
                  }`}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <AvatarDriver
                        image={"https://picsum.photos/200/300"}
                        withIcon={false}
                        appearance={{
                          photoClassName: "h-8 w-8 border border-neutral-400",
                        }}
                      />
                      <div>
                        {activeTab === "sos" ? (
                          <>
                            <h3 className="text-base font-bold">
                              {transporter.companyName}
                            </h3>
                            <div className="flex items-center gap-1 pt-2 text-xs text-neutral-700">
                              <button
                                onClick={() =>
                                  handleOpenHubungiModal(transporter)
                                }
                                className="flex items-center gap-1 text-sm font-medium text-primary-700"
                              >
                                <IconComponent
                                  src="/icons/call-blue.svg"
                                  width={16}
                                  height={16}
                                  alt="call icon"
                                />
                                <span>Hubungi</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="text-base font-bold">
                              {transporter.companyName}
                            </h3>
                            <div className="flex items-center gap-1 pt-2 text-xs text-neutral-700">
                              <ImageComponent
                                src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                                width={16}
                                height={16}
                                alt="truck icon"
                              />
                              <span>{transporter.fleets.length} Armada</span>
                              <li className="flex list-none items-center gap-1 pl-[26px]">
                                <IconComponent
                                  src="/icons/ellipse-7.svg"
                                  height={3}
                                  width={2}
                                  alt="list-bullet"
                                />
                                <button
                                  onClick={() =>
                                    handleOpenHubungiModal(transporter)
                                  }
                                  className="flex items-center gap-1 text-sm font-medium text-primary-700"
                                >
                                  <IconComponent
                                    src="/icons/call-blue.svg"
                                    width={16}
                                    height={16}
                                    alt="call icon"
                                  />
                                  <span>Hubungi</span>
                                </button>
                              </li>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {activeTab === "sos" &&
                      (() => {
                        // Prefer live data from SOS list using license plate mapping
                        const firstFleet = (transporter.fleets || [])[0];
                        const plate = firstFleet?.licensePlate;
                        const minutesFromLookup = plate
                          ? sosCountdownByPlate.get(plate)
                          : undefined;
                        const minutesFallback = (transporter.fleets || [])
                          .map(
                            (f) =>
                              f?.detailSOS?.countdownMinutes ??
                              f?.countdownMinutes
                          )
                          .find((v) => v !== undefined && v !== null);
                        const minutes =
                          minutesFromLookup !== undefined &&
                          minutesFromLookup !== null
                            ? minutesFromLookup
                            : minutesFallback;

                        const content =
                          minutes !== undefined && minutes !== null
                            ? minutes < 0
                              ? `- ${Math.abs(minutes)}:${String(
                                  Math.floor((Math.abs(minutes) % 1) * 60)
                                ).padStart(2, "0")}`
                              : `${Math.floor(minutes)}:${String(
                                  Math.floor((minutes % 1) * 60)
                                ).padStart(2, "0")}`
                            : "N/A";

                        return (
                          <div className="rounded-lg border border-red-500 bg-white px-3 py-1">
                            <span className="text-sm font-medium text-red-500">
                              {content}
                            </span>
                          </div>
                        );
                      })()}
                  </div>
                </CardHeader>
                <CardContent className="border-neutral-400 !p-0 !pt-3">
                  <div className="space-y-3 px-4 pb-4">
                    {transporter.fleets.map((fleet) => (
                      <div key={fleet.fleetId} className="cursor-pointer">
                        <div onClick={() => handleFleetCardClick(fleet)}>
                          <CardFleet
                            fleet={fleet}
                            isExpanded={expandedId === fleet.fleetId}
                            onToggleExpand={() => toggleExpanded(fleet.fleetId)}
                            onOpenDriverModal={() =>
                              handleOpenDriverModal(fleet)
                            }
                            onOpenResponseChangeModal={() =>
                              handleOpenResponseChangeModal(fleet)
                            }
                            onOpenRiwayatSOS={onOpenRiwayatSOS}
                            isSOS={
                              fleet.hasSOSAlert &&
                              fleet.detailSOS?.sosStatus === "NEW"
                            }
                            onAcknowledge={() => handleAcknowledge(fleet)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showDriverModal && selectedFleet && (
        <DriverSelectionModal
          onClose={() => setShowDriverModal(false)}
          onSuccess={handleDriverSelectionSuccess}
          vehicleId={selectedFleet.fleetId}
          vehiclePlate={selectedFleet.licensePlate}
          currentDriverId={selectedFleet.driver?.driverId || null}
        />
      )}
      {showResponseChangeModal && selectedFleetForResponse && (
        <ModalResponseChange
          open={showResponseChangeModal}
          onOpenChange={() => {
            setShowResponseChangeModal(false);
            setSelectedFleetForResponse(null);
          }}
          changeData={selectedFleetForResponse.activeOrder?.changeDetails}
          onRespond={handleRespondToChange}
        />
      )}
      <SosPopupNotification
        isOpen={showSosNotification}
        sosCount={sosCount}
        onClose={() => {
          setShowSosNotification(false);
          acknowledgeSosAlert();
        }}
        onConfirm={() => {
          setActiveTab("sos");
          setShowSosNotification(false);
          acknowledgeSosAlert();
        }}
      />

      {isHubungiModalOpen && (
        <HubungiModal
          isOpen={isHubungiModalOpen}
          onClose={() => setIsHubungiModalOpen(false)}
          showInitialChoice={true}
          transporterContacts={generalContacts}
          driverContacts={generalContacts2}
        />
      )}
    </div>
  );
};

export default DaftarArmadaCs;
