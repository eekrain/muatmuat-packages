import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Portal } from "@radix-ui/react-portal";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

export const InputLocationManagementDropdown = ({
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
}) => {
  console.log("🚀 ~ className:", className);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState(null);

  // Function to update dropdown position
  const updateDropdownPosition = () => {
    if (isDropdownSearchOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const top = rect.bottom + window.scrollY;
      if (top < 250) {
        setIsDropdownSearchOpen, false;
        inputRef.current.blur();
      } else {
        setDropdownStyle({
          position: "absolute",
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 9999,
        });
      }
    }
  };

  // Calculate position and width for the dropdown
  useLayoutEffect(() => {
    updateDropdownPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownSearchOpen]);

  // Update dropdown position on scroll and resize
  useEffect(() => {
    if (!isDropdownSearchOpen) return;
    const handleScrollOrResize = () => {
      updateDropdownPosition();
    };
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownSearchOpen]);

  // Click outside handler
  useEffect(() => {
    if (!isDropdownSearchOpen) return;
    function handleClickOutside(event) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownSearchOpen]);

  // Dropdown content
  const dropdown = (
    <div
      ref={dropdownRef}
      style={{
        ...dropdownStyle,
      }}
      className="no-scrollbar mt-[3px] max-h-[420px] overflow-y-auto rounded-[6px] border border-blue-300 bg-white shadow-md"
    >
      <div className="">
        <button
          onClick={async () => {
            await handleGetCurrentLocation();
            setIsDropdownSearchOpen, false;
          }}
          className="flex w-full items-center gap-2 px-[20px] py-[12px] text-[10px] font-medium text-[#176CF7]"
        >
          <IconComponent
            src="/icons/marker-target-outline.svg"
            width={20}
            height={20}
            className="-mt-[2px]"
          />
          <span>Pilih Lokasi</span>
        </button>
        <div className="px-[4px]">
          <hr className="border-[#C4C4C4]" />
        </div>

        <div className="space-y-3 px-[20px] py-[12px]">
          <div className="text-sm font-semibold text-gray-600">
            Hasil Pencarian
          </div>
          {locationAutoCompleteResult.map((location) => (
            <button
              key={location.ID + location.Title}
              onClick={() => {
                onSelectSearchResult(location);
                setIsDropdownSearchOpen(false);
              }}
              className="flex items-start gap-2"
            >
              <div className="h-[20px] w-[20px]">
                <IconComponent
                  className=""
                  src="/icons/marker-outline.svg"
                  width={20}
                  height={20}
                />
              </div>
              <p className="text-left text-sm leading-tight text-gray-800">
                {location.Title}
              </p>

              <div
                className="h-[20px] w-[20px] cursor-pointer hover:text-[#176CF7]"
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
                src="/icons/warning24.svg"
                height={16}
                width={16}
                className="text-[#176CF7]"
              />
            </div>
            <p className="text-[10px] font-semibold leading-[14.4px] text-[#176CF7]">
              Input Lokasi yang terdekat dengan Anda
            </p>
          </div>

          {userSavedLocations.length > 0 && (
            <>
              <div className="text-[10px] text-sm font-medium leading-[1.3] text-neutral-600">
                Manajemen Lokasi
              </div>
              <div className="space-y-2">
                {userSavedLocations.slice(0, 3).map((location) => (
                  <button
                    onClick={() => handleSelectUserSavedLocation(location)}
                    key={location.ID + location.Title}
                    className="flex items-start gap-2 text-left"
                  >
                    <div className="h-[20px] w-[20px]">
                      <IconComponent
                        className=""
                        src="/icons/map-with-marker-outline.svg"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="line-clamp-1 break-all text-sm font-semibold text-gray-800">
                        {location.Name}
                      </span>
                      <span className="line-clamp-1 break-all text-xs text-gray-600">
                        {location.Address}
                      </span>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("not implemented");
                      }}
                      className="h-[20px] w-[20px] cursor-pointer hover:text-[#176CF7]"
                    >
                      <IconComponent
                        src="/icons/pencil-outline.svg"
                        width={20}
                        height={20}
                      />
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-right">
                <button
                  onClick={onLocationManagementClicked}
                  className="text-sm text-[#176CF7]"
                >
                  Lihat Manajemen Lokasi
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("relative mx-auto mt-4 w-full", className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Masukkan Lokasi Muat"
          value={searchLocationAutoComplete}
          onFocus={() => setIsDropdownSearchOpen(true)}
          onChange={(e) => {
            setSearchLocationAutoComplete(e.currentTarget.value);
          }}
          className="w-full rounded-[6px] border border-blue-300 py-[8.5px] pl-[38px] pr-3 text-xs font-medium placeholder:text-neutral-600 focus:border-blue-500"
        />
        <IconComponent
          src="/icons/marker-lokasi-muat.svg"
          width={16}
          height={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />
      </div>
      {isDropdownSearchOpen && dropdownStyle && (
        <Portal>
          <div>{dropdown}</div>
        </Portal>
      )}
    </div>
  );
};
