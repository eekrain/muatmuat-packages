"use client";

import React from "react";

import TotalShipper from "@/container/CS/Dashboard/TotalShipper";

function Page() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">
        Ringkasan Total Mitra & Armada Terdaftar
      </h1>
      <div className="flex flex-row pb-6 pt-4">
        <TotalShipper />
      </div>

      <h1 className="text-xl font-bold">Dashboard Analytics</h1>
    </div>
  );
}

export default Page;
