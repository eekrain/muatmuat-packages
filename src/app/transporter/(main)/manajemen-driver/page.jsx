"use client";

import { useRouter } from "next/navigation";

import { Download, Plus } from "lucide-react";

import Button from "@/components/Button/Button";
import PageTitle from "@/components/PageTitle/PageTitle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import DriverAktif from "@/container/Transporter/Driver/DriverAktif";
import DriverArsip from "@/container/Transporter/Driver/DriverArsip";
import DriverNonaktif from "@/container/Transporter/Driver/DriverNonaktif";
import DriverProses from "@/container/Transporter/Driver/DriverProses";
import EmptyDriver from "@/container/Transporter/Driver/EmptyDriver";
import { useGetDriversCount } from "@/services/Transporter/manajemen-driver/getDriversCount";

const Page = () => {
  const router = useRouter();
  const { data: count } = useGetDriversCount();

  const isEmpty =
    count?.active === 0 &&
    count?.nonActive === 0 &&
    count?.registrationProcess === 0 &&
    count?.archive === 0;

  if (isEmpty) {
    return <EmptyDriver />;
  }
  return (
    <div className="my-6 max-h-screen w-full space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle withBack={false}>Manajemen Driver</PageTitle>
        <div className="flex gap-3">
          <Button
            variant="muattrans-primary-secondary"
            iconLeft={<Plus size={16} />}
            onClick={() => {}}
          >
            <span className="pt-0.5">{"Tambah Driver Massal"}</span>
          </Button>
          <Button
            iconLeft={<Plus size={16} />}
            onClick={() => router.push("/manajemen-driver/tambah")}
          >
            <span className="pt-0.5">{"Tambah Driver"}</span>
          </Button>
          <Button iconLeft={<Download size={16} />} onClick={() => {}}>
            <span className="pt-0.5">{"Unduh"}</span>
          </Button>
        </div>
      </div>

      <Tabs className="w-full" defaultValue="aktif">
        <TabsList className="w-8/12">
          <TabsTriggerWithSeparator value="aktif" activeColor="primary-700">
            Driver Aktif {count?.active ? `(${count.active})` : ""}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator value="nonaktif" activeColor="primary-700">
            Driver Nonaktif {count?.nonActive ? `(${count.nonActive})` : ""}
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
          <DriverAktif count={count?.active || 0} />
        </TabsContent>
        <TabsContent value="nonaktif" className="pt-4">
          <DriverNonaktif count={count?.nonActive || 0} />
        </TabsContent>
        <TabsContent value="proses" className="pt-4">
          <DriverProses count={count?.registrationProcess || 0} />
        </TabsContent>
        <TabsContent value="arsip" className="pt-4">
          <DriverArsip count={count?.archive || 0} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Page;
