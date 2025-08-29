import * as v from "valibot";

import { toast } from "@/lib/toast";

/**
 * Driver Form Schema for validation
 */
export const driverFormSchema = v.object({
  driverList: v.array(
    v.object({
      driverImage: v.pipe(
        v.any(),
        v.check((file) => file, "Foto KTP harus diupload")
      ),
      fullName: v.pipe(
        v.string(),
        v.minLength(1, "Nama lengkap driver harus diisi"),
        v.check((value) => {
          // Check if it contains only letters, spaces, dots, commas, quotes, apostrophes, and hyphens
          if (!/^[a-zA-Z\s.,'"'-]+$/.test(value)) {
            return false;
          }
          // Check minimum length of 3 characters
          if (value.trim().length < 3) {
            return false;
          }
          return true;
        }, "Penulisan nama lengkap tidak valid")
      ),
      whatsappNumber: v.pipe(
        v.string(),
        v.minLength(1, "No. WhatsApp harus diisi"),
        v.check((value) => {
          // Check if it's numbers only
          if (!/^[0-9]+$/.test(value)) {
            return false;
          }
          // Check minimum length of 8 digits
          if (value.length < 8) {
            return false;
          }
          return true;
        }, "No. WhatsApp minimal 8 digit dan hanya boleh angka")
      ),
      ktpPhoto: v.pipe(
        v.any(),
        v.check((file) => file, "Foto KTP harus diupload")
      ),
      simB2Photo: v.pipe(
        v.any(),
        v.check((file) => file, "Foto SIM B2 harus diupload")
      ),
      simB2ExpiryDate: v.pipe(
        v.union([v.date(), v.string()]),
        v.check((value) => {
          if (typeof value === "string") {
            return value.trim() !== "";
          }
          return value instanceof Date;
        }, "Masa berlaku SIM B2 harus diisi")
      ),
    })
  ),
});

/**
 * Default values for driver form
 */
export const driverDefaultValues = {
  driverList: [
    {
      driverImage: null,
      fullName: "",
      whatsappNumber: "",
      ktpPhoto: null,
      simB2Photo: null,
      simB2ExpiryDate: "",
    },
  ],
};

/**
 * Handle cell value change for driver table
 * @param {number} rowIndex - Row index
 * @param {string} fieldPath - Field path (e.g., 'fullName', 'whatsappNumber')
 * @param {any} value - New value
 * @param {Function} setValue - React Hook Form setValue function
 * @param {Function} trigger - React Hook Form trigger function
 * @param {Object} errors - Form errors object
 * @param {string} fieldArrayName - Field array name (default: "driverList")
 */
export const handleDriverCellValueChange = (
  rowIndex,
  fieldPath,
  value,
  setValue,
  trigger,
  errors,
  fieldArrayName = "driverList"
) => {
  setValue(`${fieldArrayName}.${rowIndex}.${fieldPath}`, value);

  // Clear specific field error when user fills it
  if (errors[fieldArrayName]?.[rowIndex]) {
    setTimeout(() => {
      trigger(`${fieldArrayName}.${rowIndex}.${fieldPath}`);
    }, 0);
  }
};

/**
 * Validate driver form and show errors
 * @param {Object} data - Form data object with driverList array
 * @param {Function} setError - React Hook Form setError function
 * @param {string} fieldArrayName - Field array name (default: "driverList")
 * @returns {boolean} - Validation result
 */
