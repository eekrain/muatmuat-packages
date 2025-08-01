"use client";

import { useEffect, useState } from "react";

import Dropdown from "@/components/Form/Dropdown";
import { useGetMasterVehicleBrands } from "@/services/Transporter/manajemen-armada/getMasterVehicleBrands";

import ModalAddOption from "./ModalAddOption";

export default function DropdownMerekKendaraan({
  url,
  value,
  onChange,
  placeholder = "Pilih Kendaraan",
  searchPlaceholder = "Cari Kendaraan",
  hasError = false,
}) {
  const [options, setOptions] = useState([]);
  const [modalAddMerek, setModalAddMerek] = useState(false);
  const { data: vehicleData } = useGetMasterVehicleBrands(url);
  const handleChange = (newValue) => {
    if (newValue === "add") {
      setModalAddMerek(true);
    } else {
      const label =
        options.find((item) => item.value === newValue)?.label || "";
      onChange({ id: newValue, name: label });
    }
  };
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
    <>
      <Dropdown
        value={value}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        isAddable={true}
        isError={hasError}
      />
      <ModalAddOption
        isOpen={modalAddMerek}
        onClose={() => setModalAddMerek(false)}
        onAdd={(newBrand) => {
          setOptions((prev) => [
            { value: newBrand.id, label: newBrand.name },
            ...prev,
          ]);
          onChange(newBrand.id);
        }}
        title="Tambah Merek Kendaraan"
        placeholder="Masukkan Merek Kendaraan"
        errorMessage="Merek kendaraan wajib diisi"
      />
    </>
  );
}
