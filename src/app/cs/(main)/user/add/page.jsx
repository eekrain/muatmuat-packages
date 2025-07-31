"use client";

import { useState } from "react";

import Card from "@/components/Card/Card";
import DataPerusahaan from "@/container/CS/User/Tambah/Web/DataPerusahaan/DataPerusahaan";
import { TabRegister } from "@/container/CS/User/Tambah/Web/TabRegister";

const Page = () => {
  // Status: "finished" | "incomplete"
  const [itemsStatus, setItemsStatus] = useState([
    "finished",
    "finished",
    "incomplete",
  ]);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex w-full items-start gap-6 px-10 py-8">
      <Card className={"border-none p-6"}>
        <DataPerusahaan activeIdx={activeIdx} />
      </Card>
      <Card className={"mt-5 w-max rounded-xl border-none pt-6"}>
        <TabRegister
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
          itemsStatus={itemsStatus}
        />
      </Card>
    </div>
  );
};

export default Page;
