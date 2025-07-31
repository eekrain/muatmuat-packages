"use client";

import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import PageTitle from "@/components/PageTitle/PageTitle";
import Form from "@/container/CS/User/Tambah/Web/Form";
import { TabRegister } from "@/container/CS/User/Tambah/Web/TabRegister";

const Page = () => {
  // Status: "finished" | "incomplete"
  const [itemsStatus, setItemsStatus] = useState([
    "finished",
    "finished",
    "incomplete",
  ]);
  const breadcrumbData = [
    { name: "Daftar User", href: "/user" },
    { name: "Transporter", href: "/user/transporter" },
    { name: "Tambah Transporter" },
  ];
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="px-10">
      <BreadCrumb className={"mb-4 mt-6"} data={breadcrumbData} />
      <PageTitle>Tambah Transporter</PageTitle>
      <div className="flex w-full items-start gap-6 pb-8">
        <Card className={"border-none p-6"}>
          <Form activeIdx={activeIdx} />
        </Card>
        <Card className={"mt-5 w-max rounded-xl border-none pt-6"}>
          <TabRegister
            activeIdx={activeIdx}
            setActiveIdx={setActiveIdx}
            itemsStatus={itemsStatus}
          />
        </Card>
      </div>
    </div>
  );
};

export default Page;
