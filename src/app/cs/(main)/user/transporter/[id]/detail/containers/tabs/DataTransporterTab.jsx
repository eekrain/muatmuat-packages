"use client";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { TabsContent } from "@/components/Tabs/Tabs";

const EmptyTabContent = ({ title, subtitle }) => (
  <div className="p-6">
    <div className="flex h-[280px] w-full flex-col items-center justify-center rounded-xl bg-white shadow-muat">
      <DataNotFound type="data" title={title} subtitle={subtitle} />
    </div>
  </div>
);

const DataTransporterTab = () => {
  return (
    <TabsContent value="data-transporter" className="">
      <EmptyTabContent
        title="Belum Ada Data"
        subtitle="Data transporter belum tersedia"
      />
    </TabsContent>
  );
};

export default DataTransporterTab;
