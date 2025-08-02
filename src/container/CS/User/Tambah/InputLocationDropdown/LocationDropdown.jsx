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
}) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState(null);
  const scrollParentRef = useRef(null);

  const getScrollParent = useCallback((node) => {
    if (node === null) {
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

  const updateDropdownPosition = useCallback(() => {
    if (isDropdownSearchOpen && containerRef.current) {
      const inputRect = containerRef.current.getBoundingClientRect();
      const isCompletelyOutsideViewport =
        inputRect.bottom < 0 ||
        inputRect.top > window.innerHeight ||
        inputRect.right < 0 ||
        inputRect.left > window.innerWidth;

      if (isCompletelyOutsideViewport) {
        setIsDropdownSearchOpen(false);
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
  }, [isDropdownSearchOpen, setIsDropdownSearchOpen]);

  useLayoutEffect(() => {
    updateDropdownPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownSearchOpen]);

  useEffect(() => {
    if (!isDropdownSearchOpen) return;

    const handleScrollOrResize = () => {
      setIsDropdownSearchOpen(false);
    };

    window.addEventListener("wheel", handleScrollOrResize, { passive: true });
    window.addEventListener("touchmove", handleScrollOrResize, {
      passive: true,
    });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("wheel", handleScrollOrResize);
      window.removeEventListener("touchmove", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isDropdownSearchOpen, setIsDropdownSearchOpen]);

  const handleInputInteraction = useCallback(() => {
    setIsDropdownSearchOpen(true);
    setTimeout(updateDropdownPosition, 0);
  }, [setIsDropdownSearchOpen, updateDropdownPosition]);

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
  }, [isDropdownSearchOpen, setIsDropdownSearchOpen]);

  const dropdown = (
    <div
      ref={dropdownRef}
      style={{ ...dropdownStyle }}
      className="no-scrollbar mt-[3px] max-h-[420px] overflow-y-auto rounded-[6px] border border-blue-300 bg-white shadow-md"
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

          {locationAutoCompleteResult?.length === 0 && (
            <div className="py-2 text-center text-xxs font-medium text-gray-600">
              Tidak ada hasil pencarian
            </div>
          )}

          {locationAutoCompleteResult?.length > 0 &&
            locationAutoCompleteResult.map((location) => (
              <button
                key={location.ID + location.Title}
                onClick={() => {
                  onSelectSearchResult(location, needValidateLocationChange);
                  setIsDropdownSearchOpen(false);
                }}
                className="flex items-start gap-2"
              >
                <div className="h-[20px] w-[20px]">
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
      className={cn("relative mx-auto mt-4 w-full", className)}
    >
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchLocationAutoComplete}
        onClick={handleInputInteraction}
        onFocus={handleInputInteraction}
        onChange={(e) => {
          setSearchLocationAutoComplete(e.currentTarget.value);
          if (!isDropdownSearchOpen) {
            setIsDropdownSearchOpen(true);
          }
        }}
        icon={{ left: markerIcon }}
        errorMessage={errorMessage}
      />
      {showClearButton && searchLocationAutoComplete && (
        <button
          type="button"
          className="absolute right-1 top-[5px] rounded-full bg-white p-px"
          onClick={() => setSearchLocationAutoComplete("")}
        >
          <IconComponent src="/icons/close20.svg" width={20} height={20} />
        </button>
      )}
      {isDropdownSearchOpen && dropdownStyle && (
        <Portal>
          <div>{dropdown}</div>
        </Portal>
      )}
    </div>
  );
};
