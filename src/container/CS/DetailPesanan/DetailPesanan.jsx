import { useParams } from "next/navigation";
import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import {
  Tabs,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import DetailPesananHeader from "@/container/CS/DetailPesanan/DetailPesananHeader/DetailPesananHeader";
import { useGetOrderDetailCS } from "@/services/CS/monitoring/detail-pesanan-cs/getOrderDetailCS";

import { TabLacakArmada } from "./TabLacakArmada/TabLacakArmada";
import { TabRingkasanPesanan } from "./TabRingkasanPesanan/TabRingkasanPesanan";
import { TabRiwayatAktivitas } from "./TabRiwayatAktivitas/TabRiwayatAktivitas";

const DetailPesanan = ({ breadcrumbData }) => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("lacak-armada");

  const { data: dataDetailPesanan } = useGetOrderDetailCS(params.orderId);

  const tabItems = [
    {
      value: "ringkasan-pesanan",
      label: "Ringkasan Pesanan",
    },
    {
      value: "lacak-armada",
      label: (
        <div className="flex items-center gap-x-1">
          <span>Lacak Armada</span>
          {dataDetailPesanan?.orderDetail?.totalAssignedTruck > 0 && (
            <span>
              ({dataDetailPesanan?.orderDetail?.totalAssignedTruck || 0})
            </span>
          )}
          {dataDetailPesanan?.orderDetail?.hasSos && (
            <div className="inline-flex h-[14px] items-center rounded bg-error-400 p-1 text-[8px] font-bold text-neutral-50">
              SOS
            </div>
          )}
        </div>
      ),
    },
    {
      value: "ringkasan-transaksi",
      label: "Ringkasan Transaksi",
    },
    {
      value: "riwayat-aktivitas",
      label: "Riwayat Aktivitas",
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
        <TabRiwayatAktivitas />
      </Tabs>
    </div>
  );
};

export default DetailPesanan;
