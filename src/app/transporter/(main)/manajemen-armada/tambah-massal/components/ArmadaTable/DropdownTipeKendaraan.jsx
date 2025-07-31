"use client";

import { useEffect, useState } from "react";

import Dropdown from "@/components/Form/Dropdown";
import { useGetMasterVehicleTypes } from "@/services/Transporter/manajemen-armada/getMasterVehicleTypes";

export default function DropdownTipeKendaraan({
  url,
  value,
  onChange,
  placeholder = "Pilih Kendaraan",
  searchPlaceholder = "Cari Kendaraan",
  disabled,
}) {
  const [options, setOptions] = useState([]);
  const { data: vehicleData } = useGetMasterVehicleTypes(url);
  useEffect(() => {
    if (vehicleData) {
      let options = [];
      if (Array.isArray(vehicleData.Data.vehicleTypes)) {
        options = vehicleData.Data.vehicleTypes.map((item) => ({
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
      disabled={disabled}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
    />
  );
}
