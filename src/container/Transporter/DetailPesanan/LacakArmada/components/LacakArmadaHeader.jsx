"use client";

import { usePathname } from "next/navigation";

import { X } from "lucide-react";

import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

function LacakArmadaHeader({
  sosUnit = 2,
  activeCount = 0,
  historyCount = 1,
  activeTab = "aktif",
  onTabChange,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  onDetailStatusClick,
  isSOS = false,
  hidePositionButton = false, // New prop to hide position button
  showDataNotFound = false, // New prop to show DataNotFound component
}) {
  // Nanti disesuaikan lagi
  const pathname = usePathname();

  const segments = pathname.replace(/\/+$/, "").split("/");
  const root = `/${segments[1] || ""}`;
  const isDaftarPesanan = root === "/daftar-pesanan";

  // Handler untuk clear search
  const handleClearSearch = () => {
    onSearchChange?.({ target: { value: "" } });
  };

  // Cek apakah search value lebih dari 2 karakter
  const shouldShowClearIcon = searchValue.length > 2;
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            Lacak Armada
          </h2>

          {/* SOS Badge */}
          {isSOS && (
            <div className="flex items-center gap-2">
              <div className="inline-flex h-6 items-center justify-center rounded-md bg-red-500 px-3 text-xs font-semibold text-white">
                SOS : {sosUnit} Unit
              </div>
              <a href="#" className="text-sm font-medium text-blue-600">
                Lihat SOS
              </a>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div
              onClick={() => onTabChange?.("aktif")}
              className="cursor-pointer"
            >
              <TagBubble
                className={`${
                  activeTab === "aktif"
                    ? "!border-blue-700 !bg-blue-100 !text-blue-700"
                    : "!border-neutral-400 !bg-neutral-200 !text-neutral-700 hover:!bg-neutral-300"
                }`}
              >
                Aktif ({activeCount})
              </TagBubble>
            </div>
            <div
              onClick={() => onTabChange?.("riwayat")}
              className="cursor-pointer"
            >
              <TagBubble
                className={`${
                  activeTab === "riwayat"
                    ? "!border-blue-700 !bg-blue-100 !text-blue-700"
                    : "!border-neutral-400 !bg-neutral-200 !text-neutral-700 hover:!bg-neutral-300"
                }`}
              >
                Riwayat ({historyCount})
              </TagBubble>
            </div>
          </div>
        </div>

        <div className="flex w-auto items-center gap-3">
          {/* Referensi: LDN-93 */}
          {false && (
            <Button variant="muattrans-primary" onClick={() => {}}>
              Lihat Posisi Armada
            </Button>
          )}
          {!hidePositionButton && activeTab === "aktif" ? (
            <Button
              variant="muattrans-primary"
              className="h-8 whitespace-nowrap px-4 md:px-6"
              onClick={onDetailStatusClick}
            >
              Lihat Posisi Armada
            </Button>
          ) : (
            !hidePositionButton && (
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 whitespace-nowrap px-4 md:px-6"
                onClick={onDetailStatusClick}
              >
                Detail Status Armada
              </Button>
            )
          )}

          {showSearch && (
            <div className="h-8 w-[305px] shrink-0">
              <Input
                type="text"
                placeholder="Cari No. Polisi / Nama Driver"
                value={searchValue}
                onChange={onSearchChange}
                icon={{
                  left: (
                    <IconComponent
                      src="/icons/search.svg"
                      width={16}
                      height={16}
                    />
                  ),
                  right: shouldShowClearIcon && (
                    <button
                      onClick={handleClearSearch}
                      className="flex items-center justify-center"
                      type="button"
                    >
                      <X className="h-4 w-4 text-neutral-500 hover:text-neutral-700" />
                    </button>
                  ),
                }}
                className="h-8 w-full !gap-y-0"
                classInput="text-xs font-medium"
              />
            </div>
          )}
        </div>
      </div>

      {/* DataNotFound component */}
      {showDataNotFound && (
        <DataNotFound
          type="search"
          title="Keyword Tidak Ditemukan"
          className="h-[300px]"
        />
      )}
    </>
  );
}

export default LacakArmadaHeader;
