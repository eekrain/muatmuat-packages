// Design Reference: https://www.figma.com/design/qVy9QwWNBWov4ZLrogzLiG/-Transporter---Monitoring-Alternate---Web?node-id=137-49798&t=NgdDLUIPMZQKBhuh-4

"use client";

import { X } from "lucide-react";

import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

// Design Reference: https://www.figma.com/design/qVy9QwWNBWov4ZLrogzLiG/-Transporter---Monitoring-Alternate---Web?node-id=137-49798&t=NgdDLUIPMZQKBhuh-4

function LacakArmadaHeader({
  sosUnit = 0,
  activeCount = 0,
  historyCount = 1,
  activeTab = "aktif",
  onTabChange,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  onDetailStatusClick,
  hidePositionButton = false,
  showDataNotFound = false,
}) {
  const { t } = useTranslation();
  // Handler to clear the search input
  const handleClearSearch = () => {
    onSearchChange?.({ target: { value: "" } });
  };

  // Show clear icon if there is any text in the search input
  const shouldShowClearIcon = searchValue.length > 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            {t("LacakArmadaHeader.title", {}, "Lacak Armada")}
          </h2>

          {/* SOS Badge */}
          {sosUnit > 0 && Number.isInteger(sosUnit) && (
            <div className="flex items-center gap-2">
              <div className="inline-flex h-6 items-center justify-center rounded-md bg-red-500 px-3 text-xs font-semibold text-white">
                {t(
                  "LacakArmadaHeader.sosUnit",
                  { sosUnit: sosUnit },
                  `SOS : ${sosUnit} Unit`
                )}
              </div>
              {sosUnit > 0 && (
                <a href="#" className="text-sm font-medium text-blue-600">
                  {t("LacakArmadaHeader.viewSOS", {}, "Lihat SOS")}
                </a>
              )}
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
                {t(
                  "LacakArmadaHeader.activeTab",
                  { activeCount: activeCount },
                  `Aktif (${activeCount})`
                )}
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
                {t(
                  "LacakArmadaHeader.historyTab",
                  { historyCount: historyCount },
                  `Riwayat (${historyCount})`
                )}
              </TagBubble>
            </div>
          </div>
        </div>

        <div className="flex w-auto items-center gap-3">
          {/* Ref: LDN-93 - Refactored for conciseness */}
          {!hidePositionButton && (
            <Button
              variant={
                activeTab === "aktif"
                  ? "muattrans-primary"
                  : "muattrans-primary-secondary"
              }
              className="h-8 whitespace-nowrap px-4 md:px-6"
              onClick={onDetailStatusClick}
            >
              {activeTab === "aktif"
                ? t(
                    "LacakArmadaHeader.viewFleetPosition",
                    {},
                    "Lihat Posisi Armada"
                  )
                : t(
                    "LacakArmadaHeader.fleetStatusDetail",
                    {},
                    "Detail Status Armada"
                  )}
            </Button>
          )}

          {showSearch && (
            <div className="h-8 w-[305px] shrink-0">
              <Input
                type="text"
                placeholder={t(
                  "LacakArmadaHeader.searchPlaceholder",
                  {},
                  "Cari No. Polisi / Nama Driver"
                )}
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

      {/* Render DataNotFound component below the header if needed */}
      {showDataNotFound && (
        <DataNotFound
          type="search"
          title={t(
            "LacakArmadaHeader.keywordNotFound",
            {},
            "Keyword Tidak Ditemukan"
          )}
          className="h-[300px]"
        />
      )}
    </>
  );
}

export default LacakArmadaHeader;