export const validateDriverForm = (
  data,
  setError,
  fieldArrayName = "driverList"
) => {
  const emptyFields = [];
  let hasInvalidWhatsApp = false;
  let hasMinLengthWhatsApp = false;
  let hasInvalidFullName = false;
  let hasMinLengthFullName = false;
  const invalidWhatsAppIndexes = [];
  const minLengthWhatsAppIndexes = [];
  const invalidFullNameIndexes = [];
  const minLengthFullNameIndexes = [];

  data[fieldArrayName].forEach((driver, index) => {
    const fieldLabels = {
      driverImage: "Foto driver",
      fullName: "Nama lengkap",
      whatsappNumber: "No. WhatsApp",
      ktpPhoto: "Foto KTP",
      simB2Photo: "Foto SIM B2",
      simB2ExpiryDate: "Masa berlaku SIM B2",
    };

    // Check fullName validation
    if (driver.fullName && driver.fullName.trim() !== "") {
      const fullNameRegex = /^[a-zA-Z\s.,'"'-]+$/;
      const trimmedName = driver.fullName.trim();

      // Check if it contains only valid characters
      if (!fullNameRegex.test(trimmedName)) {
        hasInvalidFullName = true;
        invalidFullNameIndexes.push(index);
      }
      // Check minimum length of 3 characters
      else if (trimmedName.length < 3) {
        hasMinLengthFullName = true;
        minLengthFullNameIndexes.push(index);
      }
    }

    // Check WhatsApp validation
    if (driver.whatsappNumber && driver.whatsappNumber.trim() !== "") {
      const numbersOnly = /^[0-9]+$/;
      const trimmedNumber = driver.whatsappNumber.trim();

      // Check if it contains only numbers
      if (!numbersOnly.test(trimmedNumber)) {
        hasInvalidWhatsApp = true;
        invalidWhatsAppIndexes.push(index);
      }
      // Check minimum length of 8 digits
      else if (trimmedNumber.length < 8) {
        hasMinLengthWhatsApp = true;
        minLengthWhatsAppIndexes.push(index);
      }
    }

    // Check required fields and set errors for each one
    if (!driver.driverImage) {
      emptyFields.push(`${fieldLabels["driverImage"]} (Driver ${index + 1})`);
      if (setError) {
        setError(`${fieldArrayName}.${index}.driverImage`, {
          type: "manual",
          message: "Foto driver wajib diisi",
        });
      }
    }
    if (!driver.fullName || driver.fullName.trim() === "") {
      emptyFields.push(`${fieldLabels["fullName"]} (Driver ${index + 1})`);
      if (setError) {
        setError(`${fieldArrayName}.${index}.fullName`, {
          type: "manual",
          message: "Nama lengkap wajib diisi",
        });
      }
    }
    if (!driver.whatsappNumber || driver.whatsappNumber.trim() === "") {
      emptyFields.push(
        `${fieldLabels["whatsappNumber"]} (Driver ${index + 1})`
      );
      if (setError) {
        setError(`${fieldArrayName}.${index}.whatsappNumber`, {
          type: "manual",
          message: "No. WhatsApp wajib diisi",
        });
      }
    }
    if (!driver.ktpPhoto) {
      emptyFields.push(`${fieldLabels["ktpPhoto"]} (Driver ${index + 1})`);
      if (setError) {
        setError(`${fieldArrayName}.${index}.ktpPhoto`, {
          type: "manual",
          message: "Foto KTP wajib diisi",
        });
      }
    }
    if (!driver.simB2Photo) {
      emptyFields.push(`${fieldLabels["simB2Photo"]} (Driver ${index + 1})`);
      if (setError) {
        setError(`${fieldArrayName}.${index}.simB2Photo`, {
          type: "manual",
          message: "Foto SIM B2 wajib diisi",
        });
      }
    }
    if (
      !driver.simB2ExpiryDate ||
      (typeof driver.simB2ExpiryDate === "string" &&
        driver.simB2ExpiryDate.trim() === "") ||
      (driver.simB2ExpiryDate instanceof Date &&
        isNaN(driver.simB2ExpiryDate.getTime()))
    ) {
      emptyFields.push(
        `${fieldLabels["simB2ExpiryDate"]} (Driver ${index + 1})`
      );
      if (setError) {
        setError(`${fieldArrayName}.${index}.simB2ExpiryDate`, {
          type: "manual",
          message: "Masa berlaku SIM B2 wajib diisi",
        });
      }
    }
  });

  // Check for invalid fullName format first (highest priority)
  if (hasInvalidFullName) {
    // Set errors for invalid fullName (invalid characters)
    invalidFullNameIndexes.forEach((index) => {
      if (setError) {
        setError(`${fieldArrayName}.${index}.fullName`, {
          type: "manual",
          message: "Penulisan nama lengkap tidak valid",
        });
      }
    });
    toast.error("Penulisan nama lengkap tidak valid");
    return false;
  }

  // Check for minimum length fullName (second priority)
  if (hasMinLengthFullName) {
    // Set errors for fullName with insufficient length
    minLengthFullNameIndexes.forEach((index) => {
      if (setError) {
        setError(`${fieldArrayName}.${index}.fullName`, {
          type: "manual",
          message: "Nama lengkap minimal 3 karakter",
        });
      }
    });
    toast.error("Nama lengkap minimal 3 karakter");
    return false;
  }

  // Check for invalid WhatsApp format (third priority)
  if (hasInvalidWhatsApp) {
    // Set errors for invalid WhatsApp numbers (non-numeric characters)
    invalidWhatsAppIndexes.forEach((index) => {
      if (setError) {
        setError(`${fieldArrayName}.${index}.whatsappNumber`, {
          type: "manual",
          message: "No. WhatsApp hanya boleh berisi angka",
        });
      }
    });
    toast.error("No. WhatsApp hanya boleh berisi angka");
    return false;
  }

  // Check for minimum length WhatsApp numbers (fourth priority)
  if (hasMinLengthWhatsApp) {
    // Set errors for WhatsApp numbers with insufficient length
    minLengthWhatsAppIndexes.forEach((index) => {
      if (setError) {
        setError(`${fieldArrayName}.${index}.whatsappNumber`, {
          type: "manual",
          message: "No. WhatsApp minimal 8 digit",
        });
      }
    });
    toast.error("No. WhatsApp minimal 8 digit");
    return false;
  }

  if (emptyFields.length === 1) {
    toast.error(`${emptyFields[0]} wajib diisi`);
  } else if (emptyFields.length > 1) {
    toast.error("Field Belum Diisi");
  }

  // If there are empty required fields, return false immediately
  if (emptyFields.length > 0) {
    return false;
  }

  // Check for duplicate WhatsApp numbers only if all required fields are filled
  const whatsappNumbers = data[fieldArrayName]
    .map((driver, index) => ({
      number: (driver.whatsappNumber || "").toLowerCase().replace(/\s/g, ""),
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
    // Set errors for duplicate WhatsApp numbers
    duplicateIndexes.forEach((index) => {
      if (setError) {
        setError(`${fieldArrayName}.${index}.whatsappNumber`, {
          type: "manual",
          message: "No. Whatsapp telah terdaftar",
        });
      }
    });
    toast.error("No. Whatsapp telah terdaftar");
    return false;
  }

  return true;
};

/**
 * Create new driver entry with default values
 * @returns {Object} - New driver object
 */
export const createNewDriverEntry = () => ({
  driverImage: null,
  fullName: "",
  whatsappNumber: "",
  ktpPhoto: null,
  simB2Photo: null,
  simB2ExpiryDate: "",
});

/**
 * Submit handler for driver form
 * @param {Object} value - Form values
 */
export const handleDriverSubmit = (value) => {
  // TODO: Implement API call with the payload
  void value; // Temporarily silence unused variable warning
  toast.success(`Berhasil menyimpan ${value.driverList.length} driver`);
};

/**
 * Save as draft handler for driver form
 * @param {Object} value - Form values
 */
export const handleDriverSaveAsDraft = (value) => {
  // TODO: Implement API call for saving as draft
  void value; // Temporarily silence unused variable warning
  toast.success("Berhasil tambah sebagai draft");
};
