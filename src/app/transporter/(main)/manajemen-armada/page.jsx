"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Download, Plus } from "lucide-react";

import Button from "@/components/Button/Button";
import PageTitle from "@/components/PageTitle/PageTitle";
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
import { useGetVehiclesCount } from "@/services/Transporter/manajemen-armada/getVehiclesCount";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: count } = useGetVehiclesCount();

  // Map query param values to tab values
  const getTabValue = (queryValue) => {
    const tabMap = {
      active: "aktif",
      inactive: "nonaktif",
      process: "proses",
      archive: "arsip",
    };
    return tabMap[queryValue] || "aktif";
  };

  // Map tab values to query param values
  const getQueryValue = (tabValue) => {
    const queryMap = {
      aktif: "active",
      nonaktif: "inactive",
      proses: "process",
      arsip: "archive",
    };
    return queryMap[tabValue] || "active";
  };

  // Get initial tab value from query parameter
  const tabParam = searchParams.get("tab");
  const initialTab = getTabValue(tabParam);
  const [selectedTab, setSelectedTab] = useState(initialTab);

  // Update tab when query parameter changes
  useEffect(() => {
    const newTab = getTabValue(tabParam);
    setSelectedTab(newTab);
  }, [tabParam]);

  // Handle tab change
  const handleTabChange = (value) => {
    setSelectedTab(value);
    const queryValue = getQueryValue(value);
    router.push(`/manajemen-armada?tab=${queryValue}`);
  };

  const isEmpty =
    count?.active === 0 &&
    count?.nonActive === 0 &&
    count?.registrationProcess === 0 &&
    count?.archive === 0;

  if (isEmpty) {
    return <EmptyArmada />;
  }
  return (
    <div className="my-6 max-h-screen w-full space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle withBack={false}>Manajemen Armada</PageTitle>
        <div className="flex gap-3">
          <Link href="/manajemen-armada/tambah-massal">
            <Button
              variant="muattrans-primary-secondary"
              iconLeft={<Plus size={16} />}
            >
              <span className="pt-0.5">{"Tambah Armada Massal"}</span>
            </Button>
          </Link>
          <Link href="/manajemen-armada/tambah">
            <Button iconLeft={<Plus size={16} />}>
              <span className="pt-0.5">{"Tambah Armada"}</span>
            </Button>
          </Link>
          <Button iconLeft={<Download size={16} />} onClick={() => {}}>
            <span className="pt-0.5">{"Unduh"}</span>
          </Button>
        </div>
      </div>

      <Tabs
        className="w-full"
        value={selectedTab}
        onValueChange={handleTabChange}
      >
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
          <ArmadaAktif />
        </TabsContent>
        <TabsContent value="nonaktif" className="pt-4">
          <ArmadaNonaktif />
        </TabsContent>
        <TabsContent value="proses" className="pt-4">
          <ArmadaProses />
        </TabsContent>
        <TabsContent value="arsip" className="pt-4">
          <ArmadaArsip />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Page;
