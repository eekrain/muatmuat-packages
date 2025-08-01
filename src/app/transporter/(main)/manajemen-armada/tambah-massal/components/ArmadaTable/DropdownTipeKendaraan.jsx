"use client";

import { useEffect, useState } from "react";

import Dropdown from "@/components/Form/Dropdown";
import { useGetMasterVehicleTypes } from "@/services/Transporter/manajemen-armada/getMasterVehicleTypes";

import ModalAddOption from "./ModalAddOption";

export default function DropdownTipeKendaraan({
  url,
  value,
  onChange,
  placeholder = "Pilih Kendaraan",
  searchPlaceholder = "Cari Kendaraan",
  disabled,
  hasError = false,
}) {
  const [options, setOptions] = useState([]);
  const [modalAddTipe, setModalAddTipe] = useState(false);
  const { data: vehicleData } = useGetMasterVehicleTypes(url);
  const handleChange = (newValue) => {
    if (newValue === "add") {
      setModalAddTipe(true);
    } else {
      const label =
        options.find((item) => item.value === newValue)?.label || "";
      onChange({ id: newValue, name: label });
    }
  };
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
    <>
      <Dropdown
        disabled={disabled}
        value={value}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        isAddable={true}
        isError={hasError}
      />
      <ModalAddOption
        isOpen={modalAddTipe}
        onClose={() => setModalAddTipe(false)}
        onAdd={(newBrand) => {
          setOptions((prev) => [
            { value: newBrand.id, label: newBrand.name },
            ...prev,
          ]);
          onChange({ id: newBrand.id, name: newBrand.name });
        }}
        title="Tambah Tipe Kendaraan"
        placeholder="Masukkan Tipe Kendaraan"
        errorMessage="Tipe kendaraan wajib diisi"
      />
    </>
  );
}
