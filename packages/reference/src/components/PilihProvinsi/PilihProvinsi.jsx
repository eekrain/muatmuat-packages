import { useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";

import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useSWRHook } from "@/hooks/use-swr";
import { useTranslation } from "@/hooks/use-translation";

import {
  addArraysUnique,
  getElementsNotInSecondArray,
} from "@/lib/utils/array";

import kurirTokoZustand from "@/store/Shipper/zustand/kurirToko";

import DataNotFound from "../DataNotFound/DataNotFound";
import Input from "../Form/Input";

const PilihProvinsi = ({
  addCourierProvince,
  onRefresh,
  onBack,
  selectedProvinces,
  setSelectedProvinces,
  provinceIds,
}) => {
  const { t } = useTranslation();
  // FIX BUG Opsi Pengiriman LB-0019
  const { formData, hiddenProvinceIds, setHiddenProvinceIds } =
    kurirTokoZustand();
  const [search, setSearch] = useState("");
  const [isAllChecked, setIsAllChecked] = useState(false);

  const { data: provinceGroupData } = useSWRHook("v1/province_group");

  const provinces = Object.entries(provinceGroupData?.Data || {}).map(
    ([key, value]) => ({ key, value })
  );

  const allProvinceIds = useMemo(
    () =>
      provinces.reduce(
        (arr, item) => [...arr, ...item.value.map((item) => item.ProvinceID)],
        [],
        [provinces]
      ),
    [provinces]
  );

  const nonHiddenProvinces = formData.filter(
    (province) => !hiddenProvinceIds.includes(province.provinceID)
  );
  const count = nonHiddenProvinces.length;

  const filteredProvinces = useMemo(() => {
    if (!provinces) return [];
    if (search) {
      return provinces.reduce((arr, item) => {
        const value = item.value.filter((item) =>
          item.Province.toLowerCase().includes(search.toLowerCase())
        );
        if (value.length > 0) {
          return [...arr, { ...item, value }];
        }
        return arr;
      }, []);
    }
    return provinces;
  }, [provinces, search]);

  useShallowCompareEffect(() => {
    if (allProvinceIds.length > 0) {
      const sortedAllProvinceIds = allProvinceIds.sort((a, b) => b - a);
      const sortedSelectedProvinces = selectedProvinces.sort((a, b) => b - a);
      const isAllChecked =
        JSON.stringify(sortedAllProvinceIds) ===
        JSON.stringify(sortedSelectedProvinces);
      setIsAllChecked(isAllChecked);
    }
  }, [allProvinceIds, selectedProvinces]);

  const handleSave = async () => {
    const newHiddenProvinceIds = getElementsNotInSecondArray(
      provinceIds,
      selectedProvinces
    );
    setHiddenProvinceIds(newHiddenProvinceIds);
    await addCourierProvince({
      provinceID: addArraysUnique(selectedProvinces, provinceIds),
    })
      .then(() => {
        onRefresh();
        onBack();
      })
      .catch(() => {
        onBack();
      });
  };

  const handleToogleCheckAll = (checked) => {
    if (checked) {
      setSelectedProvinces(allProvinceIds);
    } else {
      setSelectedProvinces([]);
    }
    setIsAllChecked(checked);
  };

  return (
    <div className="flex min-h-[calc(100vh_-_88px)] flex-col gap-y-5 bg-neutral-50 px-4 py-5 pb-[124px]">
      <Input
        className={"w-full"}
        placeholder={t("labelSearchProvince")}
        icon={{
          left: <IconComponent src={"/icons/search.svg"} />,
          right: search ? (
            <IconComponent
              src={"/icons/silang.svg"}
              onclick={() => {
                setSearch("");
              }}
            />
          ) : null,
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredProvinces.length > 0 ? (
        <>
          <div className="flex items-center justify-between border-b border-b-neutral-800 pb-3">
            <span className="text-base font-semibold leading-[17.6px]">
              {t("checkboxSelectAll")}
            </span>
            <Checkbox
              className="!gap-0"
              disabled={count > 0}
              label=""
              checked={isAllChecked}
              onChange={(e) => handleToogleCheckAll(e.checked)}
            />
          </div>
          <div className="flex flex-col gap-y-[18px]">
            {filteredProvinces.map((item, key) => (
              <div className="flex flex-col gap-y-3" key={key}>
                <span className="text-lg font-bold leading-[21.6px]">
                  {item.key}
                </span>
                <div className="flex flex-col gap-y-4">
                  {item.value.map((province, key) => {
                    const isLastChild = item.value.length - 1 === key;
                    const isChecked = selectedProvinces.includes(
                      province.ProvinceID
                    );
                    return (
                      <div
                        key={province.ProvinceID}
                        className={`${isLastChild ? "" : "border-b border-b-neutral-400 pb-4"} flex items-center justify-between`}
                      >
                        <span className="text-base font-bold leading-[19.2px] text-neutral-600">
                          {province.Province}
                        </span>
                        <Checkbox
                          className="!gap-0"
                          label=""
                          checked={isChecked}
                          onChange={(e) =>
                            setSelectedProvinces((prevState) => {
                              if (!e.checked) {
                                return prevState.filter(
                                  (provinceId) =>
                                    provinceId !== province.ProvinceID
                                );
                              }
                              return [...prevState, province.ProvinceID];
                            })
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex min-h-[calc(100vh_-_232px)]">
          <DataNotFound
            className="m-auto gap-y-3"
            textClass="max-w-[111px] font-semibold text-sm leading-[16.8px]"
            title={t("labelKeywordNotFound")}
          />
        </div>
      )}
      <div className="fixed bottom-0 left-0 flex w-full gap-x-2 bg-neutral-50 px-4 py-3 shadow-muat">
        <Button
          className="flex h-10 w-full max-w-full items-center !font-semibold"
          variant="muatparts-primary-secondary"
          onClick={onBack}
        >
          {t("buttonCancel")}
        </Button>
        <Button
          className="flex h-10 w-full max-w-full items-center !font-semibold"
          onClick={handleSave}
        >
          {t("buttonSave")}
        </Button>
      </div>
    </div>
  );
};

export default PilihProvinsi;
