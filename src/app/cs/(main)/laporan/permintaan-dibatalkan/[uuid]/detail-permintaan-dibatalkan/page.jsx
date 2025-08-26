"use client";

import { useParams } from "next/navigation";

import DetailLaporanPermintaanDibatalkan from "@/container/CS/LaporanPermintaanDibatalkan/DetailLaporanPermintaanDibatalkan";
import useDevice from "@/hooks/use-device";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useGetCanceledOrderDetail } from "@/services/CS/laporan/permintaan-dibatalkan/detail-permintaan-dibatalkan/getCanceledOrdersDetail";

const Page = () => {
  const { mounted } = useDevice();

  const params = useParams();
  const { data: detail = {} } = useGetCanceledOrderDetail(params.uuid);

  const breadcrumbData = useShallowMemo(
    () => [
      {
        name: "Laporan Permintaan Dibatalkan",
        href: "/laporan/permintaan-dibatalkan",
      },

      { name: "Detail Pesanan" },
    ],
    [detail?.order?.status]
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
