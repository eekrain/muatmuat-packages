import { useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DatePicker from "@/components/DatePicker/DatePicker";
import Checkbox from "@/components/Form/Checkbox";
import { DimensionInput } from "@/components/Form/DimensionInput";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Select from "@/components/Select";
import { cn } from "@/lib/utils";

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
  errors,
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

  // Filter data based on search value (license plate)
  const filteredData = data.filter((item) => {
    if (!searchValue.trim()) return true; // Show all if no search value

    const licensePlate = item.licensePlate || "";
    // Case-insensitive search that also removes spaces and special characters for better matching
    const normalizedSearch = searchValue.toLowerCase().replace(/[\s-]/g, "");
    const normalizedLicensePlate = licensePlate
      .toLowerCase()
      .replace(/[\s-]/g, "");

    return normalizedLicensePlate.includes(normalizedSearch);
  });

  return (
    <>
      <div className={`rounded-lg bg-white shadow-muat ${className}`}>
        {/* Header Table */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                icon={{ left: "/icons/search.svg" }}
                appearance={{ iconClassName: "text-neutral-700" }}
                className="!w-fit !p-0 pr-8 font-medium"
                placeholder="Cari Armada"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                >
                  <IconComponent
                    src="/icons/close20.svg"
                    width={16}
                    height={16}
                  />
                </button>
              )}
            </div>
            <Button
              type="button"
              onClick={onAddRow}
              variant="muatparts-primary-secondary"
            >
              Tambah
            </Button>
            <Button
              type="button"
              onClick={onDeleteRows}
              variant="muatparts-error-secondary"
            >
              Hapus
            </Button>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="font-semibold">
              Total : {filteredData.length} Armada
              {searchValue.trim() && filteredData.length !== data.length && (
                <span className="text-neutral-600"> dari {data.length}</span>
              )}
            </p>
            {searchValue.trim() && (
              <p className="text-xs text-neutral-600">
                {filteredData.length > 0
                  ? `Menampilkan hasil pencarian untuk &ldquo;${searchValue}&rdquo;`
                  : `Tidak ada hasil untuk &ldquo;${searchValue}&rdquo;`}
              </p>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="p-4">
          <div className="max-h-[calc(100vh-450px)] w-full overflow-auto rounded-lg border border-neutral-600">
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
                {filteredData.length === 0 && searchValue.trim() ? (
                  <tr>
                    <td colSpan="12" className="py-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <DataNotFound
                          type="search"
                          title={"Keyword Tidak Ditemukan"}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => {
                    // Find the original index in the full data array for proper error mapping
                    const originalIndex = data.findIndex(
                      (dataItem) =>
                        dataItem === item ||
                        (dataItem.licensePlate &&
                          dataItem.licensePlate === item.licensePlate &&
                          JSON.stringify(dataItem) === JSON.stringify(item))
                    );

                    return (
                      <ArmadaTableRow
                        key={`item-${originalIndex}-${index}`}
                        index={originalIndex >= 0 ? originalIndex : index}
                        data={item}
                        isSelected={selectedRows.includes(
                          originalIndex >= 0 ? originalIndex : index
                        )}
                        onCheckboxChange={() =>
                          handleCheckboxChange(
                            originalIndex >= 0 ? originalIndex : index
                          )
                        }
                        onCellValueChange={onCellValueChange}
                        onImageClick={handleImageClick}
                        errors={
                          errors?.[
                            originalIndex >= 0 ? originalIndex : index
                          ] || {}
                        }
                      />
                    );
                  })
                )}
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
  errors,
}) => {
  const handleFieldChange = (fieldPath, value) => {
    onCellValueChange?.(index, fieldPath, value);
  };

  // Helper function to check if a field has an error
  const hasError = (fieldPath) => {
    const fieldParts = fieldPath.split(".");
    let errorObj = errors;

    for (const part of fieldParts) {
      if (errorObj && errorObj[part]) {
        errorObj = errorObj[part];
      } else {
        return false;
      }
    }
    // Check if errorObj has a message property (actual error) or is just an object container
    return errorObj && (errorObj.message || typeof errorObj === "string");
  };

  // Helper function to get the actual error message
  const getErrorMessage = (fieldPath) => {
    const fieldParts = fieldPath.split(".");
    let errorObj = errors;

    for (const part of fieldParts) {
      if (errorObj && errorObj[part]) {
        errorObj = errorObj[part];
      } else {
        return null;
      }
    }

    if (errorObj && errorObj.message) {
      return errorObj.message;
    }
    if (typeof errorObj === "string") {
      return errorObj;
    }
    return null;
  };

  return (
    <tr className="px-4">
      <td className="sticky left-0 z-50 bg-white py-5 pr-4">
        <Checkbox label="" checked={isSelected} onChange={onCheckboxChange} />
      </td>

      <td className="flex items-center gap-3 py-5">
        <label
          onClick={() => onImageClick?.(index)}
          htmlFor={`foto-armada-${index}`}
        >
          {data?.informasi_armada?.images?.image_armada_depan ? (
            <img
              src={data.informasi_armada.images.image_armada_depan}
              alt="Foto Armada Depan"
              className={cn(
                "w-12 shrink cursor-pointer rounded-lg object-cover",
                hasError("informasi_armada.images.image_armada_belakang") ||
                  hasError("informasi_armada.images.image_armada_kiri") ||
                  (hasError("informasi_armada.images.image_armada_depan") &&
                    "border-error-400 hover:border-error-400")
              )}
            />
          ) : (
            <div
              className={`w-fit cursor-pointer rounded-lg border border-dashed p-2 hover:text-primary-700 ${
                hasError("informasi_armada.images.image_armada_depan")
                  ? "border-error-400 hover:border-error-400"
                  : "border-neutral-600 hover:border-primary-700"
              }`}
            >
              <IconComponent src="/icons/add-image20.svg" />
            </div>
          )}
        </label>
        <Input
          name={`informasiMuatan.${index}.licensePlate`}
          placeholder="Contoh : L 1234 TY"
          value={data?.licensePlate || ""}
          onChange={(e) => handleFieldChange("licensePlate", e.target.value)}
          appearance={{
            containerClassName: hasError("licensePlate")
              ? "border-error-400 placeholder:text-error-400"
              : "",
          }}
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
          hasError={hasError("jenis_truk")}
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
          hasError={hasError("jenis_carrier")}
        />
      </td>

      <td>
        <DropdownMerekKendaraan
          value={data?.merek_kendaraan_id || ""}
          url="v1/master/vehicle-brands"
          onChange={(value) => handleFieldChange("merek_kendaraan", value)}
          placeholder="Pilih Merek Kendaraan"
          hasError={hasError("merek_kendaraan_id")}
        />
      </td>

      <td>
        <DropdownTipeKendaraan
          disabled={!data?.merek_kendaraan_id}
          url={
            data?.merek_kendaraan
              ? `v1/master/vehicle-types?vehicleBrandId=${data?.merek_kendaraan_id}`
              : null
          }
          value={data?.tipe_kendaraan_id || ""}
          onChange={(value) => handleFieldChange("tipe_kendaraan", value)}
          placeholder="Pilih Tipe Kendaraan"
          hasError={hasError("tipe_kendaraan_id")}
        />
      </td>

      <td>
        <Select.Root
          onValueChange={(value) =>
            handleFieldChange("tahun_registrasi_kendaraan", value)
          }
          value={data?.tahun_registrasi_kendaraan || ""}
        >
          <Select.Trigger
            className={
              hasError("tahun_registrasi_kendaraan") ? "border-error-400" : ""
            }
          >
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
          appearance={{
            containerClassName: hasError("nomor_rangka")
              ? "border-error-400 placeholder:text-error-400"
              : "",
          }}
        />
      </td>

      <td className="relative">
        <DatePicker
          placeholder="Pilih Tanggal"
          value={data?.masa_berlaku_stnk || ""}
          onChange={(value) => handleFieldChange("masa_berlaku_stnk", value)}
          errorMessage={getErrorMessage("masa_berlaku_stnk")}
          showErrorMessage={false}
        />
      </td>

      <td>
        <FileUploadInput
          id={`foto-stnk-${index}`}
          value={data?.foto_stnk}
          onChange={(file) => handleFieldChange("foto_stnk", file)}
          hasError={hasError("foto_stnk")}
        />
      </td>

      <td>
        <FileUploadInput
          id={`foto-pajak-kendaraan-${index}`}
          value={data?.foto_pajak_kendaraan}
          onChange={(file) => handleFieldChange("foto_pajak_kendaraan", file)}
          hasError={hasError("foto_pajak_kendaraan")}
        />
      </td>

      <td>
        <Input
          placeholder="Contoh: SBY 123456"
          value={data?.nomor_kir || ""}
          onChange={(e) => handleFieldChange("nomor_kir", e.target.value)}
          appearance={{
            containerClassName: hasError("nomor_kir")
              ? "border-error-400 placeholder:text-error-400"
              : "",
          }}
        />
      </td>

      <td className="relative">
        <DatePicker
          placeholder="Pilih Tanggal"
          value={data?.masa_berlaku_kir || ""}
          onChange={(value) => handleFieldChange("masa_berlaku_kir", value)}
          errorMessage={getErrorMessage("masa_berlaku_kir")}
          showErrorMessage={false}
        />
      </td>

      <td>
        <FileUploadInput
          id={`foto-buku-kir-${index}`}
          value={data?.foto_buku_kir}
          onChange={(file) => handleFieldChange("foto_buku_kir", file)}
          hasError={hasError("foto_buku_kir")}
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
            errorMessage={getErrorMessage(
              "estimasi_tanggal_pemasangan_gps.mulai"
            )}
            showErrorMessage={false}
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
            errorMessage={getErrorMessage(
              "estimasi_tanggal_pemasangan_gps.selesai"
            )}
            showErrorMessage={false}
          />
        </div>
      </td>
    </tr>
  );
};

export default ArmadaTable;
