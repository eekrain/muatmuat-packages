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

import OrderWithAdditionalCost from "./OrderWithAdditionalCost";

const LaporanTambahanBiaya = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  const [tempSearch, setTempSearch] = useState("");

  const tabItems = useShallowMemo(() => {
    return [
      {
        value: "active",
        label: <>Aktif{true ? <span className="ml-1">{`(20)`}</span> : null}</>,
      },
      {
        value: "done",
        label: (
          <>Selesai{true ? <span className="ml-1">{`(1)`}</span> : null}</>
        ),
      },
    ];
  }, []);

  // Filter configuration
  const filterConfig = {
    categories: [
      {
        key: "shipper",
        label: "Shipper",
        searchable: true,
      },
    ],
    data: {
      shipper: [
        { id: "550e8400-e29b-41d4-a716-446655440000", label: "Prima Arifandi" },
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          label: "Arjuna Logistik",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          label: "Bintang Ekspres",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          label: "Cahaya Transportasi",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440004",
          label: "Dharma Pengiriman",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440005",
          label: "Agam Tunggal Jaya",
        },
      ],
    },
  };

  const dummyData = [0, 1, 2, 3];

  // Handle search
  const handleSearch = (e) => {
    if (e.key === "Enter" && tempSearch.length >= 3) {
      //   onChangeQueryParams("search", tempSearch);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setTempSearch("");
  };

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-y-4 p-6">
      <h1 className="text-xl font-bold">Laporan Tambahan Biaya</h1>
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
        <div className="flex items-center gap-x-3">
          <DropdownPeriode
            // disable
            // disable={orders.length === 0}
            options={periodOptions(t)}
            onSelect={() => {}}
            recentSelections={[]}
            value={null}
            //   onSelect={handleSelectPeriod}
            //   recentSelections={recentPeriodOptions}
            //   value={currentPeriodValue}
          />
          <Button
            // disabled
            variant="muattrans-primary"
            iconLeft="/icons/download16.svg"
            onClick={() => {}}
          >
            Unduh
          </Button>
        </div>
      </div>
      <Card className="border-none">
        {dummyData.length === 0 ? (
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
                  {`Total : ${dummyData.length} Laporan`}
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
            {dummyData.length !== 0 ? (
              dummyData.map((order, key) => (
                <div className="border-t border-t-neutral-400" key={key}>
                  <OrderWithAdditionalCost {...order} />
                </div>
              ))
            ) : (
              <div className="flex h-[193px] items-center justify-center">
                <DataNotFound
                  title="Keyword Tidak Ditemukan"
                  className="gap-5"
                  textClass="w-full"
                  width={142}
                  height={122}
                />
              </div>
            )}
          </>
        )}
      </Card>
      {dummyData.length !== 0 ? (
        <Pagination
          currentPage={1}
          totalPages={1}
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
