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

export default function DetailPencairanDanaPage({ params }) {
  const router = useRouter();
  const { id } = params;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Mock data - in real app this would come from API
  const disbursementData = {
    id: id,
    disbursementDate: "4 Okt 2024 08:00 WIB",
    account: "BCA 1234567890 an. DAFFA TOLDO",
    bankLogo: "/icons/payment/va_bca.svg",
    invoices: [
      {
        id: 1,
        invoiceNumber: "INV/20240120/MPM/00001",
        source: "Pendapatan Pesanan",
        totalIncome: 220000,
      },
      {
        id: 2,
        invoiceNumber: "INV/20240120/MPM/00002",
        source: "Pendapatan Pesanan",
        totalIncome: 210000,
      },
      {
        id: 3,
        invoiceNumber: "INV/20240120/MPM/00003",
        source: "Penyesuaian Pendapatan",
        totalIncome: 300000,
      },
      {
        id: 4,
        invoiceNumber: "COM/20240120/MPM/00004",
        source: "Penyesuaian Pendapatan",
        totalIncome: 300000,
      },
    ],
    summary: {
      grossIncome: 1040600,
      adminFee: 40600,
      dpp: 109450,
      ppn: 109450,
      pph: 109450,
    },
  };

  const columns = [
    {
      header: "No. Invoice",
      key: "invoiceNumber",
      width: "200px",
    },
    {
      header: "Sumber",
      key: "source",
      width: "200px",
    },
    {
      header: "Total Pendapatan",
      key: "totalIncome",
      width: "150px",
      render: (row) => formatCurrency(row.totalIncome),
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

  const calculateTotal = () => {
    const { grossIncome, adminFee, dpp, ppn, pph } = disbursementData.summary;
    return grossIncome - adminFee + dpp + ppn - pph;
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
          { name: "Laporan Pencairan", href: "/laporan/pencairan-dana" },
          { name: "Rincian Pencairan" },
        ]}
      />

      {/* Page Header */}
      <div className="mt-4 flex items-center justify-between">
        <PageTitle withBack={true} onClick={handleBack}>
          Rincian Pencairan
        </PageTitle>
        <Button iconLeft={<Download size={16} />}>Unduh</Button>
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
                    Tanggal Pencairan
                  </label>
                  <p className="text-sm text-gray-900">
                    {disbursementData.disbursementDate}
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="w-52 text-sm font-medium text-gray-600">
                    Rekening Pencairan
                  </label>
                  <div className="flex items-center gap-2">
                    <img
                      src={disbursementData.bankLogo}
                      alt="Bank Logo"
                      className="h-6 w-6"
                    />
                    <p className="text-sm text-gray-900">
                      {disbursementData.account}
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table
                  columns={columns}
                  data={disbursementData.invoices}
                  emptyComponent={
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-8 text-center"
                      >
                        <div className="text-gray-500">
                          <p className="font-medium">Tidak Ada Data Invoice</p>
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
                  totalPages={Math.ceil(
                    disbursementData.invoices.length / perPage
                  )}
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
                Ringkasan Pencairan
              </h3>

              <div className="space-y-4">
                {/* Gross Income */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    Pendapatan Kotor
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Nominal Pendapatan
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(disbursementData.summary.grossIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Admin Layanan
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        -{formatCurrency(disbursementData.summary.adminFee)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Other Costs */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    Biaya Lainnya
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">DPP</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(disbursementData.summary.dpp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PPN 12%</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(disbursementData.summary.ppn)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PPH 2%</span>
                      <span className="text-sm font-medium text-red-600">
                        -{formatCurrency(disbursementData.summary.pph)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(calculateTotal())}
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
