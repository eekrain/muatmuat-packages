"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import RekapPembatalanList from "@/app/cs/(main)/user/components/RekapPembatalanList";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Pagination from "@/components/Pagination/Pagination";
import { TabsContent } from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";
import { useGetTransporterCancellations } from "@/services/CS/transporters/getTransporterCancellations";

const RekapPembatalanTab = () => {
  const { t } = useTranslation();
  const params = useParams();
  const transporterId = params.id;

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // const [searchValue, setSearchValue] = useState("");

  // API call with parameters
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: perPage,
      // search: searchValue,
    }),
    [currentPage, perPage]
  );

  const {
    data: apiResponse,
    error,
    isLoading,
    mutate,
  } = useGetTransporterCancellations(transporterId);

  // Extract data from API response with memoization
  const cancellationsData = useMemo(() => {
    return apiResponse?.Data?.cancellations || [];
  }, [apiResponse]);

  const pagination = useMemo(() => {
    return apiResponse?.Data?.pagination || {};
  }, [apiResponse]);

  // Transform API data to match the expected format
  const transformedData = useMemo(() => {
    return cancellationsData.map((cancellation) => ({
      id: cancellation.id,
      date: new Date(cancellation.cancelledAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }),
      orderCode: cancellation.orderCode,
      orderId: cancellation.orderId,
      orderStatusLabel:
        cancellation.orderType === "INSTANT"
          ? t("RekapPembatalanTab.labelOrderStatusInstan", {}, "Instan")
          : t("RekapPembatalanTab.labelOrderStatusTerjadwal", {}, "Terjadwal"),
      penaltyStatus:
        cancellation.status === "CANCELLED" ? "penalized" : "pending", // You may need to adjust this based on actual penalty logic
      origin: cancellation.pickupLocation,
      destination: cancellation.dropoffLocation,
      vehicle: {
        name: cancellation.truckType,
        body: cancellation.truckCarrierType,
      },
      cargo: {
        unitCount: cancellation.totalFleets,
        unitLabel: t("RekapPembatalanTab.labelUnit", {}, "Unit"),
        items: cancellation.cargos?.map((cargo) => cargo.name) || [],
        weight: `${cancellation.totalCargos || cancellation.cargos?.reduce((sum, cargo) => sum + cargo.weight, 0) || 0} kg`,
      },
      reason: cancellation.reason,
      drivers: cancellation.cancelledImage || [], // You may need to add driver information if available in the API
      penaltyPoin: cancellation.penaltyPoin || 0,
    }));
  }, [cancellationsData, t]);

  // Search logic (can be used later if search functionality is added)
  // const handleSearch = (value) => {
  //   setSearchValue(value);
  //   setCurrentPage(1);
  // };

  // const handleClearSearch = () => {
  //   setSearchValue("");
  // };

  // Data filtering and pagination
  const getFilteredData = () => {
    // Use transformedData instead of data
    const filteredData = Array.isArray(transformedData)
      ? [...transformedData]
      : [];

    // Since we're now using API pagination, we don't need to filter here
    // The API handles search filtering
    return filteredData;
  };

  const filteredData = getFilteredData();
  const totalItems = pagination.totalItems || filteredData.length;
  const totalPages = pagination.totalPages || Math.ceil(totalItems / perPage);
  const paginatedData = filteredData; // Data is already paginated from API
  const startIndex = (currentPage - 1) * perPage;

  // Data state logic
  const hasSearch = false; // searchValue.trim().length > 0;
  const hasData = filteredData.length > 0;
  const originalDataExists = !isLoading && cancellationsData.length > 0;

  // Handle confirm penalty from list
  const handleConfirmPenalty = (_item) => {
    // After penalty confirmation, refresh the data
    mutate();
  };

  // Compute total penalty points (1 per penalized)
  const totalPenaltyPoints = transformedData.reduce(
    (acc, d) => acc + (d.penaltyStatus === "penalized" ? 1 : 0),
    0
  );

  const showNoDataState = !isLoading && !error && !originalDataExists;
  const showSearchNotFoundState =
    hasSearch && !hasData && !isLoading && originalDataExists;

  return (
    <TabsContent value="rekap-pembatalan" className="">
      <div className="mt-4 overflow-hidden !rounded-xl !bg-white shadow-muat">
        {isLoading ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center">
            <div className="text-center text-neutral-600">
              <p className="font-semibold">
                {t(
                  "RekapPembatalanTab.messageLoadingData",
                  {},
                  "Memuat data..."
                )}
              </p>
              <p className="mt-1 text-xs font-medium">
                {t(
                  "RekapPembatalanTab.messageLoadingPleaseWait",
                  {},
                  "Mohon tunggu sebentar"
                )}
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center">
            <DataNotFound type="error" width={95} height={76}>
              <div className="text-center text-neutral-600">
                <p className="font-semibold">
                  {t(
                    "RekapPembatalanTab.messageErrorOccurred",
                    {},
                    "Terjadi Kesalahan"
                  )}
                </p>
                <p className="mt-1 text-xs font-medium">
                  {t(
                    "RekapPembatalanTab.messageErrorFailedLoadCancellation",
                    {},
                    "Gagal memuat data pembatalan"
                  )}
                </p>
              </div>
            </DataNotFound>
          </div>
        ) : showNoDataState ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center">
            <DataNotFound type="data" width={95} height={76}>
              <div className="text-center text-neutral-600">
                <p className="font-semibold">
                  {t(
                    "RekapPembatalanTab.titleRekapPembatalan",
                    {},
                    "Rekap Pembatalan"
                  )}
                </p>
                <p className="mt-1 text-xs font-medium">
                  {t(
                    "RekapPembatalanTab.messageNoOrderCancelled",
                    {},
                    "Transporter tidak memilki pesanan yang dibatalkan"
                  )}
                </p>
              </div>
            </DataNotFound>
          </div>
        ) : (
          <>
            {/* List */}
            {paginatedData.length > 0 ? (
              <RekapPembatalanList
                items={paginatedData.map((d, i) => ({
                  id: d.id || d.orderId || d.orderCode,
                  index: startIndex + i + 1,
                  cancelledAt: d.date || d.cancelledAt,
                  orderCode: d.orderId || d.orderCode,
                  orderStatusLabel:
                    d.orderStatusLabel ||
                    t(
                      "RekapPembatalanTab.labelOrderStatusTerjadwal",
                      {},
                      "Terjadwal"
                    ),
                  penaltyStatus: d.penaltyStatus,
                  route: {
                    origin: d.origin || d.route?.origin,
                    destination: d.destination || d.route?.destination,
                  },
                  vehicle: d.vehicle || {
                    name: d.vehicleName,
                    body: d.vehicleBody,
                  },
                  cargo: d.cargo || {
                    unitCount: d.unitCount,
                    unitLabel: d.unitLabel,
                    name: d.cargoName,
                    weight: d.cargoWeight,
                    items: d.cargoItems,
                    itemsCount: d.cargoItemsCount,
                  },
                  reason: d.reason,
                  drivers: d.drivers,
                }))}
                summary={{ totalPenaltyPoints }}
                onConfirmPenalty={handleConfirmPenalty}
                className=""
              />
            ) : (
              <div className="px-6 pb-6">
                {showSearchNotFoundState ? (
                  <DataNotFound
                    type="search"
                    title={t(
                      "RekapPembatalanTab.titleKeywordNotFound",
                      {},
                      "Keyword Tidak Ditemukan"
                    )}
                  />
                ) : (
                  <DataNotFound
                    type="data"
                    title={t(
                      "RekapPembatalanTab.titleNoCancellationYet",
                      {},
                      "Belum Ada Pembatalan"
                    )}
                    subtitle={t(
                      "RekapPembatalanTab.subtitleNoCancellationHistory",
                      {},
                      "Belum ada riwayat pembatalan"
                    )}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
      {/* Pagination */}
      {true && hasData && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={(limit) => {
              setPerPage(limit);
              setCurrentPage(1);
            }}
            variants="muatrans"
          />
        </div>
      )}
    </TabsContent>
  );
};

export default RekapPembatalanTab;
