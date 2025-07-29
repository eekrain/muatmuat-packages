"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { DataTable } from "@/components/DataTable";
import DragAndDropUpload from "@/components/DragAndDropUpload/DragAndDropUpload";
import IconComponent from "@/components/IconComponent/IconComponent";
import Toggle from "@/components/Toggle/Toggle";
import { isDev } from "@/lib/constants/is-dev";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";

const TambahExcel = () => {
  const [list, setList] = useState([]);
  const [stateUpload, setStateUpload] = useState(true);
  const router = useRouter();
  const columns = [
    {
      key: "tanggal",
      header: "Tanggal",
      width: "80px",
      sortable: true,
      render: (row) => {
        const date = new Date(row.tanggal);
        return formatDate(date);
      },
    },
    {
      key: "document",
      header: "Dokumen",
      width: "80px",
      sortable: false,
      render: (row) => (
        <Link href={`/documents/${row.document}`} className="text-success-600">
          {row.document}
        </Link>
      ),
    },
    {
      key: "name",
      header: "Nama Pengunggah",
      width: "80px",
      sortable: false,
    },
    {
      key: "status",
      header: "Status",
      width: "80px",
      sortable: false,
      render: (row) => (
        <>
          {row.status === "Sukses"
            ? "Berhasil menambah armada"
            : "Gagal menambah armada"}
        </>
      ),
    },
    {
      key: "action",
      header: "Tindakan",
      width: "80px",
      sortable: false,
      render: (row) => {
        if (row.status === "Gagal") {
          return (
            <button className="flex items-center gap-1 font-medium text-primary-700">
              Unduh Report
              <IconComponent
                src="/icons/download16.svg"
                alt="download"
                width={16}
                height={16}
              />
            </button>
          );
        } else {
          return <>-</>;
        }
      },
    },
  ];
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (file) => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setList([
        ...list,
        {
          tanggal: new Date().toISOString(),
          document: file.name,
          name: "John Doe",
          status: stateUpload ? "Sukses" : "Gagal",
        },
      ]);
      if (stateUpload) {
        // Show success message
        toast.success(`Berhasil menambah ${20} armada`);
        router.push("/manajemen-armada/tambah-massal/preview-armada");
      } else {
        toast.error(
          "Harap selesaikan data pada menu Draft terlebih dahulu sebelum menambah armada baru."
        );
      }
    }, 3000);
  };

  const handleSort = (column, sortBy) => {
    const temp_list = [...list];
    if (sortBy === "asc") {
      temp_list.sort((a, b) => (a[column] > b[column] ? 1 : -1));
    } else if (sortBy === "desc") {
      temp_list.sort((a, b) => (a[column] < b[column] ? 1 : -1));
    } else {
      temp_list.sort((a, b) => (a[column] > b[column] ? 1 : -1)); // Default sort order
    }
    setList(temp_list);
    // Log the sorting action
    console.log(`Sorted by ${column} in ${sortBy} order`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Temporary Toggle (use it to toggle between success upload or fail upload) */}
      {isDev && (
        <div className="md:col-span-2">
          <Toggle
            value={stateUpload}
            textActive="Sukses unggah file"
            textInactive="Gagal unggah file"
            onClick={() => setStateUpload(!stateUpload)}
          />
        </div>
      )}

      {/* Card 1: Download Template */}
      <div className="flex flex-1 flex-col rounded-lg bg-white p-6 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-muat-trans-primary-400">
              <span className="text-base font-semibold text-muat-trans-secondary-900">
                1
              </span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Unduh Template Excel
            </h3>
          </div>
          <p className="text-xs font-medium text-neutral-900">
            Gunakan template ini untuk menambahkan armada sekaligus.{" "}
            <Link href="#" className="text-primary-700 underline">
              klik di sini
            </Link>
          </p>
        </div>
        <div className="flex h-full flex-grow items-center justify-center">
          <Button
            variant="muattrans-primary"
            className="flex"
            iconLeft={
              <IconComponent
                src="/icons/download16.svg"
                alt="download"
                width={16}
                height={16}
              />
            }
          >
            Unduh Template
          </Button>
        </div>
      </div>

      {/* Card 2: Upload File */}
      <div className="flex flex-1 flex-col gap-4 rounded-lg bg-white px-6 py-5 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
        <div className="flex flex-col items-start gap-2 self-stretch">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-muat-trans-primary-400">
              <span className="text-base font-semibold text-muat-trans-secondary-900">
                2
              </span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Unggah File Excel
            </h3>
          </div>
          <p className="text-xs font-medium text-black">
            Setelah melengkapi informasi armada, unggah file (.xls atau .xlsx)
            maks. 300 armada dalam satu file.
          </p>
        </div>
        <div className="flex-grow">
          <DragAndDropUpload
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        </div>
      </div>

      {/* Card 3: Riwayat Unggahan */}
      <div className="flex max-h-[400px] flex-1 flex-col rounded-lg bg-white shadow-[0px_4px_11px_rgba(65,65,65,0.25)] md:col-span-2">
        {list.length > 0 ? (
          <DataTable
            data={list}
            columns={columns}
            searchPlaceholder="Cari Nama Dokumen"
            currentPage={1}
            totalPages={1}
            totalItems={10}
            perPage={10}
            showDisplayView={false}
            showPagination={false}
            showTotalCount={false}
            tableTitle={
              <h2 className="mr-3 text-xl font-bold text-neutral-900">
                Riwayat Unggahan 90 Hari Terakhir
              </h2>
            }
            fixedHeight={true}
            // onPageChange={handlePageChange}
            // onPerPageChange={handlePerPageChange}
            // onSearch={handleSearch}
            // onFilter={handleFilter}
            onSort={handleSort}
            // loading={isLoading}
            // rowClassName={rowClassName}
            // filterConfig={getFilterConfig()}
          />
        ) : (
          <DataNotFound
            className="w-full p-6"
            image="/icons/NotFoundVoucher.png"
            title="Kamu belum punya riwayat unggahan"
            textClass={"w-full"}
          />
        )}
      </div>
    </div>
  );
};

export default TambahExcel;
