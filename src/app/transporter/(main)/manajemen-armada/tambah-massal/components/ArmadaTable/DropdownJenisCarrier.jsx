"use client";

import { useEffect, useState } from "react";

import Dropdown from "@/components/Form/Dropdown";
import { useGetMasterCarrierTypes } from "@/services/Transporter/manajemen-armada/getMasterCarrierTypes";

export default function DropdownJenisCarrier({
  url,
  value,
  onChange,
  placeholder = "Pilih Kendaraan",
  searchPlaceholder = "Cari Kendaraan",
  disabled,
}) {
  const [options, setOptions] = useState([]);
  const { data: vehicleData, error, mutate } = useGetMasterCarrierTypes(url);
  useEffect(() => {
    if (vehicleData) {
      let options = [];
      if (Array.isArray(vehicleData.Data.carrierTypes)) {
        options = vehicleData.Data.carrierTypes.map((item) => ({
          value: item.id,
          label: item.name,
        }));
      } else {
        options = vehicleData.Data.truckTypes;
      }
      setOptions(options);
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
