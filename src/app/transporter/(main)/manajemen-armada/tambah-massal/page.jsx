"use client";

import PageTitle from "@/components/PageTitle/PageTitle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { useGetFleetsDraftCheck } from "@/services/Transporter/manajemen-armada/getFleetsDraftCheck";

import PopUpInformasi from "./components/PopUpInformasi";
import Draft from "./components/Tabs/Draft/Draft";
import TambahArmadaMassal from "./components/Tabs/TambahArmadaMassal/TambahArmadaMassal";
import TambahExcel from "./components/Tabs/TambahExcel/TambahExcel";

export default function TambahMassal() {
  const { data } = useGetFleetsDraftCheck("/v1/fleet/drafts/check");
  return (
    <div className="my-6 max-h-screen w-full space-y-4 px-6 pb-20">
      {/* Header  */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PageTitle className="mb-0" withBack={false}>
            Tambah Armada Massal
          </PageTitle>
          <PopUpInformasi />
        </div>
      </div>

      {/* Tabs */}
      <Tabs className="w-full" defaultValue="tambah_armada_excel">
        <TabsList className="w-8/12">
          <TabsTriggerWithSeparator
            value="tambah_armada_excel"
            activeColor="primary-700"
          >
            Tambah Armada Dengan Excel
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="tambah_armada_massal"
            activeColor="primary-700"
          >
            Tambah Armada Massal
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="draft"
            activeColor="primary-700"
            showSeparator={false}
          >
            Draft
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
