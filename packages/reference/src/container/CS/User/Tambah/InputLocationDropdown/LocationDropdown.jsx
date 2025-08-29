import { useCallback, useEffect, useRef } from "react";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

export const LocationDropdown = ({
  className,
  locationAutoCompleteResult,
  onSelectSearchResult,
  searchLocationAutoComplete,
  setSearchLocationAutoComplete,
  handleGetCurrentLocation,
  isDropdownSearchOpen,
  setIsDropdownSearchOpen,
  errorMessage,
  markerIcon = "/icons/marker-lokasi-muat.svg",
  placeholder = "Masukkan Lokasi",
  needValidateLocationChange,
  showClearButton = false,
  onInputClick,
  onInputChange,
  onResolvedLocation,
}) => {
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Menutup dropdown jika pengguna mengklik di luar area komponen
  useEffect(() => {
    if (!isDropdownSearchOpen) return;

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownSearchOpen, setIsDropdownSearchOpen]);

  // Menutup dropdown jika pengguna melakukan scroll atau resize window
  useEffect(() => {
    if (!isDropdownSearchOpen) return;
    const handleScrollOrResize = () => {
      setIsDropdownSearchOpen(false);
    };
    window.addEventListener("wheel", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("wheel", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isDropdownSearchOpen, setIsDropdownSearchOpen]);

  // Konten JSX untuk dropdown
  const dropdown = (
    <div
      ref={dropdownRef}
      className={`no-scrollbar absolute left-0 ${errorMessage ? "top-[60%]" : "top-full"} z-50 mt-1 max-h-[420px] w-full overflow-y-auto rounded-[6px] border border-blue-300 bg-white shadow-md`}
    >
      <div>
        <button
          onClick={async () => {
            const result = await handleGetCurrentLocation();
            if (result) {
              onResolvedLocation(result);
            }
            setIsDropdownSearchOpen(false);
          }}
          className="flex w-full items-center gap-2 px-[20px] py-[12px] text-xxs font-medium text-[#176CF7]"
          type="button"
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
          {locationAutoCompleteResult?.length === 0 && (
            <div className="py-2 text-center text-xxs font-medium text-gray-600">
              Tidak ada hasil pencarian
            </div>
          )}
          {locationAutoCompleteResult?.map((location) => (
            <button
              key={location.ID + location.Title}
              onClick={() => {
                onSelectSearchResult(location, needValidateLocationChange);
                setIsDropdownSearchOpen(false);
              }}
              className="flex w-full items-start gap-2 text-left"
            >
              <div className="h-[20px] w-[20px] flex-shrink-0">
                <IconComponent
                  src="/icons/marker-outline.svg"
                  width={20}
                  height={20}
                />
              </div>
              <p className="line-clamp-3 pt-0.5 text-left text-xxs font-medium leading-tight text-gray-800">
                {location.Title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative mx-auto w-full", className)}
    >
      <Input
        type="text"
        placeholder={placeholder}
        value={searchLocationAutoComplete}
        onClick={onInputClick}
        onChange={onInputChange}
        onFocus={onInputClick}
        icon={{ left: markerIcon }}
        errorMessage={errorMessage}
      />
      {showClearButton && searchLocationAutoComplete && (
        <button
          type="button"
          className="absolute right-1 top-[5px] rounded-full bg-white p-px"
          onClick={() => {
            setSearchLocationAutoComplete("");
          }}
        >
          <IconComponent src="/icons/close20.svg" width={20} height={20} />
        </button>
      )}
      {isDropdownSearchOpen && dropdown}
    </div>
  );
};
