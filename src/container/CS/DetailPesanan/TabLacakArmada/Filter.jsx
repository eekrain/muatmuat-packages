import MyDropdown from "@/components/Dropdown/MyDropdown";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";

import { useTranslation } from "@/hooks/use-translation";

import { useLacakArmadaContext } from "./use-lacak-armada";

// const MOCK = [
//   { label: "PT Nusantara Jaya", value: "PT Nusantara Jaya" },
//   { label: "PT Sinar Abadi", value: "PT Sinar Abadi" },
//   { label: "PT Bumi Persada", value: "PT Bumi Persada" },
//   { label: "PT Cahaya Mandiri", value: "PT Cahaya Mandiri" },
//   { label: "PT Mitra Sejahtera", value: "PT Mitra Sejahtera" },
//   { label: "PT Mega Karya", value: "PT Mega Karya" },
//   { label: "PT Surya Utama", value: "PT Surya Utama" },
//   { label: "PT Anugerah Bersama", value: "PT Anugerah Bersama" },
//   { label: "PT Prima Global", value: "PT Prima Global" },
//   { label: "PT Mandiri Sentosa", value: "PT Mandiri Sentosa" },
// ];

export const Filter = () => {
  const { t } = useTranslation();
  const {
    filterOptions,
    filteredTransporters,
    selectedTransporters,
    selectedStatuses,
    transporterSearchQuery,
    setTransporterSearchQuery,
    toggleTransporterFilter,
    toggleStatusFilter,
    hasActiveFilters,
    hasNoSearchResults,
  } = useLacakArmadaContext();

  return (
    <MyDropdown.Root>
      <MyDropdown.FilterTrigger
        isActive={hasActiveFilters}
        disabled={hasNoSearchResults && !hasActiveFilters}
      />
      <MyDropdown.Content align="start">
        <MyDropdown.HoverRoot
          title={t("Filter.titleTransporter", {}, "Transporter")}
        >
          <MyDropdown.HoverContent
            appearance={{
              wrapperClassName: "max-h-[218px]",
            }}
          >
            <div className="p-2.5">
              <Input
                icon={{ left: "/icons/search.svg" }}
                appearance={{ iconClassName: "text-neutral-700" }}
                placeholder={t(
                  "Filter.placeholderCariTransporter",
                  {},
                  "Cari Transporter"
                )}
                value={transporterSearchQuery}
                onChange={(e) => setTransporterSearchQuery(e.target.value)}
                withReset
              />
            </div>
            {filteredTransporters?.length === 0 ? (
              <div className="px-2.5 pb-5 pt-2 text-center text-xs font-medium">
                {t(
                  "Filter.messageDataTidakDitemukan",
                  {},
                  "Data Tidak Ditemukan"
                )}
              </div>
            ) : (
              filteredTransporters?.map((item) => (
                <MyDropdown.HoverItem key={item.value} asChild>
                  <Checkbox
                    label={item.label}
                    className="h-8 min-h-8 flex-shrink-0 md:px-2.5"
                    checked={selectedTransporters.has(item.value)}
                    onChange={() => toggleTransporterFilter(item.value)}
                  />
                </MyDropdown.HoverItem>
              ))
            )}

            {/* {MOCK.map((item) => (
              <MyDropdown.HoverItem key={item.value} asChild>
                <Checkbox
                  label={item.label}
                  className="h-8 min-h-8 flex-shrink-0 md:px-2.5"
                />
              </MyDropdown.HoverItem>
            ))} */}
          </MyDropdown.HoverContent>
        </MyDropdown.HoverRoot>

        <MyDropdown.HoverRoot
          title={t("Filter.titleStatusArmada", {}, "Status Armada")}
        >
          <MyDropdown.HoverContent
            appearance={{
              wrapperClassName: "max-h-[160px]",
            }}
          >
            {filterOptions.status?.map((item) => (
              <MyDropdown.HoverItem key={item.value} asChild>
                <Checkbox
                  label={t(item.label)}
                  className="h-8 min-h-8 flex-shrink-0 md:px-2.5"
                  checked={selectedStatuses.has(item.value)}
                  onChange={() => toggleStatusFilter(item.value)}
                />
              </MyDropdown.HoverItem>
            ))}

            {/* {Object.entries(OrderStatusTitle).map(([key, value]) => (
              <MyDropdown.HoverItem key={key} asChild>
                <Checkbox
                  label={t(value)}
                  className="h-8 min-h-8 flex-shrink-0 md:px-2.5"
                  checked={selectedStatuses.has(key)}
                  onChange={() => toggleStatusFilter(key)}
                />
              </MyDropdown.HoverItem>
            ))} */}
          </MyDropdown.HoverContent>
        </MyDropdown.HoverRoot>
      </MyDropdown.Content>
    </MyDropdown.Root>
  );
};
