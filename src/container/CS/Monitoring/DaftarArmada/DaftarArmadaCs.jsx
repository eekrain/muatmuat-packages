"use client";

import { useEffect, useMemo, useState } from "react";

import { Loader2, X } from "lucide-react";

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
import FilterPopoverArmada from "@/container/Transporter/Monitoring/DaftarArmada/components/FilterPopoverArmada";
import ModalResponseChange from "@/container/Transporter/Monitoring/DaftarArmada/components/ModalResponseChange";
import SosPopupNotification from "@/container/Transporter/Monitoring/DaftarArmada/components/SosPopupNotification";
import { useGetFleetList } from "@/services/CS/monitoring/getCsFleetList";
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
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'sos'
  const [truckStatusFilter, setTruckStatusFilter] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState([]);
  const [showSosNotification, setShowSosNotification] = useState(false);
  const [showResponseChangeModal, setShowResponseChangeModal] = useState(false);
  const [selectedFleetForResponse, setSelectedFleetForResponse] =
    useState(null);
  const [isHubungiModalOpen, setIsHubungiModalOpen] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [selectedTruckStatuses, setSelectedTruckStatuses] = useState([]);
  const [selectedOrderStatuses, setSelectedOrderStatuses] = useState([]);

  const {
    data: fleetData,
    isLoading,
    error,
    mutate: refetchFleets,
  } = useGetFleetList({
    search: searchTerm,
    has_fleet_status: activeTab === "ready" ? "READY_FOR_ORDER" : undefined,
    truckStatus: truckStatusFilter,
    orderStatus: orderStatusFilter,
  });

  // Get all data for total counts (without status filtering)
  const { data: allFleetData } = useGetFleetList({
    search: searchTerm,
    truckStatus: truckStatusFilter,
    orderStatus: orderStatusFilter,
  });

  // Extract transporters and calculate totals from the new data structure
  const transporters = fleetData?.transporters || [];
  const allTransporters = allFleetData?.transporters || [];

  // Calculate total fleets from all data (without status filtering)
  const totalFleets = useMemo(() => {
    return allTransporters.reduce((total, transporter) => {
      return total + (transporter.fleets?.length || 0);
    }, 0);
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

  // Get filter counts from the new structure
  const filterCounts = fleetData?.filterOptions || {};

  const { latestSosAlert, acknowledgeSosAlert } = useSosWebSocket();

  // Process transporters and their fleets with filtering
  const processedTransporters = useMemo(() => {
    return transporters
      .map((transporter) => {
        const filteredFleets = (transporter.fleets || []).filter((fleet) => {
          // Search filter
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

          // Ready tab filter
          if (activeTab === "ready") {
            return fleet.status === "READY_FOR_ORDER" && searchMatch;
          }

          return searchMatch;
        });

        return {
          ...transporter,
          fleets: filteredFleets,
        };
      })
      .filter((transporter) => transporter.fleets.length > 0); // Only show transporters with fleets
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

  const handleApplyFilter = (truckStatuses, orderStatuses) => {
    setTruckStatusFilter(truckStatuses);
    setOrderStatusFilter(orderStatuses);
    setSelectedTruckStatuses(truckStatuses);
    setSelectedOrderStatuses(orderStatuses);
    setIsFilterPopoverOpen(false);
  };

  const handleFleetCardClick = (fleet) => {
    if (onFleetClick) onFleetClick(fleet);
    if (onFleetSelect) onFleetSelect(fleet.fleetId);
  };

  const handleOpenHubungiModal = (transporter) => {
    setSelectedTransporter(transporter);
    setIsHubungiModalOpen(true);
  };

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
          <FilterPopoverArmada
            onApplyFilter={handleApplyFilter}
            filterCounts={filterCounts}
            isPopoverOpen={isFilterPopoverOpen}
            onOpenChange={setIsFilterPopoverOpen}
            isFilterActive={
              selectedTruckStatuses.length > 0 ||
              selectedOrderStatuses.length > 0
            }
            currentTruckFilters={selectedTruckStatuses}
            currentOrderFilters={selectedOrderStatuses}
          />
        </div>
      </div>

      {/* filter tabs */}
      {readyCount > 0 && (
        <div className="flex gap-2 px-4 pb-3">
          <button
            className={`relative rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "ready"
                ? "border-primary-700 bg-primary-50 text-primary-700"
                : "border-neutral-200 bg-neutral-200 text-black"
            }`}
            onClick={() => setActiveTab("ready")}
          >
            Siap Menerima Order ({readyCount})
            <NotificationDot
              size="sm"
              color="red"
              position="absolute"
              positionClasses="top-0 right-0"
            />
          </button>
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
      )}

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
            selectedTruckStatuses.length > 0 ||
            selectedOrderStatuses.length > 0 ? (
              // Search/filter results empty
              <DataNotFound
                type="search"
                title="Data Armada Tidak Ditemukan"
                message="Coba ubah kata kunci atau filter pencarian Anda."
              />
            ) : (
              // First time - no data at all
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
                className="border-neutral-400 p-0 !shadow-none"
              >
                <CardHeader className="border-neutral-400 !p-0">
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
                        <h3 className="text-base font-bold">
                          {transporter.companyName}
                        </h3>
                        <div className="flex items-center gap-1 pt-2 text-xs text-neutral-700">
                          <ImageComponent
                            src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                            width={16}
                            height={16}
                          />
                          <span>{transporter.fleets.length} Armada</span>
                          <li className="flex items-center gap-1 pl-[26px]">
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
                    {transporter.fleets.map((fleet) => (
                      <div
                        key={fleet.fleetId}
                        onClick={() => handleFleetCardClick(fleet)}
                        className="cursor-pointer"
                      >
                        <CardFleet
                          fleet={fleet}
                          isExpanded={expandedId === fleet.fleetId}
                          onToggleExpand={() => toggleExpanded(fleet.fleetId)}
                          onOpenDriverModal={() => handleOpenDriverModal(fleet)}
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
        sosCount={readyCount}
        onClose={() => {
          setShowSosNotification(false);
          acknowledgeSosAlert();
        }}
        onConfirm={() => {
          setActiveTab("ready");
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
