"use client";

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
import ShipperContainer from "@/container/CS/User/ShipperContainer";
import TransporterContainer from "@/container/CS/User/TransporterContainer";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Map query param values to tab values
  const getTabValue = (queryValue) => {
    const tabMap = {
      shipper: "shipper",
      transporter: "transporter",
    };
    return tabMap[queryValue] || "shipper";
  };

  // Map tab values to query param values
  const getQueryValue = (tabValue) => {
    const queryMap = {
      shipper: "shipper",
      transporter: "transporter",
    };
    return queryMap[tabValue] || "shipper";
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
    router.push(`/user?tab=${queryValue}`);
  };

  // Mock counts - replace with actual API calls
  const shipperCount = 150;
  const transporterCount = 75;

  return (
    <div className="my-6 max-h-screen w-full space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle withBack={false}>User Management</PageTitle>
        <div className="flex gap-3">
          <Button
            variant="muattrans-primary-secondary"
            iconLeft={<Plus size={16} />}
            onClick={() => {}}
          >
            <span className="pt-0.5">Add Users (Bulk)</span>
          </Button>
          <Button
            iconLeft={<Plus size={16} />}
            onClick={() => router.push("/user/add")}
          >
            <span className="pt-0.5">Add User</span>
          </Button>
          <Button iconLeft={<Download size={16} />} onClick={() => {}}>
            <span className="pt-0.5">Export</span>
          </Button>
        </div>
      </div>

      <Tabs
        className="w-full"
        value={selectedTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="w-4/12">
          <TabsTriggerWithSeparator value="shipper" activeColor="primary-700">
            Shipper {shipperCount ? `(${shipperCount})` : ""}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="transporter"
            showSeparator={false}
            activeColor="primary-700"
          >
            Transporter {transporterCount ? `(${transporterCount})` : ""}
          </TabsTriggerWithSeparator>
        </TabsList>

        <TabsContent value="shipper" className="pt-4">
          <ShipperContainer count={shipperCount} />
        </TabsContent>
        <TabsContent value="transporter" className="pt-4">
          <TransporterContainer count={transporterCount} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Page;
