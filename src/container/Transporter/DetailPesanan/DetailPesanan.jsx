import { useParams } from "next/navigation";
import { useState } from "react";

import { useGetFleetTracking } from "@/services/Transporter/daftar-pesanan/detail-pesanan/getFleetTracking";
import { useGetOrderDetail } from "@/services/Transporter/daftar-pesanan/detail-pesanan/getOrderDetail";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";

import DetailPesananHeader from "@/container/Transporter/DetailPesanan/DetailPesananHeader/DetailPesananHeader";
import LacakArmada from "@/container/Transporter/DetailPesanan/LacakArmada/LacakArmada";
import RingkasanPesanan from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPesanan";

import { useShallowMemo } from "@/hooks/use-shallow-memo";

import LabelLacakArmada from "./LacakArmada/components/LabelLacakArmada";
import RiwayatPerubahan from "./RiwayatPerubahan/RiwayatPerubahan";

const DetailPesanan = ({ breadcrumbData }) => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("ringkasan-pesanan");

  const { data: dataOrderDetail } = useGetOrderDetail(params.uuid);
  // Fetch fleet tracking data from API
  const { data: fleetTrackingData, error: fleetTrackingError } =
    useGetFleetTracking(params.uuid);
  const tabItems = useShallowMemo(() => {
    return [
      {
        value: "ringkasan-pesanan",
        label: "Ringkasan Pesanan",
      },
      {
        value: "lacak-armada",
        label: (
          <LabelLacakArmada
            fleetCount={fleetTrackingData?.fleetSummary?.totalFleet || 0}
            hasSOS={dataOrderDetail?.hasSOSAlert}
          />
        ),
      },
      {
        value: "riwayat-perubahan",
        label: "Riwayat Perubahan",
      },
    ];
  }, [fleetTrackingData?.totalFleet, dataOrderDetail?.hasSOSAlert]);

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-y-4 py-6">
      <BreadCrumb data={breadcrumbData} />
      <DetailPesananHeader
        dataOrderDetail={dataOrderDetail}
        activeTab={activeTab}
      />

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
          <LacakArmada
            dataOrderDetail={dataOrderDetail}
            onNavigateToRiwayat={() => setActiveTab("riwayat-perubahan")}
            fleetTrackingData={fleetTrackingData}
          />
        </TabsContent>
        <TabsContent
          className="flex flex-col gap-y-4"
          value="riwayat-perubahan"
        >
          <RiwayatPerubahan dataOrderDetail={dataOrderDetail} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailPesanan;
