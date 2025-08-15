import React from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";
import { useGetAvailableTransporters } from "@/services/CS/monitoring/permintaan-angkut/getAvailableTransport";

// const companyName = "PT Batavia Prosperindo Angkut Teknologi Indonesia Trans Tbk";

const ModalTransportTersedia = ({ onClose, requestId = "dummy-id" }) => {
  // Ambil data transporter dari mock API
  const { data, isLoading } = useGetAvailableTransporters(requestId);
  const allTransporters = data?.transporters || [];
  // State untuk hasil search
  const [searchValue, setSearchValue] = React.useState("");
  const [filteredTransporters, setFilteredTransporters] =
    React.useState(allTransporters);
  // Untuk demo, ambil transporter pertama
  const transporter = filteredTransporters[0] || {};
  const companyName = transporter.companyName || "-";

  // State untuk expand/hide daftar armada
  const [isExpanded, setIsExpanded] = React.useState(false);
  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    if (!value) {
      setFilteredTransporters(allTransporters);
      return;
    }
    const lower = value.toLowerCase();
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
  };

  // Update filteredTransporters jika data berubah
  React.useEffect(() => {
    setFilteredTransporters(allTransporters);
  }, [allTransporters]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-[600px] rounded-xl bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-center">
          <h2 className="text-[16px] font-bold text-neutral-900">
            Transporter Tersedia
          </h2>
          <button
            onClick={onClose}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
          >
            <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
          </button>
        </div>
        {/* Search Bar */}
        <Search
          placeholder="Cari No. Polisi / Nama Driver / Transporter "
          onSearch={handleSearch}
          autoSearch={true}
          debounceTime={300}
          defaultValue={searchValue}
          inputClassName="w-full mb-4"
        />
        {/* List Transporter */}
        <div
          className="max-h-[337px] overflow-y-auto pr-2"
          style={{ minWidth: "calc(100% + 12px)" }}
        >
          {isLoading ? (
            <div className="py-8 text-center text-neutral-400">Loading...</div>
          ) : filteredTransporters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src="/icons/keyword-not-found.svg"
                alt="Not Found"
                className="mb-4 h-[140px] w-[140px]"
              />
              <div className="text-lg font-medium text-neutral-500">
                Keyword Tidak Ditemukan
              </div>
            </div>
          ) : (
            filteredTransporters.map((transporter) => (
              <div
                key={transporter.id}
                className="relative mb-3 rounded-xl border border-neutral-400"
              >
                <div className="rounded-xl bg-neutral-100">
                  {/* Status Badge - pindahkan ke dalam card container */}
                  {transporter.history?.hasRejectedThisRequest && (
                    <div className="absolute -top-0 right-0 z-10">
                      <div className="rounded-bl-lg rounded-tr-xl bg-red-500 px-5 py-[6px] text-xs font-semibold text-white shadow-lg">
                        Menolak Permintaan
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-4">
                    {/* Left: Logo & Info */}
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
                          {transporter.fleet.matchingUnits} Armada Yang Cocok
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                            <IconComponent
                              src="/icons/truk16.svg"
                              className="h-[14px] w-[14px] rounded"
                            />
                            {transporter.fleet.activeUnits} Armada Aktif
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                            <IconComponent
                              src="/icons/truk16.svg"
                              className="h-[14px] w-[14px] rounded"
                            />
                            {transporter.fleet.inactiveUnits} Armada Nonaktif
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="muattrans-primary-secondary"
                        className="h-8 w-[107px] rounded-full text-sm font-semibold"
                      >
                        Hubungi
                      </Button>
                      <button type="button" onClick={handleToggleExpand}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-6 w-6 text-neutral-700 transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`}
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
                  {/* Border pembatas di sini */}
                  <div className="px-4 pb-4">
                    <div className="text-xs">
                      {/* Status/Info tambahan bisa di sini */}
                      {transporter.status.activityStatus === "INACTIVE" ? (
                        <>
                          <div className="mb-3 border-b border-neutral-400"></div>

                          <span className="font-medium text-error-400">
                            Admin Terdeteksi Sering Idle (5/7)
                          </span>
                          {/* Detail link dummy */}
                          <span className="ml-1 cursor-pointer text-xs font-medium text-primary-700">
                            Detail
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div className="rounded-xl bg-white">
                    {/* Daftar Armada Yang Cocok */}
                    <div className="p-4">
                      <div className="mb-3 text-xs font-bold text-neutral-900">
                        Daftar Armada Yang Cocok
                      </div>
                      <div className="space-y-3">
                        {transporter.expandedDetails?.fleetDetails?.map(
                          (fleet) => (
                            <div
                              key={fleet.id}
                              className="flex items-center justify-between border-b pb-3"
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
                                    1,2 km dari lokasi muat -
                                    <span className="ml-1 font-semibold text-neutral-900">
                                      Kec. Kepulauan Seribu
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`flex h-6 w-[70px] items-center justify-center rounded-md text-xs font-semibold ${
                                  fleet.operationalStatus === "READY_FOR_ORDER"
                                    ? "bg-success-50 text-success-400"
                                    : "bg-neutral-200 text-neutral-600"
                                } `}
                              >
                                {fleet.operationalStatus === "READY_FOR_ORDER"
                                  ? "Aktif"
                                  : "Nonaktif"}
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
    </div>
  );
};

export default ModalTransportTersedia;
