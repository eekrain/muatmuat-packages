import { useMemo, useState } from "react";

import Card from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { InputSearch } from "@/components/InputSearch/InputSearch";
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
  const [searchTerm, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  // Logika untuk mengurutkan data
  const sortedData = useMemo(() => {
    const sortableItems = [...contactHistoryData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);

  // 2. Logika untuk memfilter data berdasarkan nilai `searchTerm`.
  // useMemo digunakan agar proses filter tidak dijalankan ulang pada setiap render,
  // kecuali jika `sortedData` atau `searchTerm` berubah.
  const filteredData = useMemo(() => {
    // Jika input pencarian kosong, kembalikan semua data yang sudah diurutkan.
    if (!searchTerm) {
      return sortedData;
    }
    // Jika ada input, filter data.
    return sortedData.filter((item) =>
      // Ubah nama CS dan kata kunci pencarian ke huruf kecil
      // agar pencarian tidak case-sensitive (tidak peduli huruf besar/kecil).
      // Kemudian periksa apakah nama CS mengandung teks yang dicari.
      item.csName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedData, searchTerm]);

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
      <Card className="rounded-lg border-0 p-6">
        <div className="w-full md:w-1/4">
          {/* 3. Komponen InputSearch dihubungkan dengan state pencarian. */}
          {/* `searchValue` diisi oleh state `searchTerm`. */}
          {/* `setSearchValue` digunakan untuk memperbarui state `searchTerm` setiap kali pengguna mengetik. */}
          <InputSearch
            searchValue={searchTerm}
            setSearchValue={setSearchValue}
            placeholder="Cari Nama/Perusahaan"
          />
        </div>
        {filteredData.length > 0 ? (
          <>
            {/* Search */}

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <SortableHeader columnKey="csName" title="CS Bertugas" />
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
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap p-4 text-start text-sm text-neutral-900">
                        {item.csName}
                      </td>
                      <td className="whitespace-nowrap p-4 text-start text-sm text-neutral-900">
                        {item.contactDate}
                      </td>
                      <td className="whitespace-nowrap p-4 text-start text-sm text-neutral-900">
                        {`Hubungi Ke - ${item.contactCount}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <DataNotFound
            title="Belum Ada Riwayat Laporan"
            description="Belum ada riwayat laporan yang tercatat."
            type="data"
            className="h-full p-6"
          />
        )}
      </Card>

      {filteredData.length > 0 && (
        <Pagination
          currentPage={1}
          totalPages={15}
          onPageChange={() => {}}
          onPerPageChange={() => {}}
          perPage={10}
        />
      )}
    </>
  );
};

export default RiwayatHubungiTable;
