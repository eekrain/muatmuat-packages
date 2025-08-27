"use client";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
import { cn } from "@/lib/utils";

/**
 * An input component that displays a dropdown of location search results.
 */
export const LocationDropdownOnly = ({
  className,
  locationAutoCompleteResult,
  onSelectSearchResult,
  userSavedLocations,
  searchLocationAutoComplete,
  setSearchLocationAutoComplete,
  handleGetCurrentLocation,
  handleSelectUserSavedLocation,
  onLocationManagementClicked,
  isDropdownSearchOpen,
  setIsDropdownSearchOpen,
  handleAddToSavedLocation,
  handleEditLocation,
  errorMessage,
  markerIcon = "/icons/marker-lokasi-muat.svg",
  placeholder = "Masukkan Lokasi",
  needValidateLocationChange,
}) => {
  const handleOpenChange = (open) => {
    // If trying to close the popover, check if user is still actively using the input
    if (!open) {
      // Use a small delay to check if the input is still focused
      setTimeout(() => {
        const activeElement = document.activeElement;
        const isInputActive =
          activeElement?.type === "text" &&
          activeElement?.placeholder === placeholder;

        // Only close if the input is not active/focused
        if (!isInputActive) {
          setIsDropdownSearchOpen(false);
        }
      }, 10);
    } else {
      // Always allow opening
      setIsDropdownSearchOpen(true);
    }
  };

  return (
    <div className={cn("mx-auto mt-4 w-full", className)}>
      <Popover open={isDropdownSearchOpen} onOpenChange={handleOpenChange}>
        {/* Create a wrapper that acts as the trigger */}
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              type="text"
              placeholder={placeholder}
              value={searchLocationAutoComplete}
              onChange={(e) => {
                setSearchLocationAutoComplete(e.currentTarget.value);
                // Auto-open dropdown when typing
                if (!isDropdownSearchOpen) {
                  setIsDropdownSearchOpen(true);
                }
              }}
              icon={{ left: markerIcon }}
              errorMessage={errorMessage}
              onFocus={() => {
                if (!isDropdownSearchOpen) {
                  setIsDropdownSearchOpen(true);
                }
              }}
              onKeyDown={(e) => {
                // Prevent the trigger from handling arrow keys
                if (
                  ["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)
                ) {
                  e.stopPropagation();
                }
              }}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="no-scrollbar max-h-[420px] overflow-y-auto rounded-[6px] border border-blue-300 p-0 shadow-md"
          align="start"
          sideOffset={4}
          // This style now works correctly because the trigger is the full-width div.
          style={{ width: "var(--radix-popover-trigger-width)" }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div>
            <button
              onClick={async () => {
                await handleGetCurrentLocation();
                setIsDropdownSearchOpen(false);
              }}
              className="flex w-full items-center gap-2 px-[20px] py-[12px] text-xxs font-medium text-[#176CF7]"
            >
              <IconComponent
                src="/icons/marker-target-outline.svg"
                width={20}
                height={20}
              />
              <span>Pilih Lokasi</span>
            </button>
            <div className="px-[4px]">
              <hr className="border-[#C4C4C4]" />
            </div>

            <div className="space-y-3 px-[20px] py-[12px]">
              <div className="text-xxs font-semibold text-gray-600">
                Hasil Pencarian
              </div>
              {locationAutoCompleteResult?.map((location) => (
                <button
                  key={location.ID + location.Title}
                  onClick={() => {
                    onSelectSearchResult(location, needValidateLocationChange);
                    setIsDropdownSearchOpen(false);
                  }}
                  className="flex w-full items-start gap-2"
                >
                  <div className="h-[20px] w-[20px] flex-shrink-0">
                    <IconComponent
                      src="/icons/marker-outline.svg"
                      width={20}
                      height={20}
                    />
                  </div>
                  <p className="flex-1 pt-0.5 text-left text-xxs font-medium leading-tight text-gray-800">
                    {location.Title}
                  </p>
                  <div
                    className="h-[20px] w-[20px] flex-shrink-0 cursor-pointer hover:text-[#176CF7]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToSavedLocation(location);
                    }}
                  >
                    <IconComponent
                      src="/icons/bookmark.svg"
                      width={20}
                      height={20}
                    />
                  </div>
                </button>
              ))}

              <div className="flex w-full flex-row items-center gap-2.5 rounded-md border border-[#176CF7] px-3 py-2">
                <div className="flex items-center">
                  <IconComponent
                    src="/icons/info16.svg"
                    height={16}
                    width={16}
                    className="text-[#176CF7]"
                  />
                </div>
                <p className="capsize text-xxs font-semibold leading-[14.4px] text-[#176CF7]">
                  Input Lokasi yang terdekat dengan Anda
                </p>
              </div>

              {userSavedLocations?.length > 0 && (
                <>
                  <div className="text-xxs font-medium leading-[1.3] text-neutral-600">
                    Manajemen Lokasi
                  </div>
                  <div className="space-y-2">
                    {userSavedLocations.slice(0, 3).map((location) => (
                      <button
                        onClick={() => handleSelectUserSavedLocation(location)}
                        key={location.ID + location.Title}
                        className="flex w-full flex-col gap-1"
                      >
                        <div className="flex w-full items-center gap-2 text-left">
                          <div className="size-5">
                            <IconComponent
                              src="/icons/map-with-marker-outline.svg"
                              width={20}
                              height={20}
                            />
                          </div>
                          <span className="capsize line-clamp-1 flex-1 break-all text-xxs font-bold text-gray-800">
                            {location.Name}
                          </span>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLocation(location);
                            }}
                            className="size-5 cursor-pointer hover:text-[#176CF7]"
                          >
                            <IconComponent
                              src="/icons/pencil-outline.svg"
                              className="size-5"
                            />
                          </div>
                        </div>

                        <div className="flex w-full items-center gap-2 text-left">
                          <div className="w-5" />
                          <div className="capsize flex-1 text-xxs font-medium text-gray-600">
                            <span className="line-clamp-1">
                              {location.Address}
                            </span>
                          </div>
                          <div className="w-5" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="text-right">
                    <button
                      onClick={onLocationManagementClicked}
                      className="text-xxs font-medium text-[#176CF7]"
                    >
                      Lihat Manajemen Lokasi
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
