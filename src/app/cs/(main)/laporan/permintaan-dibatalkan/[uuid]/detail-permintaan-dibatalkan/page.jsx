"use client";

import { useParams } from "next/navigation";

import DetailLaporanPermintaanDibatalkan from "@/container/CS/LaporanPermintaanDibatalkan/DetailLaporanPermintaanDibatalkan";
import useDevice from "@/hooks/use-device";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";
import { useGetCanceledOrderDetail } from "@/services/CS/laporan/permintaan-dibatalkan/detail-permintaan-dibatalkan/getCanceledOrdersDetail";

const Page = () => {
  const { mounted } = useDevice();
  const { t } = useTranslation();

  const params = useParams();
  const { data: detail = {} } = useGetCanceledOrderDetail(params.uuid);

  const breadcrumbData = useShallowMemo(
    () => [
      {
        name: t(
          "DetailLaporanPermintaanDibatalkan.breadcrumbReportTitle",
          {},
          "Laporan Permintaan Dibatalkan"
        ),
        href: "/laporan/permintaan-dibatalkan",
      },
      {
        name: t(
          "DetailLaporanPermintaanDibatalkan.breadcrumbOrderDetail",
          {},
          "Detail Pesanan"
        ),
      },
    ],
    [detail?.order?.status, t]
  );

  if (!mounted) return null;

  return (
    <DetailLaporanPermintaanDibatalkan
      breadcrumbData={breadcrumbData}
      detail={detail}
    />
  );
};

export default Page;
