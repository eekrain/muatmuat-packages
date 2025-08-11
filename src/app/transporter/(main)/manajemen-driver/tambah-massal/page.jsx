"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import PageTitle from "@/components/PageTitle/PageTitle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";
import { useGetDriversDraftStatus } from "@/services/Transporter/manajemen-driver/getDriversDraftStatus";

import PopUpInformasi from "./components/PopUpInformasi";
import Draft from "./components/Tabs/Draft/Draft";
import TambahDriverMassal from "./components/Tabs/TambahDriverMassal/TambahDriverMassal";
import TambahExcel from "./components/Tabs/TambahExcel/TambahExcel";

export default function TambahMassal() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data } = useGetDriversDraftStatus("/v1/drivers/draft/status");
  const tab = searchParams.get("tab") || "tambah_armada_excel";

  const [activeTab, setActiveTab] = useState(tab);

  // Function to clear tab parameter from URL
  const clearTabParam = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("tab");

    const newUrl = currentParams.toString()
      ? `${window.location.pathname}?${currentParams.toString()}`
      : window.location.pathname;

    router.replace(newUrl);
  };

  useEffect(() => {
    if (tab) {
      clearTabParam();
    }
  }, [tab]);
  return (
    <div className="my-6 max-h-screen w-full space-y-4 px-6 pb-20">
      {/* Header  */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PageTitle className="mb-0" withBack={false}>
            {t(
              "TambahMassalScreen.titleTambahDriverMassal",
              {},
              "Tambah Driver Massal"
            )}
          </PageTitle>
          <PopUpInformasi />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        defaultValue="tambah_armada_excel"
      >
        <TabsList className="w-8/12">
          <TabsTriggerWithSeparator
            value="tambah_armada_excel"
            activeColor="primary-700"
          >
            {t(
              "TambahMassalScreen.tabTambahDriverDenganExcel",
              {},
              "Tambah Driver Dengan Excel"
            )}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="tambah_driver_massal"
            activeColor="primary-700"
          >
            {t(
              "TambahMassalScreen.tabTambahDriverMassal",
              {},
              "Tambah Driver Massal"
            )}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="draft"
            activeColor="primary-700"
            showSeparator={false}
          >
            {t("TambahMassalScreen.tabDraft", {}, "Draft")}
          </TabsTriggerWithSeparator>
        </TabsList>

        <TabsContent value="tambah_armada_excel" className="pt-4">
          <TambahExcel />
        </TabsContent>
        <TabsContent value="tambah_driver_massal" className="pt-4">
          <TambahDriverMassal isDraftAvailable={data?.Data?.hasDraft} />
        </TabsContent>
        <TabsContent value="draft" className="pt-4">
          <Draft isDraftAvailable={data?.Data?.hasDraft} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
