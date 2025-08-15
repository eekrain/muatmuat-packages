"use client";

import { useParams, useRouter } from "next/navigation";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card, { CardContent } from "@/components/Card/Card";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useTranslation } from "@/hooks/use-translation";
import { useGetRevenueReportDetailById } from "@/services/Transporter/laporan/pendapatan/getRevenueDetail";

export default function DetailPendapatanPage({ params }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useParams();

  const selectedTransporterId = "550e8400-e29b-41d4-a716-446655440002";

  const { data: revenueDetail, isLoading } = useGetRevenueReportDetailById(id, {
    transporter_id: selectedTransporterId,
  });

  const handleBack = () => {
    router.back();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="mt-8">
      {/* Breadcrumb */}
      <BreadCrumb
        data={[
          {
            name: t(
              "DetailPendapatanPage.breadcrumbLaporanPendapatan",
              {},
              "Laporan Pendapatan"
            ),
            href: "/laporan/pendapatan",
          },
          {
            name: t(
              "DetailPendapatanPage.breadcrumbDetailPendapatan",
              {},
              "Detail Pendapatan"
            ),
          },
        ]}
      />

      {/* Page Header */}
      <PageTitle className="mt-4" withBack={true} onClick={handleBack}>
        {t(
          "DetailPendapatanPage.titleDetailPendapatan",
          {},
          "Detail Pendapatan"
        )}
      </PageTitle>

      {/* Income Details Card */}
      <Card className="mb-6 rounded-xl border-none">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-52 text-sm font-medium text-gray-600">
                {t("DetailPendapatanPage.labelOrderCode", {}, "Kode Pesanan")}
              </label>
              <p className="font-medium text-blue-600">
                {revenueDetail?.reportInfo?.orderCode || "-"}
              </p>
            </div>
            <div className="flex items-center">
              <label className="w-52 text-sm font-medium text-gray-600">
                {t("DetailPendapatanPage.labelSource", {}, "Sumber")}
              </label>
              <p className="text-gray-900">
                {revenueDetail?.reportInfo?.sourceName || "-"}
              </p>
            </div>
            <div className="flex items-center">
              <label className="w-52 text-sm font-medium text-gray-600">
                {t("DetailPendapatanPage.labelStatus", {}, "Status")}
              </label>
              <BadgeStatus
                variant={
                  revenueDetail?.reportInfo?.statusBadge?.color || "default"
                }
                className="w-fit"
              >
                {revenueDetail?.reportInfo?.statusBadge?.text || "-"}
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
              {t(
                "DetailPendapatanPage.titleIncomeDetails",
                {},
                "Rincian Pendapatan"
              )}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-52 text-sm font-medium text-gray-600">
                  {t(
                    "DetailPendapatanPage.labelInitialIncomeValue",
                    {},
                    "Nilai Awal Pendapatan"
                  )}
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(
                    revenueDetail?.revenueDetails?.initialRevenue?.amount
                  )}
                </p>
              </div>
              <div className="flex items-start">
                <label className="w-52 pt-2 text-sm font-medium text-gray-600">
                  {t("DetailPendapatanPage.labelDetails", {}, "Rincian")}
                </label>
                <div className="flex-1">
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F8F8FB]">
                          <th className="w-2 px-4 py-3 text-left text-sm font-semibold text-[#7B7B7B]">
                            {t(
                              "DetailPendapatanPage.tableColumnNumber",
                              {},
                              "No."
                            )}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#7B7B7B]">
                            {t(
                              "DetailPendapatanPage.tableColumnDisbursementDate",
                              {},
                              "Tanggal Pencairan"
                            )}
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-[#7B7B7B]">
                            {t(
                              "DetailPendapatanPage.tableColumnDisbursedAmount",
                              {},
                              "Jumlah Dana Dicairkan"
                            )}
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-[#7B7B7B]">
                            {t(
                              "DetailPendapatanPage.tableColumnRemainingAmount",
                              {},
                              "Sisa Dana Belum Dicairkan"
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueDetail?.disbursementHistory?.length > 0 ? (
                          revenueDetail.disbursementHistory.map(
                            (item, index) => (
                              <tr
                                key={item?.reference || index}
                                className={
                                  index <
                                  revenueDetail.disbursementHistory.length - 1
                                    ? "border-b border-gray-100"
                                    : ""
                                }
                              >
                                <td className="px-4 py-5 text-center text-xs text-gray-900">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-5 text-sm text-gray-900">
                                  {item?.disbursementDateFormatted || "-"}
                                </td>
                                <td className="px-4 py-5 text-right text-sm text-gray-900">
                                  {formatCurrency(item?.disbursedAmount)}
                                </td>
                                <td className="px-4 py-5 text-right text-sm text-gray-900">
                                  {formatCurrency(item?.remainingAfter)}
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-8 text-center text-gray-700"
                            >
                              {t(
                                "DetailPendapatanPage.statusNotDisbursed",
                                {},
                                "Belum Dicairkan"
                              )}
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
