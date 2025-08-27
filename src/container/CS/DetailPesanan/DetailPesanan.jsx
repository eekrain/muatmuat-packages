import { useParams } from "next/navigation";
import { useState } from "react";

import { useGetOrderDetailCS } from "@/services/CS/monitoring/detail-pesanan-cs/getOrderDetailCS";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import {
  Tabs,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";

import DetailPesananHeader from "@/container/CS/DetailPesanan/DetailPesananHeader/DetailPesananHeader";

import { useTranslation } from "@/hooks/use-translation";

import { TabLacakArmada } from "./TabLacakArmada/TabLacakArmada";
import { TabRingkasanPesanan } from "./TabRingkasanPesanan/TabRingkasanPesanan";
import { TabRiwayatAktivitas } from "./TabRiwayatAktivitas/TabRiwayatAktivitas";
import { TabStatusDokumen } from "./TabStatusDokumen/TabStatusDokumen";

const DetailPesanan = ({ breadcrumbData }) => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("riwayat-aktivitas");
  const { t } = useTranslation();

  const { data: dataDetailPesanan } = useGetOrderDetailCS(params.orderId);

  const tabItems = [
    {
      value: "ringkasan-pesanan",
      label: t("DetailPesanan.tabRingkasanPesanan", {}, "Ringkasan Pesanan"),
    },
    {
      value: "lacak-armada",
      label: (
        <div className="flex items-center gap-x-1">
          <span>{t("DetailPesanan.tabLacakArmada", {}, "Lacak Armada")}</span>
          {dataDetailPesanan?.orderDetail?.totalAssignedTruck > 0 && (
            <span>
              ({dataDetailPesanan?.orderDetail?.totalAssignedTruck || 0})
            </span>
          )}
          {dataDetailPesanan?.orderDetail?.hasSos && (
            <div className="inline-flex h-[14px] items-center rounded bg-error-400 p-1 text-[8px] font-bold text-neutral-50">
              {t("DetailPesanan.badgeSos", {}, "SOS")}
            </div>
          )}
        </div>
      ),
    },
    {
      value: "status-dokumen",
      label: "Status Dokumen",
    },
    {
      value: "ringkasan-transaksi",
      label: t(
        "DetailPesanan.tabRingkasanTransaksi",
        {},
        "Ringkasan Transaksi"
      ),
    },
    {
      value: "riwayat-aktivitas",
      label: t("DetailPesanan.tabRiwayatAktivitas", {}, "Riwayat Aktivitas"),
    },
  ];

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-y-4 py-6">
      <BreadCrumb data={breadcrumbData} maxWidth={111} />
      <DetailPesananHeader data={dataDetailPesanan} />
      <Tabs
        className="flex flex-col gap-y-4"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-fit justify-start">
          {tabItems.map((tabItem, key) => (
            <TabsTriggerWithSeparator
              key={key}
              value={tabItem.value}
              activeColor="primary-700"
              className="px-6 !text-base text-neutral-900"
              showSeparator={key !== tabItems.length - 1}
            >
              <span className="whitespace-nowrap">{tabItem.label}</span>
            </TabsTriggerWithSeparator>
          ))}
        </TabsList>

        <TabRingkasanPesanan data={dataDetailPesanan} />
        <TabLacakArmada />
        <TabStatusDokumen orderId={params.orderId} />
        <TabRiwayatAktivitas />
      </Tabs>
    </div>
  );
};

export default DetailPesanan;
