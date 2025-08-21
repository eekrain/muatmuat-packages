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

  const {
    data: fleetData,
    isLoading,
    error,
    mutate: refetchFleets,
  } = useGetFleetList({
    search: searchTerm,
    sosOnly: activeTab === "sos",
    truckStatus: truckStatusFilter,
    orderStatus: orderStatusFilter,
  });

  const fleets = fleetData?.fleets || [];
  const sosCount =
    fleetData?.summary?.statusBreakdown?.sos ||
    fleets.filter((f) => f.hasSOSAlert).length;
  const hasFilterData = fleetData?.summary;
  const { latestSosAlert, acknowledgeSosAlert } = useSosWebSocket();

  const groupedFleets = useMemo(() => {
    const filtered = fleets.filter((fleet) => {
      const searchMatch =
        fleet.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fleet.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fleet.transporter?.companyName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (activeTab === "sos") {
        return fleet.hasSOSAlert && searchMatch;
      }
      return searchMatch;
    });

    if (filtered.length === 0) {
      return [];
    }

    const groups = filtered.reduce((acc, fleet) => {
      const key = fleet.transporterId;
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
  }, [fleets, searchTerm, activeTab]);

  const totalFleets = fleetData?.pagination?.totalItems || 0;

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
  };

  const handleFleetCardClick = (fleet) => {
    if (onFleetClick) onFleetClick(fleet);
    if (onFleetSelect) onFleetSelect(fleet.id);
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
          {activeTab === "all" && (
            <FilterPopoverArmada
              onApplyFilter={handleApplyFilter}
              filterCounts={fleetData?.summary?.statusBreakdown}
            />
          )}
        </div>
      </div>

      {/* filter tabs */}
      {hasFilterData && sosCount > 0 && (
        <div className="flex gap-2 px-4 pb-3">
          <button
            className={`relative rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
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
        ) : groupedFleets.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <DataNotFound
              type="search"
              title="Data Armada Tidak Ditemukan"
              message="Coba ubah kata kunci atau filter pencarian Anda."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {groupedFleets.map(({ transporter, fleets: transporterFleets }) => (
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
                          <span>{transporterFleets.length} Armada</span>
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
                    {transporterFleets.map((fleet) => (
                      <div
                        key={fleet.id}
                        onClick={() => handleFleetCardClick(fleet)}
                        className="cursor-pointer"
                      >
                        <CardFleet
                          fleet={fleet}
                          isExpanded={expandedId === fleet.id}
                          onToggleExpand={() => toggleExpanded(fleet.id)}
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
          vehicleId={selectedFleet.id}
          vehiclePlate={selectedFleet.licensePlate}
          currentDriverId={selectedFleet.driver?.id || null}
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
