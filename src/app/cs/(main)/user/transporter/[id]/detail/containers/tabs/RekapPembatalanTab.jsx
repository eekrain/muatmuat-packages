"use client";

import { useState } from "react";

import RekapPembatalanList from "@/app/cs/(main)/user/components/RekapPembatalanList";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Pagination from "@/components/Pagination/Pagination";
import { TabsContent } from "@/components/Tabs/Tabs";

const RekapPembatalanTab = () => {
  // Local state for this tab
  const fallbackMock = [
    {
      id: "row-5",
      date: "1 Agu 2025 18:00 WIB",
      orderCode: "MT25A002A",
      orderStatusLabel: "Terjadwal",
      penaltyStatus: "pending",
      origin: "Kota Surabaya, Kec. Tegalsari Tegalsari",
      destination: "Kota Pasuruan, Kec. Klojen",
      vehicle: { name: "Colt Diesel Double", body: "Bak Terbuka" },
      cargo: {
        unitCount: 1,
        unitLabel: "Unit",
        items: ["Besi"],
        weight: "1.000 kg",
      },
      reason: "Driver Berhalangan",
      drivers: [
        { image: "https://picsum.photos/seed/driver1/80" },
        { image: "https://picsum.photos/seed/driver2/80" },
        { image: "https://picsum.photos/seed/driver3/80" },
      ],
    },
    {
      id: "row-4",
      date: "1 Agu 2025 18:00 WIB",
      orderCode: "MT25A002A",
      orderStatusLabel: "Instan",
      penaltyStatus: "exempt",
      origin: "Kota Surabaya, Kec. Tegalsari Tegalsari Tegalsari",
      destination: "Kota Pasuruan, Kec. Klojen",
      vehicle: { name: "Colt Diesel Double", body: "Bak Terbuka" },
      cargo: {
        unitCount: 1,
        unitLabel: "Unit",
        items: [
          "Peralatan Rumah Tangga",
          "Elektronik",
          "Pakaian",
          "Mainan",
          "Buku",
          "Perkakas",
          "Aksesoris",
          "Perlengkapan Dapur",
        ],
        weight: "2.500 kg",
      },
      reason: "Kendaraan Bermasalah",
      drivers: [{ image: "https://picsum.photos/seed/driver4/80" }],
    },
    {
      id: "row-3",
      date: "1 Agu 2025 18:00 WIB",
      orderCode: "MT25A002A",
      orderStatusLabel: "Instan",
      penaltyStatus: "penalized",
      origin: "Kota Surabaya, Kec. Tegalsari Tegalsari",
      destination: "Kota Pasuruan, Kec. Klojen",
      vehicle: { name: "Colt Diesel Double", body: "Bak Terbuka" },
      cargo: {
        unitCount: 1,
        unitLabel: "Unit",
        items: [
          "Peralatan Rumah Tangga",
          "Elektronik",
          "Pakaian",
          "Mainan",
          "Buku",
          "Perkakas",
          "Aksesoris",
          "Perlengkapan Dapur",
        ],
        weight: "2.500 kg",
      },
      reason: "Kendaraan Bermasalah",
      drivers: [{ image: "https://picsum.photos/seed/driver5/80" }],
    },
    {
      id: "row-2",
      date: "1 Agu 2025 18:00 WIB",
      orderCode: "MT25A002A",
      orderStatusLabel: "Instan",
      penaltyStatus: "penalized",
      origin: "Kota Surabaya, Kec. Tegalsari Tegalsari",
      destination: "Kota Pasuruan, Kec. Klojen",
      vehicle: { name: "Colt Diesel Double", body: "Bak Terbuka" },
      cargo: {
        unitCount: 1,
        unitLabel: "Unit",
        items: ["Besi"],
        weight: "1.000 kg",
      },
      reason: "Bencana Alam",
      drivers: [
        { image: "https://picsum.photos/seed/driver6/80" },
        { image: "https://picsum.photos/seed/driver7/80" },
        { image: "https://picsum.photos/seed/driver8/80" },
        { image: "https://picsum.photos/seed/driver9/80" },
      ],
    },
    {
      id: "row-1",
      date: "1 Agu 2025 18:00 WIB",
      orderCode: "MT25A002A",
      orderStatusLabel: "Instan",
      penaltyStatus: "penalized",
      origin: "Kota Surabaya, Kec. Tegalsari Tegalsari",
      destination: "Kota Pasuruan, Kec. Klojen",
      vehicle: { name: "Colt Diesel Double", body: "Bak Terbuka" },
      cargo: {
        unitCount: 1,
        unitLabel: "Unit",
        items: ["Besi"],
        weight: "1.000 kg",
      },
      reason:
        "Lainnya: Pengemudi mengalami kendala teknis, tidak dapat melanjutkan pengiriman",
      drivers: [
        { image: "https://picsum.photos/seed/driver10/80" },
        { image: "https://picsum.photos/seed/driver11/80" },
        { image: "https://picsum.photos/seed/driver12/80" },
      ],
    },
  ];
  const initialData = fallbackMock;
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  // Table columns no longer used; list UI replaces table view

  // Search logic
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  // Data filtering and pagination
  const getFilteredData = () => {
    let filteredData = Array.isArray(data) ? [...data] : [];

    if (searchValue.trim() && searchValue.length >= 3) {
      const sv = searchValue.toLowerCase();
      filteredData = filteredData.filter((item) => {
        const flat = {
          orderId: item.orderId || item.orderCode,
          date: item.date || item.cancelledAt,
          origin: item.origin || item.route?.origin,
          destination: item.destination || item.route?.destination,
          reason: item.reason,
          cancelledBy: item.cancelledBy,
        };
        return Object.values(flat).some((v) =>
          v?.toString().toLowerCase().includes(sv)
        );
      });
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const showPagination = totalItems > 1;

  // Data state logic
  const hasSearch = searchValue.trim().length > 0;
  const hasData = filteredData.length > 0;
  const originalDataExists = (data || []).length > 0;
  // Handle confirm penalty from list
  const handleConfirmPenalty = (item) => {
    const code = item?.orderCode || item?.orderId || item?.id;
    setData((prev) =>
      prev.map((d) => {
        const dCode = d.orderId || d.orderCode || d.id;
        if (dCode === code) {
          return { ...d, penaltyStatus: "penalized" };
        }
        return d;
      })
    );
  };

  // Compute total penalty points (1 per penalized)
  const totalPenaltyPoints = (data || []).reduce(
    (acc, d) => acc + (d.penaltyStatus === "penalized" ? 1 : 0),
    0
  );

  const showNoDataState = !originalDataExists;
  const showSearchNotFoundState = hasSearch && !hasData && originalDataExists;

  return (
    <TabsContent value="rekap-pembatalan" className="">
      <div className="mt-4 overflow-hidden !rounded-xl !bg-white shadow-muat">
        {showNoDataState ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center">
            <DataNotFound type="data" width={95} height={76}>
              <div className="text-center text-neutral-600">
                <p className="font-semibold">Belum Ada Pembatalan</p>
                <p className="mt-2 text-xs font-medium">
                  Belum ada riwayat pembatalan
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
                  orderStatusLabel: d.orderStatusLabel || "Terjadwal",
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
                  <DataNotFound type="search" title="Keyword Tidak Ditemukan" />
                ) : (
                  <DataNotFound
                    type="data"
                    title="Belum Ada Pembatalan"
                    subtitle="Belum ada riwayat pembatalan"
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
      {/* Pagination */}
      {showPagination && hasData && (
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
