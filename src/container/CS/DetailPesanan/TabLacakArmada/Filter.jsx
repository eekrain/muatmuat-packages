import MyDropdown from "@/components/Dropdown/MyDropdown";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";
import { useTranslation } from "@/hooks/use-translation";

import { useLacakArmadaContext } from "./use-lacak-armada";

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
        disabled={hasNoSearchResults}
      />
      <MyDropdown.Content align="start">
        <MyDropdown.HoverRoot title="Transporter">
          <MyDropdown.HoverContent>
            <div className="p-2.5">
              <Input
                icon={{ left: "/icons/search.svg" }}
                appearance={{ iconClassName: "text-neutral-700" }}
                placeholder="Cari Transporter"
                value={transporterSearchQuery}
                onChange={(e) => setTransporterSearchQuery(e.target.value)}
              />
            </div>
            {filteredTransporters?.map((item) => (
              <MyDropdown.HoverItem key={item.value} asChild>
                <Checkbox
                  label={item.label}
                  className="h-8 md:px-2.5"
                  checked={selectedTransporters.has(item.value)}
                  onChange={() => toggleTransporterFilter(item.value)}
                />
              </MyDropdown.HoverItem>
            ))}
            {/* {[
              { label: "PT Nusantara Jaya", value: "PT Nusantara Jaya" },
              { label: "PT Sinar Abadi", value: "PT Sinar Abadi" },
              { label: "PT Bumi Persada", value: "PT Bumi Persada" },
              { label: "PT Cahaya Mandiri", value: "PT Cahaya Mandiri" },
              { label: "PT Mitra Sejahtera", value: "PT Mitra Sejahtera" },
              { label: "PT Mega Karya", value: "PT Mega Karya" },
              { label: "PT Surya Utama", value: "PT Surya Utama" },
              { label: "PT Anugerah Bersama", value: "PT Anugerah Bersama" },
              { label: "PT Prima Global", value: "PT Prima Global" },
              { label: "PT Mandiri Sentosa", value: "PT Mandiri Sentosa" },
            ].map((item) => (
              <MyDropdown.HoverItem key={item.value} asChild>
                <Checkbox label={item.label} className="h-8 md:px-2.5" />
              </MyDropdown.HoverItem>
            ))} */}
          </MyDropdown.HoverContent>
        </MyDropdown.HoverRoot>

        <MyDropdown.HoverRoot title="Status Armada">
          <MyDropdown.HoverContent>
            {filterOptions.status?.map((item) => (
              <MyDropdown.HoverItem key={item.value} asChild>
                <Checkbox
                  label={t(item.label)}
                  className="h-8 md:px-2.5"
                  checked={selectedStatuses.has(item.value)}
                  onChange={() => toggleStatusFilter(item.value)}
                />
              </MyDropdown.HoverItem>
            ))}
          </MyDropdown.HoverContent>
        </MyDropdown.HoverRoot>
      </MyDropdown.Content>
    </MyDropdown.Root>
  );
};
