import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DatePicker from "@/components/DatePicker/DatePicker";
import Checkbox from "@/components/Form/Checkbox";
import { DimensionInput } from "@/components/Form/DimensionInput";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Select from "@/components/Select";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import FileUploadInput from "../FileUploadInput";
import ModalAddImage from "../ModalAddImage/ModalAddImage";
import DropdownJenisCarrier from "./DropdownJenisCarrier";
import DropdownJenisTruk from "./DropdownJenisTruk";
import DropdownMerekKendaraan from "./DropdownMerekKendaraan";
import DropdownTipeKendaraan from "./DropdownTipeKendaraan";
import InputNomorKIR from "./InputNomorKIR";
import InputNomorPolisi from "./InputNomorPolisi";
import InputNomorRangka from "./InputNomorRangka";

const dimensionUnits = [
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
];

/**
 * Utility functions for date calculations
 */
const getMaxDateSTNK = () => {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 5);
  return maxDate;
};

const getMaxDateKIR = () => {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 6);
  return maxDate;
};

const getMaxDateGPSStart = () => {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 3);
  return maxDate;
};

const getMaxDateGPSEnd = (startDate) => {
  if (!startDate) return null;
  const gpsStartDate = new Date(startDate);
  const maxDate = new Date(gpsStartDate);
  maxDate.setDate(gpsStartDate.getDate() + 14); // 2 weeks from start date
  return maxDate;
};

/**
 * Utility function to validate all license plates for duplicates
 * Can be called externally (e.g., on form submit)
 * @param {Array} data - Array of armada data
 * @param {Function} setError - React Hook Form setError function (optional)
 * @param {string} fieldArrayName - Name of the field array (optional)
 * @param {Function} t - Translation function (optional)
 * @returns {boolean} - True if no duplicates found, false if duplicates exist
 */
