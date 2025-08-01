"use client";

import { useEffect, useState } from "react";

import Dropdown from "@/components/Form/Dropdown";
import { useGetMasterTrucks } from "@/services/Transporter/manajemen-armada/getMasterTrucks";

export default function DropdownJenisTruk({
  url,
  value,
  onChange,
  placeholder = "Pilih Kendaraan",
  searchPlaceholder = "Cari Kendaraan",
  hasError = false,
}) {
  const [options, setOptions] = useState([]);
  const { data: vehicleData } = useGetMasterTrucks(url);
  useEffect(() => {
    if (vehicleData) {
      let options = [];
      if (Array.isArray(vehicleData.Data.truckTypes)) {
        options = vehicleData.Data.truckTypes.map((item) => ({
          value: item.id,
          label: item.name,
          image: item.icon,
        }));
      }
      setOptions(options);
    } else {
      // Clear options when no data
      setOptions([]);
    }
  }, [vehicleData]);
  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      isError={hasError}
    />
  );
}
