import { useEffect, useRef, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Plus, Search } from "lucide-react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

import { cn } from "@/lib/utils";

const SelectFilterRadix = ({
  options = [],
  addData = false,
  value = null,
  onChange = () => {},
  onAddNew = null,
  onSearch = null, // New prop for server-side search
  addLabel = "Tambah Data Baru",
  placeholder = "Pilih...",
  className = "",
  disabled = false,
  searchable = true,
  maxHeight = "238px",
  errorMessage = null,
  classNameOptions,
  addModalTitle = "Tambah Data Baru",
  addModalPlaceholder = "Masukkan Data Baru",
  addModalMinLength = 3,
  addModalValidate = (val) => /^[a-zA-Z0-9\s]+$/.test(val),
  addModalErrorMessage = "Input tidak valid",
  onOpenChange = null, // New prop for open/close events
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(value);
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalValue, setAddModalValue] = useState("");
  const [addModalError, setAddModalError] = useState("");
  const searchTimeoutRef = useRef(null);

  // Filter options based on search term (only for client-side filtering)
  // For server-side search, we rely on the options prop which comes from API
  const filteredOptions = onSearch
    ? options // Use all options from API when server-side search is enabled
    : options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Clear search input when dropdown close
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      // Clear any pending search timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // Call onSearch with empty string to reset search
      if (onSearch) onSearch("");
    }
  }, [open, onSearch]);

  // Update selected option when value prop changes
  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option.value);
    onChange(option.value);
    setOpen(false);
    setSearchTerm("");
  };

  const handleAddNew = () => {
    if (addData) {
      setShowAddModal(true);
      setOpen(false);
      setSearchTerm("");
    } else if (onAddNew) {
      onAddNew(searchTerm);
      setOpen(false);
      setSearchTerm("");
    }
  };

  const handleAddModalSubmit = () => {
    if (addModalValue.length === 0) {
      setAddModalError("Field harus diisi");
      return;
    }
    if (addModalValue.length < addModalMinLength) {
      setAddModalError(`Minimal ${addModalMinLength} karakter`);
      return;
    }
    if (!addModalValidate(addModalValue)) {
      setAddModalError(addModalErrorMessage);
      return;
    }
    setAddModalError("");
    if (onAddNew) onAddNew(addModalValue);
    setShowAddModal(false);
    setAddModalValue("");
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search to avoid too many API calls
    searchTimeoutRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(newSearchTerm);
      }
    }, 300); // 300ms delay
  };

  return (
    <>
      <Popover.Root
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (onOpenChange) onOpenChange(isOpen);
        }}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-8 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-xs font-medium leading-[14.4px] transition-colors duration-200",
              disabled &&
                "cursor-not-allowed border-neutral-400 bg-neutral-100 text-neutral-500",
              open && "border-primary-700 text-neutral-900",
              !open &&
                "border-neutral-600 text-neutral-900 hover:border-primary-700",
              errorMessage && "border-red-500",
              className
            )}
          >
            <span
              className={cn(
                "truncate",
                !options.find((opt) => opt.value === selectedOption)?.label &&
                  "text-neutral-600"
              )}
            >
              {options.find((opt) => opt.value === selectedOption)?.label ||
                placeholder}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-neutral-700 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </button>
        </Popover.Trigger>
        <Popover.Content
          sideOffset={4}
          align="start"
          className={cn(
            "z-50 flex w-[var(--radix-popover-trigger-width)] flex-col rounded-md border border-neutral-400 bg-white shadow-lg",
            className
          )}
          side="bottom"
          avoidCollisions={false}
          style={{ maxHeight }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2.5">
              <div className="flex h-8 items-center gap-2 rounded-md border border-neutral-600 bg-white px-3 focus-within:border-primary-700 hover:border-primary-700">
                <Search size={16} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={placeholder.replace("Pilih ", "Cari ")}
                  className="min-w-0 flex-1 bg-transparent text-xs font-medium placeholder-neutral-600 outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      // Clear any pending search timeout
                      if (searchTimeoutRef.current) {
                        clearTimeout(searchTimeoutRef.current);
                      }
                      // Immediately trigger search with empty string
                      if (onSearch) {
                        onSearch("");
                      }
                    }}
                    className="flex-shrink-0 rounded hover:bg-neutral-100"
                    type="button"
                    aria-label="Clear search"
                  >
                    <IconComponent
                      src="/icons/silang.svg"
                      width={16}
                      height={16}
                      className="fill-neutral-700"
                    />
                  </button>
                )}
              </div>
            </div>
          )}

          {addData && (
            <>
              <button
                type="button"
                onClick={handleAddNew}
                className="w-full px-2.5"
              >
                <div className="flex h-8 items-center gap-2 hover:bg-neutral-100">
                  <Plus className="h-4 w-4 flex-shrink-0 text-primary-700" />
                  <span className="text-xs font-medium">{addLabel}</span>
                </div>
              </button>
              <hr className="border-1 mx-3 border-neutral-400" />
            </>
          )}

          {/* Options List */}
          <div className="overflow-y-auto rounded-b-md">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value || index}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "flex h-8 w-full cursor-pointer items-center justify-between px-2.5 text-left transition-colors hover:bg-neutral-200",
                    classNameOptions
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {option.image && (
                      <img
                        src={option.image}
                        className="aspect-square object-contain"
                        height={32}
                        width={32}
                        alt={option.value}
                      />
                    )}
                    <span className="truncate text-xs font-medium text-neutral-900">
                      {option.label}
                    </span>
                  </div>
                  {selectedOption && selectedOption === option.value ? (
                    <IconComponent
                      src={"/icons/check-circle16.svg"}
                      className="ml-2 text-primary-700"
                      width={16}
                      height={16}
                    />
                  ) : null}
                </button>
              ))
            ) : (
              <div className="inline-flex h-8 w-full items-center justify-center text-xs font-medium text-neutral-900">
                Data Tidak Ditemukan
              </div>
            )}
          </div>
        </Popover.Content>
        {errorMessage && (
          <p className="mt-2 text-xs font-medium leading-[1.2] text-red-500">
            {errorMessage}
          </p>
        )}
      </Popover.Root>
      {/* Modal Tambah Data */}
      {addData && (
        <Modal open={showAddModal} onOpenChange={setShowAddModal}>
          <ModalContent className="w-modal-small">
            <ModalHeader size="small" />
            <div className="px-6 py-9">
              <div className="flex flex-col items-center justify-center gap-6">
                <h2 className="w-full text-center text-base font-bold leading-[19.2px] text-neutral-900">
                  {addModalTitle}
                </h2>
                <Input
                  value={addModalValue}
                  onChange={(e) => setAddModalValue(e.currentTarget.value)}
                  placeholder={addModalPlaceholder}
                  className="w-full cursor-pointer"
                  appearance={{ inputClassName: "w-full cursor-pointer" }}
                  errorMessage={addModalError}
                />
                <div className="flex flex-row justify-center gap-2">
                  <Button
                    variant="muatparts-primary-secondary"
                    onClick={() => setShowAddModal(false)}
                    className="h-8 w-[112px]"
                  >
                    Batal
                  </Button>
                  <Button
                    variant="muatparts-primary"
                    onClick={handleAddModalSubmit}
                    className="h-8 w-[112px]"
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default SelectFilterRadix;
