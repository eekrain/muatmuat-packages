import { useMemo, useState } from "react";

import Card from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";

// Mock data berdasarkan gambar yang diberikan
const contactHistoryData = [
  {
    id: 1,
    csName: "CS Bertugas",
    contactDate: "03 Okt 2024 18:00 WIB",
    contactCount: 20,
  },
  {
    id: 2,
    csName: "CS Daffa Toldo",
    contactDate: "02 Okt 2024 18:00 WIB",
    contactCount: 19,
  },
  {
    id: 3,
    csName: "CS Christina Clara",
    contactDate: "01 Okt 2024 18:00 WIB",
    contactCount: 18,
  },
  {
    id: 4,
    csName: "CS Prima Arfandi",
    contactDate: "01 Okt 2024 12:00 WIB",
    contactCount: 17,
  },
  {
    id: 5,
    csName: "CS Nafalia Juwita",
    contactDate: "01 Okt 2024 09:00 WIB",
    contactCount: 16,
  },
  {
    id: 6,
    csName: "CS Daffa Toldo",
    contactDate: "03 Okt 2024 18:00 WIB",
    contactCount: 15,
  },
  {
    id: 7,
    csName: "CS Christina Clara",
    contactDate: "02 Okt 2024 18:00 WIB",
    contactCount: 14,
  },
  {
    id: 8,
    csName: "CS Prima Arfandi",
    contactDate: "01 Okt 2024 18:00 WIB",
    contactCount: 13,
  },
  {
    id: 9,
    csName: "CS Daffa Toldo",
    contactDate: "01 Okt 2024 12:00 WIB",
    contactCount: 12,
  },
  {
    id: 10,
    csName: "CS Nafalia Juwita",
    contactDate: "01 Okt 2024 09:00 WIB",
    contactCount: 11,
  },
];

/**
 * Komponen DataTable untuk menampilkan riwayat menghubungi CS.
 * Termasuk fungsionalitas pencarian dan sorting.
 */
