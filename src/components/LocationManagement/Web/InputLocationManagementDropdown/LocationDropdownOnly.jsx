import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Portal } from "@radix-ui/react-portal";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useRegisterModalPortalNode } from "@/components/Modal/useRegisterModalPortalNode";
import { cn } from "@/lib/utils";

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
}) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState(null);
  const scrollParentRef = useRef(null);

  // Get the callback ref from the hook
  const setDropdownRef = useRegisterModalPortalNode([isDropdownSearchOpen]);

  // Function to find the first scrollable parent
  const getScrollParent = useCallback((node) => {
    if (node == null) {
      return document.documentElement;
    }
    const { overflow, overflowY } = window.getComputedStyle(node);
    const isScrollable =
      overflow.includes("auto") ||
      overflow.includes("scroll") ||
      overflowY.includes("auto") ||
      overflowY.includes("scroll");

    if (isScrollable && node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      if (node.parentNode === document.body) {
        return document.documentElement;
      }
      return getScrollParent(node.parentNode);
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      scrollParentRef.current = getScrollParent(containerRef.current);
    }
  }, [getScrollParent, isDropdownSearchOpen]);

  // Function to update dropdown position
  const updateDropdownPosition = () => {
    if (isDropdownSearchOpen && containerRef.current) {
      const inputRect = containerRef.current.getBoundingClientRect();
      const scrollParent = scrollParentRef.current || document.documentElement;
      const scrollParentRect = scrollParent.getBoundingClientRect();

      // Check if the button is outside the scrollable parent's viewport
      if (
        inputRect.bottom < scrollParentRect.top ||
        inputRect.top > scrollParentRect.bottom
      ) {
        setIsDropdownSearchOpen(false);
        inputRef.current.blur();
        return;
      }

      setDropdownStyle({
        position: "fixed",
        top: inputRect.bottom,
        left: inputRect.left,
        width: inputRect.width,
        zIndex: 9999,
      });
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
    const scrollParent = scrollParentRef.current || window;
    const handleScrollOrResize = () => {
      updateDropdownPosition();
    };
    scrollParent.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      scrollParent.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownSearchOpen]);

  // Click outside handler
  useEffect(() => {
    if (!isDropdownSearchOpen) return;
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
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
            setIsDropdownSearchOpen(false);
          }}
          className="flex w-full items-center gap-2 px-[20px] py-[12px] text-xxs font-medium text-[#176CF7]"
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
          {locationAutoCompleteResult &&
            locationAutoCompleteResult.length > 0 &&
            locationAutoCompleteResult.map((location) => (
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
            <p className="text-xxs font-semibold leading-[14.4px] text-[#176CF7]">
              Input Lokasi yang terdekat dengan Anda
            </p>
          </div>

          {userSavedLocations && userSavedLocations.length > 0 && (
            <>
              <div className="text-sm text-xxs font-medium leading-[1.3] text-neutral-600">
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
                        handleEditLocation(location);
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
    <div
      ref={containerRef}
      className={cn("relative mx-auto mt-4 w-full", className)}
    >
      <Input
        ref={inputRef}
        type="text"
        placeholder="Masukkan Lokasi Muat"
        value={searchLocationAutoComplete}
        onClick={() => setIsDropdownSearchOpen(true)}
        onChange={(e) => {
          setSearchLocationAutoComplete(e.currentTarget.value);
        }}
        icon={{ left: markerIcon }}
        errorMessage={errorMessage}
      />
      {isDropdownSearchOpen && dropdownStyle && (
        <Portal>
          <div ref={setDropdownRef}>{dropdown}</div>
        </Portal>
      )}
    </div>
  );
};
