import { useRouter } from "next/navigation";
import { useState } from "react";

// import { TimelineContainer, TimelineContentAddress, TimelineItem } from '@/components/Timeline';

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";

import RingkasanPesanan from "./RingaksanPesanan/RingkasanPesanan";
import { TabRiwayatAktivitas } from "./RiwayatAktivitas/TabRiwayatAktivitas";

const DetailLaporanPermintaanDibatalkan = ({ breadcrumbData, detail = {} }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("ringkasan-pesanan");

  // Extract data from detail prop with fallbacks
  const { order = {}, shipper = {}, orderSummary = {} } = detail;

  const tabItems = [
    {
      value: "ringkasan-pesanan",
      label: t(
        "DetailLaporanPermintaanDibatalkan.tabRingkasanPesanan",
        {},
        "Ringkasan Pesanan"
      ),
    },
    {
      value: "riwayat-aktivitas",
      label: t(
        "DetailLaporanPermintaanDibatalkan.tabRiwayatAktivitas",
        {},
        "Riwayat Aktivitas"
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-y-4 py-6">
      <BreadCrumb data={breadcrumbData} />
      <div className="flex items-center gap-x-3">
        <IconComponent
          onClick={() => router.back()}
          src="/icons/arrow-left24.svg"
          size="medium"
          className="text-primary-700"
        />
        <h1 className="text-xl font-bold text-neutral-900">
          {t(
            "DetailLaporanPermintaanDibatalkan.titleDetailPesanan",
            {},
            "Detail Pesanan"
          )}
        </h1>
      </div>

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

        <TabsContent value="ringkasan-pesanan">
          <RingkasanPesanan
            order={order}
            shipper={shipper}
            orderSummary={orderSummary}
          />
        </TabsContent>

        <TabsContent value="riwayat-aktivitas">
          <div className="mt-6 text-center">
            <TabRiwayatAktivitas orderSummary={orderSummary} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailLaporanPermintaanDibatalkan;
