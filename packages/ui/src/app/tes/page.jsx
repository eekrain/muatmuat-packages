"use client";

import { useState } from "react";

import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";

export default function TestPage() {
  // Mock data for different scenarios
  const mockFiltersWithIcons = [
    { id: 1, label: "Jakarta", item: { icon: "/icons/location.svg" } },
    { id: 2, label: "Truck", item: { icon: "/icons/truck.svg" } },
    { id: 3, label: "Under 5 Years", item: { icon: "/icons/calendar.svg" } },
    {
      id: 4,
      label: "Price: Low to High",
      item: { icon: "/icons/sorting16.svg" },
    },
    { id: 5, label: "Available Now", item: { icon: "/icons/check16.svg" } },
    {
      id: 6,
      label: "Verified Driver",
      item: { icon: "/icons/verified-green.svg" },
    },
  ];

  const mockFiltersWithoutIcons = [
    { id: 1, label: "Jakarta" },
    { id: 2, label: "Sedan" },
    { id: 3, label: "Under 5 Years" },
    { id: 4, label: "Price: Low to High" },
  ];

  const mockFiltersLongLabels = [
    { id: 1, label: "Very Long Filter Label That Might Cause Overflow Issues" },
    { id: 2, label: "Another Extremely Long Filter Name Here For Testing" },
    { id: 3, label: "Short" },
    { id: 4, label: "Medium Length Filter" },
    { id: 5, label: "Yet Another Very Long Filter Label For Testing Purposes" },
    { id: 6, label: "Super Long Filter Label That Definitely Needs Scrolling" },
  ];

  const [filters1, setFilters1] = useState([...mockFiltersWithIcons]);
  const [filters2, setFilters2] = useState([...mockFiltersWithoutIcons]);
  const [filters3, setFilters3] = useState([...mockFiltersLongLabels]);
  const [filters4, setFilters4] = useState([
    ...mockFiltersWithIcons.slice(0, 2),
  ]);
  const [filters5, setFilters5] = useState([]);

  const handleRemoveFilter = (setter) => (filter) => {
    setter((prev) => prev.filter((f) => f.id !== filter.id));
  };

  const handleClearAll = (setter) => () => {
    setter([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          ActiveFiltersBar Component Test
        </h1>

        {/* Test Case 1: With Icons */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Test 1: Filters with Icons
          </h2>
          <p className="mb-4 text-gray-600">
            Testing the component with filters that have icons.
          </p>
          <ActiveFiltersBar
            filters={filters1}
            onRemoveFilter={handleRemoveFilter(setFilters1)}
            onClearAll={handleClearAll(setFilters1)}
            clearAllText="Clear All Filters"
          />
          <div className="mt-4 text-sm text-gray-500">
            Filters count: {filters1.length}
          </div>
        </div>

        {/* Test Case 2: Without Icons */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Test 2: Filters without Icons
          </h2>
          <p className="mb-4 text-gray-600">
            Testing the component with filters that don't have icons.
          </p>
          <ActiveFiltersBar
            filters={filters2}
            onRemoveFilter={handleRemoveFilter(setFilters2)}
            onClearAll={handleClearAll(setFilters2)}
            clearAllText="Hapus Semua"
          />
          <div className="mt-4 text-sm text-gray-500">
            Filters count: {filters2.length}
          </div>
        </div>

        {/* Test Case 3: Long Labels */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Test 3: Long Filter Labels
          </h2>
          <p className="mb-4 text-gray-600">
            Testing the component with very long filter labels to check
            scrolling behavior.
          </p>
          <ActiveFiltersBar
            filters={filters3}
            onRemoveFilter={handleRemoveFilter(setFilters3)}
            onClearAll={handleClearAll(setFilters3)}
            clearAllText="Clear All"
          />
          <div className="mt-4 text-sm text-gray-500">
            Filters count: {filters3.length}
          </div>
        </div>

        {/* Test Case 4: No Clear All Button */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Test 4: No Clear All Button
          </h2>
          <p className="mb-4 text-gray-600">
            Testing the component with showClearAll set to false.
          </p>
          <ActiveFiltersBar
            filters={filters4}
            onRemoveFilter={handleRemoveFilter(setFilters4)}
            onClearAll={handleClearAll(setFilters4)}
            showClearAll={false}
          />
          <div className="mt-4 text-sm text-gray-500">
            Filters count: {filters4.length}
          </div>
        </div>

        {/* Test Case 5: Empty State */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Test 5: Empty State
          </h2>
          <p className="mb-4 text-gray-600">
            Testing the component when there are no filters (should return
            null).
          </p>
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <ActiveFiltersBar
              filters={filters5}
              onRemoveFilter={handleRemoveFilter(setFilters5)}
              onClearAll={handleClearAll(setFilters5)}
            />
            <p className="mt-4 text-gray-500">
              Component should not render anything above this text.
            </p>
          </div>
        </div>

        {/* Test Case 6: Custom Styling */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Test 6: Custom Styling
          </h2>
          <p className="mb-4 text-gray-600">
            Testing the component with custom className and styling.
          </p>
          <ActiveFiltersBar
            filters={filters1.slice(0, 3)}
            onRemoveFilter={handleRemoveFilter(setFilters1)}
            onClearAll={handleClearAll(setFilters1)}
            className="rounded-lg border border-blue-200 bg-blue-50 p-4"
            tagClassName="bg-blue-100 border-blue-300 text-blue-800"
            scrollButtonClassName="bg-blue-500 text-white hover:bg-blue-600"
            clearAllText="Reset Filters"
          />
        </div>

        {/* Reset All Button */}
        <div className="rounded-lg bg-gray-100 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Reset All Tests
          </h2>
          <button
            onClick={() => {
              setFilters1([...mockFiltersWithIcons]);
              setFilters2([...mockFiltersWithoutIcons]);
              setFilters3([...mockFiltersLongLabels]);
              setFilters4([...mockFiltersWithIcons.slice(0, 2)]);
              setFilters5([]);
            }}
            className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-white transition-colors"
          >
            Reset All Filters
          </button>
        </div>

        {/* Component Information */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-blue-900">
            Component Information
          </h2>
          <div className="space-y-2 text-blue-800">
            <p>
              <strong>Component:</strong> ActiveFiltersBar
            </p>
            <p>
              <strong>Location:</strong>{" "}
              src/components/ActiveFiltersBar/ActiveFiltersBar.jsx
            </p>
            <p>
              <strong>Dependencies:</strong> lucide-react, @/lib/utils,
              IconComponent
            </p>
            <p>
              <strong>Styling:</strong> Tailwind CSS with custom color palette
            </p>
            <p>
              <strong>Features:</strong> Scrollable, removable filters, clear
              all, icons support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
