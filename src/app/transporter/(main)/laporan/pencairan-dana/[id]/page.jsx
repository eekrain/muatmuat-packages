"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Download } from "lucide-react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import PageTitle from "@/components/PageTitle/PageTitle";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { useTranslation } from "@/hooks/use-translation";
import { useGetWithdrawalDetail } from "@/services/Transporter/laporan/pencairan-dana/getWithdrawalDetail";

export default function DetailPencairanDanaPage({ params }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = params;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { withdrawal, invoices, summary } = useGetWithdrawalDetail(id);
  console.log("withdrawal:", withdrawal);
  console.log("invoices:", invoices);
  console.log("summary:", summary);

  function formatDateToWIB(isoString) {
    if (!isoString) return "4 Okt 2024 08:00 WIB"; // Fallback to match UI

    const date = new Date(isoString);
    const options = {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatted = new Intl.DateTimeFormat("id-ID", options).format(date);
    return `${formatted.replace(".", ":")} WIB`;
  }

  const columns = [
    {
      header: t(
        "DetailPencairanDanaPage.tableColumnInvoiceNumber",
        {},
        "No. Invoice"
      ),
      key: "invoiceNumber",
      width: "200px",
      render: (row) => row.invoiceNumber || "N/A",
    },
    {
      header: t("DetailPencairanDanaPage.tableColumnSource", {}, "Sumber"),
      key: "source",
      width: "200px",
      render: (row) => row.source || "N/A",
    },
    {
      header: t(
        "DetailPencairanDanaPage.tableColumnTotalIncome",
        {},
        "Total Pendapatan"
      ),
      key: "amount",
      width: "150px",
      render: (row) => formatCurrency(row.amount || 0),
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
  };

  return (
    <div className="mt-8">
      {/* Breadcrumb */}
      <BreadCrumb
        data={[
          {
            name: t(
              "DetailPencairanDanaPage.breadcrumbLaporanPencairan",
              {},
              "Laporan Pencairan"
            ),
            href: "/laporan/pencairan-dana",
          },
          {
            name: t(
              "DetailPencairanDanaPage.breadcrumbRincianPencairan",
              {},
              "Rincian Pencairan"
            ),
          },
        ]}
      />

      {/* Page Header */}
      <div className="mt-4 flex items-center justify-between">
        <PageTitle withBack={true} onClick={handleBack}>
          {t(
            "DetailPencairanDanaPage.titleRincianPencairan",
            {},
            "Rincian Pencairan"
          )}
        </PageTitle>
        <Button iconLeft={<Download size={16} />}>
          {t("DetailPencairanDanaPage.buttonDownload", {}, "Unduh")}
        </Button>
      </div>

      {/* Main Content */}
      <div className="mt-6 flex gap-6">
        {/* Left Side - Main Content */}
        <div className="flex-1">
          <Card className="border-none">
            <CardContent className="p-6">
              {/* Disbursement Details */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center">
                  <label className="w-52 text-sm font-medium text-gray-600">
                    {t(
                      "DetailPencairanDanaPage.labelDisbursementDate",
                      {},
                      "Tanggal Pencairan"
                    )}
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDateToWIB(withdrawal?.withdrawalDate)}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="w-52 text-sm font-medium text-gray-600">
                    {t(
                      "DetailPencairanDanaPage.labelDisbursementAccount",
                      {},
                      "Rekening Pencairan"
                    )}
                  </label>
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        withdrawal?.bankAccount?.logoUrl ||
                        "/icons/payment/va_bca.svg"
                      }
                      alt="Bank Logo"
                      className="h-6 w-6"
                    />
                    <p className="text-sm text-gray-900">
                      {withdrawal?.bankAccount?.bankCode || "BCA"}{" "}
                      {withdrawal?.bankAccount?.accountNumber || "1234567890"}{" "}
                      an.{" "}
                      {withdrawal?.bankAccount?.accountHolderName ||
                        "DAFFA TOLDO"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table
                  columns={columns}
                  data={invoices || []}
                  emptyComponent={
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-8 text-center"
                      >
                        <div className="text-gray-500">
                          <p className="font-medium">
                            {t(
                              "DetailPencairanDanaPage.emptyStateNoInvoiceData",
                              {},
                              "Tidak Ada Data Invoice"
                            )}
                          </p>
                        </div>
                      </td>
                    </tr>
                  }
                />
              </div>

              {/* Pagination */}
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil((invoices?.length || 0) / perPage)}
                  perPage={perPage}
                  onPageChange={handlePageChange}
                  onPerPageChange={handlePerPageChange}
                  variants="muatrans"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Summary Card */}
        <div className="w-80">
          <Card className="border-none">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {t(
                  "DetailPencairanDanaPage.titleDisbursementSummary",
                  {},
                  "Ringkasan Pencairan"
                )}
              </h3>

              <div className="space-y-4">
                {/* Gross Income */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    {t(
                      "DetailPencairanDanaPage.labelGrossIncome",
                      {},
                      "Pendapatan Kotor"
                    )}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {t(
                          "DetailPencairanDanaPage.labelIncomeAmount",
                          {},
                          "Nominal Pendapatan"
                        )}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(summary?.grossIncome || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {t(
                          "DetailPencairanDanaPage.labelServiceAdmin",
                          {},
                          "Admin Layanan"
                        )}
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        -{formatCurrency(summary?.adminFee || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Other Costs */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    {t(
                      "DetailPencairanDanaPage.labelOtherCosts",
                      {},
                      "Biaya Lainnya"
                    )}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {t("DetailPencairanDanaPage.labelDPP", {}, "DPP")}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(summary?.dpp || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {t("DetailPencairanDanaPage.labelPPN", {}, "PPN 12%")}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(summary?.ppn || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {t("DetailPencairanDanaPage.labelPPH", {}, "PPH 2%")}
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        -{formatCurrency(summary?.pph || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {t("DetailPencairanDanaPage.labelTotal", {}, "Total")}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(summary?.netAmount || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
