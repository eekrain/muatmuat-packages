import { useMemo, useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";
import { useTranslation } from "@/hooks/use-translation";

const mockFleets = [
  {
    id: 1,
    licensePlate: "L 1111 LBA",
    driver: { name: "Rizky Aditya Pratama" },
    lastLocation: {
      distance: 1.2,
      District: "Lowokwaru",
      City: "Kota Malang",
    },
    operationalStatus: "INACTIVE",
  },
  {
    id: 2,
    licensePlate: "L 2222 LBA",
    driver: { name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho" },
    lastLocation: {
      distance: 2.1,
      District: "Kepulauan Seribu Selatan",
      City: "DKI Jakarta",
    },
    operationalStatus: "INACTIVE",
  },
  {
    id: 3,
    licensePlate: "L 4444 LBA",
    driver: { name: "Yoel Gallaher" },
    lastLocation: null,
    operationalStatus: "READY_FOR_ORDER",
  },
];

const mockTransporters = [
  {
    id: 1,
    transporterName: "PT Batavia Prosperindo Angkut Teknologi Indone...",
    cocok: 4,
    aktif: 0,
    nonaktif: 4,
    status: "ARMADA_NONAKTIF_BANYAK",
    statusText: "Armada Nonaktif Terlalu Banyak (4/4)",
    statusColor: "text-error-400",
    showDetail: true,
    logo: "/icons/company-placeholder.svg",
    fleets: mockFleets,
  },
  {
    id: 2,
    transporterName: "PT Siba Surya",
    cocok: 3,
    aktif: 1,
    nonaktif: 2,
    status: "ADMIN_IDLE",
    statusText: "Admin Terdeteksi Sering Idle (5/7 Order)",
    statusColor: "text-error-400",
    showDetail: true,
    logo: "/icons/company-placeholder.svg",
    fleets: mockFleets,
  },
  {
    id: 3,
    transporterName: "PT Batavia Prosperindo Angkut Teknologi Indone...",
    cocok: 4,
    aktif: 0,
    nonaktif: 4,
    status: "ARMADA_NONAKTIF_BANYAK",
    statusText: "Armada Nonaktif Terlalu Banyak (4/4)",
    statusColor: "text-error-400",
    showDetail: true,
    logo: "/icons/company-placeholder.svg",
    fleets: mockFleets,
  },
];

const ModalTransporterMenolakPerubahan = ({ onClose }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [showHubungiModal, setShowHubungiModal] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const filteredTransporters = useMemo(() => {
    if (!searchValue) return mockTransporters;
    const lower = searchValue.toLowerCase();
    return mockTransporters.filter((t) =>
      t.transporterName.toLowerCase().includes(lower)
    );
  }, [searchValue]);

  const handleToggleExpand = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 ${showHubungiModal ? "hidden" : ""}`}
      >
        <div className="relative w-[600px] rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-center">
            <h2 className="text-[16px] font-bold text-neutral-900">
              {t(
                "ModalTransporterMenolakPerubahan.titleModal",
                {},
                "Transporter Menolak Perubahan Armada"
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
              "ModalTransporterMenolakPerubahan.placeholderSearch",
              {},
              "Cari No. Polisi / Nama Driver / Transporter "
            )}
            onSearch={setSearchValue}
            autoSearch={true}
            debounceTime={300}
            defaultValue={searchValue}
            inputClassName="w-full mb-4"
          />
          <div
            className="h-[337px] overflow-y-auto pr-2"
            style={{ minWidth: "calc(100% + 12px)" }}
          >
            {filteredTransporters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <img
                  src="/icons/keyword-not-found.svg"
                  alt="Not Found"
                  className="mb-4 h-[140px] w-[140px]"
                />
                <div className="text-lg font-medium text-neutral-500">
                  {t(
                    "ModalTransporterMenolakPerubahan.textTidakAdaTransporter",
                    {},
                    "Keyword Tidak Ditemukan"
                  )}
                </div>
              </div>
            ) : (
              filteredTransporters.map((transporter) => (
                <div
                  key={transporter.id}
                  className="relative mb-3 rounded-xl border border-neutral-400"
                >
                  <div className="rounded-xl bg-neutral-100">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300">
                          <img
                            src={transporter.logo}
                            alt={transporter.transporterName}
                            className="h-14 w-14 rounded-full border border-neutral-300 object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900">
                            {transporter.transporterName.length > 46
                              ? `${transporter.transporterName.slice(0, 46)}...`
                              : transporter.transporterName}
                          </div>
                          <div className="mt-2 text-xs font-medium text-neutral-900">
                            {t(
                              "ModalTransporterMenolakPerubahan.textMatchingFleets",
                              { cocok: transporter.cocok },
                              `${transporter.cocok} Armada Yang Cocok`
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                              <IconComponent
                                src="/icons/truk16.svg"
                                className="h-[14px] w-[14px] rounded"
                              />
                              {t(
                                "ModalTransporterMenolakPerubahan.textActiveFleets",
                                { aktif: transporter.aktif },
                                `${transporter.aktif} Armada Aktif`
                              )}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                              <IconComponent
                                src="/icons/truk16.svg"
                                className="h-[14px] w-[14px] rounded"
                              />
                              {t(
                                "ModalTransporterMenolakPerubahan.textInactiveFleets",
                                { nonaktif: transporter.nonaktif },
                                `${transporter.nonaktif} Armada Nonaktif`
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="muattrans-primary-secondary"
                          className="h-8 w-[107px] rounded-full text-sm font-semibold"
                          onClick={() => {
                            setShowHubungiModal(true);
                            setSelectedTransporter(transporter);
                          }}
                        >
                          {t(
                            "ModalTransporterMenolakPerubahan.buttonHubungi",
                            {},
                            "Hubungi"
                          )}
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleToggleExpand(transporter.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 text-neutral-700 transition-transform duration-300 ${expandedCardId === transporter.id ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="text-xs">
                        {transporter.statusText && (
                          <>
                            <div className="mb-3 border-b border-neutral-400"></div>
                            <span
                              className={`font-medium ${transporter.statusColor}`}
                            >
                              {transporter.statusText}
                            </span>
                            {transporter.showDetail && (
                              <span className="ml-1 cursor-pointer text-xs font-medium text-primary-700">
                                Detail
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedCardId === transporter.id && (
                    <div className="rounded-xl bg-white">
                      <div className="p-4">
                        <div className="mb-3 text-xs font-bold text-neutral-900">
                          {t(
                            "ModalTransporterMenolakPerubahan.titleMatchingFleetsList",
                            {},
                            "Daftar Armada Yang Cocok"
                          )}
                        </div>
                        <div className="space-y-3">
                          {transporter.fleets &&
                          transporter.fleets.length > 0 ? (
                            transporter.fleets.map((fleet) => (
                              <div
                                key={fleet.id}
                                className="flex items-center justify-between border-b border-neutral-400 pb-3"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src="/truck-placeholder.png"
                                    alt="Truck"
                                    className="h-14 w-14 rounded border"
                                  />
                                  <div>
                                    <div className="text-xs font-bold text-neutral-900">
                                      {fleet.licensePlate} -{" "}
                                      <span className="font-semibold">
                                        {fleet.driver.name.length > 43
                                          ? `${fleet.driver.name.slice(0, 43)}...`
                                          : fleet.driver.name}
                                      </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-neutral-600">
                                      <IconComponent
                                        src="/icons/location-driver.svg"
                                        className="h-[14px] w-[14px]"
                                      />
                                      {fleet.lastLocation?.distance
                                        ? t(
                                            "ModalTransporterMenolakPerubahan.textDistanceFromLocation",
                                            {
                                              distance:
                                                fleet.lastLocation.distance,
                                            },
                                            `${fleet.lastLocation.distance} km dari lokasi muat -`
                                          )
                                        : "-"}
                                      <span className="font-semibold text-neutral-900">
                                        {(() => {
                                          const lokasi = `${fleet.lastLocation?.District || "-"}, ${fleet.lastLocation?.City || "-"}`;
                                          return lokasi.length > 48
                                            ? `${lokasi.slice(0, 48)}...`
                                            : lokasi;
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className={`flex h-6 w-[70px] items-center justify-center rounded-md text-xs font-semibold ${
                                    [
                                      "READY_FOR_ORDER",
                                      "ON_DUTY",
                                      "WAITING_LOADING_TIME",
                                    ].includes(fleet.operationalStatus)
                                      ? "bg-success-50 text-success-400"
                                      : ["NOT_PAIRED", "INACTIVE"].includes(
                                            fleet.operationalStatus
                                          )
                                        ? "bg-neutral-200 text-neutral-600"
                                        : "bg-neutral-200 text-neutral-600"
                                  }`}
                                >
                                  {[
                                    "READY_FOR_ORDER",
                                    "ON_DUTY",
                                    "WAITING_LOADING_TIME",
                                  ].includes(fleet.operationalStatus)
                                    ? t(
                                        "ModalTransporterMenolakPerubahan.statusActive",
                                        {},
                                        "Aktif"
                                      )
                                    : ["NOT_PAIRED", "INACTIVE"].includes(
                                          fleet.operationalStatus
                                        )
                                      ? t(
                                          "ModalTransporterMenolakPerubahan.statusInactive",
                                          {},
                                          "Nonaktif"
                                        )
                                      : "Nonaktif"}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-neutral-500">
                              Belum ada detail armada untuk mock data.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <HubungiModal
        isOpen={showHubungiModal}
        onClose={() => setShowHubungiModal(false)}
        transporterData={selectedTransporter || null}
      />
    </>
  );
};

export default ModalTransporterMenolakPerubahan;
