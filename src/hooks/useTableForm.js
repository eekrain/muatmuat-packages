import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useFieldArray, useForm } from "react-hook-form";

import { toast } from "@/lib/toast";

/**
 * Reusable hook for table-based forms
 * @param {Object} config - Configuration object
 * @param {Object} config.defaultValues - Default form values
 * @param {Object} config.schema - Valibot validation schema
 * @param {Function} config.onSubmit - Submit handler
 * @param {Function} config.onSaveAsDraft - Save as draft handler
 * @param {Function} config.validateAndShowErrors - Custom validation function
 * @param {Function} config.handleCellValueChange - Custom cell change handler
 * @param {string} config.fieldArrayName - Name of the field array (default: "informasiMuatan")
 */
export const useTableForm = (config) => {
  const {
    defaultValues,
    schema,
    onSubmit,
    onSaveAsDraft,
    validateAndShowErrors,
    handleCellValueChange: customCellValueChange,
    fieldArrayName = "informasiMuatan",
  } = config;

  // Table state
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  // Form setup
  const formMethods = useForm({
    defaultValues,
    resolver: valibotResolver(schema),
  });

  const {
    control,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName,
  });

  // Event handlers
  const handleAddRow = () => {
    const defaultItem = defaultValues[fieldArrayName][0];
    append(defaultItem);
  };

  const handleDeleteRows = () => {
    if (selectedRowIndex.length === 0) {
      toast.error("Harap pilih 1 item untuk menghapus");
      return;
    }
    setConfirmDeleteModal(true);
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
  };

  const handleSelectRow = (selectedRows) => {
    setSelectedRowIndex(selectedRows);
  };

  const handleCellValueChange = (rowIndex, fieldPath, value) => {
    // Use custom handler if provided, otherwise use default
    if (customCellValueChange) {
      customCellValueChange(
        rowIndex,
        fieldPath,
        value,
        setValue,
        trigger,
        errors,
        fieldArrayName
      );
    } else {
      setValue(`${fieldArrayName}.${rowIndex}.${fieldPath}`, value);

      // Clear specific field error when user fills it
      if (errors[fieldArrayName]?.[rowIndex]) {
        setTimeout(() => {
          trigger(`${fieldArrayName}.${rowIndex}.${fieldPath}`);
        }, 0);
      }
    }
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleRemove = () => {
    if (selectedRowIndex.length === 0) {
      toast.error("Harap pilih 1 item untuk menghapus");
      return;
    }

    const newFields = fields.filter(
      (_, index) => !selectedRowIndex.includes(index)
    );
    remove(selectedRowIndex);
    setSelectedRowIndex([]);
    setSelectAll(false);

    if (newFields.length === 0) {
      const defaultItem = defaultValues[fieldArrayName][0];
      append(defaultItem);
    }
    setConfirmDeleteModal(false);
    toast.success("Berhasil hapus item");
  };

  // Submit handlers
  const onSubmitHandler = (value) => {
    if (validateAndShowErrors) {
      const isValid = validateAndShowErrors(value);
      if (isValid && onSubmit) {
        onSubmit(value);
      }
    } else if (onSubmit) {
      onSubmit(value);
    }
  };

  const onSubmitError = (_errors) => {
    const formData = watch(fieldArrayName);
    if (validateAndShowErrors) {
      validateAndShowErrors({ [fieldArrayName]: formData });
    }
  };

  const handleSaveAsDraft = () => {
    const formData = watch(fieldArrayName);
    if (validateAndShowErrors) {
      const isValid = validateAndShowErrors({ [fieldArrayName]: formData });
      if (isValid && onSaveAsDraft) {
        onSaveAsDraft({ [fieldArrayName]: formData });
      }
    } else if (onSaveAsDraft) {
      onSaveAsDraft({ [fieldArrayName]: formData });
    }
  };

  // Auto-select all effect
  useEffect(() => {
    if (selectAll) {
      setSelectedRowIndex(fields.map((_, index) => index));
    } else {
      setSelectedRowIndex([]);
    }
  }, [selectAll, fields]);

  return {
    // Form methods
    formMethods,
    fields,
    errors,
    watch,
    handleSubmit: handleSubmit(onSubmitHandler, onSubmitError),

    // Table state
    selectAll,
    selectedRowIndex,
    searchValue,
    confirmDeleteModal,
    setConfirmDeleteModal,

    // Event handlers
    handleAddRow,
    handleDeleteRows,
    handleSelectAll,
    handleSelectRow,
    handleCellValueChange,
    handleSearchChange,
    handleRemove,
    handleSaveAsDraft,

    // Raw form methods (for advanced use cases)
    setValue,
    trigger,
    reset,
    append,
    remove,
  };
};
