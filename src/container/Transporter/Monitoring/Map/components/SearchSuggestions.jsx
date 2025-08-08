import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import "./SearchSuggestions.css";

export const SearchSuggestions = ({
  isOpen,
  searchValue,
  onSelect,
  className,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  // Mock data - these are all available vehicles/drivers in the system
  const mockVehiclesAndDrivers = [
    { id: "1", licensePlate: "B 1234 ABC", driverName: "Ahmad Subandi" },
    { id: "2", licensePlate: "B 5678 DEF", driverName: "Budi Santoso" },
    { id: "3", licensePlate: "L 4567 CD", driverName: "Siti Nurhaliza" },
    { id: "4", licensePlate: "L 9012 GH", driverName: "Agus Prasetyo" },
    { id: "5", licensePlate: "L 3456 IJ", driverName: "John Doe" },
    { id: "6", licensePlate: "D 7890 KL", driverName: "Wahyu Hidayat" },
    { id: "7", licensePlate: "F 2345 MN", driverName: "Eko Nugroho" },
    { id: "8", licensePlate: "R 123 ABD", driverName: "Rizki Firmansyah" },
    { id: "9", licensePlate: "B 9876 XYZ", driverName: "Abdulrohman" },
    { id: "10", licensePlate: "L 555 ABD", driverName: "Fajar Sidik" },
    { id: "11", licensePlate: "D 444 EFG", driverName: "Abdullah Malik" },
    { id: "12", licensePlate: "B 321 ABD", driverName: "Hendra Gunawan" },
  ];

  // Create separate suggestion entries for matching license plates and driver names
  const createSuggestions = () => {
    if (!searchValue) return [];

    const searchLower = searchValue.toLowerCase();
    const suggestions = [];

    // Add all matching license plates
    mockVehiclesAndDrivers.forEach((item) => {
      if (item.licensePlate.toLowerCase().includes(searchLower)) {
        suggestions.push({
          id: `plate-${item.id}`,
          type: "licensePlate",
          displayText: item.licensePlate,
          originalData: item,
        });
      }
    });

    // Add all matching driver names
    mockVehiclesAndDrivers.forEach((item) => {
      if (item.driverName.toLowerCase().includes(searchLower)) {
        suggestions.push({
          id: `driver-${item.id}`,
          type: "driverName",
          displayText: item.driverName,
          originalData: item,
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

  if (!isOpen || suggestions.length === 0) return null;

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
        "absolute left-0 top-full z-30 mt-1 w-[300px] overflow-hidden rounded-md border border-neutral-300 bg-white shadow-lg",
        className
      )}
    >
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
    </div>
  );
};
