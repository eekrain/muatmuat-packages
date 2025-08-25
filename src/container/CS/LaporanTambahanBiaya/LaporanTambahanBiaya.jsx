import { useState } from "react";

import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import FilterDropdown from "@/components/FilterDropdown";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";
import {
  Tabs,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";
import { periodOptions } from "@/lib/constants/Shared/periodOptions";
import { cn } from "@/lib/utils";
import { formatDateToDDMonYYYY } from "@/lib/utils/dateFormat";

import OrderWithAdditionalCost from "./OrderWithAdditionalCost";

const LaporanTambahanBiaya = ({
  activeTab,
  setActiveTab,
  isLoading,
  reports,
  pagination,
  periodHistory,
  filterOptions,
  hasNoReports,
  lastFilterField,
  onChangeQueryParams,
}) => {
  const { t } = useTranslation();
  const isFirstTimer = false;

  const [tempSearch, setTempSearch] = useState("");

  const tabItems = useShallowMemo(() => {
    return [
      {
        value: "active",
        label: <>Aktif{true ? <span className="ml-1">{`(1)`}</span> : null}</>,
      },
      {
        value: "completed",
        label: (
          <>Selesai{true ? <span className="ml-1">{`(20)`}</span> : null}</>
        ),
      },
    ];
  }, []);

  const recentSelections = useShallowMemo(() => {
    return periodHistory.map((item) => ({
      name: `${formatDateToDDMonYYYY(item.start_date)} - ${formatDateToDDMonYYYY(item.end_date)}`,
      value: `${formatDateToDDMonYYYY(item.start_date)} - ${formatDateToDDMonYYYY(item.end_date)}`,
      start_date: formatDateToDDMonYYYY(item.start_date),
      end_date: formatDateToDDMonYYYY(item.end_date),
    }));
  }, [periodHistory]);

  // Filter configuration
  const filterConfig = useShallowMemo(
    () => ({
      categories: [
        {
          key: "shipper",
          label: "Shipper",
          searchable: true,
        },
      ],
      data: {
        shipper: filterOptions
          ? filterOptions.shippers.map((shipper) => ({
              id: shipper.id,
              label: shipper.name,
            }))
          : [],
      },
    }),
    [filterOptions]
  );

  // Handle search
  const handleSearch = (e) => {
    if (e.key === "Enter" && tempSearch.length >= 3) {
      onChangeQueryParams("search", tempSearch);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setTempSearch("");
  };

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-y-4 p-6">
      <h1 className="text-xl font-bold">Laporan Tambahan Biaya</h1>
      {isFirstTimer ? null : (
        <div className="flex items-center justify-between">
          <Tabs
            className="flex flex-col gap-y-4"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="w-fit justify-start">
              {tabItems.map((tabItem, key) => (
                <TabsTriggerWithSeparator
                  key={key}
                  value={tabItem.value}
                  activeColor="primary-700"
                  className="px-6 !text-base text-neutral-900"
                  showSeparator={key !== tabItems.length - 1}
                >
                  <span className="whitespace-nowrap">{tabItem.label}</span>
                </TabsTriggerWithSeparator>
              ))}
            </TabsList>
          </Tabs>
          {reports.length === 0 ? null : (
            <div className="flex items-center gap-x-3">
              <DropdownPeriode
                // disable
                // disable={orders.length === 0}
                options={periodOptions(t)}
                onSelect={() => {}}
                recentSelections={recentSelections}
                value={null}
                //   onSelect={handleSelectPeriod}
                //   recentSelections={recentPeriodOptions}
                //   value={currentPeriodValue}
              />
              <Button
                disabled={reports.length === 0}
                variant="muattrans-primary"
                iconLeft="/icons/download16.svg"
                onClick={() => {}}
              >
                Unduh
              </Button>
            </div>
          )}
        </div>
      )}
      <Card className="border-none">
        {isFirstTimer || hasNoReports ? (
          <div className="flex h-[280px] items-center justify-center">
            <DataNotFound
              type="data"
              title={
                activeTab === "active"
                  ? "Belum Ada Laporan Tambahan Biaya"
                  : "Belum Ada Laporan Tambahan Biaya Selesai"
              }
              className="gap-3"
              textClass="w-full"
              width={96}
              height={77}
            />
          </div>
        ) : reports.length === 0 && activeTab === "completed" ? (
          <div className="flex h-[280px] items-center justify-center">
            <DataNotFound
              type="data"
              title="Belum Ada Laporan Tambahan Biaya"
              className="gap-3"
              textClass="w-full"
              width={96}
              height={77}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-y-6 p-6 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <Input
                    className="gap-0"
                    // disabled
                    // disabled={
                    //   hasNoOrders || (!hasFilteredOrders && !queryParams.search)
                    // }
                    appearance={{ containerClassName: "w-[262px]" }}
                    placeholder="Cari Nama/Perusahaan"
                    icon={{
                      left: "/icons/search16.svg",
                      right: tempSearch ? (
                        <IconComponent
                          src="/icons/silang16.svg"
                          onClick={handleClearSearch}
                        />
                      ) : null,
                    }}
                    value={tempSearch}
                    onChange={({ target: { value } }) => setTempSearch(value)}
                    onKeyUp={handleSearch}
                  />
                  <FilterDropdown
                    // disabled
                    categories={filterConfig.categories}
                    data={filterConfig.data}
                    selectedValues={{}}
                    onSelectionChange={() => {}}
                    searchPlaceholder="Cari {category}"
                    multiSelect={false}
                    // disabled={isFilterDisabled}
                  />
                </div>
                <span className="text-base font-semibold">
                  {`Total : ${20 || reports?.length} Laporan`}
                </span>
              </div>
              {false ? (
                <div className="flex items-center gap-x-3">
                  <Button className="font-bold" variant="link">
                    Hapus Semua Filter
                  </Button>
                  <TagBubble
                    withRemove={{
                      onRemove: () => {},
                    }}
                  >
                    Prima Arifandi
                  </TagBubble>
                </div>
              ) : null}
            </div>
            {reports.length > 0 ? (
              reports.map((order, key) => (
                <div className="border-t border-t-neutral-400" key={key}>
                  <OrderWithAdditionalCost {...order} />
                </div>
              ))
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center",
                  lastFilterField === "search" ? "h-[193px]" : "h-[145px]"
                )}
              >
                {lastFilterField === "search" ? (
                  <DataNotFound
                    title="Keyword Tidak Ditemukan"
                    className="gap-5"
                    textClass="w-full"
                    width={142}
                    height={122}
                  />
                ) : (
                  <DataNotFound
                    type="data"
                    title="Tidak ada data"
                    className="gap-3"
                    textClass="w-full"
                    width={96}
                    height={77}
                  />
                )}
              </div>
            )}
          </>
        )}
      </Card>
      {reports.length > 0 ? (
        <Pagination
          currentPage={1}
          totalPages={2}
          perPage={10}
          onPageChange={() => {}}
          onPerPageChange={() => {}}
          className="py-0"
        />
      ) : null}
    </div>
  );
};

export default LaporanTambahanBiaya;
