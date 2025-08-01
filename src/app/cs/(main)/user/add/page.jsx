"use client";

import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import PageTitle from "@/components/PageTitle/PageTitle";
import Form from "@/container/CS/User/Tambah/Web/Form";
import { TabRegister } from "@/container/CS/User/Tambah/Web/TabRegister";

const Page = () => {
  const [itemsStatus, setItemsStatus] = useState([
    "incomplete", // finished (toogle)
    "incomplete", // finished (toogle)
    "incomplete", // finished (toogle)
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
        <Form activeIdx={activeIdx} />
        <Card className={"w-max rounded-xl border-none pt-6"}>
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