const RiwayatHubungiTable = () => {
  // 1. State untuk menyimpan nilai input pencarian dari pengguna.
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [hasError, setHasError] = useState(false);

  // Safety check: pastikan contactHistoryData tersedia dan tidak undefined
  const safeContactHistoryData = useMemo(() => {
    try {
      if (!contactHistoryData) {
        console.warn(
          "contactHistoryData is null or undefined, using empty array"
        );
        return [];
      }
      if (!Array.isArray(contactHistoryData)) {
        console.warn("contactHistoryData is not an array, using empty array");
        return [];
      }
      if (contactHistoryData.length === 0) {
        console.warn("contactHistoryData is empty array");
        return [];
      }
      return contactHistoryData.map((item, index) => ({
        ...item,
        id: item?.id || index,
        csName: item?.csName || "Unknown CS",
        contactDate: item?.contactDate || "Unknown Date",
        contactCount: item?.contactCount || 0,
      }));
    } catch (error) {
      console.error("Error processing contactHistoryData:", error);
      setHasError(true);
      return [];
    }
  }, []);

  // Logika untuk mengurutkan data
  const sortedData = useMemo(() => {
    // Safety check: pastikan safeContactHistoryData adalah array dan tidak undefined
    if (
      !Array.isArray(safeContactHistoryData) ||
      safeContactHistoryData.length === 0
    ) {
      return [];
    }

    try {
      const sortableItems = [...safeContactHistoryData];
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          // Safety check: pastikan a dan b ada dan memiliki key yang diminta
          if (
            !a ||
            !b ||
            a[sortConfig.key] === undefined ||
            b[sortConfig.key] === undefined
          ) {
            return 0;
          }

          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
      return Array.isArray(sortableItems) ? sortableItems : [];
    } catch (error) {
      console.error("Error sorting data:", error);
      return safeContactHistoryData || [];
    }
  }, [sortConfig, safeContactHistoryData]);

  // 2. Logika untuk memfilter data berdasarkan nilai `searchValue`.
  // useMemo digunakan agar proses filter tidak dijalankan ulang pada setiap render,
  // kecuali jika `sortedData` atau `searchValue` berubah.
  const filteredData = useMemo(() => {
    try {
      // Safety check: pastikan sortedData ada dan adalah array
      if (!sortedData) {
        console.warn("sortedData is null or undefined");
        return [];
      }

      if (!Array.isArray(sortedData)) {
        console.warn("sortedData is not an array:", typeof sortedData);
        return [];
      }

      if (sortedData.length === 0) {
        return [];
      }

      // Safety check untuk searchValue
      const safeSearchValue =
        searchValue && typeof searchValue === "string" ? searchValue : "";

      // Jika input pencarian kosong, kembalikan semua data yang sudah diurutkan.
      if (!safeSearchValue || safeSearchValue.trim() === "") {
        return [...sortedData]; // Return copy to prevent mutations
      }

      // Jika ada input, filter data dengan maximum safety
      const filteredResult = [];

      for (let i = 0; i < sortedData.length; i++) {
        try {
          const item = sortedData[i];

          // Safety check: pastikan item ada
          if (!item) {
            continue;
          }

          // Safety check: pastikan item.csName ada dan adalah string
          if (!item.csName || typeof item.csName !== "string") {
            continue;
          }

          // Perform case-insensitive search
          const itemName = item.csName.toLowerCase();
          const searchTerm = safeSearchValue.toLowerCase();

          if (itemName.includes(searchTerm)) {
            filteredResult.push(item);
          }
        } catch (itemError) {
          console.error("Error processing item at index", i, ":", itemError);
          continue;
        }
      }

      return filteredResult;
    } catch (error) {
      console.error("Critical error in filteredData:", error);
      setHasError(true);
      return [];
    }
  }, [sortedData, searchValue]);

  // Fungsi untuk menangani permintaan sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Komponen untuk header tabel yang bisa di-sort
  const SortableHeader = ({ columnKey, title }) => (
    <th
      className="cursor-pointer p-4 text-left text-sm font-semibold text-neutral-500"
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center gap-2">
        {title}
        <IconComponent
          src="/icons/sort-gray.svg"
          alt="Sort"
          width={16}
          height={16}
        />
      </div>
    </th>
  );

  return (
    <>
      {hasError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            Terjadi kesalahan saat memuat data. Silakan refresh halaman.
          </p>
        </div>
      )}
      <Card className="rounded-lg border-0 p-6">
        <div className="w-full md:w-1/4">
          {/* 3. Komponen Input Search yang aman untuk pencarian. */}
          {/* `value` diisi oleh state `searchValue`. */}
          {/* `onChange` digunakan untuk memperbarui state `searchValue` setiap kali pengguna mengetik. */}
          <Input
            icon={{ left: "/icons/search.svg" }}
            appearance={{
              inputClassName: "pr-4 !text-[#1b1b1b]",
            }}
            value={searchValue || ""}
            onChange={(e) => {
              try {
                // Maximum safety untuk event handling
                if (!e) {
                  console.warn("Event is null or undefined");
                  return;
                }

                if (!e.target && !e.currentTarget) {
                  console.warn("Event target is null or undefined");
                  return;
                }

                // Ambil value dengan fallback
                const target = e.target || e.currentTarget;
                const value = target?.value;

                if (typeof value !== "string") {
                  console.warn("Input value is not a string:", typeof value);
                  setSearchValue("");
                  return;
                }

                setSearchValue(value);
              } catch (error) {
                console.error("Error in search input onChange:", error);
                setSearchValue("");
              }
            }}
            placeholder="Cari Nama/Perusahaan"
          />
        </div>
        {(() => {
          try {
            // Triple safety check for rendering
            const safeFilteredData = Array.isArray(filteredData)
              ? filteredData
              : [];
            const hasData = safeFilteredData.length > 0;
            const hasOriginalData =
              Array.isArray(safeContactHistoryData) &&
              safeContactHistoryData.length > 0;
            const isSearching = searchValue && searchValue.trim() !== "";

            // Jika tidak ada data sama sekali
            if (!hasOriginalData) {
              return (
                <DataNotFound
                  title="Belum Ada Riwayat Laporan"
                  description="Belum ada riwayat laporan yang tercatat."
                  type="data"
                  className="h-full p-6"
                />
              );
            }

            // Jika sedang mencari tapi tidak ada hasil
            if (isSearching && !hasData) {
              return (
                <DataNotFound
                  title="Keyword Tidak Ditemukan"
                  description={`Tidak ada data yang sesuai dengan pencarian "${searchValue}".`}
                  type="search"
                  className="h-full p-6"
                />
              );
            }

            // Jika ada data untuk ditampilkan
            if (hasData) {
              return (
                <>
                  {/* Search */}

                  {/* Table */}
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          <SortableHeader
                            columnKey="csName"
                            title="CS Bertugas"
                          />
                          <SortableHeader
                            columnKey="contactDate"
                            title="Tanggal Menghubungi"
                          />
                          <SortableHeader
                            columnKey="contactCount"
                            title="Hubungi Ke"
                          />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 bg-white">
                        {/* Data yang ditampilkan di tabel adalah `filteredData`, bukan data asli. */}
                        {safeFilteredData.map((item, index) => {
                          try {
                            // Safety check untuk setiap item
                            if (!item) {
                              return null;
                            }

                            const itemId = item.id || `item-${index}`;

                            return (
                              <tr key={itemId}>
                                <td className="whitespace-nowrap p-4 text-start text-sm text-neutral-900">
                                  {item.csName || "N/A"}
                                </td>
                                <td className="whitespace-nowrap p-4 text-start text-sm text-neutral-900">
                                  {item.contactDate || "N/A"}
                                </td>
                                <td className="whitespace-nowrap p-4 text-start text-sm text-neutral-900">
                                  {item.contactCount
                                    ? `Hubungi Ke - ${item.contactCount}`
                                    : "N/A"}
                                </td>
                              </tr>
                            );
                          } catch (itemError) {
                            console.error(
                              "Error rendering item:",
                              itemError,
                              item
                            );
                            return null;
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            }

            // Fallback untuk kondisi yang tidak terduga
            return (
              <DataNotFound
                title="Belum Ada Riwayat Laporan"
                description="Belum ada riwayat laporan yang tercatat."
                type="data"
                className="h-full p-6"
              />
            );
          } catch (renderError) {
            console.error("Error rendering table:", renderError);
            return (
              <div className="p-4 text-center text-red-600">
                Terjadi kesalahan saat menampilkan data.
              </div>
            );
          }
        })()}
      </Card>

      {(() => {
        try {
          const safeFilteredData = Array.isArray(filteredData)
            ? filteredData
            : [];
          const hasData = safeFilteredData.length > 0;

          return hasData ? (
            <Pagination
              currentPage={1}
              totalPages={15}
              onPageChange={() => {}}
              onPerPageChange={() => {}}
              perPage={10}
            />
          ) : null;
        } catch (paginationError) {
          console.error("Error rendering pagination:", paginationError);
          return null;
        }
      })()}
    </>
  );
};

export default RiwayatHubungiTable;
