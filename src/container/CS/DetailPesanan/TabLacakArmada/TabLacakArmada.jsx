import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import { TabsContent } from "@/components/Tabs/Tabs";
import { cn } from "@/lib/utils";

import { AppliedFilterBubbles } from "./AppliedFilterBubbles";
import { Filter } from "./Filter";
import { TransporterItem } from "./TransporterItem";
import { LacakArmadaProvider, useLacakArmadaContext } from "./use-lacak-armada";

export const TabLacakArmada = (props) => {
  return (
    <LacakArmadaProvider {...props}>
      <Inner />
    </LacakArmadaProvider>
  );
};

export const Inner = () => {
  const {
    data,
    totalArmada,
    totalSos,
    hasActiveFilters,
    hasActiveSearch,
    filteredDataByFilters,
    mainSearchQuery,
    setMainSearchQuery,
    searchInputValue,
    setSearchInputValue,
  } = useLacakArmadaContext();

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setMainSearchQuery(searchInputValue);
    }
  };

  // Check if we have filtered data but no results (filter-based)
  const hasNoFilteredData =
    hasActiveFilters &&
    !hasActiveSearch &&
    (!filteredDataByFilters ||
      filteredDataByFilters.length === 0 ||
      filteredDataByFilters.every(
        (transporter) => !transporter.fleets || transporter.fleets.length === 0
      ));

  // Check if we have search results but no data found (search-based)
  const hasNoSearchResults =
    hasActiveSearch &&
    (!data ||
      data.length === 0 ||
      data.every(
        (transporter) => !transporter.fleets || transporter.fleets.length === 0
      )) &&
    // But we do have data when only filters are applied (or no filters at all)
    filteredDataByFilters &&
    filteredDataByFilters.length > 0 &&
    filteredDataByFilters.some(
      (transporter) => transporter.fleets && transporter.fleets.length > 0
    );

  return (
    <TabsContent className="flex flex-col gap-y-4" value="lacak-armada">
      <div className="min flex w-full max-w-[1200px] flex-col gap-6 rounded-xl bg-white p-6 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
        {/* Card Header */}
        <div
          className={cn(
            "flex items-center justify-between gap-6",
            totalArmada > 1 && "flex-col items-start justify-normal"
          )}
        >
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-neutral-900">
              Lacak Armada
            </h1>
            {totalSos > 0 && (
              <>
                <span className="flex h-6 items-center rounded-md bg-error-400 px-2 py-1 text-xs font-semibold text-error-50">
                  SOS{totalSos > 1 ? `: ${totalSos} Unit` : ""}
                </span>
                <a href="#" className="text-xs font-medium text-primary-700">
                  Lihat SOS
                </a>
              </>
            )}
          </div>
          <div
            className={cn(
              "flex items-center justify-between",
              totalArmada > 1 && "w-full"
            )}
          >
            {totalArmada > 1 && (
              <div className="flex items-center gap-3">
                <Input
                  icon={{ left: "/icons/search.svg" }}
                  appearance={{ iconClassName: "text-neutral-700" }}
                  className="w-[278px]"
                  placeholder="Cari No. Polisi / Nama Driver / Transporter"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
                <Filter />
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 min-w-[160px] !rounded-full !text-sm"
              >
                Ubah Transporter
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-8 min-w-[174px] !rounded-full !text-sm"
              >
                Lihat Posisi Armada
              </Button>
            </div>
          </div>

          <AppliedFilterBubbles />
        </div>

        {/* Armada Items Container */}
        {hasNoFilteredData ? (
          <div className="flex h-full min-h-[230px] w-full flex-1 items-center justify-center">
            <DataNotFound
              type="data"
              className="gap-4"
              textClass="!w-auto max-w-[400px]"
            >
              <div className="text-center">
                <p className="text-base font-semibold text-neutral-600">
                  Data tidak Ditemukan.
                  <br />
                  Mohon coba hapus beberapa filter
                </p>
              </div>
            </DataNotFound>
          </div>
        ) : hasNoSearchResults ? (
          <div className="flex h-full min-h-[300px] w-full flex-1 items-center justify-center">
            <DataNotFound
              type="search"
              className="gap-4"
              textClass="!w-auto max-w-[400px]"
            >
              <div className="text-center">
                <p className="text-base font-semibold text-neutral-600">
                  Keyword Tidak Ditemukan
                </p>
              </div>
            </DataNotFound>
          </div>
        ) : (
          data?.map((item) => (
            <TransporterItem key={item?.transporterId} data={item} />
          ))
        )}
      </div>

      {false && (
        <div>
          totalSos: {totalSos}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </TabsContent>
  );
};
