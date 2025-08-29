import { useState } from "react";

import ActiveFiltersBar from "./ActiveFiltersBar";

export default {
  title: "Components/ActiveFiltersBar",
  component: ActiveFiltersBar,
  parameters: {
    docs: {
      description: {
        component:
          "A horizontal bar displaying active filters as removable tags with optional scroll functionality for overflow management.",
      },
    },
  },
  argTypes: {
    filters: {
      description: "Array of filter objects to display",
      control: { type: "object" },
    },
    onRemoveFilter: {
      description: "Callback function when a filter is removed",
      action: "filter removed",
    },
    onClearAll: {
      description: "Callback function when clear all is clicked",
      action: "all filters cleared",
    },
    className: {
      description: "Additional CSS classes for the container",
      control: { type: "text" },
    },
    showClearAll: {
      description: "Whether to show the clear all button",
      control: { type: "boolean" },
    },
    clearAllText: {
      description: "Text for the clear all button",
      control: { type: "text" },
    },
    emptyText: {
      description:
        "Text to show when no filters are active (not used in current implementation)",
      control: { type: "text" },
    },
    tagClassName: {
      description: "Additional CSS classes for filter tags",
      control: { type: "text" },
    },
    scrollButtonClassName: {
      description: "Additional CSS classes for scroll buttons",
      control: { type: "text" },
    },
  },
};

const mockFilters = [
  { id: 1, label: "Jakarta", item: { icon: "/icons/location.svg" } },
  { id: 2, label: "Sedan", item: { icon: "/icons/truck.svg" } },
  { id: 3, label: "Under 5 Years", item: { icon: "/icons/calendar.svg" } },
  {
    id: 4,
    label: "Price: Low to High",
    item: { icon: "/icons/sorting16.svg" },
  },
];

const mockFiltersWithoutIcons = [
  { id: 1, label: "Jakarta" },
  { id: 2, label: "Sedan" },
  { id: 3, label: "Under 5 Years" },
  { id: 4, label: "Price: Low to High" },
];

const mockFiltersLongLabels = [
  { id: 1, label: "Very Long Filter Label That Might Cause Overflow" },
  { id: 2, label: "Another Extremely Long Filter Name Here" },
  { id: 3, label: "Short" },
  { id: 4, label: "Medium Length Filter" },
  { id: 5, label: "Yet Another Very Long Filter Label For Testing" },
];

export const Default = {
  args: {
    filters: mockFilters,
    showClearAll: true,
    clearAllText: "Hapus Semua Filter",
  },
  render: (args) => {
    const [filters, setFilters] = useState(args.filters);

    const handleRemoveFilter = (filter) => {
      setFilters(filters.filter((f) => f.id !== filter.id));
      args.onRemoveFilter(filter);
    };

    const handleClearAll = () => {
      setFilters([]);
      args.onClearAll();
    };

    return (
      <ActiveFiltersBar
        {...args}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
    );
  },
};

export const WithoutIcons = {
  args: {
    filters: mockFiltersWithoutIcons,
    showClearAll: true,
    clearAllText: "Clear All",
  },
  render: (args) => {
    const [filters, setFilters] = useState(args.filters);

    const handleRemoveFilter = (filter) => {
      setFilters(filters.filter((f) => f.id !== filter.id));
      args.onRemoveFilter(filter);
    };

    const handleClearAll = () => {
      setFilters([]);
      args.onClearAll();
    };

    return (
      <ActiveFiltersBar
        {...args}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
    );
  },
};

export const LongLabels = {
  args: {
    filters: mockFiltersLongLabels,
    showClearAll: true,
    clearAllText: "Clear All Filters",
  },
  render: (args) => {
    const [filters, setFilters] = useState(args.filters);

    const handleRemoveFilter = (filter) => {
      setFilters(filters.filter((f) => f.id !== filter.id));
      args.onRemoveFilter(filter);
    };

    const handleClearAll = () => {
      setFilters([]);
      args.onClearAll();
    };

    return (
      <ActiveFiltersBar
        {...args}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
    );
  },
};

export const NoClearAll = {
  args: {
    filters: mockFilters.slice(0, 2),
    showClearAll: false,
  },
  render: (args) => {
    const [filters, setFilters] = useState(args.filters);

    const handleRemoveFilter = (filter) => {
      setFilters(filters.filter((f) => f.id !== filter.id));
      args.onRemoveFilter(filter);
    };

    return (
      <ActiveFiltersBar
        {...args}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
      />
    );
  },
};

export const Empty = {
  args: {
    filters: [],
    showClearAll: true,
  },
  render: (args) => <ActiveFiltersBar {...args} />,
};

export const Playground = {
  args: {
    filters: mockFilters,
    showClearAll: true,
    clearAllText: "Hapus Semua Filter",
    className: "",
    tagClassName: "",
    scrollButtonClassName: "",
  },
  render: (args) => {
    const [filters, setFilters] = useState(args.filters);

    const handleRemoveFilter = (filter) => {
      setFilters(filters.filter((f) => f.id !== filter.id));
      args.onRemoveFilter(filter);
    };

    const handleClearAll = () => {
      setFilters([]);
      args.onClearAll();
    };

    return (
      <ActiveFiltersBar
        {...args}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
    );
  },
};
