import { useState } from "react";

import { useGetContactHistory } from "@/services/CS/laporan/tambahan-biaya/detail-tambahan-biaya/getContactHistory";

import Card from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";

import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";

import { formatDate } from "@/lib/utils/dateFormat";

/**
 * Komponen DataTable untuk menampilkan riwayat menghubungi CS.
 * Termasuk fungsionalitas pencarian dan sorting.
 */
const RiwayatHubungiTable = () => {
  const defaultQueryParams = {
    page: 1,
    limit: 10,
    search: "",
    sort: "",
    order: "",
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);
  const [tempSearch, setTempSearch] = useState("");
  const [hasNoContactHistories, setHasNoContactHistories] = useState(false);

  const queryString = useShallowMemo(() => {
    const params = new URLSearchParams();

    // Only add parameters with valid values
    if (queryParams.page && queryParams.page > 0) {
      params.append("page", queryParams.page);
    }
    if (queryParams.limit && queryParams.limit > 0) {
      params.append("limit", queryParams.limit);
    }
    if (queryParams.search) {
      params.append("search", queryParams.search);
    }
    if (queryParams.sort) {
      params.append("sort", queryParams.sort);
    }
    if (queryParams.order) {
      params.append("order", queryParams.order);
    }
    return params.toString();
  }, [queryParams]);

  const { data: { contactHistory = [], pagination = null } = {}, isLoading } =
    useGetContactHistory(queryString);

  useShallowCompareEffect(() => {
    if (
      !isLoading &&
      contactHistory.length === 0 &&
      JSON.stringify(defaultQueryParams) === JSON.stringify(queryParams)
    ) {
      setHasNoContactHistories(true);
    }
  }, [contactHistory, defaultQueryParams, queryParams, isLoading]);

  const DataEmptyComponent = () => (
    <DataNotFound
      className="gap-5"
      title="Keyword Tidak Ditemukan"
      width={144}
      height={122}
    />
  );

  const columns = [
    {
      key: "csName",
      header: "CS Bertugas",
      width: "484px",
      className: "align-top !pl-6 !pr-3",
      headerClassName: "pl-6 pr-3",
      render: (row) => (
        <span className="mt-1 text-xxs font-medium leading-[1.3]">
          {row.cs_name}
        </span>
      ),
    },
    {
      key: "contactedAt",
      header: "CS Bertugas",
      width: "472px",
      className: "align-top !px-3",
      headerClassName: "px-3",
      render: (row) => (
        <span className="mt-1 text-xxs font-medium leading-[1.3]">
          {formatDate(row.contacted_at, { padDay: true })}
        </span>
      ),
    },
    {
      key: "contactSequence",
      header: "Hubungi Ke",
      width: "276px",
      className: "align-top !pr-6 !pl-3",
      headerClassName: "pr-6 pl-3",
      render: (row) => (
        <span className="mt-1 text-xxs font-medium leading-[1.3]">
          {`Hubungi Ke - ${row.contact_sequence}`}
        </span>
      ),
    },
  ];

  const handleChangeQueryParams = (field, value) => {
    setQueryParams((prevState) => {
      // Reset to page 1 when changing filters
      if (field !== "page") {
        return { ...prevState, [field]: value, page: 1 };
      }
      return { ...prevState, [field]: value };
    });
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === "Enter" && tempSearch.length >= 3) {
      handleChangeQueryParams("search", tempSearch);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setTempSearch("");
  };

  // Generic function to handle sorting for any column
  const handleSort = (columnName) => {
    // If sort is empty or not the current column, set to current column and order to desc
    if (queryParams.sort !== columnName) {
      handleChangeQueryParams("sort", columnName);
      handleChangeQueryParams("order", "desc");
    }
    // If sort is the current column and order is desc, change to asc
    else if (queryParams.sort === columnName && queryParams.order === "desc") {
      handleChangeQueryParams("order", "asc");
    }
    // If sort is the current column and order is asc, reset sort and order
    else {
      handleChangeQueryParams("sort", "");
      handleChangeQueryParams("order", "");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="overflow-hidden border-none">
        {hasNoContactHistories ? (
          <div className="flex h-[280px] items-center justify-center">
            <DataNotFound
              type="data"
              title="Belum Ada Riwayat Hubungi"
              className="gap-3"
              textClass="w-full"
              width={96}
              height={77}
            />
          </div>
        ) : (
          <>
            <div className="p-6 pt-5">
              <Input
                className="gap-0"
                appearance={{ containerClassName: "w-[262px]" }}
                placeholder="Cari CS Bertugas"
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
            </div>
            <Table
              columns={columns}
              data={contactHistory}
              loading={isLoading}
              onRowClick={undefined}
              onSort={handleSort}
              sortConfig={{
                sort: queryParams.sort,
                order: queryParams.order,
              }}
              emptyComponent={<DataEmptyComponent />}
            />
          </>
        )}
      </Card>
      {contactHistory.length === 0 ? null : (
        <Pagination
          currentPage={pagination?.currentPage}
          totalPages={pagination?.totalPages}
          perPage={pagination?.itemsPerPage}
          onPageChange={(value) => handleChangeQueryParams("page", value)}
          onPerPageChange={(value) => handleChangeQueryParams("limit", value)}
          className="py-0"
        />
      )}
    </div>
  );
};

export default RiwayatHubungiTable;
