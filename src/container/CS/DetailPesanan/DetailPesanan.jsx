import { useParams } from "next/navigation";
import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import DetailPesananHeader from "@/container/CS/DetailPesanan/DetailPesananHeader/DetailPesananHeader";
import RingkasanPesanan from "@/container/CS/DetailPesanan/RingkasanPesanan/RingkasanPesanan";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useGetOrderDetail } from "@/services/Transporter/daftar-pesanan/detail-pesanan/getOrderDetail";

import { LacakArmadaCard } from "./LacakArmada/LacakArmadaCard";

const DetailPesanan = ({ breadcrumbData }) => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("ringkasan-pesanan");

  const { data: dataOrderDetail } = useGetOrderDetail(params.uuid);

  const tabItems = useShallowMemo(() => {
    return [
      {
        value: "ringkasan-pesanan",
        label: "Ringkasan Pesanan",
      },
      {
        value: "lacak-armada",
        label: (
          <div className="flex items-center gap-x-1">
            <span>Lacak Armada</span>
            {true && <span>(1)</span>}
            {false && (
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
        value: "riwayat-perubahan",
        label: "Riwayat Aktivitas",
      },
    ];
  }, []);

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-y-4 py-6">
      <BreadCrumb data={breadcrumbData} maxWidth={111} />
      <DetailPesananHeader dataOrderDetail={dataOrderDetail} />
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
        <TabsContent
          className="flex flex-col gap-y-4"
          value="ringkasan-pesanan"
        >
          <RingkasanPesanan dataOrderDetail={dataOrderDetail} />
        </TabsContent>

        <TabsContent className="flex flex-col gap-y-4" value="lacak-armada">
          <LacakArmadaCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailPesanan;
