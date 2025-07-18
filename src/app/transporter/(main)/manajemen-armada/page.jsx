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
import ArmadaAktif from "@/container/Transporter/Armada/ArmadaAktif";
import ArmadaArsip from "@/container/Transporter/Armada/ArmadaArsip";
import ArmadaNonaktif from "@/container/Transporter/Armada/ArmadaNonaktif";
import ArmadaProses from "@/container/Transporter/Armada/ArmadaProses";
import EmptyArmada from "@/container/Transporter/Armada/EmptyArmada";
import { useGetActiveVehiclesData } from "@/services/Transporter/manajemen-armada/getActiveVehiclesData";
import { useGetArchivedVehiclesData } from "@/services/Transporter/manajemen-armada/getArchivedVehiclesData";
import { useGetInactiveVehiclesData } from "@/services/Transporter/manajemen-armada/getInactiveVehiclesData";
import { useGetProcessVehiclesData } from "@/services/Transporter/manajemen-armada/getProcessVehiclesData";
import { useGetVehiclesCount } from "@/services/Transporter/manajemen-armada/getVehiclesCount";

const Page = () => {
  const router = useRouter();
  const { data: count } = useGetVehiclesCount();
  const { data: dataAktif } = useGetActiveVehiclesData();
  const { data: dataNonaktif } = useGetInactiveVehiclesData();
  const { data: dataProses } = useGetProcessVehiclesData();
  const { data: dataArsip } = useGetArchivedVehiclesData();

  const isEmpty =
    count?.active === 0 &&
    count?.nonActive === 0 &&
    count?.registrationProcess === 0 &&
    count?.archive === 0;

  if (isEmpty) {
    return <EmptyArmada />;
  }
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
        <TabsList className="w-8/12">
          <TabsTriggerWithSeparator value="aktif" activeColor="primary-700">
            Armada Aktif {count?.active ? `(${count.active})` : ""}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator value="nonaktif" activeColor="primary-700">
            Armada Nonaktif {count?.nonActive ? `(${count.nonActive})` : ""}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator value="proses" activeColor="primary-700">
            Proses Pendaftaran{" "}
            {count?.registrationProcess ? `(${count.registrationProcess})` : ""}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="arsip"
            showSeparator={false}
            activeColor="primary-700"
          >
            Arsip {count?.archive ? `(${count.archive})` : ""}
          </TabsTriggerWithSeparator>
        </TabsList>

        <TabsContent value="aktif" className="pt-4">
          <ArmadaAktif data={dataAktif} />
        </TabsContent>
        <TabsContent value="nonaktif" className="pt-4">
          <ArmadaNonaktif data={dataNonaktif} />
        </TabsContent>
        <TabsContent value="proses" className="pt-4">
          <ArmadaProses data={dataProses} />
        </TabsContent>
        <TabsContent value="arsip" className="pt-4">
          <ArmadaArsip data={dataArsip} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Page;
