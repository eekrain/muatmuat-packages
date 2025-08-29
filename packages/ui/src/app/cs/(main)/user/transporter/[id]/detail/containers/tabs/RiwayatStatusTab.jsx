"use client";

import { useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { TabsContent } from "@/components/Tabs/Tabs";

const RiwayatStatusTab = () => {
  // Status badge helper - similar to DaftarArmadaTab
  const getStatusBadge = (status) => {
    let variant = "success";
    if (status === "Aktif") {
      variant = "success"; // Green
    } else if (status === "Non Aktif") {
      variant = "error"; // Gray
    }
    return (
      <BadgeStatus className={"w-[80px] text-xs"} variant={variant}>
        {status}
      </BadgeStatus>
    );
  };

  // Mock data based on the screenshots
  const fallbackMock = [
    {
      id: 1,
      status: "Aktif",
      tanggalPerubahan: "01 Okt 2024 09:00 WIB",
      diubahOleh: "CS Nafalia Juwita",
    },
    {
      id: 2,
      status: "Non Aktif",
      tanggalPerubahan: "01 Okt 2024 12:00 WIB",
      diubahOleh: "Sistem",
    },
    {
      id: 3,
      status: "Aktif",
      tanggalPerubahan: "02 Okt 2024 14:00 WIB",
      diubahOleh: "CS Christina Clara",
    },
    {
      id: 4,
      status: "Non Aktif",
      tanggalPerubahan: "03 Okt 2024 09:00 WIB",
      diubahOleh: "Sistem",
    },
    {
      id: 5,
      status: "Aktif",
      tanggalPerubahan: "03 Okt 2024 14:00 WIB",
      diubahOleh: "CS Priya Anindit",
    },
    {
      id: 6,
      status: "Non Aktif",
      tanggalPerubahan: "04 Okt 2024 12:00 WIB",
      diubahOleh: "CS Delfa Felsa",
    },
    {
      id: 7,
      status: "Aktif",
      tanggalPerubahan: "05 Okt 2024 09:00 WIB",
      diubahOleh: "CS Nafalia Juwita",
    },
    {
      id: 8,
      status: "Non Aktif",
      tanggalPerubahan: "06 Okt 2024 09:00 WIB",
      diubahOleh: "Sistem",
    },
    {
      id: 9,
      status: "Aktif",
      tanggalPerubahan: "07 Okt 2024 14:00 WIB",
      diubahOleh: "CS Christina Clara",
    },
    {
      id: 10,
      status: "Non Aktif",
      tanggalPerubahan: "08 Okt 2024 14:00 WIB",
      diubahOleh: "CS Priya Anindit",
    },
    {
      id: 11,
      status: "Aktif",
      tanggalPerubahan: "09 Okt 2024 10:30 WIB",
      diubahOleh: "CS Rahman Wijaya",
    },
    {
      id: 12,
      status: "Non Aktif",
      tanggalPerubahan: "10 Okt 2024 15:20 WIB",
      diubahOleh: "Sistem",
    },
    {
      id: 13,
      status: "Aktif",
      tanggalPerubahan: "11 Okt 2024 08:45 WIB",
      diubahOleh: "CS Sarah Putri",
    },
    {
      id: 14,
      status: "Non Aktif",
      tanggalPerubahan: "12 Okt 2024 16:10 WIB",
      diubahOleh: "CS Ahmad Fauzi",
    },
    {
      id: 15,
      status: "Aktif",
      tanggalPerubahan: "13 Okt 2024 11:25 WIB",
      diubahOleh: "CS Maya Sari",
    },
    {
      id: 16,
      status: "Non Aktif",
      tanggalPerubahan: "14 Okt 2024 13:40 WIB",
      diubahOleh: "Sistem",
    },
    {
      id: 17,
      status: "Aktif",
      tanggalPerubahan: "15 Okt 2024 09:15 WIB",
      diubahOleh: "CS Budi Santoso",
    },
    {
      id: 18,
      status: "Non Aktif",
      tanggalPerubahan: "16 Okt 2024 14:50 WIB",
      diubahOleh: "CS Linda Kusuma",
    },
    {
      id: 19,
      status: "Aktif",
      tanggalPerubahan: "17 Okt 2024 10:05 WIB",
      diubahOleh: "Sistem",
    },
    {
      id: 20,
      status: "Non Aktif",
      tanggalPerubahan: "18 Okt 2024 15:35 WIB",
      diubahOleh: "CS Dewi Lestari",
    },
    {
      id: 21,
      status: "Aktif",
      tanggalPerubahan: "19 Okt 2024 08:20 WIB",
      diubahOleh: "CS Rizki Pratama",
    },
    {
      id: 22,
      status: "Non Aktif",
      tanggalPerubahan: "20 Okt 2024 12:45 WIB",
      diubahOleh: "Sistem",
    },
    {
      id: 23,
      status: "Aktif",
      tanggalPerubahan: "21 Okt 2024 16:30 WIB",
      diubahOleh: "CS Andi Nugroho",
    },
    {
      id: 24,
      status: "Non Aktif",
      tanggalPerubahan: "22 Okt 2024 11:55 WIB",
      diubahOleh: "CS Sinta Maharani",
    },
    {
      id: 25,
      status: "Aktif",
      tanggalPerubahan: "23 Okt 2024 14:10 WIB",
      diubahOleh: "CS Hendra Gunawan",
    },
  ];

  const [data] = useState(fallbackMock);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });

  // Table columns configuration
  const columns = [
    {
      key: "status",
      header: "Status",
      sortable: false,
      className: "px-6 py-4",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "tanggalPerubahan",
      header: "Tanggal Perubahan",
      sortable: true,
      className: "px-6 py-4 text-xs font-medium",
    },
    {
      key: "diubahOleh",
      header: "Diubah Oleh",
      sortable: false,
      className: "px-6 py-4 text-xs font-medium",
    },
  ];

  // Handle sorting
  const handleSort = (columnKey) => {
    let newOrder = "asc";
    if (sortConfig.sort === columnKey && sortConfig.order === "asc") {
      newOrder = "desc";
    }
    setSortConfig({ sort: columnKey, order: newOrder });
  };

  // Apply sorting to data
  const getSortedData = () => {
    if (!sortConfig.sort) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.sort];
      const bVal = b[sortConfig.sort];

      if (sortConfig.order === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  // Pagination logic
  const sortedData = getSortedData();
  const totalItems = sortedData.likiikngth;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);
  const showPagination = totalItems > 1;
  const showNoDataState = data.length === 0;

  return (
    <TabsContent value="riwayat-status" className="pb-20">
      <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-muat">
        {/* Header */}
        {showNoDataState ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center">
            <DataNotFound type="data" width={95} height={76}>
              <div className="text-center text-neutral-600">
                <p className="font-semibold">Belum Ada Armada</p>
                <p className="mt-2 text-xs font-medium">
                  Hubungi Transporter untuk menambahkan armada
                </p>
              </div>
            </DataNotFound>
          </div>
        ) : (
          <>
            <div className="px-6 py-5">
              <h3 className="text-base font-semibold text-neutral-900">
                Riwayat Status
              </h3>
            </div>

            {/* Table */}
            <div className="">
              <Table
                columns={columns}
                data={paginatedData}
                onSort={handleSort}
                sortConfig={sortConfig}
                rowClassName={(row, index) =>
                  index % 2 === 1 ? "bg-neutral-50" : "bg-white"
                }
                emptyComponent={
                  <DataNotFound
                    type="data"
                    title="Belum Ada Riwayat"
                    subtitle="Belum ada riwayat perubahan status"
                  />
                }
              />
            </div>
          </>
        )}
      </div>
      {showPagination && (
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

export default RiwayatStatusTab;
