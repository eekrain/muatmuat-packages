"use client";

import { useRouter } from "next/navigation";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card, { CardContent } from "@/components/Card/Card";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function DetailPendapatanPage({ params }) {
  const router = useRouter();
  const { id } = params;

  // Mock data - in real app this would come from API
  const incomeData = {
    id: id,
    orderCode: "INV/MTR/210504/001/AAA",
    source: "Penyesuaian Pendapatan",
    status: "Belum Dicairkan",
    statusType: "not_disbursed",
    initialAmount: 7500000,
    disbursements: [
      {
        id: 1,
        disbursementDate: "24 Sep 2024 12:00 WIB",
        disbursedAmount: 3750000,
        remainingAmount: 3750000,
      },
      {
        id: 2,
        disbursementDate: "24 Okt 2024 12:00 WIB",
        disbursedAmount: 1750000,
        remainingAmount: 2000000,
      },
      {
        id: 3,
        disbursementDate: "24 Nov 2024 12:00 WIB",
        disbursedAmount: 2000000,
        remainingAmount: 0,
      },
    ],
  };

  const columns = [
    {
      header: "No.",
      key: "no",
      width: "80px",
      render: (row, index) => index + 1,
    },
    {
      header: "Tanggal Pencairan",
      key: "disbursementDate",
      width: "200px",
      render: (row) => row.disbursementDate || "Belum Dicairkan",
    },
    {
      header: "Jumlah Dana Dicairkan",
      key: "disbursedAmount",
      width: "200px",
      render: (row) => row.disbursedAmount || "Belum Dicairkan",
    },
    {
      header: "Sisa Dana Belum Dicairkan",
      key: "remainingAmount",
      width: "200px",
      render: (row) => row.remainingAmount || "Belum Dicairkan",
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

  return (
    <div className="mt-8">
      {/* Breadcrumb */}
      <BreadCrumb
        data={[
          { name: "Laporan Pendapatan", href: "/laporan/pendapatan" },
          { name: "Detail Pendapatan" },
        ]}
      />

      {/* Page Header */}
      <PageTitle className="mt-4" withBack={true} onClick={handleBack}>
        Detail Pendapatan
      </PageTitle>

      {/* Income Details Card */}
      <Card className="mb-6 rounded-xl border-none">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-52 text-sm font-medium text-gray-600">
                Kode Pesanan
              </label>
              <p className="font-medium text-blue-600">
                {incomeData.orderCode}
              </p>
            </div>
            <div className="flex items-center">
              <label className="w-52 text-sm font-medium text-gray-600">
                Sumber
              </label>
              <p className="text-gray-900">{incomeData.source}</p>
            </div>
            <div className="flex items-center">
              <label className="w-52 text-sm font-medium text-gray-600">
                Status
              </label>
              <BadgeStatus variant="error" className="w-fit">
                {incomeData.status}
              </BadgeStatus>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Disbursement Details Card */}
      <Card className="border-none">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Rincian Pendapatan
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-52 text-sm font-medium text-gray-600">
                  Nilai Awal Pendapatan
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(incomeData.initialAmount)}
                </p>
              </div>
              <div className="flex items-start">
                <label className="w-52 pt-2 text-sm font-medium text-gray-600">
                  Rincian
                </label>
                <div className="flex-1">
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F8F8FB]">
                          <th className="w-2 px-4 py-3 text-left text-sm font-semibold text-[#7B7B7B]">
                            No.
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#7B7B7B]">
                            Tanggal Pencairan
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-[#7B7B7B]">
                            Jumlah Dana Dicairkan
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-[#7B7B7B]">
                            Sisa Dana Belum Dicairkan
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {incomeData.disbursements.length > 0 ? (
                          incomeData.disbursements.map((item, index) => (
                            <tr
                              key={item.id}
                              className={
                                index < incomeData.disbursements.length - 1
                                  ? "border-b border-gray-100"
                                  : ""
                              }
                            >
                              <td className="px-4 py-5 text-center text-xs text-gray-900">
                                {item.id}
                              </td>
                              <td className="px-4 py-5 text-sm text-gray-900">
                                {item.disbursementDate}
                              </td>
                              <td className="px-4 py-5 text-right text-sm text-gray-900">
                                {formatCurrency(item.disbursedAmount)}
                              </td>
                              <td className="px-4 py-5 text-right text-sm text-gray-900">
                                {formatCurrency(item.remainingAmount)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-8 text-center text-gray-700"
                            >
                              Belum Dicairkan
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
