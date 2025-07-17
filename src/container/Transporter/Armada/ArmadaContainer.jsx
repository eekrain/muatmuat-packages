"use client";

import { useRouter } from "next/navigation";

import { Download, Plus } from "lucide-react";

import Button from "@/components/Button/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";

import ArmadaAktif from "./ArmadaAktif";

const ArmadaContainer = ({ data }) => {
  const router = useRouter();

  return (
    <div className="max-h-screen w-full space-y-4 py-6">
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
          <Button
            iconLeft={<Plus size={16} />}
            onClick={() => router.push("/manajemen-armada/tambah")}
          >
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

        <TabsContent value="aktif" className={"pt-4"}>
          <ArmadaAktif data={data} />
        </TabsContent>
        <TabsContent value="nonaktif">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-neutral-500">Armada nonaktif content</p>
          </div>
        </TabsContent>
        <TabsContent value="proses">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-neutral-500">Proses pendaftaran content</p>
          </div>
        </TabsContent>
        <TabsContent value="arsip">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-neutral-500">Arsip content</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ArmadaContainer;
