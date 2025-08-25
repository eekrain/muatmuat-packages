import React, { useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";
import { useTranslation } from "@/hooks/use-translation";
import { useGetAvailableTransporters } from "@/services/CS/monitoring/permintaan-angkut/getAvailableTransport";

const ModalTransportTersedia = ({ onClose, requestId = "dummy-id" }) => {
  const { t } = useTranslation();
  const [showHubungiModal, setShowHubungiModal] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  const { data, isLoading } = useGetAvailableTransporters(requestId);
  const allTransporters = data?.transporters || [];
  const [searchValue, setSearchValue] = React.useState("");
  const [filteredTransporters, setFilteredTransporters] =
    React.useState(allTransporters);
  const [expandedCardId, setExpandedCardId] = React.useState(null);

  const handleToggleExpand = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchValue || searchValue.length < 3) {
        setFilteredTransporters(allTransporters);
        return;
      }
      const lower = searchValue.toLowerCase();
      setFilteredTransporters(
        allTransporters.filter(
          (t) =>
            t.companyName.toLowerCase().includes(lower) ||
            (t.fleet &&
              (String(t.fleet.matchingUnits).includes(lower) ||
                String(t.fleet.activeUnits).includes(lower) ||
                String(t.fleet.inactiveUnits).includes(lower))) ||
            t.expandedDetails?.fleetDetails?.some(
              (fleet) =>
                fleet.licensePlate.toLowerCase().includes(lower) ||
                fleet.driver.name.toLowerCase().includes(lower)
            )
        )
      );
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue, allTransporters]);

  React.useEffect(() => {
    setFilteredTransporters(allTransporters);
  }, [allTransporters]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 ${
        showHubungiModal ? "hidden" : ""
      }`}
    >
      <div className="relative w-[600px] rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <h2 className="text-[16px] font-bold text-neutral-900">
            {t(
              "ModalTransportTersedia.titleAvailableTransporters",
              {},
              "Transporter Tersedia"
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
            "ModalTransportTersedia.placeholderSearch",
            {},
            "Cari No. Polisi / Nama Driver / Transporter"
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
              {t("ModalTransportTersedia.textLoading", {}, "Loading...")}
            </div>
          ) : filteredTransporters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src="/icons/keyword-not-found.svg"
                alt="Not Found"
                className="mb-4 h-[140px] w-[140px]"
              />
              <div className="text-lg font-medium text-neutral-500">
                {t(
                  "ModalTransportTersedia.messageKeywordNotFound",
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
                  {transporter.history?.hasRejectedThisRequest && (
                    <div className="absolute -top-0 right-0 z-10">
                      <div className="rounded-bl-lg rounded-tr-xl bg-red-500 px-5 py-[6px] text-xs font-semibold text-white shadow-lg">
                        {t(
                          "ModalTransportTersedia.badgeRequestRejected",
                          {},
                          "Menolak Permintaan"
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300">
                        <img
                          src={transporter.logo}
                          alt={transporter.companyName}
                          className="h-14 w-14 rounded-full border border-neutral-300 object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">
                          {transporter.companyName.length > 46
                            ? `${transporter.companyName.slice(0, 46)}...`
                            : transporter.companyName}
                        </div>
                        <div className="mt-2 text-xs font-medium text-neutral-900">
                          {t(
                            "ModalTransportTersedia.textMatchingFleets",
                            { matchingUnits: transporter.fleet.matchingUnits },
                            `${transporter.fleet.matchingUnits} Armada Yang Cocok`
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                            <IconComponent
                              src="/icons/truk16.svg"
                              className="h-[14px] w-[14px] rounded"
                            />
                            {t(
                              "ModalTransportTersedia.textActiveFleets",
                              { activeUnits: transporter.fleet.activeUnits },
                              `${transporter.fleet.activeUnits} Armada Aktif`
                            )}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                            <IconComponent
                              src="/icons/truk16.svg"
                              className="h-[14px] w-[14px] rounded"
                            />
                            {t(
                              "ModalTransportTersedia.textInactiveFleets",
                              {
                                inactiveUnits: transporter.fleet.inactiveUnits,
                              },
                              `${transporter.fleet.inactiveUnits} Armada Nonaktif`
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
                          "ModalTransportTersedia.buttonContact",
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
                          className={`h-6 w-6 text-neutral-700 transition-transform duration-300 ${
                            expandedCardId === transporter.id
                              ? "rotate-180"
                              : ""
                          }`}
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
                      {!transporter.status.isActive && (
                        <>
                          <div className="mb-3 border-b border-neutral-400"></div>
                          <span className="font-medium text-error-400">
                            {t(
                              "ModalTransportTersedia.statusAdminIdle",
                              {
                                current: transporter.status?.current ?? 0,
                                total: transporter.status?.total ?? 0,
                              },
                              `Admin Terdeteksi Sering Idle (${
                                transporter.status?.current ?? 0
                              }/${transporter.status?.total ?? 0} Order)`
                            )}
                          </span>
                          <span className="ml-1 cursor-pointer text-xs font-medium text-primary-700">
                            {t(
                              "ModalTransportTersedia.linkDetails",
                              {},
                              "Detail"
                            )}
                          </span>
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
                          "ModalTransportTersedia.titleMatchingFleetsList",
                          {},
                          "Daftar Armada Yang Cocok"
                        )}
                      </div>
                      <div className="space-y-3">
                        {transporter.expandedDetails?.fleetDetails?.map(
                          (fleet) => (
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
                                          "ModalTransportTersedia.textDistanceFromLocation",
                                          {
                                            distance:
                                              fleet.lastLocation.distance,
                                          },
                                          `${fleet.lastLocation.distance} km dari lokasi muat -`
                                        )
                                      : "-"}
                                    <span className="font-semibold text-neutral-900">
                                      {(() => {
                                        const lokasi = `${
                                          fleet.lastLocation?.District || "-"
                                        }, ${fleet.lastLocation?.City || "-"}`;
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
                                      "ModalTransportTersedia.statusActive",
                                      {},
                                      "Aktif"
                                    )
                                  : ["NOT_PAIRED", "INACTIVE"].includes(
                                        fleet.operationalStatus
                                      )
                                    ? t(
                                        "ModalTransportTersedia.statusInactive",
                                        {},
                                        "Nonaktif"
                                      )
                                    : "-"}
                              </span>
                            </div>
                          )
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
      <HubungiModal
        isOpen={showHubungiModal}
        onClose={() => setShowHubungiModal(false)}
        transporterData={selectedTransporter || null}
      />
    </div>
  );
};

export default ModalTransportTersedia;
