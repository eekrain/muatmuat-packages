"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetcherExcelDriversMassalTemplate } from "@/services/Transporter/manajemen-driver/getDriversExcelTemplate";
import { useGetDriversUploadHistoryWithParams } from "@/services/Transporter/manajemen-driver/getDriversUploadHistory";
import { usePostDriverExcelUpload } from "@/services/Transporter/manajemen-driver/postDriverExcelUpload";

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
      key: "tanggal",
      header: t("TambahExcelScreen.headerTanggal", {}, "Tanggal"),
      width: "80px",
      sortable: true,
      render: (row) => {
        const date = new Date(row.tanggal).toISOString();
        return formatDate(date);
      },
    },
    {
      key: "document",
      header: t("TambahExcelScreen.headerDokumen", {}, "Dokumen"),
      width: "80px",
      sortable: false,
      render: (row) => (
        <Link href={row.action} className="text-success-600">
          {row.document}
        </Link>
      ),
    },
    {
      key: "name",
      header: t(
        "TambahExcelScreen.headerNamaPengunggah",
        {},
        "Nama Pengunggah"
      ),
      width: "80px",
      sortable: false,
    },
    {
      key: "status",
      header: t("TambahExcelScreen.headerStatus", {}, "Status"),
      width: "80px",
      sortable: false,
      render: (row) => (
        <>
          {row.status === "SUCCESS"
            ? t(
                "TambahExcelScreen.statusBerhasilMenambahDriver",
                {},
                "Berhasil menambah driver"
              )
            : t(
                "TambahExcelScreen.statusGagalMenambahDriver",
                {},
                "Gagal menambah driver"
              )}
        </>
      ),
    },
    {
      key: "action",
      header: t("TambahExcelScreen.headerTindakan", {}, "Tindakan"),
      width: "80px",
      sortable: false,
      render: (row) => {
        if (row.status === "FAILED") {
          return (
            <Link href={row.action} target="_blank">
              <button className="flex items-center gap-1 font-medium text-primary-700">
                {t("TambahExcelScreen.buttonUnduhReport", {}, "Unduh Report")}
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

  const { data, isLoading } =
    useGetDriversUploadHistoryWithParams(searchParams);
  const { trigger, isMutating } = usePostDriverExcelUpload();

  const handleUpload = (file) => {
    // setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    trigger(formData)
      .then((response) => {
        // setIsUploading(false);
        setUploadedFile(file);
        if (response?.Data?.batchId) {
          toast.success(
            t(
              "TambahExcelScreen.messageSuccessAddDriver",
              { count: response.Data.totalDrivers },
              `Berhasil menambah ${response.Data.totalDrivers} driver`
            )
          );
          router.push(
            `/manajemen-driver/tambah-massal/preview/${response.Data.batchId}`
          );
        }
      })
      .catch((_error) => {
        toast.error(
          t(
            "TambahExcelScreen.messageErrorAddDriver",
            {},
            "Gagal menambah driver. \n Periksa laporan untuk mengetahui driver yang gagal ditambahkan"
          )
        );
      });
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);

      // Fetch template data when user clicks download
      const templateData = await fetcherExcelDriversMassalTemplate(
        "v1/drivers/excel-template",
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
            "TambahExcelScreen.messageSuccessDownloadTemplate",
            {},
            "Template berhasil diunduh"
          )
        );
      } else {
        toast.error(
          t(
            "TambahExcelScreen.messageErrorTemplateNotAvailable",
            {},
            "Template tidak tersedia"
          )
        );
      }
    } catch {
      toast.error(
        t(
          "TambahExcelScreen.messageErrorDownloadTemplate",
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
          tanggal: item.uploadedAt,
          document: item.fileName,
          name: item.uploadedBy,
          status: item.status,
          action: item.reportUrl ? item.reportUrl : "-",
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
              "TambahExcelScreen.toggleSuksesUnggahFile",
              {},
              "Sukses unggah file"
            )}
            textInactive={t(
              "TambahExcelScreen.toggleGagalUnggahFile",
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
                "TambahExcelScreen.titleUnduhTemplateExcel",
                {},
                "Unduh Template Excel"
              )}
            </h3>
          </div>
          <p className="text-xs font-medium text-neutral-900">
            {t(
              "TambahExcelScreen.descriptionTemplateUsage",
              {},
              "Gunakan template ini untuk menambahkan armada sekaligus."
            )}{" "}
            <Link href="#" className="text-primary-700 underline">
              {t("TambahExcelScreen.linkClickHere", {}, "klik di sini")}
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
            {t("TambahExcelScreen.buttonUnduhTemplate", {}, "Unduh Template")}
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
              {t(
                "TambahExcelScreen.titleUnggahFileExcel",
                {},
                "Unggah File Excel"
              )}
            </h3>
          </div>
          <p className="text-xs font-medium text-black">
            {t(
              "TambahExcelScreen.descriptionUploadInstructions",
              {},
              "Setelah melengkapi informasi driver, unggah file (.xls atau .xlsx) maks. 300 driver dalam satu file."
            )}
          </p>
        </div>
        <div className="flex-grow">
          <DropzoneComponent
            onUpload={handleUpload}
            file={uploadedFile}
            loading={isMutating}
            placeholder={t(
              "TambahExcelScreen.placeholderDropzone",
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
              "TambahExcelScreen.placeholderSearchDocument",
              {},
              "Cari Nama Dokumen (min. 4 karakter)"
            )}
            currentPage={searchParams.page}
            totalPages={data?.Data?.pagination?.totalPages || 1}
            totalItems={data?.Data?.pagination?.total || 0}
            perPage={searchParams.limit}
            // showDisplayView={false}
            showPagination={false}
            // showTotalCount={true}
            tableTitle={
              <h2 className="mr-3 text-xl font-bold text-neutral-900">
                {t(
                  "TambahExcelScreen.titleRiwayatUnggahan",
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
              "TambahExcelScreen.titleNoUploadHistory",
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
