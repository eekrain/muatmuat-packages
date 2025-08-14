"use client";

import { useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { TabsContent } from "@/components/Tabs/Tabs";

const RekapPembatalanTab = ({ mockCancellationData = [] }) => {
  // Local state for this tab
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  // Cancellation table columns
  const cancellationColumns = [
    {
      key: "orderId",
      header: "ID Order",
      sortable: true,
      render: (row) => <div className="text-sm font-medium">{row.orderId}</div>,
    },
    {
      key: "date",
      header: "Tanggal",
      sortable: true,
      render: (row) => <div className="text-sm">{row.date}</div>,
    },
    {
      key: "route",
      header: "Rute",
      sortable: false,
      render: (row) => (
        <div className="text-sm">
          {row.origin} → {row.destination}
        </div>
      ),
    },
    {
      key: "reason",
      header: "Alasan Pembatalan",
      sortable: false,
      render: (row) => <div className="text-sm">{row.reason}</div>,
    },
    {
      key: "cancelledBy",
      header: "Dibatalkan Oleh",
      sortable: false,
      render: (row) => <div className="text-sm">{row.cancelledBy}</div>,
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: () => <BadgeStatus variant="error">Dibatalkan</BadgeStatus>,
    },
  ];

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
    let filteredData = [...mockCancellationData];

    if (searchValue.trim() && searchValue.length >= 3) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const showPagination = totalItems >= 10;

  // Data state logic
  const hasSearch = searchValue.trim().length > 0;
  const hasData = filteredData.length > 0;
  const originalDataExists = mockCancellationData.length > 0;

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
            {/* Search Section */}
            <div className="px-6 pb-6 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Input
                    icon={{
                      left: (
                        <IconComponent
                          src="/icons/search16.svg"
                          className="!text-neutral-700"
                          width={16}
                          height={16}
                        />
                      ),
                      right: searchValue.length > 0 && (
                        <button onClick={handleClearSearch}>
                          <IconComponent
                            src="/icons/close20.svg"
                            width={20}
                            height={20}
                          />
                        </button>
                      ),
                    }}
                    appearance={{
                      inputClassName: "!text-xs",
                      containerClassName: "!w-full min-w-[262px]",
                    }}
                    placeholder="Cari Pembatalan"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div>
                  <p className="font-semibold">
                    Total: {totalItems} Pembatalan
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <Table
              data={paginatedData}
              columns={cancellationColumns}
              emptyComponent={
                showSearchNotFoundState ? (
                  <DataNotFound type="search" title="Keyword Tidak Ditemukan" />
                ) : (
                  <DataNotFound
                    type="data"
                    title="Belum Ada Pembatalan"
                    subtitle="Belum ada riwayat pembatalan"
                  />
                )
              }
            />
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
