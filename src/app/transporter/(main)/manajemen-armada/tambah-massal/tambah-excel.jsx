"use client";

import Link from "next/link";
import { useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { DataTable } from "@/components/DataTable";
import DragAndDropUpload from "@/components/DragAndDropUpload/DragAndDropUpload";
import IconComponent from "@/components/IconComponent/IconComponent";
import Toggle from "@/components/Toggle/Toggle";
import { toast } from "@/lib/toast";

const TambahExcel = () => {
  const { success, error } = toast;
  const [list, setList] = useState([]);
  const [stateUpload, setStateUpload] = useState(true);
  const columns = [
    {
      key: "tanggal",
      header: "Tanggal",
      width: "80px",
      sortable: true,
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
    },
    {
      key: "action",
      header: "Tindakan",
      width: "80px",
      sortable: false,
      render: (row) => (
        <button className="flex items-center gap-1 font-medium text-primary-700">
          Unduh Report
          <IconComponent
            src="/icons/download16.svg"
            alt="download"
            width={16}
            height={16}
          />
        </button>
      ),
    },
  ];
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (file) => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      if (stateUpload) {
        setList([
          ...list,
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
          {
            tanggal: new Date().toISOString().split("T")[0],
            document: file.name,
            name: "John Doe",
            status: "Sukses",
          },
        ]);
        // Show success message
        success(`Berhasil menambah ${20} armada`);
      } else {
        error(
          "Harap selesaikan data pada menu Draft terlebih dahulu sebelum menambah armada baru."
        );
      }
    }, 3000);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Temporary Toggle (use it to toggle between success upload or fail upload) */}
      <div className="col-span-2">
        <Toggle
          value={stateUpload}
          textActive="Sukses unggah file"
          textInactive="Gagal unggah file"
          onClick={() => setStateUpload(!stateUpload)}
        />
      </div>

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
      <div className="col-span-2 flex max-h-[400px] flex-1 flex-col rounded-lg bg-white shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
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
            // onSort={handleSort}
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
