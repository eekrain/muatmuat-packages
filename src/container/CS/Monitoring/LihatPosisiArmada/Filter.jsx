// Assuming you have a generic Input component
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import MyDropdown from "@/components/Dropdown/MyDropdown";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";

import { useTranslation } from "@/hooks/use-translation";

export const Filter = ({
  onFilterChange,
  transporters = [],
  statuses = [],
  activeFilters = { transporters: [], statuses: [] }, // Add activeFilters prop
}) => {
  const { t } = useTranslation();
  const [transporterSearchQuery, setTransporterSearchQuery] = useState("");
  const [selectedTransporters, setSelectedTransporters] = useState(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const isSyncingRef = useRef(false);

  // Sync local state with activeFilters from parent
  useEffect(() => {
    if (!isSyncingRef.current) {
      isSyncingRef.current = true;
      setSelectedTransporters(new Set(activeFilters.transporters));
      setSelectedStatuses(new Set(activeFilters.statuses));
      // Use setTimeout to ensure sync flag is reset after state updates
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  }, [activeFilters]);

  const handleTransporterToggle = useCallback((value) => {
    setSelectedTransporters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  }, []);

  const handleStatusToggle = useCallback((value) => {
    setSelectedStatuses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  }, []);

  // Convert Sets to arrays for proper dependency tracking
  const selectedTransportersArray = useMemo(
    () => Array.from(selectedTransporters),
    [selectedTransporters]
  );
  const selectedStatusesArray = useMemo(
    () => Array.from(selectedStatuses),
    [selectedStatuses]
  );

  // Notify parent component when filters change (only when not syncing)
  useEffect(() => {
    if (!isSyncingRef.current && onFilterChange) {
      const filters = {
        transporters: selectedTransportersArray,
        statuses: selectedStatusesArray,
      };
      onFilterChange(filters);
    }
  }, [selectedTransportersArray, selectedStatusesArray, onFilterChange]);

  // Use provided transporters and statuses
  const availableTransporters = useMemo(() => {
    return transporters;
  }, [transporters]);

  const availableStatuses = useMemo(() => statuses, [statuses]);

  const filteredTransporters = useMemo(() => {
    if (!transporterSearchQuery) {
      return availableTransporters;
    }
    return availableTransporters.filter((transporter) =>
      transporter.label
        .toLowerCase()
        .includes(transporterSearchQuery.toLowerCase())
    );
  }, [transporterSearchQuery, availableTransporters]);

  const hasActiveFilters = useMemo(
    () => selectedTransporters.size > 0 || selectedStatuses.size > 0,
    [selectedTransporters, selectedStatuses]
  );

  return (
    <MyDropdown.Root>
      <MyDropdown.FilterTrigger isActive={hasActiveFilters} />
      <MyDropdown.Content align="start" className="w-[194px]">
        {/* --- Transporter Filter --- */}
        <MyDropdown.HoverRoot
          title={t("Filter.titleTransporter", {}, "Transporter")}
          className={selectedTransporters.size > 0 ? "font-semibold" : ""}
        >
          <MyDropdown.HoverContent
            className="w-[202px]"
            appearance={{
              wrapperClassName: "max-h-[212px]",
            }}
          >
            <div className="p-2.5">
              <Input
                icon={{ left: "/icons/search.svg" }}
                appearance={{
                  wrapperClassName: "h-8",
                  iconClassName: "text-neutral-700",
                }}
                placeholder={t(
                  "Filter.placeholderCariTransporter",
                  {},
                  "Cari Transporter"
                )}
                value={transporterSearchQuery}
                onChange={(e) => setTransporterSearchQuery(e.target.value)}
                withReset
              />
            </div>
            {filteredTransporters.length > 0 ? (
              filteredTransporters.map((item) => (
                <MyDropdown.HoverItem key={item.value} asChild>
                  <Checkbox
                    label={item.label}
                    className="h-8 min-h-8 w-full flex-shrink-0 px-2.5"
                    checked={selectedTransporters.has(item.value)}
                    onChange={() => handleTransporterToggle(item.value)}
                  />
                </MyDropdown.HoverItem>
              ))
            ) : (
              <div className="px-2.5 pb-5 pt-2 text-center text-xs font-medium text-neutral-600">
                {t("Filter.dataTidakDitemukan", {}, "Data Tidak Ditemukan")}
              </div>
            )}
          </MyDropdown.HoverContent>
        </MyDropdown.HoverRoot>

        {/* --- Status Armada Filter --- */}
        <MyDropdown.HoverRoot
          title={t("Filter.titleStatusArmada", {}, "Status Armada")}
          className={selectedStatuses.size > 0 ? "font-semibold" : ""}
        >
          <MyDropdown.HoverContent className="w-[194px]">
            {availableStatuses.map((item) => (
              <MyDropdown.HoverItem key={item.value} asChild>
                <Checkbox
                  label={item.label}
                  className="h-8 min-h-8 w-full flex-shrink-0 px-2.5"
                  checked={selectedStatuses.has(item.value)}
                  onChange={() => handleStatusToggle(item.value)}
                />
              </MyDropdown.HoverItem>
            ))}
          </MyDropdown.HoverContent>
        </MyDropdown.HoverRoot>
      </MyDropdown.Content>
    </MyDropdown.Root>
  );
};
