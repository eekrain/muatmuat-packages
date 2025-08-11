import { useState } from "react";

import FileUploadInput from "@/app/transporter/(main)/manajemen-armada/tambah-massal/components/FileUploadInput";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DatePicker from "@/components/DatePicker/DatePicker";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import ModalAddImage from "../ModalAddImage/ModalAddImage";
import InputFullName from "./InputFullName";
import InputPhoneNumber from "./InputPhoneNumber";

/**
 * Utility functions for date calculations
 */
const getMaxDateSIMB2 = () => {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 5); // SIM B2 typically valid for 5 years
  return maxDate;
};

/**
 * Utility function to validate all WhatsApp numbers for duplicates
 * Can be called externally (e.g., on form submit)
 * @param {Array} data - Array of driver data
 * @param {Function} setError - React Hook Form setError function (optional)
 * @param {string} fieldArrayName - Name of the field array (optional)
 * @param {Function} t - Translation function (optional)
 * @returns {boolean} - True if no duplicates found, false if duplicates exist
 */
export const validateAllWhatsAppNumbers = (
  data,
  setError = null,
  fieldArrayName = "driverList",
  t = null
) => {
  const whatsappNumbers = data
    .map((item, index) => ({
      number: (item.whatsappNumber || "").toLowerCase().replace(/\s/g, ""),
      index,
    }))
    .filter((item) => item.number.length > 0);

  const numberGroups = {};
  whatsappNumbers.forEach(({ number, index }) => {
    if (!numberGroups[number]) {
      numberGroups[number] = [];
    }
    numberGroups[number].push(index);
  });

  const duplicateIndexes = [];
  Object.values(numberGroups).forEach((indexes) => {
    if (indexes.length > 1) {
      duplicateIndexes.push(...indexes);
    }
  });

  if (duplicateIndexes.length > 0) {
    const errorMessage = t
      ? t(
          "DriverTable.messageErrorDuplicateWhatsapp",
          {},
          "No. WhatsApp sudah terdaftar"
        )
      : "No. WhatsApp sudah terdaftar";

    // Set errors for duplicate WhatsApp numbers
    if (setError) {
      duplicateIndexes.forEach((index) => {
        setError(`${fieldArrayName}.${index}.whatsappNumber`, {
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

const DriverTable = ({
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
      onCellValueChange?.(activeImageIndex, "driverImage", images);
      setAddArmadaImageModal(false);
      setActiveImageIndex(null);
    }
  };

  const handleImageModalClose = () => {
    setAddArmadaImageModal(false);
    setActiveImageIndex(null);
  };

  // Filter data based on search value (full name or WhatsApp number)
  const filteredData = data.filter((item) => {
    if (!searchValue.trim()) return true; // Show all if no search value

    const fullName = item.fullName || "";
    const whatsappNumber = item.whatsappNumber || "";

    // Case-insensitive search that also removes spaces and special characters for better matching
    const normalizedSearch = searchValue.toLowerCase().replace(/[\s-]/g, "");
    const normalizedFullName = fullName.toLowerCase().replace(/[\s-]/g, "");
    const normalizedWhatsappNumber = whatsappNumber
      .toLowerCase()
      .replace(/[\s-]/g, "");

    return (
      normalizedFullName.includes(normalizedSearch) ||
      normalizedWhatsappNumber.includes(normalizedSearch)
    );
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
                placeholder={t(
                  "DriverTable.placeholderSearchDriver",
                  {},
                  "Cari Driver"
                )}
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
              {t("DriverTable.buttonAdd", {}, "Tambah")}
            </Button>
            <Button
              type="button"
              onClick={onDeleteRows}
              variant="muatparts-error-secondary"
            >
              {t("DriverTable.buttonDelete", {}, "Hapus")}
            </Button>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="font-semibold">
              {t(
                "DriverTable.labelTotalDrivers",
                { count: filteredData.length },
                `Total : ${filteredData.length} Driver`
              )}
              {searchValue.trim() && filteredData.length !== data.length && (
                <span className="text-neutral-600">
                  {" "}
                  {t(
                    "DriverTable.labelFromTotal",
                    { total: data.length },
                    `dari ${data.length}`
                  )}
                </span>
              )}
            </p>
            {searchValue.trim() && (
              <p className="text-xs text-neutral-600">
                {filteredData.length > 0
                  ? t(
                      "DriverTable.messageSearchResults",
                      { keyword: searchValue },
                      `Menampilkan hasil pencarian untuk &ldquo;${searchValue}&rdquo;`
                    )
                  : t(
                      "DriverTable.messageNoSearchResults",
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
            <table className="table-tambah-driver-massal w-full table-fixed overflow-auto">
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
                      {t("DriverTable.headerDriver", {}, "Driver*")}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "DriverTable.headerWhatsappNumber",
                        {},
                        "No. Whatsapp*"
                      )}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t("DriverTable.headerKtpPhoto", {}, "Foto KTP*")}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t("DriverTable.headerSimB2Photo", {}, "Foto SIM B2*")}
                    </span>
                  </th>
                  <th className="w-[180px]">
                    <span className="text-xs font-semibold text-gray-500">
                      {t(
                        "DriverTable.headerSimB2Expiry",
                        {},
                        "Masa Berlaku SIM B2*"
                      )}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && searchValue.trim() ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <DataNotFound
                          type="search"
                          title={t(
                            "DriverTable.titleKeywordNotFound",
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
                        (dataItem.fullName &&
                          dataItem.fullName === item.fullName &&
                          dataItem.whatsappNumber === item.whatsappNumber &&
                          JSON.stringify(dataItem) === JSON.stringify(item))
                    );

                    return (
                      <DriverTableRow
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

      {/* Modal Add Driver Image */}
      <ModalAddImage
        isOpen={addArmadaImageModal}
        onClose={handleImageModalClose}
        value={
          activeImageIndex !== null ? data[activeImageIndex]?.driverImage : null
        }
        onSave={handleImageSave}
      />
    </>
  );
};

const DriverTableRow = ({
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
   * Handle WhatsApp number change
   * @param {Event} e - Input change event
   */
  const handleWhatsAppNumberChange = (e) => {
    const newValue = e.target.value;

    // Update the field value only
    handleFieldChange("whatsappNumber", newValue);
  };

  /**
   * Handle full name change
   * @param {Event} e - Input change event
   */
  const handleFullNameChange = (e) => {
    const newValue = e.target.value;

    // Update the field value only
    handleFieldChange("fullName", newValue);
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
          htmlFor={`foto-driver-${index}`}
        >
          {data?.driverImage ? (
            <img
              src={data.driverImage.driver_image}
              alt={t("DriverTable.altDriverPhoto", {}, "Foto Driver")}
              className={cn(
                "w-12 shrink cursor-pointer rounded-lg object-cover",
                hasError("driverImage") &&
                  "border-error-400 hover:border-error-400"
              )}
            />
          ) : (
            <div
              className={`w-fit cursor-pointer rounded-lg border border-dashed p-2 hover:text-primary-700 ${
                hasError("driverImage")
                  ? "border-error-400 hover:border-error-400"
                  : "border-neutral-600 hover:border-primary-700"
              }`}
            >
              <IconComponent src="/icons/add-image20.svg" />
            </div>
          )}
        </label>
        <InputFullName
          name={`driverList.${index}.fullName`}
          value={data?.fullName || ""}
          onChange={handleFullNameChange}
          hasError={hasError("fullName")}
          placeholder={t(
            "DriverTable.placeholderFullName",
            {},
            "Masukkan Nama Lengkap"
          )}
        />
      </td>

      <td>
        <InputPhoneNumber
          name={`driverList.${index}.whatsappNumber`}
          value={data?.whatsappNumber || ""}
          onChange={handleWhatsAppNumberChange}
          hasError={hasError("whatsappNumber")}
          placeholder={t(
            "DriverTable.placeholderPhoneNumber",
            {},
            "Contoh: 08xxxxxxxxxx"
          )}
        />
      </td>

      <td>
        <FileUploadInput
          id={`foto-ktp-${index}`}
          value={data?.ktpPhoto}
          onChange={(file) => handleFieldChange("ktpPhoto", file)}
          hasError={hasError("ktpPhoto")}
        />
      </td>

      <td>
        <FileUploadInput
          id={`foto-sim-b2-${index}`}
          value={data?.simB2Photo}
          onChange={(file) => handleFieldChange("simB2Photo", file)}
          hasError={hasError("simB2Photo")}
        />
      </td>

      <td className="relative">
        <DatePicker
          placeholder={t(
            "DriverTable.placeholderSelectDate",
            {},
            "Pilih Tanggal"
          )}
          value={data?.simB2ExpiryDate || ""}
          onChange={(value) => handleFieldChange("simB2ExpiryDate", value)}
          errorMessage={getErrorMessage("simB2ExpiryDate")}
          showErrorMessage={false}
          minDate={new Date()}
          maxDate={getMaxDateSIMB2()}
        />
      </td>
    </tr>
  );
};

export default DriverTable;
