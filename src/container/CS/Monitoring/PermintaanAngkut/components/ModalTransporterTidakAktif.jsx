import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useGetInactiveTransporter } from "@/services/CS/monitoring/permintaan-angkut/getInactiveTransporter";
import { useGetLatestFleetNote } from "@/services/CS/monitoring/permintaan-angkut/getLatestFleetNote";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";

// ++ ADDED: useMemo
import { useTranslation } from "@/hooks/use-translation";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";

import ModalDetailTransporterTidakAktif from "./ModalDetailTransporterTidakAktif";

const ModalTransporterTidakAktif = ({ onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetInactiveTransporter();
  const allTransporters = data?.transporters || [];
  const [searchValue, setSearchValue] = useState("");
  const [showHubungiModal, setShowHubungiModal] = useState(false);

  const getStatusText = (transporter) => {
    switch (transporter.inactivityStatus) {
      case "ARMADA_INACTIVE":
        return t(
          "ModalTransporterTidakAktif.statusArmadaNonaktifTerlaluBanyak",
          { current: transporter.current, total: transporter.total },
          "Armada Nonaktif Terlalu Banyak ({current}/{total})"
        );
      case "TRANSPORTER_IDLE":
        return t(
          "ModalTransporterTidakAktif.statusAdminTerdeteksiSeringIdle",
          { current: transporter.current, total: transporter.total },
          "Admin Terdeteksi Sering Idle ({current}/{total} Order)"
        );
      case "TRANSPORTER_INACTIVE":
      default:
        return t(
          "ModalTransporterTidakAktif.statusTransporterTidakAktif",
          {},
          "Transporter Tidak Aktif"
        );
    }
  };

  // Search logic similar to ModalTransportTersedia
  const [filteredTransporters, setFilteredTransporters] =
    useState(allTransporters);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearch = (value) => {
    setSearchValue(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      if (!value || value.length < 3) {
        setFilteredTransporters(allTransporters);
        return;
      }
      const lower = value.toLowerCase();
      setFilteredTransporters(
        allTransporters.filter(
          (t) =>
            t.transporterName?.toLowerCase().includes(lower) ||
            (t.fleet &&
              (String(t.fleet.matchingUnits).includes(lower) ||
                String(t.fleet.activeUnits).includes(lower) ||
                String(t.fleet.inactiveUnits).includes(lower))) ||
            t.expandedDetails?.fleetDetails?.some(
              (fleet) =>
                fleet.licensePlate?.toLowerCase().includes(lower) ||
                fleet.driver?.name?.toLowerCase().includes(lower)
            )
        )
      );
    }, 300);
    setSearchTimeout(timeout);
  };

  // Update filteredTransporters when allTransporters changes
  useMemo(() => {
    setFilteredTransporters(allTransporters);
  }, [allTransporters]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [selectedTransporterId, setSelectedTransporterId] = useState(null);
  const { data: latestFleetNote } = useGetLatestFleetNote(
    selectedTransporterId
  );

  const handleDetailClick = (transporter) => {
    if (transporter.inactivityStatus === "TRANSPORTER_INACTIVE") {
      setSelectedTransporter(transporter);
      setSelectedTransporterId(transporter.id);
      setShowDetailModal(true);
    } else {
      router.push(`/monitoring/${transporter.id}/detail-transporter`);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 ${showHubungiModal || showDetailModal ? "hidden" : ""}`}
      >
        <div className="relative h-[460px] w-[600px] rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-center">
            <h2 className="text-[16px] font-bold text-neutral-900">
              {t(
                "ModalTransporterTidakAktif.titleModal",
                {},
                "Transporter Tidak Aktif"
              )}
            </h2>
            <button
              onClick={onClose}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
            </button>
          </div>
          <Search
            placeholder={t(
              "ModalTransporterTidakAktif.placeholderSearch",
              {},
              "Cari No. Polisi / Nama Driver / Transporter "
            )}
            onSearch={handleSearch}
            autoSearch={true}
            debounceTime={300}
            defaultValue={searchValue}
            inputClassName="w-full mb-4"
          />
          <div
            className="h-[337px] overflow-y-auto pr-2"
            style={{ minWidth: "calc(100% + 12px)" }}
          >
            {isLoading ? (
              <div className="py-8 text-center text-neutral-400">
                {t("ModalTransporterTidakAktif.textLoading", {}, "Loading...")}
              </div>
            ) : filteredTransporters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <img
                  src="/icons/keyword-not-found.svg"
                  alt="Not Found"
                  className="mb-4 h-[140px] w-[140px]"
                />
                <div className="text-lg font-medium text-[#868686]">
                  {t(
                    "ModalTransporterTidakAktif.textKeywordTidakDitemukan",
                    {},
                    "Keyword Tidak Ditemukan"
                  )}
                </div>
              </div>
            ) : (
              filteredTransporters.map((transporter) => (
                <div
                  key={transporter.id}
                  className="relative mb-3 flex h-[88px] items-center rounded-xl border border-neutral-400 bg-white px-4 py-3"
                >
                  <div className="flex w-full items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 bg-white">
                      <img
                        src="/icons/company-placeholder.svg"
                        alt={transporter.transporterName}
                        className="h-12 w-12 rounded-full border border-neutral-300 object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-neutral-900">
                        {transporter.transporterName.length > 46
                          ? `${transporter.transporterName.slice(0, 46)}...`
                          : transporter.transporterName}
                      </div>
                      <div className="mt-1 text-xs font-medium">
                        <span className="text-error-400">
                          {getStatusText(transporter)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="muattrans-primary-secondary"
                        className="h-8 w-[90px] rounded-full text-sm font-semibold"
                        onClick={() => {
                          setShowHubungiModal(true);
                          setSelectedTransporter(transporter);
                        }}
                      >
                        {t(
                          "ModalTransporterTidakAktif.buttonHubungi",
                          {},
                          "Hubungi"
                        )}
                      </Button>
                      <Button
                        variant="muattrans-primary"
                        className="h-8 w-[90px] rounded-full text-sm font-semibold"
                        onClick={() => handleDetailClick(transporter)}
                      >
                        {t(
                          "ModalTransporterTidakAktif.buttonDetail",
                          {},
                          "Detail"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showDetailModal && latestFleetNote && (
        <ModalDetailTransporterTidakAktif
          transporter={selectedTransporter}
          detail={latestFleetNote.details}
          onClose={() => setShowDetailModal(false)}
          latestNote={latestFleetNote.latestNote}
          onHubungi={() => {}}
          onSelesaikan={() => setShowDetailModal(false)}
        />
      )}
      {/* HubungiModal integration */}
      <HubungiModal
        isOpen={showHubungiModal}
        onClose={() => setShowHubungiModal(false)}
        transporterData={selectedTransporter || null}
      />
    </>
  );
};

export default ModalTransporterTidakAktif;
