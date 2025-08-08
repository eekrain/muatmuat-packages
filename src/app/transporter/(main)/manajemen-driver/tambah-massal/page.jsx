"use client";

import PageTitle from "@/components/PageTitle/PageTitle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { useGetDriversDraftStatus } from "@/services/Transporter/manajemen-driver/getDriversDraftStatus";

import PopUpInformasi from "./components/PopUpInformasi";
import Draft from "./components/Tabs/Draft/Draft";
import TambahDriverMassal from "./components/Tabs/TambahDriverMassal/TambahDriverMassal";
import TambahExcel from "./components/Tabs/TambahExcel/TambahExcel";

export default function TambahMassal() {
  const { data } = useGetDriversDraftStatus("/v1/drivers/draft/status");
  return (
    <div className="my-6 max-h-screen w-full space-y-4 px-6 pb-20">
      {/* Header  */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PageTitle className="mb-0" withBack={false}>
            Tambah Driver Massal
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
            Tambah Driver Dengan Excel
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="tambah_driver_massal"
            activeColor="primary-700"
          >
            Tambah Driver Massal
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
