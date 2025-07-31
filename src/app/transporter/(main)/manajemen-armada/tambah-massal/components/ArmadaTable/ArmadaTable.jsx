import { useState } from "react";

import Button from "@/components/Button/Button";
import DatePicker from "@/components/DatePicker/DatePicker";
import Checkbox from "@/components/Form/Checkbox";
import { DimensionInput } from "@/components/Form/DimensionInput";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Select from "@/components/Select";

import FileUploadInput from "../../preview-armada/components/FileUploadInput";
import ModalAddImage from "../../preview-armada/components/ModalAddImage/ModalAddImage";
import DropdownJenisCarrier from "./DropdownJenisCarrier";
import DropdownJenisTruk from "./DropdownJenisTruk";
import DropdownMerekKendaraan from "./DropdownMerekKendaraan";
import DropdownTipeKendaraan from "./DropdownTipeKendaraan";

const dimensionUnits = [
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
];

const ArmadaTable = ({
  data = [],
  selectedRows = [],
  selectAll = false,
  searchValue = "",
  onSearchChange,
  onSelectAll,
  onSelectRow,
  onAddRow,
  onDeleteRows,
  onCellValueChange,
  className = "",
}) => {
  const [addArmadaImageModal, setAddArmadaImageModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const handleCheckboxChange = (index) => {
    if (selectedRows.includes(index)) {
      onSelectRow(selectedRows.filter((i) => i !== index));
    } else {
      onSelectRow([...selectedRows, index]);
    }
  };

  const handleSelectAllChange = () => {
    onSelectAll(!selectAll);
  };

  const handleImageClick = (index) => {
    setActiveImageIndex(index);
    setAddArmadaImageModal(true);
  };

  const handleImageSave = (images) => {
    if (activeImageIndex !== null) {
      onCellValueChange?.(activeImageIndex, "informasi_armada.images", images);
      setAddArmadaImageModal(false);
      setActiveImageIndex(null);
    }
  };

  const handleImageModalClose = () => {
    setAddArmadaImageModal(false);
    setActiveImageIndex(null);
  };

  return (
    <>
      <div className={`rounded-lg bg-white shadow-muat ${className}`}>
        {/* Header Table */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Input
              icon={{ left: "/icons/search.svg" }}
              appearance={{ iconClassName: "text-neutral-700" }}
              className="!w-fit !p-0 font-medium"
              placeholder="Cari Armada"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <Button onClick={onAddRow} variant="muatparts-primary-secondary">
              Tambah
            </Button>
            <Button onClick={onDeleteRows} variant="muatparts-error-secondary">
              Hapus
            </Button>
          </div>
          <p className="font-semibold">Total : {data.length} Armada</p>
        </div>

        {/* Table */}
        <div className="p-4">
          <div className="max-h-[296px] w-full overflow-auto rounded-lg border border-neutral-600">
            <table className="table-tambah-armada-massal w-full table-fixed overflow-auto">
              <thead className="sticky top-0 z-50 border-b border-neutral-500 bg-white text-left">
                <tr>
                  <th className="sticky left-0 w-[16px] bg-white px-4 py-5">
                    <Checkbox
                      label=""
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th className="w-[232px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Armada*
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Jenis Truk*
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Jenis Carrier*
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Merek Kendaraan*
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Tipe Kendaraan*
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Tahun Registrasi Kendaraan*
                    </span>
                  </th>
                  <th className="w-[261px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Dimensi Carrier (Opsional)
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Nomor Rangka*
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Masa Berlaku STNK*
                    </span>
                  </th>
                  <th className="w-[98px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Foto STNK*
                    </span>
                  </th>
                  <th className="w-[133px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Foto Pajak Kendaraan*
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      KIR Kendaraan*
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Masa Berlaku KIR*
                    </span>
                  </th>
                  <th className="w-[98px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Foto Buku KIR*
                    </span>
                  </th>
                  <th className="w-[394px]">
                    <span className="text-xs font-semibold text-gray-500">
                      Estimasi Tanggal Pemasangan GPS*
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <ArmadaTableRow
                    key={`item-${index}`}
                    index={index}
                    data={item}
                    isSelected={selectedRows.includes(index)}
                    onCheckboxChange={() => handleCheckboxChange(index)}
                    onCellValueChange={onCellValueChange}
                    onImageClick={handleImageClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Add Armada Image */}
      <ModalAddImage
        isOpen={addArmadaImageModal}
        onClose={handleImageModalClose}
        value={
          activeImageIndex !== null
            ? data[activeImageIndex]?.informasi_armada?.images
            : null
        }
        onSave={handleImageSave}
      />
    </>
  );
};

const ArmadaTableRow = ({
  index,
  data,
  isSelected,
  onCheckboxChange,
  onCellValueChange,
  onImageClick,
}) => {
  const handleFieldChange = (fieldPath, value) => {
    onCellValueChange?.(index, fieldPath, value);
  };

  return (
    <tr className="px-4">
      <td className="sticky left-0 z-50 bg-white py-5 pr-4">
        <Checkbox label="" checked={isSelected} onChange={onCheckboxChange} />
      </td>

      <td className="flex gap-3 py-5">
        <label
          onClick={() => onImageClick?.(index)}
          htmlFor={`foto-armada-${index}`}
        >
          {data?.informasi_armada?.images?.image_armada_depan ? (
            <img
              src={data.informasi_armada.images.image_armada_depan}
              alt="Foto Armada Depan"
              className="w-12 shrink cursor-pointer rounded-lg object-cover"
            />
          ) : (
            <div className="w-fit cursor-pointer rounded-lg border border-dashed border-neutral-600 p-2 hover:border-primary-700 hover:text-primary-700">
              <IconComponent src="/icons/add-image20.svg" />
            </div>
          )}
        </label>
        <Input
          placeholder="Contoh : L 1234 TY"
          value={data?.nomor_plat || ""}
          onChange={(e) => handleFieldChange("nomor_plat", e.target.value)}
        />
      </td>

      <td>
        <DropdownJenisTruk
          url="v1/master/truck-types"
          value={data?.jenis_truk || ""}
          onChange={(value) => {
            handleFieldChange("jenis_truk", value);
            // Clear carrier selection when truck type changes
            handleFieldChange("jenis_carrier", "");
          }}
          placeholder="Pilih Jenis Truk"
        />
      </td>

      <td>
        <DropdownJenisCarrier
          disabled={!data?.jenis_truk}
          url={
            data?.jenis_truk
              ? `v1/master/carrier-types?truckTypeId=${data?.jenis_truk}`
              : null
          }
          value={data?.jenis_carrier || ""}
          onChange={(value) => handleFieldChange("jenis_carrier", value)}
          placeholder="Pilih Jenis Carrier"
        />
      </td>

      <td>
        <DropdownMerekKendaraan
          value={data?.merek_kendaraan || ""}
          url="v1/master/vehicle-brands"
          onChange={(value) => handleFieldChange("merek_kendaraan", value)}
          placeholder="Pilih Jenis Merek Kendaraan"
        />
      </td>

      <td>
        <DropdownTipeKendaraan
          disabled={!data?.merek_kendaraan}
          url={
            data?.merek_kendaraan
              ? `v1/master/vehicle-types?vehicleBrandId=${data?.merek_kendaraan}`
              : null
          }
          value={data?.tipe_kendaraan || ""}
          onChange={(value) => handleFieldChange("tipe_kendaraan", value)}
          placeholder="Pilih Tipe Kendaraan"
        />
      </td>

      <td>
        <Select.Root
          onValueChange={(value) =>
            handleFieldChange("tahun_registrasi_kendaraan", value)
          }
          value={data?.tahun_registrasi_kendaraan || ""}
        >
          <Select.Trigger>
            <Select.Value placeholder="Pilih Tahun" />
          </Select.Trigger>
          <Select.Content>
            {Array.from({ length: 100 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <Select.Item
                  key={year}
                  value={year.toString()}
                  className="py-2 text-xs font-medium"
                >
                  {year}
                </Select.Item>
              );
            })}
          </Select.Content>
        </Select.Root>
      </td>

      <td>
        <div className="flex items-center gap-3">
          <DimensionInput
            manual={{
              lebar: {
                value: data?.dimensi_carrier?.lebar || "",
                setValue: (value) =>
                  handleFieldChange("dimensi_carrier.lebar", value),
              },
              panjang: {
                value: data?.dimensi_carrier?.panjang || "",
                setValue: (value) =>
                  handleFieldChange("dimensi_carrier.panjang", value),
              },
              tinggi: {
                value: data?.dimensi_carrier?.tinggi || "",
                setValue: (value) =>
                  handleFieldChange("dimensi_carrier.tinggi", value),
              },
            }}
          />
          <Select.Root
            onValueChange={(value) =>
              handleFieldChange("dimensi_carrier.unit", value)
            }
            value={data?.dimensi_carrier?.unit || "m"}
          >
            <Select.Trigger>
              <Select.Value placeholder="Unit" />
            </Select.Trigger>
            <Select.Content>
              {dimensionUnits.map((unit) => (
                <Select.Item
                  key={unit.value}
                  value={unit.value}
                  className="py-2 text-xs font-medium"
                >
                  {unit.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </td>

      <td>
        <Input
          placeholder="Maksimal 17 Digit"
          value={data?.nomor_rangka || ""}
          onChange={(e) => handleFieldChange("nomor_rangka", e.target.value)}
        />
      </td>

      <td className="relative">
        <DatePicker
          placeholder="Pilih Tanggal"
          value={data?.masa_berlaku_stnk || ""}
          onChange={(value) => handleFieldChange("masa_berlaku_stnk", value)}
        />
      </td>

      <td>
        <FileUploadInput
          id={`foto-stnk-${index}`}
          value={data?.foto_stnk}
          onChange={(file) => handleFieldChange("foto_stnk", file)}
        />
      </td>

      <td>
        <FileUploadInput
          id={`foto-pajak-kendaraan-${index}`}
          value={data?.foto_pajak_kendaraan}
          onChange={(file) => handleFieldChange("foto_pajak_kendaraan", file)}
        />
      </td>

      <td>
        <Input
          placeholder="Contoh: SBY 123456"
          value={data?.nomor_kir || ""}
          onChange={(e) => handleFieldChange("nomor_kir", e.target.value)}
        />
      </td>

      <td className="relative">
        <DatePicker
          placeholder="Pilih Tanggal"
          value={data?.masa_berlaku_kir || ""}
          onChange={(value) => handleFieldChange("masa_berlaku_kir", value)}
        />
      </td>

      <td>
        <FileUploadInput
          id={`foto-buku-kir-${index}`}
          value={data?.foto_buku_kir}
          onChange={(file) => handleFieldChange("foto_buku_kir", file)}
        />
      </td>

      <td>
        <div className="flex items-center gap-2">
          <DatePicker
            placeholder="Pilih Tanggal"
            value={data?.estimasi_tanggal_pemasangan_gps?.mulai || ""}
            onChange={(value) =>
              handleFieldChange("estimasi_tanggal_pemasangan_gps.mulai", value)
            }
          />
          <span className="text-xs font-medium">s/d</span>
          <DatePicker
            placeholder="Pilih Tanggal"
            value={data?.estimasi_tanggal_pemasangan_gps?.selesai || ""}
            onChange={(value) =>
              handleFieldChange(
                "estimasi_tanggal_pemasangan_gps.selesai",
                value
              )
            }
          />
        </div>
      </td>
    </tr>
  );
};

export default ArmadaTable;
