import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Select } from "@/components/Select/Select";

// Example data
const truckTypes = [
  { value: "colt-diesel-engkel", label: "Colt Diesel Engkel" },
  { value: "colt-diesel-double", label: "Colt Diesel Double" },
  { value: "tractor-head-4x2", label: "Tractor Head 4x2" },
  { value: "tractor-head-6x4", label: "Tractor Head 6x4" },
  {
    value: "medium-truck",
    label: "Medium Truck 4x2 (Rigid) Premium Nitro Boost Supercharge",
  },
];

const brands = [
  { value: "mitsubishi", label: "Mitsubishi" },
  { value: "hino", label: "Hino" },
  { value: "isuzu", label: "Isuzu" },
  { value: "mercedes", label: "Mercedes Benz" },
];

const trucksWithImages = [
  {
    value: "colt-diesel-engkel",
    label: "Colt Diesel Engkel",
    icon: "/icons/truck.svg",
    description: "Kapasitas: 3-5 ton",
  },
  {
    value: "tractor-head-4x2",
    label: "Tractor Head 4x2",
    icon: "/icons/truck.svg",
    description: "Kapasitas: 15-20 ton",
  },
  {
    value: "medium-truck",
    label: "Medium Truck 4x2",
    icon: "/icons/truck.svg",
    description: "Kapasitas: 8-12 ton",
  },
];

