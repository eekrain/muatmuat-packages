"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { DataTable } from "@/components/DataTable";
import DropzoneComponent from "@/components/Dropzone/Dropzone";
import IconComponent from "@/components/IconComponent/IconComponent";
import Toggle from "@/components/Toggle/Toggle";
import { useTranslation } from "@/hooks/use-translation";
import { isDev } from "@/lib/constants/is-dev";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";
import { fetcherExcelArmadaMassalTemplate } from "@/services/Transporter/manajemen-armada/getFleetsExcelTemplate";
import { useGetFleetsUploadHistoryWithParams } from "@/services/Transporter/manajemen-armada/getFleetsUploadHistory";
import { usePostFleetBulkUpload } from "@/services/Transporter/manajemen-armada/postFleetBulkUpload";

const TambahExcel = () => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [stateUpload, setStateUpload] = useState(true);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sort: "",
    order: "",
  });
  const router = useRouter();
  const columns = [
    {
      key: "createdAt",
      header: t("TambahExcel.headerTanggal", {}, "Tanggal"),
      width: "80px",
      sortable: true,
      render: (row) => {
        const date = new Date(row.createdAt).toISOString();
        return formatDate(date);
      },
    },
    {
      key: "document",
      header: t("TambahExcel.headerDokumen", {}, "Dokumen"),
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
      header: t("TambahExcel.headerNamaPengunggah", {}, "Nama Pengunggah"),
      width: "80px",
      sortable: false,
    },
    {
      key: "status",
      header: t("TambahExcel.headerStatus", {}, "Status"),
      width: "80px",
      sortable: false,
      render: (row) => (
        <>
          {row.status === "COMPLETED"
            ? t(
                "TambahExcel.statusBerhasilMenambahArmada",
                {},
                "Berhasil menambah armada"
              )
            : t(
                "TambahExcel.statusGagalMenambahArmada",
                {},
                "Gagal menambah armada"
              )}
        </>
      ),
    },
    {
      key: "action",
      header: t("TambahExcel.headerTindakan", {}, "Tindakan"),
      width: "80px",
      sortable: false,
      render: (row) => {
        if (row.status === "FAILED") {
          return (
            <Link href={row.action} target="_blank">
              <button className="flex items-center gap-1 font-medium text-primary-700">
                {t("TambahExcel.buttonUnduhReport", {}, "Unduh Report")}
                <IconComponent
                  src="/icons/download16.svg"
                  alt="download"
                  width={16}
                  height={16}
                />
              </button>
            </Link>
          );
        } else {
          return <>-</>;
        }
      },
    },
  ];
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const { data, isLoading } = useGetFleetsUploadHistoryWithParams(searchParams);
  const { trigger, isMutating } = usePostFleetBulkUpload();

  const handleUpload = (file) => {
    // setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    trigger(formData)
      .then((response) => {
        setUploadedFile(file);
        if (response?.Data?.bulkImportId) {
          toast.success(
            t(
              "TambahExcel.toastBerhasilMenambahArmada",
              { totalRows: response.Data.totalRows },
              `Berhasil menambah ${response.Data.totalRows} armada`
            )
          );
          router.push(
            `/manajemen-armada/tambah-massal/preview-armada/${response.Data.bulkImportId}`
          );
        }
      })
      .catch((_error) => {
        toast.error(
          t(
            "TambahExcel.toastGagalMenambahArmada",
            {},
            "Gagal menambah armada.\n Periksa laporan untuk mengetahui armada yang gagal ditambahkan."
          )
        );
      });
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);

      // Fetch template data when user clicks download
      const templateData = await fetcherExcelArmadaMassalTemplate(
        "v1/fleet/excel-template",
        { arg: null }
      );

      if (templateData?.Data?.templateUrl) {
        // Create a temporary anchor element to download the file
        const link = document.createElement("a");
        link.href = templateData.Data.templateUrl;
        link.download = "Template_Armada.xlsx"; // Set the filename
        link.target = "_blank"; // Open in new tab if direct download fails

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(
          t(
            "TambahExcel.toastTemplateBerhasilDiunduh",
            {},
            "Template berhasil diunduh"
          )
        );
      } else {
        toast.error(
          t(
            "TambahExcel.toastTemplateTidakTersedia",
            {},
            "Template tidak tersedia"
          )
        );
      }
    } catch {
      toast.error(
        t(
          "TambahExcel.toastGagalMengunduhTemplate",
          {},
          "Gagal mengunduh template"
        )
      );
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleSort = (column, sortBy) => {
    setSearchParams((prev) => ({
      ...prev,
      sort: column,
      order: sortBy,
    }));
  };

  const handleSearch = (searchTerm) => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1, // Reset to first page when searching
    }));
  };

  const handlePageChange = (page) => {
    setSearchParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const handlePerPageChange = (limit) => {
    setSearchParams((prev) => ({
      ...prev,
      limit,
      page: 1, // Reset to first page when changing page size
    }));
  };

  useEffect(() => {
    if (data && data.Data && data.Data.history.length > 0) {
      setList(
        data.Data.history.map((item) => ({
          createdAt: item.uploadedAt,
          document: item.originalFileName,
          name: item.uploadBy,
          status: item.status,
          action: item.fileReport ? item.fileReport : "-",
        }))
      );
    }
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Temporary Toggle (use it to toggle between success upload or fail upload) */}
      {isDev && (
        <div className="md:col-span-2">
          <Toggle
            value={stateUpload}
            textActive={t(
              "TambahExcel.toggleSuksesUnggahFile",
              {},
              "Sukses unggah file"
            )}
            textInactive={t(
              "TambahExcel.toggleGagalUnggahFile",
              {},
              "Gagal unggah file"
            )}
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
              {t(
                "TambahExcel.titleUnduhTemplateExcel",
                {},
                "Unduh Template Excel"
              )}
            </h3>
          </div>
          <p className="text-xs font-medium text-neutral-900">
            {t(
              "TambahExcel.descriptionGunakanTemplate",
              {},
              "Gunakan template ini untuk menambahkan armada sekaligus."
            )}{" "}
            <Link href="#" className="text-primary-700 underline">
              {t("TambahExcel.linkKlikDisini", {}, "klik di sini")}
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
            onClick={handleDownloadTemplate}
            disabled={isDownloadingTemplate}
            loading={isDownloadingTemplate}
          >
            {isDownloadingTemplate
              ? t("TambahExcel.buttonMemuatTemplate", {}, "Memuat Template...")
              : t("TambahExcel.buttonUnduhTemplate", {}, "Unduh Template")}
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
              {t("TambahExcel.titleUnggahFileExcel", {}, "Unggah File Excel")}
            </h3>
          </div>
          <p className="text-xs font-medium text-black">
            {t(
              "TambahExcel.descriptionSetelahMelengkapi",
              {},
              "Setelah melengkapi informasi armada, unggah file (.xls atau .xlsx) maks. 300 armada dalam satu file."
            )}
          </p>
        </div>
        <div className="flex-grow">
          <DropzoneComponent
            onUpload={handleUpload}
            file={uploadedFile}
            loading={isMutating}
            placeholder={t(
              "TambahExcel.placeholderSeretDanLepas",
              {},
              "Seret dan lepas file di sini atau klik untuk memilih file"
            )}
            className={"w-full"}
          />
        </div>
      </div>

      {/* Card 3: Riwayat Unggahan */}
      <div className="flex max-h-[400px] flex-1 flex-col rounded-lg bg-white shadow-[0px_4px_11px_rgba(65,65,65,0.25)] md:col-span-2">
        {list.length > 0 ? (
          <DataTable
            data={list}
            columns={columns}
            searchPlaceholder={t(
              "TambahExcel.searchPlaceholderCariNamaDokumen",
              {},
              "Cari Nama Dokumen (min. 4 karakter)"
            )}
            currentPage={searchParams.page}
            totalPages={data?.Data?.pagination?.totalPages || 1}
            totalItems={data?.Data?.pagination?.totalItems || 0}
            perPage={searchParams.limit}
            // showDisplayView={false}
            showPagination={false}
            // showTotalCount={true}
            tableTitle={
              <h2 className="mr-3 text-xl font-bold text-neutral-900">
                {t(
                  "TambahExcel.titleRiwayatUnggahan90Hari",
                  {},
                  "Riwayat Unggahan 90 Hari Terakhir"
                )}
              </h2>
            }
            fixedHeight={true}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            onSearch={handleSearch}
            onSort={handleSort}
            loading={isLoading}
          />
        ) : (
          <DataNotFound
            className="w-full p-6"
            image="/icons/NotFoundVoucher.png"
            title={t(
              "TambahExcel.dataNotFoundTitle",
              {},
              "Kamu belum punya riwayat unggahan"
            )}
            textClass={"w-full"}
          />
        )}
      </div>
    </div>
  );
};

export default TambahExcel;
