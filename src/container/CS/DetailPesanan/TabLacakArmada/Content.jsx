import { useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";

import { TransporterItem } from "./TransporterItem";
import { useLacakArmadaContext } from "./use-lacak-armada";

export const Content = () => {
  const { data, hasActiveFilters, hasActiveSearch, filteredDataByFilters } =
    useLacakArmadaContext();

  const [assignment, setAssignment] = useState({
    type: "SAME_TRANSPORTER",
    transporterId: null,
  });

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

  if (data.length === 0) {
    return (
      <div className="flex w-full justify-center text-center font-medium text-neutral-600">
        <DataNotFound type="data" width={95.5} height={76.76}>
          <div className="text-base font-semibold">Belum ada Armada</div>
          <div className="mt-3 text-xs">
            Tugaskan transporter secara langsung, atau gunakan fitur blast ulang
            agar sistem mengirimkan penawaran ke transporter lain
          </div>

          <div className="mt-3 flex justify-center gap-3">
            <Button
              variant="muattrans-primary-secondary"
              className="h-8 min-w-[160px] !rounded-full !text-sm"
            >
              Pilih Transporter
            </Button>
            <Button
              variant="muattrans-primary"
              className="h-8 min-w-[160px] !rounded-full !text-sm"
            >
              Blast Ulang
            </Button>
          </div>
        </DataNotFound>
      </div>
    );
  }

  if (hasNoFilteredData) {
    return (
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
    );
  }

  if (hasNoSearchResults) {
    return (
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
    );
  }

  return data?.map((item, index) => (
    <TransporterItem key={item?.transporterId} data={item} />
  ));
};