export default function SelectExample() {
  const [selectedTruck, setSelectedTruck] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedWithSearch, setSelectedWithSearch] = useState("");
  const [selectedWithImages, setSelectedWithImages] = useState("");

  return (
    <div className="max-w-md space-y-8 p-8">
      <h1 className="text-2xl font-bold">Select Component Examples</h1>

      {/* Basic Select */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Basic Select</h2>
        <Select.Root value={selectedTruck} onValueChange={setSelectedTruck}>
          <Select.Trigger placeholder="Pilih Jenis Truck">
            <Select.Value placeholder="Pilih Jenis Truck" />
          </Select.Trigger>
          <Select.Content>
            {truckTypes.map((truck) => (
              <Select.Item
                key={truck.value}
                value={truck.value}
                textValue={truck.label}
              >
                <span className="truncate text-xs font-medium text-neutral-900">
                  {truck.label}
                </span>
              </Select.Item>
            ))}
            <Select.Empty>No trucks found.</Select.Empty>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Select with Images and Complex Content */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">
          Select with Images & Descriptions
        </h2>
        <Select.Root
          value={selectedWithImages}
          onValueChange={setSelectedWithImages}
        >
          <Select.Trigger placeholder="Pilih Truck dengan Detail">
            <Select.Value placeholder="Pilih Truck dengan Detail" />
          </Select.Trigger>
          <Select.Content>
            {trucksWithImages.map((truck) => (
              <Select.Item
                key={truck.value}
                value={truck.value}
                textValue={truck.label}
                height="h-12" // Custom height for larger content
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded border border-neutral-300 bg-neutral-50">
                    <IconComponent
                      src={truck.icon}
                      width={16}
                      height={16}
                      className="text-neutral-600"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-neutral-900">
                      {truck.label}
                    </span>
                    <span className="text-xs text-neutral-600">
                      {truck.description}
                    </span>
                  </div>
                </div>
              </Select.Item>
            ))}
            <Select.Empty>Data Tidak Ditemukan</Select.Empty>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Select with Search */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Select with Search</h2>
        <Select.Root
          value={selectedWithSearch}
          onValueChange={setSelectedWithSearch}
        >
          <Select.Trigger placeholder="Cari Jenis Truck">
            <Select.Value placeholder="Cari Jenis Truck" />
          </Select.Trigger>
          <Select.Content searchable searchPlaceholder="Cari Jenis Truck">
            {truckTypes.map((truck) => (
              <Select.Item
                key={truck.value}
                value={truck.value}
                textValue={truck.label}
              >
                <span className="truncate text-xs font-medium text-neutral-900">
                  {truck.label}
                </span>
              </Select.Item>
            ))}
            <Select.Empty>Data Tidak Ditemukan</Select.Empty>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Select with Groups */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Select with Groups</h2>
        <Select.Root value={selectedBrand} onValueChange={setSelectedBrand}>
          <Select.Trigger placeholder="Pilih Merek">
            <Select.Value placeholder="Pilih Merek" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group label="Japanese Brands">
              <Select.Item value="mitsubishi" textValue="Mitsubishi">
                <span className="truncate text-xs font-medium text-neutral-900">
                  Mitsubishi
                </span>
              </Select.Item>
              <Select.Item value="hino" textValue="Hino">
                <span className="truncate text-xs font-medium text-neutral-900">
                  Hino
                </span>
              </Select.Item>
              <Select.Item value="isuzu" textValue="Isuzu">
                <span className="truncate text-xs font-medium text-neutral-900">
                  Isuzu
                </span>
              </Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group label="European Brands">
              <Select.Item value="mercedes" textValue="Mercedes Benz">
                <span className="truncate text-xs font-medium text-neutral-900">
                  Mercedes Benz
                </span>
              </Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Select with Add New */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">
          Select with Add New Option
        </h2>
        <Select.Root value={selectedBrand} onValueChange={setSelectedBrand}>
          <Select.Trigger placeholder="Pilih atau Tambah Merek">
            <Select.Value placeholder="Pilih atau Tambah Merek" />
          </Select.Trigger>
          <Select.Content
            searchable
            searchPlaceholder="Cari Merek"
            onAddNew={(searchTerm) => {
              alert(`Adding new brand: ${searchTerm}`);
            }}
            addNewText="Tambah Merek Baru"
          >
            {brands.map((brand) => (
              <Select.Item
                key={brand.value}
                value={brand.value}
                textValue={brand.label}
              >
                <span className="truncate text-xs font-medium text-neutral-900">
                  {brand.label}
                </span>
              </Select.Item>
            ))}
            <Select.Empty>Data Tidak Ditemukan</Select.Empty>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Disabled Select */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Disabled Select</h2>
        <Select.Root value="" onValueChange={() => {}} disabled>
          <Select.Trigger placeholder="Disabled Select">
            <Select.Value placeholder="Disabled Select" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="disabled" textValue="Disabled">
              <span className="truncate text-xs font-medium text-neutral-900">
                This won&apos;t work
              </span>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Error State */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">Error State</h2>
        <Select.Root value="" onValueChange={() => {}}>
          <Select.Trigger
            placeholder="Select with Error"
            errorMessage="This field is required"
          >
            <Select.Value placeholder="Select with Error" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="error" textValue="Error">
              <span className="truncate text-xs font-medium text-neutral-900">
                Error option
              </span>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Custom Item without Check Icon */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">
          Custom Item (No Check Icon)
        </h2>
        <Select.Root value={selectedBrand} onValueChange={setSelectedBrand}>
          <Select.Trigger placeholder="Custom Items">
            <Select.Value placeholder="Custom Items" />
          </Select.Trigger>
          <Select.Content>
            {brands.map((brand) => (
              <Select.Item
                key={brand.value}
                value={brand.value}
                textValue={brand.label}
                showCheckIcon={false}
                className="bg-primary-50 hover:bg-primary-100"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-medium text-primary-700">
                    {brand.label}
                  </span>
                  <span className="text-xs text-primary-600">✓</span>
                </div>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      {/* Current Values Display */}
      <div className="mt-8 rounded-md bg-neutral-100 p-4">
        <h3 className="mb-2 font-semibold">Current Values:</h3>
        <p className="text-sm">Selected Truck: {selectedTruck || "None"}</p>
        <p className="text-sm">Selected Brand: {selectedBrand || "None"}</p>
        <p className="text-sm">
          Selected with Search: {selectedWithSearch || "None"}
        </p>
        <p className="text-sm">
          Selected with Images: {selectedWithImages || "None"}
        </p>
      </div>
    </div>
  );
}
