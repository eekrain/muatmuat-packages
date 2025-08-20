import FilterDropdown from "@/components/FilterDropdown";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

const TransporterSearchAndFilter = ({
  searchValue,
  onSearch,
  onSearchKeyDown,
  onSearchBlur,
  onClearSearch,
  filters,
  onFilter,
  showFilterNotFoundState,
  showSearchNotFoundState,
  isLoading,
  totalItems,
}) => {
  const { t } = useTranslation();
  const getFilterConfig = () => {
    return {
      categories: [
        {
          key: "status",
          label: t("TransporterSearchAndFilter.filterStatus", {}, "Status"),
        },
      ],
      data: {
        status: [
          {
            id: "Aktif",
            key: "ACTIVE",
            label: t("TransporterSearchAndFilter.statusActive", {}, "Aktif"),
          },
          {
            id: "Non Aktif",
            key: "NON_ACTIVE",
            label: t(
              "TransporterSearchAndFilter.statusInactive",
              {},
              "Non Aktif"
            ),
          },
          {
            id: "Dalam Verifikasi",
            key: "IN_VERIFICATION",
            label: t(
              "TransporterSearchAndFilter.statusInVerification",
              {},
              "Dalam Verifikasi"
            ),
          },
          {
            id: "Verifikasi Ditolak",
            key: "VERIFICATION_REJECTED",
            label: t(
              "TransporterSearchAndFilter.statusVerificationRejected",
              {},
              "Verifikasi Ditolak"
            ),
          },
        ],
      },
    };
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-center gap-3">
        <Input
          icon={{
            left: (
              <IconComponent
                src="/icons/search16.svg"
                className="!text-neutral-700"
              />
            ),
            right: searchValue.length > 0 && (
              <button onClick={onClearSearch}>
                <IconComponent src="/icons/close20.svg" />
              </button>
            ),
          }}
          appearance={{
            inputClassName: "!text-xs",
            containerClassName: "!w-full min-w-[262px]",
          }}
          className="!w-full"
          placeholder={t(
            "TransporterSearchAndFilter.placeholderSearch",
            {},
            "Cari Transporter/PIC Perusahaan"
          )}
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={onSearchKeyDown}
          onBlur={onSearchBlur}
          disabled={showFilterNotFoundState || isLoading}
        />
        <FilterDropdown
          triggerClassName={
            "!w-[165px] hover:!border-neutral-600 hover:!bg-white"
          }
          selectedValues={filters}
          categories={getFilterConfig().categories}
          data={getFilterConfig().data}
          onSelectionChange={onFilter}
          multiSelect={false}
          searchable={false}
          disabled={showSearchNotFoundState || isLoading}
        />
      </div>
      <div>
        <p className="font-semibold">
          {isLoading
            ? t("TransporterSearchAndFilter.statusLoading", {}, "Memuat...")
            : t(
                "TransporterSearchAndFilter.totalTransporters",
                { total: totalItems },
                `Total: ${totalItems} Transporter`
              )}
        </p>
      </div>
    </div>
  );
};

export default TransporterSearchAndFilter;
