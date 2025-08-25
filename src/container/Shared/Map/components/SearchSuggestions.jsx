import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import "./SearchSuggestions.css";

export const SearchSuggestions = ({
  isOpen,
  searchValue,
  onSelect,
  className,
  fleetLocationsData,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  // Get real fleet data from API
  // const { data: fleetLocationsData } = useGetFleetLocations();

  // Use real fleet data or empty array if data is not loaded yet
  const vehiclesAndDrivers = fleetLocationsData?.fleets || [];

  // Create separate suggestion entries for matching license plates and driver names
  const createSuggestions = () => {
    if (!searchValue || !vehiclesAndDrivers.length) return [];

    const searchLower = searchValue.toLowerCase();
    const suggestions = [];

    // Add all matching license plates
    vehiclesAndDrivers?.forEach((item) => {
      if (item.licensePlate.toLowerCase().includes(searchLower)) {
        suggestions.push({
          id: `plate-${item.id}`,
          type: "licensePlate",
          displayText: item.licensePlate,
          originalData: {
            id: item.id,
            licensePlate: item.licensePlate,
            driverName: item.driverName,
            latitude: item.latitude,
            longitude: item.longitude,
          },
        });
      }
    });

    // Add all matching driver names
    vehiclesAndDrivers?.forEach((item) => {
      if (item.driverName?.toLowerCase().includes(searchLower)) {
        suggestions.push({
          id: `driver-${item.id}`,
          type: "driverName",
          displayText: item.driverName,
          originalData: {
            id: item.id,
            licensePlate: item.licensePlate,
            driverName: item.driverName,
            latitude: item.latitude,
            longitude: item.longitude,
          },
        });
      }
    });

    return suggestions;
  };

  const suggestions = createSuggestions();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onSelect(null);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, selectedIndex, suggestions, onSelect]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchValue]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        onSelect(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onSelect]);

  if (!isOpen) return null;

  const getHighlightedText = (text, highlight) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-semibold text-primary-700">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div
      ref={suggestionsRef}
      className={cn(
        "absolute left-0 top-full z-30 mt-1 w-[300px] overflow-hidden rounded-md border border-neutral-400 bg-white shadow-muat",
        className
      )}
    >
      {suggestions.length === 0 ? (
        <div className="flex h-[52px] items-center justify-center px-2.5 py-[22px]">
          <span className="text-center text-xs font-medium text-black">
            Data Tidak Ditemukan
          </span>
        </div>
      ) : (
        <div className="search-suggestions-scroll relative max-h-[174px] overflow-y-auto overflow-x-hidden">
          {suggestions.map((suggestion, index) => {
            return (
              <button
                key={suggestion.id}
                className="flex h-8 w-full items-center px-2.5 py-3 text-left transition-colors hover:bg-neutral-200"
                onClick={() => onSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex w-full items-center overflow-hidden">
                  <span className="text-xs font-medium text-black">
                    {getHighlightedText(suggestion.displayText, searchValue)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
