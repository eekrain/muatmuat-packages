import { useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";

import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

function transformByFirstLetter(array) {
  if (!array || array.length === 0) {
    return [];
  }

  // Group items by first letter of their name
  const grouped = array.reduce((acc, item) => {
    const firstLetter = item.name.charAt(0).toUpperCase();

    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }

    acc[firstLetter].push(item);
    return acc;
  }, {});

  // Transform grouped data into desired format, sorted alphabetically
  return Object.keys(grouped)
    .sort()
    .map((letter) => ({
      firstLetter: letter,
      children: grouped[letter],
    }));
}

const SearchKecamatanScreen = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { setLocationPartial } = useLocationFormStore();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const filteredKecamatan = useShallowMemo(() => {
    if (!search) return transformByFirstLetter(params.kecamatanList);
    return transformByFirstLetter(
      params.kecamatanList.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [params.kecamatanList, search]);

  const handleSelectKecamatan = (kecamatan) => {
    setLocationPartial({
      district: {
        name: kecamatan.name,
        value: kecamatan.value,
      },
    });
    navigation.pop();
  };

  return (
    <FormResponsiveLayout
      title={{
        label: t("titleSelectDistrict"),
      }}
    >
      <div
        className={cn(
          "flex flex-col gap-y-6 bg-neutral-100 px-4 py-5",
          filteredKecamatan.length > 0 ? "min-h-[calc(100vh-62px)]" : "h-72px"
        )}
      >
        <Input
          placeholder={t("placeholderSearchDistrict")}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={{
            left: "/icons/search16.svg",
            right: search ? (
              <IconComponent
                src="/icons/silang.svg"
                onClick={() => setSearch("")}
              />
            ) : null,
          }}
        />
        {filteredKecamatan.map((item, key) => (
          <div className="flex flex-col gap-y-4" key={key}>
            <span className="text-lg font-bold leading-[1.1] text-neutral-900">
              {item.firstLetter}
            </span>
            {item.children.map((child, index) => (
              <button
                className={cn(
                  "w-full self-start text-left",
                  item.children.length - 1 === index
                    ? ""
                    : "border-b border-b-neutral-400 pb-4"
                )}
                key={index}
                onClick={() => handleSelectKecamatan(child)}
              >
                <span className="text-base font-semibold leading-[1.1] text-[#676767]">
                  {child.name}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {filteredKecamatan.length === 0 ? (
        <div
          className={cn(
            "flex min-h-[calc(100vh-134px)] items-center justify-center bg-neutral-100"
          )}
        >
          <DataNotFound
            className="gap-y-3.5"
            textClass="leading-[19.2px]"
            title={
              <span
                dangerouslySetInnerHTML={{ __html: t("titleKeywordNotFound") }}
              />
            }
            width={134}
            height={114}
            type="search"
          />
        </div>
      ) : null}
    </FormResponsiveLayout>
  );
};

export default SearchKecamatanScreen;
