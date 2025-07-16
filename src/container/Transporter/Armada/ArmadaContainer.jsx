"use client";

import { Download, Plus } from "lucide-react";

import Button from "@/components/Button/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";

const ArmadaContainer = ({ vehicles }) => {
  return (
    <div className="mx-auto max-w-[1232px] space-y-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manajemen Armada</h1>
        <div className="flex gap-3">
          <Button
            variant="muattrans-primary-secondary"
            iconLeft={<Plus size={16} />}
            onClick={() => {}}
          >
            <span className="pt-0.5">{"Tambah Armada Massal"}</span>
          </Button>
          <Button iconLeft={<Plus size={16} />} onClick={() => {}}>
            <span className="pt-0.5">{"Tambah Armada"}</span>
          </Button>
          <Button iconLeft={<Download size={16} />} onClick={() => {}}>
            <span className="pt-0.5">{"Unduh"}</span>
          </Button>
        </div>
      </div>

      <Tabs className="w-full" defaultValue="aktif">
        <TabsList className="w-7/12">
          <TabsTriggerWithSeparator value="aktif" activeColor="primary-700">
            Armada Aktif
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator value="nonaktif" activeColor="primary-700">
            Armada Nonaktif
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator value="proses" activeColor="primary-700">
            Proses Pendaftaran
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="arsip"
            showSeparator={false}
            activeColor="primary-700"
          >
            Arsip
          </TabsTriggerWithSeparator>
        </TabsList>

        <TabsContent value="aktif"></TabsContent>
        <TabsContent value="nonaktif"></TabsContent>
        <TabsContent value="proses"></TabsContent>
        <TabsContent value="arsip"></TabsContent>
      </Tabs>

      <pre>{JSON.stringify(vehicles, null, 2)}</pre>
    </div>
  );
};
export default ArmadaContainer;
