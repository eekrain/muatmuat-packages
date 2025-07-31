"use client";

import { useEffect, useState } from "react";

import Dropdown from "@/components/Form/Dropdown";
import { useGetMasterVehicleBrands } from "@/services/Transporter/manajemen-armada/getMasterVehicleBrands";

export default function DropdownMerekKendaraan({
  url,
  value,
  onChange,
  placeholder = "Pilih Kendaraan",
  searchPlaceholder = "Cari Kendaraan",
}) {
  const [options, setOptions] = useState([]);
  const { data: vehicleData } = useGetMasterVehicleBrands(url);
  useEffect(() => {
    if (vehicleData) {
      let options = [];
      if (Array.isArray(vehicleData.Data.vehicleBrands)) {
        options = vehicleData.Data.vehicleBrands.map((item) => ({
          value: item.id,
          label: item.name,
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
    />
  );
}
