import { useRouter } from "next/navigation";
import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";

import RingkasanPesanan from "@/container/CS/DetailTambahanBiaya/RingaksanPesanan/RingkasanPesanan";
import RiwayatHubungiTable from "@/container/CS/DetailTambahanBiaya/RiwayatHubungi/RiwayatHubungiTable";

const DetailTambahanBiaya = ({ breadcrumbData, report = {} }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("ringkasan-pesanan");

  // Extract data from report prop with fallbacks
  const {
    order = {},
    shipper = {},
    transporters = [],
    contact_summary = {},
    cost_breakdown = {},
    payment_deadline = null,
  } = report;

  const tabItems = [
    {
      value: "ringkasan-pesanan",
      label: "Ringkasan Pesanan",
    },
    {
      value: "riwayat-hubungi",
      label: "Riwayat Hubungi",
    },
  ];

  return (
    <div className="mx-auto flex max-w-[1232px] flex-col gap-y-4 py-6">
      <BreadCrumb data={breadcrumbData} />
      <div className="flex items-center gap-x-3">
        <IconComponent
          onClick={() => router.back()}
          src="/icons/arrow-left24.svg"
          size="medium"
          className="text-primary-700"
        />
        <h1 className="text-xl font-bold text-neutral-900">
          Detail Tambahan Biaya
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
            contactSummary={contact_summary}
            order={order}
            shipper={shipper}
            transporters={transporters}
            costBreakdown={cost_breakdown}
            paymentDeadline={payment_deadline}
          />
        </TabsContent>

        <TabsContent value="riwayat-hubungi">
          <RiwayatHubungiTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailTambahanBiaya;