export const validateAllLicensePlates = (
  data,
  setError = null,
  fieldArrayName = "informasiMuatan",
  t = null
) => {
  const licensePlates = data
    .map((item, index) => ({
      plate: (item.licensePlate || "").toLowerCase().replace(/\s/g, ""),
      index,
    }))
    .filter((item) => item.plate.length > 0);

  const plateGroups = {};
  licensePlates.forEach(({ plate, index }) => {
    if (!plateGroups[plate]) {
      plateGroups[plate] = [];
    }
    plateGroups[plate].push(index);
  });

  const duplicateIndexes = [];
  Object.values(plateGroups).forEach((indexes) => {
    if (indexes.length > 1) {
      duplicateIndexes.push(...indexes);
    }
  });

  if (duplicateIndexes.length > 0) {
    const errorMessage = t
      ? t(
          "ArmadaTable.messageErrorLicensePlateDuplicate",
          {},
          "No. Polisi kendaraan sudah terdaftar"
        )
      : t(
          "ArmadaTable.messageErrorLicensePlateDuplicate",
          {},
          "No. Polisi kendaraan sudah terdaftar"
        );

    // Set errors for duplicate license plates
    if (setError) {
      duplicateIndexes.forEach((index) => {
        setError(`${fieldArrayName}.${index}.licensePlate`, {
          type: "manual",
          message: errorMessage,
        });
      });
    }
    toast.error(errorMessage);
    return false;
  }

  return true;
};

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
  const { t } = useTranslation();
  const [addArmadaImageModal, setAddArmadaImageModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  // Local search input state to avoid triggering parent on every keystroke.
  const [localSearch, setLocalSearch] = useState(searchValue || "");

  useEffect(() => {
    // keep local input in sync when parent resets/clears searchValue
    setLocalSearch(searchValue || "");
  }, [searchValue]);

  const handleSearchKeyDown = (e) => {
    if (e.key !== "Enter") return;

    const value = (e.target && e.target.value) || localSearch || "";
    // Only trigger search when empty (clear) or length > 3
    if (value.length === 0 || value.length > 2) {
      onSearchChange?.(value);
    }
    // Prevent default form submit if inside a form
    e.preventDefault();
  };

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
                appearance={{
                  iconClassName: "text-neutral-700",
                  containerClassName: "min-w-[272px]",
                }}
                className="!w-fit !p-0 pr-8 font-medium"
                placeholder={t(
                  "ArmadaTable.placeholderCariArmada",
                  {},
                  "Cari Armada"
                )}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    onSearchChange?.("");
                  }}
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
              {t("ArmadaTable.buttonTambah", {}, "Tambah")}
            </Button>
            <Button
              type="button"
              onClick={onDeleteRows}
              variant="muatparts-error-secondary"
            >
              {t("ArmadaTable.buttonHapus", {}, "Hapus")}
            </Button>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="font-semibold">
              {t(
                "ArmadaTable.labelTotalArmada",
                { count: filteredData.length },
                `Total : ${filteredData.length} Armada`
              )}
              {searchValue.trim() && filteredData.length !== data.length && (
                <span className="text-neutral-600">
                  {" "}
                  {t(
                    "ArmadaTable.labelDariTotal",
                    { total: data.length },
                    ` dari ${data.length}`
                  )}
                </span>
              )}
            </p>
            {searchValue.trim() && (
              <p className="text-xs text-neutral-600">
                {filteredData.length > 0
                  ? t(
                      "ArmadaTable.messageSearchResults",
                      { keyword: searchValue },
                      `Menampilkan hasil pencarian untuk &ldquo;${searchValue}&rdquo;`
                    )
                  : t(
                      "ArmadaTable.messageNoSearchResults",
                      { keyword: searchValue },
                      `Tidak ada hasil untuk &ldquo;${searchValue}&rdquo;`
                    )}
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
                  <th className="sticky top-0 w-[16px] bg-white px-4 py-5">
                    <Checkbox
                      label=""
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th className="w-[232px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t("ArmadaTable.headerArmada", {}, "Armada*")}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t("ArmadaTable.headerJenisTruk", {}, "Jenis Truk*")}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "ArmadaTable.headerJenisCarrier",
                        {},
                        "Jenis Carrier*"
                      )}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "ArmadaTable.headerMerekKendaraan",
                        {},
                        "Merek Kendaraan*"
                      )}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "ArmadaTable.headerTipeKendaraan",
                        {},
                        "Tipe Kendaraan*"
                      )}
                    </span>
                  </th>
                  <th className="w-[200px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "ArmadaTable.headerTahunRegistrasi",
                        {},
                        "Tahun Registrasi Kendaraan*"
                      )}
                    </span>
                  </th>
                  <th className="w-[261px]">
                    {/* Keep translation but render parenthetical part italic */}
                    {(() => {
                      const full = t(
                        "ArmadaTable.headerDimensiCarrier",
                        {},
                        "Dimensi Carrier (Opsional)"
                      );
                      const match = full.match(/^(.*?)(\s*\(.*\))$/);
                      const before = match ? match[1] : full;
                      const paren = match ? match[2] : null;
                      return (
                        <span className="text-xs font-semibold text-gray-500">
                          {before}
                          {paren && (
                            <span className="font-normal italic">{paren}</span>
                          )}
                        </span>
                      );
                    })()}
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t("ArmadaTable.headerNomorRangka", {}, "Nomor Rangka*")}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "ArmadaTable.headerMasaBerlakuSTNK",
                        {},
                        "Masa Berlaku STNK*"
                      )}
                    </span>
                  </th>
                  <th className="w-[98px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t("ArmadaTable.headerFotoSTNK", {}, "Foto STNK*")}
                    </span>
                  </th>
                  <th className="w-[133px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "ArmadaTable.headerFotoPajakKendaraan",
                        {},
                        "Foto Pajak Kendaraan*"
                      )}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "ArmadaTable.headerKIRKendaraan",
                        {},
                        "KIR Kendaraan*"
                      )}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "ArmadaTable.headerMasaBerlakuKIR",
                        {},
                        "Masa Berlaku KIR*"
                      )}
                    </span>
                  </th>
                  <th className="w-[98px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t("ArmadaTable.headerFotoBukuKIR", {}, "Foto Buku KIR*")}
                    </span>
                  </th>
                  <th className="w-[394px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "ArmadaTable.headerEstimasiTanggalPemasanganGPS",
                        {},
                        "Estimasi Tanggal Pemasangan GPS*"
                      )}
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
                          title={t(
                            "ArmadaTable.titleKeywordNotFound",
                            {},
                            "Keyword Tidak Ditemukan"
                          )}
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
  const { t } = useTranslation();
  const handleFieldChange = (fieldPath, value) => {
    onCellValueChange?.(index, fieldPath, value);
  };

  /**
   * Handle GPS Start Date change and reset GPS End Date
   * @param {string} value - New GPS start date value
   */
  const handleGPSStartDateChange = (value) => {
    handleFieldChange("estimasi_tanggal_pemasangan_gps.mulai", value);
    // Reset GPS End Date when GPS Start Date changes
    handleFieldChange("estimasi_tanggal_pemasangan_gps.selesai", "");
  };

  /**
   * Handle license plate change (no real-time validation)
   * @param {Event} e - Input change event
   */
  const handleLicensePlateChange = (e) => {
    const newValue = e.target.value;

    // Update the field value only
    handleFieldChange("licensePlate", newValue);
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
      <td className="z-50 bg-white py-5 pr-4">
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
              alt={t("ArmadaTable.altFotoArmadaDepan", {}, "Foto Armada Depan")}
              className={cn(
                "r aspect-square w-12 shrink cursor-pointer rounded-lg object-cover",
                (hasError("informasi_armada.images.image_armada_belakang") ||
                  hasError("informasi_armada.images.image_armada_kiri") ||
                  hasError("informasi_armada.images.image_armada_kanan") ||
                  hasError("informasi_armada.images.image_armada_depan")) &&
                  "border-2 border-error-400 hover:border-error-400"
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
        <InputNomorPolisi
          name={`informasiMuatan.${index}.licensePlate`}
          value={data?.licensePlate || ""}
          onChange={handleLicensePlateChange}
          errorMessage={getErrorMessage("licensePlate")}
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
          placeholder={t(
            "ArmadaTable.placeholderPilihJenisTruk",
            {},
            "Pilih Jenis Truk"
          )}
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
          placeholder={t(
            "ArmadaTable.placeholderPilihJenisCarrier",
            {},
            "Pilih Jenis Carrier"
          )}
          hasError={hasError("jenis_carrier")}
        />
      </td>

      <td>
        <DropdownMerekKendaraan
          value={data?.merek_kendaraan_id || ""}
          url="v1/master/vehicle-brands"
          onChange={(value) => handleFieldChange("merek_kendaraan", value)}
          placeholder={t(
            "ArmadaTable.placeholderPilihMerekKendaraan",
            {},
            "Pilih Merek Kendaraan"
          )}
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
          placeholder={t(
            "ArmadaTable.placeholderPilihTipeKendaraan",
            {},
            "Pilih Tipe Kendaraan"
          )}
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
            <Select.Value
              placeholder={t(
                "ArmadaTable.placeholderPilihTahun",
                {},
                "Pilih Tahun"
              )}
            />
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
              <Select.Value
                placeholder={t("ArmadaTable.placeholderUnit", {}, "Unit")}
              />
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
        <InputNomorRangka
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
          placeholder={t(
            "ArmadaTable.placeholderPilihTanggal",
            {},
            "Pilih Tanggal"
          )}
          value={data?.masa_berlaku_stnk || ""}
          onChange={(value) => handleFieldChange("masa_berlaku_stnk", value)}
          errorMessage={getErrorMessage("masa_berlaku_stnk")}
          showErrorMessage={false}
          minDate={new Date()}
          maxDate={getMaxDateSTNK()}
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
        <InputNomorKIR
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
          placeholder={t(
            "ArmadaTable.placeholderPilihTanggal",
            {},
            "Pilih Tanggal"
          )}
          value={data?.masa_berlaku_kir || ""}
          onChange={(value) => handleFieldChange("masa_berlaku_kir", value)}
          errorMessage={getErrorMessage("masa_berlaku_kir")}
          showErrorMessage={false}
          minDate={new Date()}
          maxDate={getMaxDateKIR()}
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
            placeholder={t(
              "ArmadaTable.placeholderPilihTanggal",
              {},
              "Pilih Tanggal"
            )}
            value={data?.estimasi_tanggal_pemasangan_gps?.mulai || ""}
            onChange={handleGPSStartDateChange}
            errorMessage={getErrorMessage(
              "estimasi_tanggal_pemasangan_gps.mulai"
            )}
            showErrorMessage={false}
            minDate={new Date()}
            maxDate={getMaxDateGPSStart()}
          />
          <span className="text-xs font-medium">
            {t("ArmadaTable.sampaiDengan", {}, "s/d")}
          </span>
          <DatePicker
            placeholder={t(
              "ArmadaTable.placeholderPilihTanggal",
              {},
              "Pilih Tanggal"
            )}
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
            minDate={
              data?.estimasi_tanggal_pemasangan_gps?.mulai
                ? new Date(data.estimasi_tanggal_pemasangan_gps.mulai)
                : new Date()
            }
            maxDate={getMaxDateGPSEnd(
              data?.estimasi_tanggal_pemasangan_gps?.mulai
            )}
          />
        </div>
      </td>
    </tr>
  );
};

export default ArmadaTable;
