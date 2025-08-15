"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import PageTitle from "@/components/PageTitle/PageTitle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";
import { useGetFleetsDraftCheck } from "@/services/Transporter/manajemen-armada/getFleetsDraftCheck";
import { useGetUserPopupPreference } from "@/services/Transporter/manajemen-armada/getUserPopupPreference";

import PopUpInformasi from "./components/PopUpInformasi";
import Draft from "./components/Tabs/Draft/Draft";
import TambahArmadaMassal from "./components/Tabs/TambahArmadaMassal/TambahArmadaMassal";
import TambahExcel from "./components/Tabs/TambahExcel/TambahExcel";

export default function TambahMassal() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useGetFleetsDraftCheck("/v1/fleet/drafts/check");
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "tambah_armada_excel";

  const [activeTab, setActiveTab] = useState(tab);

  // Get user popup preference in parent component
  const {
    data: popupPreference,
    isLoading: isPopupLoading,
    error: popupError,
    mutate: mutatePopupPreference,
  } = useGetUserPopupPreference();

  // Function to clear tab parameter from URL
  const clearTabParam = useCallback(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("tab");

    const newUrl = currentParams.toString()
      ? `${window.location.pathname}?${currentParams.toString()}`
      : window.location.pathname;

    router.replace(newUrl);
  }, [searchParams, router]);

  useEffect(() => {
    if (tab) {
      clearTabParam();
    }
  }, [tab, clearTabParam]);

  return (
    <div className="my-6 max-h-screen w-full space-y-4 px-6 pb-20">
      {/* Header  */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PageTitle className="mb-0" withBack={false}>
            {t(
              "TambahMassal.titleTambahArmadaMassal",
              {},
              "Tambah Armada Massal"
            )}
          </PageTitle>
          <PopUpInformasi
            popupPreference={popupPreference}
            isLoading={isPopupLoading}
            error={popupError}
            mutatePopupPreference={mutatePopupPreference}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
        }}
        className="w-full"
        defaultValue="tambah_armada_excel"
      >
        <TabsList className="w-8/12">
          <TabsTriggerWithSeparator
            value="tambah_armada_excel"
            activeColor="primary-700"
          >
            {t(
              "TambahMassal.tabTambahArmadaDenganExcel",
              {},
              "Tambah Armada Dengan Excel"
            )}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="tambah_armada_massal"
            activeColor="primary-700"
          >
            {t(
              "TambahMassal.tabTambahArmadaMassal",
              {},
              "Tambah Armada Massal"
            )}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="draft"
            activeColor="primary-700"
            showSeparator={false}
          >
            {t("TambahMassal.tabDraft", {}, "Draft")}
          </TabsTriggerWithSeparator>
        </TabsList>

        <TabsContent value="tambah_armada_excel" className="pt-4">
          <TambahExcel />
        </TabsContent>
        <TabsContent value="tambah_armada_massal" className="pt-4">
          <TambahArmadaMassal
            isDraftAvailable={data?.Data?.hasExistingDrafts}
          />
        </TabsContent>
        <TabsContent value="draft" className="pt-4">
          <Draft isDraftAvailable={data?.Data?.hasExistingDrafts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
