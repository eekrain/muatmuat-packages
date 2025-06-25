"use client";

import { useState } from "react";

import PilihProvinsi from "@/components/PilihProvinsi/PilihProvinsi";

export default function PilihProvinsiDemo() {
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [provinceIds] = useState([11, 12, 13, 14, 15]);
  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      <PilihProvinsi
        addCourierProvince={async ({ provinceID }) => {
          console.log(`Saved provinces: ${provinceID.join(", ")}`);
          return Promise.resolve();
        }}
        onRefresh={() => console.log("Refreshed!")}
        onBack={() => console.log("Back clicked!")}
        selectedProvinces={selectedProvinces}
        setSelectedProvinces={setSelectedProvinces}
        provinceIds={provinceIds}
      />
    </div>
  );
}
